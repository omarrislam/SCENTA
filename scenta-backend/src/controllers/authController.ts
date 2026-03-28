import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { User } from "../models/User";
import { ApiError } from "../utils/ApiError";
import { env } from "../config/env";
import { sendSuccess } from "../utils/response";
import { AuthRequest } from "../middleware/auth";
import { sendEmail } from "../services/emailService";

const COOKIE_NAME = "auth_token";
const isSecureEnv = env.NODE_ENV === "production" || !!process.env.VERCEL;
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: isSecureEnv,
  sameSite: (isSecureEnv ? "none" : "lax") as "none" | "lax",
  domain: env.COOKIE_DOMAIN,
  maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days in ms
};

const signToken = (payload: { id: string; role: "customer" | "admin"; name: string }) =>
  jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"] });

const setAuthCookie = (res: Response, token: string) => {
  res.cookie(COOKIE_NAME, token, COOKIE_OPTIONS);
};

const clearAuthCookie = (res: Response) => {
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    secure: isSecureEnv,
    sameSite: (isSecureEnv ? "none" : "lax") as "none" | "lax",
    domain: env.COOKIE_DOMAIN
  });
};

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, name } = req.body;
    const existing = await User.findOne({ email }).lean();
    if (existing) {
      throw new ApiError(409, "EMAIL_EXISTS", "Email already registered");
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ email, passwordHash, name, role: "customer" });
    const token = signToken({ id: user.id, role: user.role, name });
    setAuthCookie(res, token);
    return sendSuccess(res, { user: { id: user.id, email, name, role: user.role } }, 201);
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
    const token = signToken({ id: user.id, role: user.role, name: user.name });
    setAuthCookie(res, token);
    return sendSuccess(res, { user: { id: user.id, email, name: user.name, role: user.role } });
  } catch (error) {
    return next(error);
  }
};

export const logout = (_req: Request, res: Response) => {
  clearAuthCookie(res);
  return sendSuccess(res, { status: "logged_out" });
};

export const me = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new ApiError(401, "UNAUTHORIZED", "Missing token");
    }
    const user = await User.findById(req.user.id).select("email name role").lean();
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

export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;
    if (!email) {
      throw new ApiError(400, "BAD_REQUEST", "Email is required");
    }
    const user = await User.findOne({ email });
    // Always respond with success to prevent email enumeration
    if (!user) {
      return sendSuccess(res, { status: "ok" });
    }

    const rawToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
    const ttl = Number(env.PASSWORD_RESET_TTL_MS);

    user.resetPasswordToken = tokenHash;
    user.resetPasswordExpires = new Date(Date.now() + ttl);
    await user.save();

    const resetUrl = `${env.FRONTEND_URL.split(",")[0].trim()}/reset-password?token=${rawToken}`;

    await sendEmail({
      to: user.email,
      subject: "Password reset request",
      text: `You requested a password reset. Click the link to reset your password (valid for 1 hour):\n\n${resetUrl}\n\nIf you did not request this, ignore this email.`
    });

    return sendSuccess(res, { status: "ok" });
  } catch (error) {
    return next(error);
  }
};

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      throw new ApiError(400, "BAD_REQUEST", "Token and new password are required");
    }

    const tokenHash = crypto.createHash("sha256").update(String(token)).digest("hex");
    const user = await User.findOne({
      resetPasswordToken: tokenHash,
      resetPasswordExpires: { $gt: new Date() }
    });

    if (!user) {
      throw new ApiError(400, "INVALID_TOKEN", "Reset token is invalid or has expired");
    }

    user.passwordHash = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return sendSuccess(res, { status: "ok" });
  } catch (error) {
    return next(error);
  }
};
