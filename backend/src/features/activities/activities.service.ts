import { randomUUID } from "crypto";

import { AppError } from "../../errors/app-error";
import type { ActivitiesDao } from "./activities.dao";
import type { ActivityModel } from "./activities.model";

export class ActivitiesService {
  constructor(private readonly activitiesDao: ActivitiesDao) {}

  async list(classroomId: string): Promise<ActivityModel[]> {
    return this.activitiesDao.listByClassroom(classroomId);
  }

  async create(payload: {
    classroomId: string;
    periodId: string;
    label: string;
    weight: number;
    limitDate: string;
  }): Promise<ActivityModel> {
    const exists = await this.activitiesDao.periodExists(
      payload.classroomId,
      payload.periodId,
    );

    if (!exists) {
      throw new AppError(400, "Period does not belong to classroom");
    }

    return this.activitiesDao.create({
      id: randomUUID(),
      classroomId: payload.classroomId,
      periodId: payload.periodId,
      label: payload.label,
      weight: payload.weight,
      limitDate: payload.limitDate,
    });
  }

  async update(
    classroomId: string,
    id: string,
    payload: {
      periodId?: string;
      label?: string;
      weight?: number;
      limitDate?: string;
    },
  ): Promise<ActivityModel> {
    if (payload.periodId) {
      const exists = await this.activitiesDao.periodExists(
        classroomId,
        payload.periodId,
      );

      if (!exists) {
        throw new AppError(400, "Period does not belong to classroom");
      }
    }

    const updated = await this.activitiesDao.update(classroomId, id, payload);

    if (!updated) {
      throw new AppError(404, "Activity not found");
    }

    return updated;
  }

  async delete(classroomId: string, id: string): Promise<void> {
    const deleted = await this.activitiesDao.delete(classroomId, id);

    if (!deleted) {
      throw new AppError(404, "Activity not found");
    }
  }
}

export const buildActivitiesService = (
  activitiesDao: ActivitiesDao,
): ActivitiesService => new ActivitiesService(activitiesDao);
