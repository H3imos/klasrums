import type { Connection, ResultSetHeader } from "mysql2/promise";

import type { ClassroomModel } from "./classrooms.model";

export interface ClassroomsDao {
  list(): Promise<ClassroomModel[]>;
  create(payload: {
    id: string;
    name: string;
    room: string;
    status: "active" | "archived";
  }): Promise<ClassroomModel>;
  update(
    id: string,
    payload: {
      name?: string;
      room?: string;
      status?: "active" | "archived";
    },
  ): Promise<ClassroomModel | null>;
  delete(id: string): Promise<boolean>;
}

type ClassroomRow = {
  id: string;
  name: string;
  room: string;
  status: "active" | "archived";
  students_count: number;
  periods_count: number;
  activities_count: number;
  created_at: Date;
  updated_at: Date;
};

class MysqlClassroomsDao implements ClassroomsDao {
  constructor(private readonly db: Connection) {}

  async list(): Promise<ClassroomModel[]> {
    const [rows] = await this.db.query(
      "SELECT c.id, c.name, c.room, c.status, COALESCE(st.students_count, 0) AS students_count, COALESCE(p.periods_count, 0) AS periods_count, COALESCE(a.activities_count, 0) AS activities_count, c.created_at, c.updated_at FROM classrooms c LEFT JOIN (SELECT classroom_id, COUNT(*) AS students_count FROM classroom_students GROUP BY classroom_id) st ON st.classroom_id = c.id LEFT JOIN (SELECT classroom_id, COUNT(*) AS periods_count FROM classroom_periods GROUP BY classroom_id) p ON p.classroom_id = c.id LEFT JOIN (SELECT classroom_id, COUNT(*) AS activities_count FROM classroom_activities GROUP BY classroom_id) a ON a.classroom_id = c.id ORDER BY c.created_at DESC",
    );

    return (rows as ClassroomRow[]).map(this.toModel);
  }

  async create(payload: {
    id: string;
    name: string;
    room: string;
    status: "active" | "archived";
  }): Promise<ClassroomModel> {
    const { id, name, room, status } = payload;

    await this.db.execute(
      "INSERT INTO classrooms (id, name, room, status) VALUES (?, ?, ?, ?)",
      [id, name, room, status],
    );

    const created = await this.findById(id);

    if (!created) {
      throw new Error("Failed to create classroom");
    }

    return created;
  }

  async update(
    id: string,
    payload: {
      name?: string;
      room?: string;
      status?: "active" | "archived";
    },
  ): Promise<ClassroomModel | null> {
    const fields: string[] = [];
    const values: Array<string> = [];

    if (payload.name !== undefined) {
      fields.push("name = ?");
      values.push(payload.name);
    }

    if (payload.room !== undefined) {
      fields.push("room = ?");
      values.push(payload.room);
    }

    if (payload.status !== undefined) {
      fields.push("status = ?");
      values.push(payload.status);
    }

    if (fields.length === 0) {
      return this.findById(id);
    }

    values.push(id);

    await this.db.execute(
      `UPDATE classrooms SET ${fields.join(", ")} WHERE id = ?`,
      values,
    );

    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const [result] = await this.db.execute<ResultSetHeader>(
      "DELETE FROM classrooms WHERE id = ?",
      [id],
    );

    return result.affectedRows > 0;
  }

  private async findById(id: string): Promise<ClassroomModel | null> {
    const [rows] = await this.db.query(
      "SELECT c.id, c.name, c.room, c.status, COALESCE(st.students_count, 0) AS students_count, COALESCE(p.periods_count, 0) AS periods_count, COALESCE(a.activities_count, 0) AS activities_count, c.created_at, c.updated_at FROM classrooms c LEFT JOIN (SELECT classroom_id, COUNT(*) AS students_count FROM classroom_students GROUP BY classroom_id) st ON st.classroom_id = c.id LEFT JOIN (SELECT classroom_id, COUNT(*) AS periods_count FROM classroom_periods GROUP BY classroom_id) p ON p.classroom_id = c.id LEFT JOIN (SELECT classroom_id, COUNT(*) AS activities_count FROM classroom_activities GROUP BY classroom_id) a ON a.classroom_id = c.id WHERE c.id = ? LIMIT 1",
      [id],
    );

    const row = (rows as ClassroomRow[])[0];

    return row ? this.toModel(row) : null;
  }

  private toModel(row: ClassroomRow): ClassroomModel {
    return {
      id: row.id,
      name: row.name,
      room: row.room,
      status: row.status,
      studentsCount: Number(row.students_count) || 0,
      periodsCount: Number(row.periods_count) || 0,
      activitiesCount: Number(row.activities_count) || 0,
      createdAt: row.created_at.toISOString(),
      updatedAt: row.updated_at.toISOString(),
    };
  }
}

export const buildClassroomsDao = (db: Connection): ClassroomsDao =>
  new MysqlClassroomsDao(db);
