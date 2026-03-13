import cors from "cors";
import express, { Application } from "express";
import type { Connection } from "mysql2/promise";

import { buildActivitiesRouter } from "./features/activities/activities.routes";
import { buildClassroomsRouter } from "./features/classrooms/classrooms.routes";
import { buildPeriodsRouter } from "./features/periods/periods.routes";
import { buildStudentsRouter } from "./features/students/students.routes";
import { errorHandler } from "./middlewares/error-handler";

export interface AppDependencies {
  db: Connection;
  corsOrigin?: string;
}

export const createApp = ({ db, corsOrigin }: AppDependencies): Application => {
  const app = express();

  app.use(
    cors({
      origin: corsOrigin ?? "http://localhost:5173",
      credentials: true,
    }),
  );
  app.use(express.json());
  app.use("/api", buildClassroomsRouter(db));
  app.use("/api", buildPeriodsRouter(db));
  app.use("/api", buildActivitiesRouter(db));
  app.use("/api", buildStudentsRouter(db));

  app.use(errorHandler);

  return app;
};
