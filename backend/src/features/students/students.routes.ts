import { Router } from "express";
import type { Connection } from "mysql2/promise";

import { buildStudentsController } from "./students.controller";
import { buildStudentsDao } from "./students.dao";
import { buildStudentsService } from "./students.service";

export const buildStudentsRouter = (db: Connection): Router => {
  const router = Router();
  const dao = buildStudentsDao(db);
  const service = buildStudentsService(dao);
  const controller = buildStudentsController(service);

  router.get("/classrooms/:classroomId/students", (req, res, next) =>
    controller.list(req, res, next),
  );

  router.post("/classrooms/:classroomId/students", (req, res, next) =>
    controller.create(req, res, next),
  );

  router.put("/classrooms/:classroomId/students/:id", (req, res, next) =>
    controller.update(req, res, next),
  );

  router.delete("/classrooms/:classroomId/students/:id", (req, res, next) =>
    controller.removeFromClassroom(req, res, next),
  );

  return router;
};
