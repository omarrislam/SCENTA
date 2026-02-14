import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { ApiError } from "../utils/ApiError";

export interface AuthRequest extends Request {
  user?: { id: string; role: "customer" | "admin" };
}

export const requireAuth = (req: AuthRequest, _res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return next(new ApiError(401, "UNAUTHORIZED", "Missing token"));
  }
  try {
    const token = header.replace("Bearer ", "");
    const payload = jwt.verify(token, env.JWT_SECRET) as { id: string; role: "customer" | "admin" };
    req.user = payload;
    return next();
  } catch (error) {
    return next(new ApiError(401, "UNAUTHORIZED", "Invalid token", error));
  }
};

export const requireRole = (role: "admin" | "customer") => (req: AuthRequest, _res: Response, next: NextFunction) => {
  if (!req.user) {
    return next(new ApiError(401, "UNAUTHORIZED", "Missing token"));
  }
  if (req.user.role !== role) {
    return next(new ApiError(403, "FORBIDDEN", "Insufficient role"));
  }
  return next();
};
