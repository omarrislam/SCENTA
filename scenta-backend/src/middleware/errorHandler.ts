import { NextFunction, Request, Response } from "express";
import { env } from "../config/env";
import { ApiError } from "../utils/ApiError";
import { sendError } from "../utils/response";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (err instanceof ApiError) {
    // eslint-disable-next-line no-console
    console.error("API_ERROR", {
      method: req.method,
      path: req.originalUrl,
      code: err.code,
      status: err.status,
      message: err.message,
      details: err.details
    });
    return sendError(res, err.status, err.code, err.message, err.details);
  }

  // eslint-disable-next-line no-console
  console.error("UNEXPECTED_ERROR", {
    method: req.method,
    path: req.originalUrl,
    message: err.message,
    stack: err.stack
  });

  const details = env.NODE_ENV === "production" ? undefined : err.message;
  return sendError(res, 500, "INTERNAL_ERROR", "Unexpected error", details);
};
