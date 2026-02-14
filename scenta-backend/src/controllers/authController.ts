import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { User } from "../models/User";
import { ApiError } from "../utils/ApiError";
import { env } from "../config/env";
import { sendSuccess } from "../utils/response";
import { AuthRequest } from "../middleware/auth";

const signToken = (payload: { id: string; role: "customer" | "admin" }) =>
  jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"] });

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, name } = req.body;
    const existing = await User.findOne({ email });
    if (existing) {
      throw new ApiError(409, "EMAIL_EXISTS", "Email already registered");
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ email, passwordHash, name, role: "customer" });
    const token = signToken({ id: user.id, role: user.role });
    return sendSuccess(res, { token, user: { id: user.id, email, name, role: user.role } }, 201);
  } catch (error) {
    return next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      throw new ApiError(401, "INVALID_CREDENTIALS", "Invalid email or password");
    }
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      throw new ApiError(401, "INVALID_CREDENTIALS", "Invalid email or password");
    }
    const token = signToken({ id: user.id, role: user.role });
    return sendSuccess(res, { token, user: { id: user.id, email, name: user.name, role: user.role } });
  } catch (error) {
    return next(error);
  }
};

export const me = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new ApiError(401, "UNAUTHORIZED", "Missing token");
    }
    const user = await User.findById(req.user.id).select("email name role");
    return sendSuccess(res, user);
  } catch (error) {
    return next(error);
  }
};

export const changePassword = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new ApiError(401, "UNAUTHORIZED", "Missing token");
    }
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) {
      throw new ApiError(404, "NOT_FOUND", "User not found");
    }
    const ok = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!ok) {
      throw new ApiError(401, "INVALID_CREDENTIALS", "Current password is incorrect");
    }
    user.passwordHash = await bcrypt.hash(newPassword, 10);
    await user.save();
    return sendSuccess(res, { status: "updated" });
  } catch (error) {
    return next(error);
  }
};

export const forgotPassword = async (_req: Request, res: Response) =>
  sendSuccess(res, { status: "ok" });

export const resetPassword = async (_req: Request, res: Response) =>
  sendSuccess(res, { status: "ok" });
