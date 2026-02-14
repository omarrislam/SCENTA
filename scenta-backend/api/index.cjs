require("tsx/cjs");

const { createApp } = require("../src/app.ts");
const { connectDatabase } = require("../src/config/db.ts");

let ready = null;

const ensureReady = async () => {
  if (!ready) {
    ready = (async () => {
      await connectDatabase();
    })();
  }
  await ready;
};

const app = createApp();

module.exports = async function handler(req, res) {
  const method = String(req?.method ?? "");
  const url = String(req?.url ?? "");

  if (method !== "OPTIONS" && !url.startsWith("/api/health")) {
    await ensureReady();
  }

  return app(req, res);
};
