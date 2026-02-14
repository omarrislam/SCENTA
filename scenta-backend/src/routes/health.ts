import { Router } from "express";
import { sendSuccess } from "../utils/response";

const router = Router();

router.get("/health", (_req, res) =>
  sendSuccess(res, {
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  })
);

export default router;
