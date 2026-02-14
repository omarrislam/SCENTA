const { createApp } = require("../dist-cjs/app.js");
const { connectDatabase } = require("../dist-cjs/config/db.js");

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
