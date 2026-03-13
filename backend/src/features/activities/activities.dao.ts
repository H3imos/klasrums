import type { Connection, ResultSetHeader } from "mysql2/promise";

import type { ActivityModel } from "./activities.model";

export interface ActivitiesDao {
  listByClassroom(classroomId: string): Promise<ActivityModel[]>;
  create(payload: {
    id: string;
    classroomId: string;
    periodId: string;
    label: string;
    weight: number;
    limitDate: string;
  }): Promise<ActivityModel>;
  update(
    classroomId: string,
    id: string,
    payload: {
      periodId?: string;
      label?: string;
      weight?: number;
      limitDate?: string;
    }
  ): Promise<ActivityModel | null>;
  delete(classroomId: string, id: string): Promise<boolean>;
  periodExists(classroomId: string, periodId: string): Promise<boolean>;
}

type ActivityRow = {
  id: string;
  classroom_id: string;
  period_id: string;
  label: string;
  weight: number;
  limit_date: Date;
  created_at: Date;
};

class MysqlActivitiesDao implements ActivitiesDao {
  constructor(private readonly db: Connection) {}

  async listByClassroom(classroomId: string): Promise<ActivityModel[]> {
    const [rows] = await this.db.query<ActivityRow[]>(
      "SELECT id, classroom_id, period_id, label, weight, limit_date, created_at FROM classroom_activities WHERE classroom_id = ? ORDER BY limit_date ASC, created_at ASC",
      [classroomId]
    );

    return rows.map(this.toModel);
  }

  async create(payload: {
    id: string;
    classroomId: string;
    periodId: string;
    label: string;
    weight: number;
    limitDate: string;
  }): Promise<ActivityModel> {
    const { id, classroomId, periodId, label, weight, limitDate } = payload;

    await this.db.execute(
      "INSERT INTO classroom_activities (id, classroom_id, period_id, label, weight, limit_date) VALUES (?, ?, ?, ?, ?, ?)",
      [id, classroomId, periodId, label, weight, limitDate]
    );

    const created = await this.findById(classroomId, id);

    if (!created) {
      throw new Error("Failed to create activity");
    }

    return created;
  }

  async update(
    classroomId: string,
    id: string,
    payload: {
      periodId?: string;
      label?: string;
      weight?: number;
      limitDate?: string;
    }
  ): Promise<ActivityModel | null> {
    const fields: string[] = [];
    const values: Array<string | number> = [];

    if (payload.periodId !== undefined) {
      fields.push("period_id = ?");
      values.push(payload.periodId);
    }

    if (payload.label !== undefined) {
      fields.push("label = ?");
      values.push(payload.label);
    }

    if (payload.weight !== undefined) {
      fields.push("weight = ?");
      values.push(payload.weight);
    }

    if (payload.limitDate !== undefined) {
      fields.push("limit_date = ?");
      values.push(payload.limitDate);
    }

    if (fields.length === 0) {
      return this.findById(classroomId, id);
    }

    values.push(classroomId, id);

    await this.db.execute(
      `UPDATE classroom_activities SET ${fields.join(", ")} WHERE classroom_id = ? AND id = ?`,
      values
    );

    return this.findById(classroomId, id);
  }

  async delete(classroomId: string, id: string): Promise<boolean> {
    const [result] = await this.db.execute<ResultSetHeader>(
      "DELETE FROM classroom_activities WHERE classroom_id = ? AND id = ?",
      [classroomId, id]
    );

    return result.affectedRows > 0;
  }

  async periodExists(classroomId: string, periodId: string): Promise<boolean> {
    const [rows] = await this.db.query<Array<{ id: string }>>(
      "SELECT id FROM classroom_periods WHERE classroom_id = ? AND id = ? LIMIT 1",
      [classroomId, periodId]
    );

    return rows.length > 0;
  }

  private async findById(
    classroomId: string,
    id: string
  ): Promise<ActivityModel | null> {
    const [rows] = await this.db.query<ActivityRow[]>(
      "SELECT id, classroom_id, period_id, label, weight, limit_date, created_at FROM classroom_activities WHERE classroom_id = ? AND id = ? LIMIT 1",
      [classroomId, id]
    );

    const row = rows[0];

    return row ? this.toModel(row) : null;
  }

  private toModel(row: ActivityRow): ActivityModel {
    return {
      id: row.id,
      classroomId: row.classroom_id,
      periodId: row.period_id,
      label: row.label,
      weight: row.weight,
      limitDate: row.limit_date.toISOString().slice(0, 10),
      createdAt: row.created_at.toISOString()
    };
  }
}

export const buildActivitiesDao = (db: Connection): ActivitiesDao =>
  new MysqlActivitiesDao(db);
