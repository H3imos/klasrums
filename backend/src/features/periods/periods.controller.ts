import type { NextFunction, Request, Response } from "express";

import { AppError } from "../../errors/app-error";
import type { CreatePeriodRequestDto, UpdatePeriodRequestDto } from "./periods.dto";
import { toPeriodDto } from "./periods.mapper";
import type { PeriodsService } from "./periods.service";

const parseString = (value: unknown): string => {
  if (typeof value !== "string") return "";
  return value.trim();
};

const parseNumber = (value: unknown): number | null => {
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

export class PeriodsController {
  constructor(private readonly periodsService: PeriodsService) {}

  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const classroomId = parseString(req.params?.classroomId);

      if (!classroomId) {
        throw new AppError(400, "classroomId is required");
      }

      const periods = await this.periodsService.list(classroomId);
      res.status(200).json(periods.map(toPeriodDto));
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

      const position = parseNumber(req.body?.position);

      const payload: CreatePeriodRequestDto = {
        label: parseString(req.body?.label),
        position: position ?? -1
      };

      if (!payload.label || payload.position < 0) {
        throw new AppError(400, "label and position are required");
      }

      const period = await this.periodsService.create({
        classroomId,
        ...payload
      });

      res.status(201).json(toPeriodDto(period));
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

      const position =
        req.body?.position !== undefined ? parseNumber(req.body?.position) : null;

      const payload: UpdatePeriodRequestDto = {
        label: parseString(req.body?.label) || undefined,
        position: position ?? undefined
      };

      if (req.body?.position !== undefined && payload.position === undefined) {
        throw new AppError(400, "position must be a number");
      }

      if (!payload.label && payload.position === undefined) {
        throw new AppError(400, "At least one field is required");
      }

      const period = await this.periodsService.update(
        classroomId,
        id,
        payload
      );

      res.status(200).json(toPeriodDto(period));
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const classroomId = parseString(req.params?.classroomId);
      const id = parseString(req.params?.id);

      if (!classroomId || !id) {
        throw new AppError(400, "classroomId and id are required");
      }

      await this.periodsService.delete(classroomId, id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

export const buildPeriodsController = (
  periodsService: PeriodsService
): PeriodsController => new PeriodsController(periodsService);
