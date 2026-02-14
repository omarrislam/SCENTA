import { NextFunction, Request, Response } from "express";
import { ZodSchema } from "zod";
import { ApiError } from "../utils/ApiError";

export const validate = (schema: ZodSchema) => (req: Request, _res: Response, next: NextFunction) => {
  const result = schema.safeParse({
    body: req.body,
    query: req.query,
    params: req.params
  });
  if (!result.success) {
    return next(new ApiError(400, "VALIDATION_ERROR", "Invalid request", result.error.flatten()));
  }
  return next();
};
