import { Router } from "express";
import type { Connection } from "mysql2/promise";

import { buildPeriodsController } from "./periods.controller";
import { buildPeriodsDao } from "./periods.dao";
import { buildPeriodsService } from "./periods.service";

export const buildPeriodsRouter = (db: Connection): Router => {
  const router = Router();
  const dao = buildPeriodsDao(db);
  const service = buildPeriodsService(dao);
  const controller = buildPeriodsController(service);

  router.get("/classrooms/:classroomId/periods", (req, res, next) =>
    controller.list(req, res, next)
  );

  router.post("/classrooms/:classroomId/periods", (req, res, next) =>
    controller.create(req, res, next)
  );

  router.put("/classrooms/:classroomId/periods/:id", (req, res, next) =>
    controller.update(req, res, next)
  );

  router.delete("/classrooms/:classroomId/periods/:id", (req, res, next) =>
    controller.delete(req, res, next)
  );

  return router;
};
