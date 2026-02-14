import { NextFunction, Request, Response } from "express";
import { env } from "../config/env";
import { ApiError } from "../utils/ApiError";
import { sendError } from "../utils/response";

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (err instanceof ApiError) {
    return sendError(res, err.status, err.code, err.message, err.details);
  }
  const details = env.NODE_ENV === "production" ? undefined : err.message;
  return sendError(res, 500, "INTERNAL_ERROR", "Unexpected error", details);
};
