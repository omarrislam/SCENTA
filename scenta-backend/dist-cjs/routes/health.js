"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const response_1 = require("../utils/response");
const router = (0, express_1.Router)();
router.get("/health", (_req, res) => (0, response_1.sendSuccess)(res, {
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
}));
exports.default = router;
