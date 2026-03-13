import type { NextFunction, Request, Response } from "express";

import { AppError } from "../../errors/app-error";
import { parseNumber, parseString } from "../../helpers/parsers";
import { toScoreDto } from "./scores.mapper";
import type { SaveScoreRequestDto } from "./scores.dto";
import type { ScoresService } from "./scores.service";

const isValidScore = (value: number) => value >= 0 && value <= 5;

export class ScoresController {
  constructor(private readonly scoresService: ScoresService) {}

  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const classroomId = parseString(req.params?.classroomId);

      if (!classroomId) {
        throw new AppError(400, "classroomId is required");
      }

      const scores = await this.scoresService.list(classroomId);
      res.status(200).json(scores.map(toScoreDto));
    } catch (error) {
      next(error);
    }
  }

  async save(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const classroomId = parseString(req.params?.classroomId);

      if (!classroomId) {
        throw new AppError(400, "classroomId is required");
      }

      const studentId = parseString(req.body?.studentId);
      const activityId = parseString(req.body?.activityId);
      const rawScore = req.body?.score;

      let score: number | null;

      if (rawScore === null) {
        score = null;
      } else {
        const parsed = parseNumber(rawScore);

        if (parsed === null) {
          throw new AppError(400, "score must be a number or null");
        }

        score = parsed;
      }

      const payload: SaveScoreRequestDto = {
        studentId,
        activityId,
        score,
      };

      if (!payload.studentId || !payload.activityId) {
        throw new AppError(400, "studentId and activityId are required");
      }

      if (payload.score !== null && !isValidScore(payload.score)) {
        throw new AppError(400, "score must be between 0 and 5");
      }

      await this.scoresService.save({
        classroomId,
        studentId: payload.studentId,
        activityId: payload.activityId,
        score: payload.score,
      });

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

export const buildScoresController = (
  scoresService: ScoresService,
): ScoresController => new ScoresController(scoresService);
