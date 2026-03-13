import { randomUUID } from "crypto";

import { AppError } from "../../errors/app-error";
import type { ClassroomsDao } from "./classrooms.dao";
import type { ClassroomModel } from "./classrooms.model";

export class ClassroomsService {
  constructor(private readonly classroomsDao: ClassroomsDao) {}

  async list(): Promise<ClassroomModel[]> {
    return this.classroomsDao.list();
  }

  async create(payload: {
    name: string;
    room: string;
  }): Promise<ClassroomModel> {
    const classroom = await this.classroomsDao.create({
      id: randomUUID(),
      name: payload.name,
      room: payload.room,
      status: "active",
    });

    return classroom;
  }

  async update(
    id: string,
    payload: {
      name?: string;
      room?: string;
      status?: "active" | "archived";
    },
  ): Promise<ClassroomModel> {
    const updated = await this.classroomsDao.update(id, payload);

    if (!updated) {
      throw new AppError(404, "Classroom not found");
    }

    return updated;
  }

  async delete(id: string): Promise<void> {
    const deleted = await this.classroomsDao.delete(id);

    if (!deleted) {
      throw new AppError(404, "Classroom not found");
    }
  }
}

export const buildClassroomsService = (
  classroomsDao: ClassroomsDao,
): ClassroomsService => new ClassroomsService(classroomsDao);
