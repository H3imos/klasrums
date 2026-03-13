import { Router } from "express";
import type { Connection } from "mysql2/promise";

import { buildClassroomsController } from "./classrooms.controller";
import { buildClassroomsDao } from "./classrooms.dao";
import { buildClassroomsService } from "./classrooms.service";

export const buildClassroomsRouter = (db: Connection): Router => {
  const router = Router();
  const dao = buildClassroomsDao(db);
  const service = buildClassroomsService(dao);
  const controller = buildClassroomsController(service);

  router.get("/classrooms", (req, res, next) =>
    controller.list(req, res, next),
  );

  router.post("/classrooms", (req, res, next) =>
    controller.create(req, res, next),
  );

  router.put("/classrooms/:id", (req, res, next) =>
    controller.update(req, res, next),
  );

  router.delete("/classrooms/:id", (req, res, next) =>
    controller.delete(req, res, next),
  );

  return router;
};
