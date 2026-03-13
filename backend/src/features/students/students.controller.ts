import type { NextFunction, Request, Response } from "express";

import { AppError } from "../../errors/app-error";
import { parseString } from "../../helpers/parsers";
import type {
  CreateStudentRequestDto,
  UpdateStudentRequestDto,
} from "./students.dto";
import { toStudentDto } from "./students.mapper";
import type { StudentsService } from "./students.service";

export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const classroomId = parseString(req.params?.classroomId);

      if (!classroomId) {
        throw new AppError(400, "classroomId is required");
      }

      const students = await this.studentsService.list(classroomId);
      res.status(200).json(students.map(toStudentDto));
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const classroomId = parseString(req.params?.classroomId);

      if (!classroomId) {
        throw new AppError(400, "classroomId is required");
      }

      const payload: CreateStudentRequestDto = {
        fullName: parseString(req.body?.fullName),
        email: parseString(req.body?.email),
      };

      if (!payload.fullName || !payload.email) {
        throw new AppError(400, "fullName and email are required");
      }

      const student = await this.studentsService.create({
        classroomId,
        fullName: payload.fullName,
        email: payload.email,
      });

      res.status(201).json(toStudentDto(student));
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const classroomId = parseString(req.params?.classroomId);
      const id = parseString(req.params?.id);

      if (!classroomId || !id) {
        throw new AppError(400, "classroomId and id are required");
      }

      const payload: UpdateStudentRequestDto = {
        fullName: parseString(req.body?.fullName) || undefined,
        email: parseString(req.body?.email) || undefined,
      };

      if (!payload.fullName && !payload.email) {
        throw new AppError(400, "At least one field is required");
      }

      const student = await this.studentsService.update(
        classroomId,
        id,
        payload,
      );
      res.status(200).json(toStudentDto(student));
    } catch (error) {
      next(error);
    }
  }

  async removeFromClassroom(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const classroomId = parseString(req.params?.classroomId);
      const id = parseString(req.params?.id);

      if (!classroomId || !id) {
        throw new AppError(400, "classroomId and id are required");
      }

      await this.studentsService.removeFromClassroom(classroomId, id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

export const buildStudentsController = (
  studentsService: StudentsService,
): StudentsController => new StudentsController(studentsService);
