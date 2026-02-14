import { createApp } from "../src/app";
import { connectDatabase } from "../src/config/db";

let ready: Promise<void> | null = null;

const ensureReady = async () => {
  if (!ready) {
    ready = (async () => {
      await connectDatabase();
    })();
  }
  await ready;
};

const app = createApp();

export default async function handler(req: unknown, res: unknown) {
  await ensureReady();
  return app(req as never, res as never);
}
