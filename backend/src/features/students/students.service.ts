import { randomUUID } from "crypto";

import { AppError } from "../../errors/app-error";
import type { StudentsDao } from "./students.dao";
import type { StudentModel } from "./students.model";

export class StudentsService {
  constructor(private readonly studentsDao: StudentsDao) {}

  async list(classroomId: string): Promise<StudentModel[]> {
    return this.studentsDao.listByClassroom(classroomId);
  }

  async create(payload: {
    classroomId: string;
    fullName: string;
    email: string;
  }): Promise<StudentModel> {
    return this.studentsDao.createInClassroom({
      id: randomUUID(),
      classroomId: payload.classroomId,
      fullName: payload.fullName,
      email: payload.email,
    });
  }

  async update(
    classroomId: string,
    id: string,
    payload: {
      fullName?: string;
      email?: string;
    },
  ): Promise<StudentModel> {
    const updated = await this.studentsDao.updateInClassroom(
      classroomId,
      id,
      payload,
    );

    if (!updated) {
      throw new AppError(404, "Student not found");
    }

    return updated;
  }

  async removeFromClassroom(classroomId: string, id: string): Promise<void> {
    const deleted = await this.studentsDao.removeFromClassroom(classroomId, id);

    if (!deleted) {
      throw new AppError(404, "Student not found");
    }
  }
}

export const buildStudentsService = (
  studentsDao: StudentsDao,
): StudentsService => new StudentsService(studentsDao);
