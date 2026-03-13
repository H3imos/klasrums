import { randomUUID } from "crypto";

import { AppError } from "../../errors/app-error";
import type { PeriodsDao } from "./periods.dao";
import type { PeriodModel } from "./periods.model";

export class PeriodsService {
  constructor(private readonly periodsDao: PeriodsDao) {}

  async list(classroomId: string): Promise<PeriodModel[]> {
    return this.periodsDao.listByClassroom(classroomId);
  }

  async create(payload: {
    classroomId: string;
    label: string;
    position: number;
  }): Promise<PeriodModel> {
    return this.periodsDao.create({
      id: randomUUID(),
      classroomId: payload.classroomId,
      label: payload.label,
      position: payload.position
    });
  }

  async update(
    classroomId: string,
    id: string,
    payload: {
      label?: string;
      position?: number;
    }
  ): Promise<PeriodModel> {
    const updated = await this.periodsDao.update(classroomId, id, payload);

    if (!updated) {
      throw new AppError(404, "Period not found");
    }

    return updated;
  }

  async delete(classroomId: string, id: string): Promise<void> {
    const deleted = await this.periodsDao.delete(classroomId, id);

    if (!deleted) {
      throw new AppError(404, "Period not found");
    }
  }
}

export const buildPeriodsService = (periodsDao: PeriodsDao): PeriodsService =>
  new PeriodsService(periodsDao);
