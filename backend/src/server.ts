import { createApp } from "./app";
import { createDbConnection } from "./config/database";
import { loadEnv } from "./config/env";

const bootstrap = async (): Promise<void> => {
  const env = loadEnv();
  const db = await createDbConnection({
    host: env.dbHost,
    port: env.dbPort,
    user: env.dbUser,
    password: env.dbPassword,
    database: env.dbName
  });

  const app = createApp({ db, corsOrigin: env.corsOrigin });

  app.listen(env.port, () => {
    // eslint-disable-next-line no-console
    console.log(`Server running on port ${env.port}`);
  });
};

bootstrap().catch((error) => {
  // eslint-disable-next-line no-console
  console.error("Failed to start server", error);
  process.exit(1);
});
