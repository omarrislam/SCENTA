import morgan from "morgan";
import { RequestWithId } from "./requestId";
import { AuthRequest } from "./auth";

morgan.token("req_id", (req) => (req as RequestWithId).requestId ?? "-");
morgan.token("user_id", (req) => (req as AuthRequest).user?.id ?? "-");

export const httpLogger = morgan((tokens, req, res) =>
  JSON.stringify({
    ts: new Date().toISOString(),
    reqId: tokens.req_id(req, res),
    method: tokens.method(req, res),
    path: tokens.url(req, res),
    status: Number(tokens.status(req, res) || 0),
    responseMs: Number(tokens["response-time"](req, res) || 0),
    bytes: Number(tokens.res(req, res, "content-length") || 0),
    userId: tokens.user_id(req, res),
    ip: (req as unknown as { ip?: string }).ip ?? "-"
  })
);
