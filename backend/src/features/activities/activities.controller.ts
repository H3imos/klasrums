import type { NextFunction, Request, Response } from "express";

import { AppError } from "../../errors/app-error";
import {
  parseDateString,
  parseNumber,
  parseString,
} from "../../helpers/parsers";

import { toActivityDto } from "./activities.mapper";

import type {
  CreateActivityRequestDto,
  UpdateActivityRequestDto,
} from "./activities.dto";
import type { ActivitiesService } from "./activities.service";

const isValidWeight = (value: number) => value >= 0 && value <= 1;

export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const classroomId = parseString(req.params?.classroomId);

      if (!classroomId) {
        throw new AppError(400, "classroomId is required");
      }

      const activities = await this.activitiesService.list(classroomId);
      res.status(200).json(activities.map(toActivityDto));
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

      const weight = parseNumber(req.body?.weight);

      const payload: CreateActivityRequestDto = {
        periodId: parseString(req.body?.periodId),
        label: parseString(req.body?.label),
        weight: weight ?? -1,
        limitDate: parseDateString(req.body?.limitDate),
      };

      if (
        !payload.periodId ||
        !payload.label ||
        payload.weight < 0 ||
        !payload.limitDate
      ) {
        throw new AppError(
          400,
          "periodId, label, weight and limitDate are required",
        );
      }

      if (!isValidWeight(payload.weight)) {
        throw new AppError(400, "weight must be between 0 and 1");
      }

      const activity = await this.activitiesService.create({
        classroomId,
        ...payload,
      });

      res.status(201).json(toActivityDto(activity));
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

      const weight =
        req.body?.weight !== undefined ? parseNumber(req.body?.weight) : null;

      const payload: UpdateActivityRequestDto = {
        periodId: parseString(req.body?.periodId) || undefined,
        label: parseString(req.body?.label) || undefined,
        weight: weight ?? undefined,
        limitDate: parseDateString(req.body?.limitDate) || undefined,
      };

      if (req.body?.weight !== undefined && payload.weight === undefined) {
        throw new AppError(400, "weight must be a number");
      }

      if (payload.weight !== undefined && !isValidWeight(payload.weight)) {
        throw new AppError(400, "weight must be between 0 and 1");
      }

      if (
        !payload.periodId &&
        !payload.label &&
        payload.weight === undefined &&
        !payload.limitDate
      ) {
        throw new AppError(400, "At least one field is required");
      }

      const activity = await this.activitiesService.update(
        classroomId,
        id,
        payload,
      );

      res.status(200).json(toActivityDto(activity));
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

      await this.activitiesService.delete(classroomId, id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

export const buildActivitiesController = (
  activitiesService: ActivitiesService,
): ActivitiesController => new ActivitiesController(activitiesService);
