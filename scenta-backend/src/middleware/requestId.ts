import { NextFunction, Request, Response } from "express";
import crypto from "crypto";

export interface RequestWithId extends Request {
  requestId?: string;
}

export const requestId = (req: RequestWithId, res: Response, next: NextFunction) => {
  const incomingId = req.headers["x-request-id"];
  const id =
    typeof incomingId === "string" && incomingId.trim()
      ? incomingId.trim()
      : crypto.randomUUID();
  req.requestId = id;
  res.setHeader("x-request-id", id);
  next();
};
