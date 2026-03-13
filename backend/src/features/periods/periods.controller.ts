import type { NextFunction, Request, Response } from "express";

import { AppError } from "../../errors/app-error";
import { parseDateString, parseString } from "../../helpers/parsers";
import type {
  CreatePeriodRequestDto,
  UpdatePeriodRequestDto
} from "./periods.dto";
import { toPeriodDto } from "./periods.mapper";
import type { PeriodsService } from "./periods.service";

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

      const payload: CreatePeriodRequestDto = {
        label: parseString(req.body?.label),
        startDate: parseDateString(req.body?.startDate),
        finishDate: parseDateString(req.body?.finishDate)
      };

      if (!payload.label || !payload.startDate || !payload.finishDate) {
        throw new AppError(400, "label, startDate and finishDate are required");
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

      const payload: UpdatePeriodRequestDto = {
        label: parseString(req.body?.label) || undefined,
        startDate: parseDateString(req.body?.startDate) || undefined,
        finishDate: parseDateString(req.body?.finishDate) || undefined
      };

      if (!payload.label && !payload.startDate && !payload.finishDate) {
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
