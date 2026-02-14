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
  const method =
    typeof req === "object" && req !== null && "method" in req
      ? String((req as { method?: string }).method ?? "")
      : "";
  const url =
    typeof req === "object" && req !== null && "url" in req
      ? String((req as { url?: string }).url ?? "")
      : "";

  if (method !== "OPTIONS" && !url.startsWith("/api/health")) {
    await ensureReady();
  }

  return app(req as never, res as never);
}
