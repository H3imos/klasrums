import { randomUUID } from "crypto";

import { AppError } from "../../errors/app-error";
import type { ScoreModel } from "./scores.model";
import type { ScoresDao } from "./scores.dao";

export class ScoresService {
  constructor(private readonly scoresDao: ScoresDao) {}

  async list(classroomId: string): Promise<ScoreModel[]> {
    return this.scoresDao.listByClassroom(classroomId);
  }

  async save(payload: {
    classroomId: string;
    studentId: string;
    activityId: string;
    score: number | null;
  }): Promise<void> {
    const studentExists = await this.scoresDao.studentExistsInClassroom(
      payload.classroomId,
      payload.studentId,
    );

    if (!studentExists) {
      throw new AppError(400, "Student does not belong to classroom");
    }

    const activityExists = await this.scoresDao.activityExistsInClassroom(
      payload.classroomId,
      payload.activityId,
    );

    if (!activityExists) {
      throw new AppError(400, "Activity does not belong to classroom");
    }

    if (payload.score === null) {
      await this.scoresDao.clear({
        classroomId: payload.classroomId,
        studentId: payload.studentId,
        activityId: payload.activityId,
      });
      return;
    }

    await this.scoresDao.upsert({
      id: randomUUID(),
      classroomId: payload.classroomId,
      studentId: payload.studentId,
      activityId: payload.activityId,
      score: payload.score,
    });
  }
}

export const buildScoresService = (scoresDao: ScoresDao): ScoresService =>
  new ScoresService(scoresDao);
