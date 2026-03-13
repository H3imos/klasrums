import type { Connection, ResultSetHeader } from "mysql2/promise";

import type { PeriodModel } from "./periods.model";

export interface PeriodsDao {
  listByClassroom(classroomId: string): Promise<PeriodModel[]>;
  create(payload: {
    id: string;
    classroomId: string;
    label: string;
    startDate: string;
    finishDate: string;
  }): Promise<PeriodModel>;
  update(
    classroomId: string,
    id: string,
    payload: {
      label?: string;
      startDate?: string;
      finishDate?: string;
    },
  ): Promise<PeriodModel | null>;
  delete(classroomId: string, id: string): Promise<boolean>;
}

type PeriodRow = {
  id: string;
  classroom_id: string;
  label: string;
  start_date: Date;
  finish_date: Date;
  created_at: Date;
};

class MysqlPeriodsDao implements PeriodsDao {
  constructor(private readonly db: Connection) {}

  async listByClassroom(classroomId: string): Promise<PeriodModel[]> {
    const [rows] = await this.db.query<PeriodRow[]>(
      "SELECT id, classroom_id, label, start_date, finish_date, created_at FROM classroom_periods WHERE classroom_id = ? ORDER BY start_date ASC, finish_date ASC, created_at ASC",
      [classroomId],
    );

    return rows.map(this.toModel);
  }

  async create(payload: {
    id: string;
    classroomId: string;
    label: string;
    startDate: string;
    finishDate: string;
  }): Promise<PeriodModel> {
    const { id, classroomId, label, startDate, finishDate } = payload;

    await this.db.execute(
      "INSERT INTO classroom_periods (id, classroom_id, label, start_date, finish_date) VALUES (?, ?, ?, ?, ?)",
      [id, classroomId, label, startDate, finishDate],
    );

    const created = await this.findById(classroomId, id);

    if (!created) {
      throw new Error("Failed to create period");
    }

    return created;
  }

  async update(
    classroomId: string,
    id: string,
    payload: {
      label?: string;
      startDate?: string;
      finishDate?: string;
    },
  ): Promise<PeriodModel | null> {
    const fields: string[] = [];
    const values: Array<string | number> = [];

    if (payload.label !== undefined) {
      fields.push("label = ?");
      values.push(payload.label);
    }

    if (payload.startDate !== undefined) {
      fields.push("start_date = ?");
      values.push(payload.startDate);
    }

    if (payload.finishDate !== undefined) {
      fields.push("finish_date = ?");
      values.push(payload.finishDate);
    }

    if (fields.length === 0) {
      return this.findById(classroomId, id);
    }

    values.push(classroomId, id);

    await this.db.execute(
      `UPDATE classroom_periods SET ${fields.join(", ")} WHERE classroom_id = ? AND id = ?`,
      values,
    );

    return this.findById(classroomId, id);
  }

  async delete(classroomId: string, id: string): Promise<boolean> {
    const [result] = await this.db.execute<ResultSetHeader>(
      "DELETE FROM classroom_periods WHERE classroom_id = ? AND id = ?",
      [classroomId, id],
    );

    return result.affectedRows > 0;
  }

  private async findById(
    classroomId: string,
    id: string,
  ): Promise<PeriodModel | null> {
    const [rows] = await this.db.query<PeriodRow[]>(
      "SELECT id, classroom_id, label, start_date, finish_date, created_at FROM classroom_periods WHERE classroom_id = ? AND id = ? LIMIT 1",
      [classroomId, id],
    );

    const row = rows[0];

    return row ? this.toModel(row) : null;
  }

  private toModel(row: PeriodRow): PeriodModel {
    return {
      id: row.id,
      classroomId: row.classroom_id,
      label: row.label,
      startDate: row.start_date.toISOString().slice(0, 10),
      finishDate: row.finish_date.toISOString().slice(0, 10),
      createdAt: row.created_at.toISOString(),
    };
  }
}

export const buildPeriodsDao = (db: Connection): PeriodsDao =>
  new MysqlPeriodsDao(db);
