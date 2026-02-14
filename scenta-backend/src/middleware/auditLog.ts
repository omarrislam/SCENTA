import { NextFunction, Response } from "express";
import { AuthRequest } from "./auth";

export const auditLog = (req: AuthRequest, _res: Response, next: NextFunction) => {
  if (req.user?.role === "admin") {
    console.info("[audit]", {
      path: req.path,
      method: req.method,
      adminId: req.user.id,
      time: new Date().toISOString()
    });
  }
  next();
};
