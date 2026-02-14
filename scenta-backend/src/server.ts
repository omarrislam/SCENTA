import { createApp } from "./app";
import { connectDatabase } from "./config/db";
import { env } from "./config/env";

const start = async () => {
  await connectDatabase();
  const app = createApp();
  app.listen(env.PORT, () => {
    console.log(`SCENTA API running on ${env.PORT}`);
  });
};

start();
