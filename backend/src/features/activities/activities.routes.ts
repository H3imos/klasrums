import { Router } from "express";
import type { Connection } from "mysql2/promise";

import { buildActivitiesController } from "./activities.controller";
import { buildActivitiesDao } from "./activities.dao";
import { buildActivitiesService } from "./activities.service";

export const buildActivitiesRouter = (db: Connection): Router => {
  const router = Router();
  const dao = buildActivitiesDao(db);
  const service = buildActivitiesService(dao);
  const controller = buildActivitiesController(service);

  router.get("/classrooms/:classroomId/activities", (req, res, next) =>
    controller.list(req, res, next)
  );

  router.post("/classrooms/:classroomId/activities", (req, res, next) =>
    controller.create(req, res, next)
  );

  router.put("/classrooms/:classroomId/activities/:id", (req, res, next) =>
    controller.update(req, res, next)
  );

  router.delete("/classrooms/:classroomId/activities/:id", (req, res, next) =>
    controller.delete(req, res, next)
  );

  return router;
};
