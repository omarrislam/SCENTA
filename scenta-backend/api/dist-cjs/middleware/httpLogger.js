"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.httpLogger = void 0;
const morgan_1 = __importDefault(require("morgan"));
morgan_1.default.token("req_id", (req) => req.requestId ?? "-");
morgan_1.default.token("user_id", (req) => req.user?.id ?? "-");
exports.httpLogger = (0, morgan_1.default)((tokens, req, res) => JSON.stringify({
    ts: new Date().toISOString(),
    reqId: tokens.req_id(req, res),
    method: tokens.method(req, res),
    path: tokens.url(req, res),
    status: Number(tokens.status(req, res) || 0),
    responseMs: Number(tokens["response-time"](req, res) || 0),
    bytes: Number(tokens.res(req, res, "content-length") || 0),
    userId: tokens.user_id(req, res),
    ip: req.ip ?? "-"
}));
