import { Router } from "express";
import type { Connection } from "mysql2/promise";

import { buildScoresController } from "./scores.controller";
import { buildScoresDao } from "./scores.dao";
import { buildScoresService } from "./scores.service";

export const buildScoresRouter = (db: Connection): Router => {
  const router = Router();
  const dao = buildScoresDao(db);
  const service = buildScoresService(dao);
  const controller = buildScoresController(service);

  router.get("/classrooms/:classroomId/scores", (req, res, next) =>
    controller.list(req, res, next),
  );

  router.put("/classrooms/:classroomId/scores", (req, res, next) =>
    controller.save(req, res, next),
  );

  return router;
};
