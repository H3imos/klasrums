import dotenv from "dotenv";

export interface EnvConfig {
  port: number;
  corsOrigin: string;
  dbHost: string;
  dbPort: number;
  dbUser: string;
  dbPassword: string;
  dbName: string;
}

export const loadEnv = (): EnvConfig => {
  dotenv.config();

  const port = Number(process.env.PORT ?? 3000);
  const dbPort = Number(process.env.MYSQL_PORT ?? 3306);
  const corsOrigin = process.env.CORS_ORIGIN ?? "http://localhost:5173";

  if (!process.env.MYSQL_HOST) {
    throw new Error("MYSQL_HOST is required");
  }

  if (!process.env.MYSQL_USER) {
    throw new Error("MYSQL_USER is required");
  }

  if (!process.env.MYSQL_PASSWORD) {
    throw new Error("MYSQL_PASSWORD is required");
  }

  if (!process.env.MYSQL_DATABASE) {
    throw new Error("MYSQL_DATABASE is required");
  }

  return {
    port,
    corsOrigin,
    dbHost: process.env.MYSQL_HOST,
    dbPort,
    dbUser: process.env.MYSQL_USER,
    dbPassword: process.env.MYSQL_PASSWORD,
    dbName: process.env.MYSQL_DATABASE
  };
};
