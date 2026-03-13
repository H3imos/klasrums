import type { Connection, ResultSetHeader } from "mysql2/promise";

import type { StudentModel } from "./students.model";

export interface StudentsDao {
  listByClassroom(classroomId: string): Promise<StudentModel[]>;
  createInClassroom(payload: {
    id: string;
    classroomId: string;
    fullName: string;
    email: string;
  }): Promise<StudentModel>;
  updateInClassroom(
    classroomId: string,
    id: string,
    payload: {
      fullName?: string;
      email?: string;
    },
  ): Promise<StudentModel | null>;
  removeFromClassroom(classroomId: string, id: string): Promise<boolean>;
}

type StudentRow = {
  id: string;
  full_name: string;
  email: string;
  created_at: Date;
  updated_at: Date;
};

class MysqlStudentsDao implements StudentsDao {
  constructor(private readonly db: Connection) {}

  async listByClassroom(classroomId: string): Promise<StudentModel[]> {
    const [rows] = await this.db.query<
      Array<StudentRow & { classroom_id: string }>
    >(
      "SELECT s.id, s.full_name, s.email, s.created_at, s.updated_at, cs.classroom_id FROM classroom_students cs INNER JOIN students s ON s.id = cs.student_id WHERE cs.classroom_id = ? ORDER BY s.full_name ASC",
      [classroomId],
    );

    return rows.map((row) => this.toModel(row, row.classroom_id));
  }

  async createInClassroom(payload: {
    id: string;
    classroomId: string;
    fullName: string;
    email: string;
  }): Promise<StudentModel> {
    const { id, classroomId, fullName, email } = payload;

    await this.db.beginTransaction();

    try {
      const existing = await this.findByEmail(email);
      const studentId = existing?.id ?? id;

      if (!existing) {
        await this.db.execute(
          "INSERT INTO students (id, full_name, email) VALUES (?, ?, ?)",
          [studentId, fullName, email],
        );
      } else if (fullName && existing.full_name !== fullName) {
        await this.db.execute(
          "UPDATE students SET full_name = ? WHERE id = ?",
          [fullName, studentId],
        );
      }

      await this.db.execute(
        "INSERT IGNORE INTO classroom_students (classroom_id, student_id) VALUES (?, ?)",
        [classroomId, studentId],
      );

      const created = await this.findByIdInClassroom(classroomId, studentId);

      if (!created) {
        throw new Error("Failed to create student");
      }

      await this.db.commit();
      return created;
    } catch (error) {
      await this.db.rollback();
      throw error;
    }
  }

  async updateInClassroom(
    classroomId: string,
    id: string,
    payload: {
      fullName?: string;
      email?: string;
    },
  ): Promise<StudentModel | null> {
    const fields: string[] = [];
    const values: Array<string> = [];

    if (payload.fullName !== undefined) {
      fields.push("s.full_name = ?");
      values.push(payload.fullName);
    }

    if (payload.email !== undefined) {
      fields.push("s.email = ?");
      values.push(payload.email);
    }

    if (fields.length === 0) {
      return this.findByIdInClassroom(classroomId, id);
    }

    values.push(classroomId, id);

    await this.db.execute(
      `UPDATE students s INNER JOIN classroom_students cs ON cs.student_id = s.id SET ${fields.join(", ")} WHERE cs.classroom_id = ? AND s.id = ?`,
      values,
    );

    return this.findByIdInClassroom(classroomId, id);
  }

  async removeFromClassroom(classroomId: string, id: string): Promise<boolean> {
    const [result] = await this.db.execute<ResultSetHeader>(
      "DELETE FROM classroom_students WHERE classroom_id = ? AND student_id = ?",
      [classroomId, id],
    );

    return result.affectedRows > 0;
  }

  private async findByEmail(email: string): Promise<StudentRow | null> {
    const [rows] = await this.db.query<StudentRow[]>(
      "SELECT id, full_name, email, created_at, updated_at FROM students WHERE email = ? LIMIT 1",
      [email],
    );

    return rows[0] ?? null;
  }

  private async findByIdInClassroom(
    classroomId: string,
    id: string,
  ): Promise<StudentModel | null> {
    const [rows] = await this.db.query<
      Array<StudentRow & { classroom_id: string }>
    >(
      "SELECT s.id, s.full_name, s.email, s.created_at, s.updated_at, cs.classroom_id FROM classroom_students cs INNER JOIN students s ON s.id = cs.student_id WHERE cs.classroom_id = ? AND s.id = ? LIMIT 1",
      [classroomId, id],
    );

    const row = rows[0];

    return row ? this.toModel(row, row.classroom_id) : null;
  }

  private toModel(row: StudentRow, classroomId: string): StudentModel {
    return {
      id: row.id,
      classroomId,
      fullName: row.full_name,
      email: row.email,
      createdAt: row.created_at.toISOString(),
      updatedAt: row.updated_at.toISOString(),
    };
  }
}

export const buildStudentsDao = (db: Connection): StudentsDao =>
  new MysqlStudentsDao(db);
