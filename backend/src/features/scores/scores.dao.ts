import type { Connection, RowDataPacket } from "mysql2/promise";

import type { ScoreModel } from "./scores.model";

export interface ScoresDao {
  listByClassroom(classroomId: string): Promise<ScoreModel[]>;
  upsert(payload: {
    id: string;
    classroomId: string;
    studentId: string;
    activityId: string;
    score: number;
  }): Promise<void>;
  clear(payload: {
    classroomId: string;
    studentId: string;
    activityId: string;
  }): Promise<void>;
  studentExistsInClassroom(
    classroomId: string,
    studentId: string,
  ): Promise<boolean>;
  activityExistsInClassroom(
    classroomId: string,
    activityId: string,
  ): Promise<boolean>;
}

type ScoreRow = RowDataPacket & {
  id: string;
  classroom_id: string;
  student_id: string;
  activity_id: string;
  score: number;
  created_at: Date;
  updated_at: Date;
};

class MysqlScoresDao implements ScoresDao {
  constructor(private readonly db: Connection) {}

  async listByClassroom(classroomId: string): Promise<ScoreModel[]> {
    const [rows] = await this.db.query<Array<ScoreRow>>(
      "SELECT id, classroom_id, student_id, activity_id, score, created_at, updated_at FROM scores WHERE classroom_id = ? ORDER BY updated_at DESC",
      [classroomId],
    );

    return rows.map(this.toModel);
  }

  async upsert(payload: {
    id: string;
    classroomId: string;
    studentId: string;
    activityId: string;
    score: number;
  }): Promise<void> {
    const { id, classroomId, studentId, activityId, score } = payload;

    await this.db.execute(
      "INSERT INTO scores (id, classroom_id, student_id, activity_id, score) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE score = VALUES(score), updated_at = CURRENT_TIMESTAMP",
      [id, classroomId, studentId, activityId, score],
    );
  }

  async clear(payload: {
    classroomId: string;
    studentId: string;
    activityId: string;
  }): Promise<void> {
    const { classroomId, studentId, activityId } = payload;

    await this.db.execute(
      "DELETE FROM scores WHERE classroom_id = ? AND student_id = ? AND activity_id = ?",
      [classroomId, studentId, activityId],
    );
  }

  async studentExistsInClassroom(
    classroomId: string,
    studentId: string,
  ): Promise<boolean> {
    const [rows] = await this.db.query<
      Array<RowDataPacket & { student_id: string }>
    >(
      "SELECT student_id FROM classroom_students WHERE classroom_id = ? AND student_id = ? LIMIT 1",
      [classroomId, studentId],
    );

    return rows.length > 0;
  }

  async activityExistsInClassroom(
    classroomId: string,
    activityId: string,
  ): Promise<boolean> {
    const [rows] = await this.db.query<Array<RowDataPacket & { id: string }>>(
      "SELECT id FROM classroom_activities WHERE classroom_id = ? AND id = ? LIMIT 1",
      [classroomId, activityId],
    );

    return rows.length > 0;
  }

  private toModel(row: ScoreRow): ScoreModel {
    return {
      id: row.id,
      classroomId: row.classroom_id,
      studentId: row.student_id,
      activityId: row.activity_id,
      score: row.score,
      createdAt: row.created_at.toISOString(),
      updatedAt: row.updated_at.toISOString(),
    };
  }
}

export const buildScoresDao = (db: Connection): ScoresDao =>
  new MysqlScoresDao(db);
