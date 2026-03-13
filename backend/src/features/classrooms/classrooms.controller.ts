import type { NextFunction, Request, Response } from "express";

import { toClassroomDto } from "./classrooms.mapper";
import { AppError } from "../../errors/app-error";
import type {
  CreateClassroomRequestDto,
  UpdateClassroomRequestDto,
} from "./classrooms.dto";
import type { ClassroomsService } from "./classrooms.service";

const parseString = (value: unknown): string => {
  if (typeof value !== "string") return "";
  return value.trim();
};

const parseStatus = (value: unknown): "active" | "archived" | undefined => {
  if (value === "active" || value === "archived") return value;
  return undefined;
};

export class ClassroomsController {
  constructor(private readonly classroomsService: ClassroomsService) {}

  async list(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const classrooms = await this.classroomsService.list();
      res.status(200).json(classrooms.map(toClassroomDto));
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const payload: CreateClassroomRequestDto = {
        name: parseString(req.body?.name),
        room: parseString(req.body?.room),
      };

      if (!payload.name || !payload.room) {
        throw new AppError(400, "name and room are required");
      }

      const classroom = await this.classroomsService.create(payload);
      res.status(201).json(toClassroomDto(classroom));
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseString(req.params?.id);

      if (!id) {
        throw new AppError(400, "id is required");
      }

      const payload: UpdateClassroomRequestDto = {
        name: parseString(req.body?.name) || undefined,
        room: parseString(req.body?.room) || undefined,
        status: parseStatus(req.body?.status),
      };

      if (req.body?.status !== undefined && !payload.status) {
        throw new AppError(400, "status must be active or archived");
      }

      if (!payload.name && !payload.room && !payload.status) {
        throw new AppError(400, "At least one field is required");
      }

      const classroom = await this.classroomsService.update(id, payload);
      res.status(200).json(toClassroomDto(classroom));
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseString(req.params?.id);

      if (!id) {
        throw new AppError(400, "id is required");
      }

      await this.classroomsService.delete(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

export const buildClassroomsController = (
  classroomsService: ClassroomsService,
): ClassroomsController => new ClassroomsController(classroomsService);
