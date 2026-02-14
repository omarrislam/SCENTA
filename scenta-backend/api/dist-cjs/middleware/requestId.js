"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestId = void 0;
const crypto_1 = __importDefault(require("crypto"));
const requestId = (req, res, next) => {
    const incomingId = req.headers["x-request-id"];
    const id = typeof incomingId === "string" && incomingId.trim()
        ? incomingId.trim()
        : crypto_1.default.randomUUID();
    req.requestId = id;
    res.setHeader("x-request-id", id);
    next();
};
exports.requestId = requestId;
