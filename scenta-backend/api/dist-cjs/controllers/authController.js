"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.forgotPassword = exports.changePassword = exports.me = exports.logout = exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const crypto_1 = __importDefault(require("crypto"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../models/User");
const ApiError_1 = require("../utils/ApiError");
const env_1 = require("../config/env");
const response_1 = require("../utils/response");
const emailService_1 = require("../services/emailService");
const COOKIE_NAME = "auth_token";
const isSecureEnv = env_1.env.NODE_ENV === "production" || !!process.env.VERCEL;
const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: isSecureEnv,
    sameSite: (isSecureEnv ? "none" : "lax"),
    domain: env_1.env.COOKIE_DOMAIN,
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days in ms
};
const signToken = (payload) => jsonwebtoken_1.default.sign(payload, env_1.env.JWT_SECRET, { expiresIn: env_1.env.JWT_EXPIRES_IN });
const setAuthCookie = (res, token) => {
    res.cookie(COOKIE_NAME, token, COOKIE_OPTIONS);
};
const clearAuthCookie = (res) => {
    res.clearCookie(COOKIE_NAME, {
        httpOnly: true,
        secure: isSecureEnv,
        sameSite: (isSecureEnv ? "none" : "lax"),
        domain: env_1.env.COOKIE_DOMAIN
    });
};
const register = async (req, res, next) => {
    try {
        const { email, password, name } = req.body;
        const existing = await User_1.User.findOne({ email }).lean();
        if (existing) {
            throw new ApiError_1.ApiError(409, "EMAIL_EXISTS", "Email already registered");
        }
        const passwordHash = await bcryptjs_1.default.hash(password, 10);
        const user = await User_1.User.create({ email, passwordHash, name, role: "customer" });
        const token = signToken({ id: user.id, role: user.role });
        setAuthCookie(res, token);
        return (0, response_1.sendSuccess)(res, { user: { id: user.id, email, name, role: user.role } }, 201);
    }
    catch (error) {
        return next(error);
    }
};
exports.register = register;
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User_1.User.findOne({ email });
        if (!user) {
            throw new ApiError_1.ApiError(401, "INVALID_CREDENTIALS", "Invalid email or password");
        }
        const ok = await bcryptjs_1.default.compare(password, user.passwordHash);
        if (!ok) {
            throw new ApiError_1.ApiError(401, "INVALID_CREDENTIALS", "Invalid email or password");
        }
        const token = signToken({ id: user.id, role: user.role });
        setAuthCookie(res, token);
        return (0, response_1.sendSuccess)(res, { user: { id: user.id, email, name: user.name, role: user.role } });
    }
    catch (error) {
        return next(error);
    }
};
exports.login = login;
const logout = (_req, res) => {
    clearAuthCookie(res);
    return (0, response_1.sendSuccess)(res, { status: "logged_out" });
};
exports.logout = logout;
const me = async (req, res, next) => {
    try {
        if (!req.user) {
            throw new ApiError_1.ApiError(401, "UNAUTHORIZED", "Missing token");
        }
        const user = await User_1.User.findById(req.user.id).select("email name role").lean();
        return (0, response_1.sendSuccess)(res, user);
    }
    catch (error) {
        return next(error);
    }
};
exports.me = me;
const changePassword = async (req, res, next) => {
    try {
        if (!req.user) {
            throw new ApiError_1.ApiError(401, "UNAUTHORIZED", "Missing token");
        }
        const { currentPassword, newPassword } = req.body;
        const user = await User_1.User.findById(req.user.id);
        if (!user) {
            throw new ApiError_1.ApiError(404, "NOT_FOUND", "User not found");
        }
        const ok = await bcryptjs_1.default.compare(currentPassword, user.passwordHash);
        if (!ok) {
            throw new ApiError_1.ApiError(401, "INVALID_CREDENTIALS", "Current password is incorrect");
        }
        user.passwordHash = await bcryptjs_1.default.hash(newPassword, 10);
        await user.save();
        return (0, response_1.sendSuccess)(res, { status: "updated" });
    }
    catch (error) {
        return next(error);
    }
};
exports.changePassword = changePassword;
const forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        if (!email) {
            throw new ApiError_1.ApiError(400, "BAD_REQUEST", "Email is required");
        }
        const user = await User_1.User.findOne({ email });
        // Always respond with success to prevent email enumeration
        if (!user) {
            return (0, response_1.sendSuccess)(res, { status: "ok" });
        }
        const rawToken = crypto_1.default.randomBytes(32).toString("hex");
        const tokenHash = crypto_1.default.createHash("sha256").update(rawToken).digest("hex");
        const ttl = Number(env_1.env.PASSWORD_RESET_TTL_MS);
        user.resetPasswordToken = tokenHash;
        user.resetPasswordExpires = new Date(Date.now() + ttl);
        await user.save();
        const resetUrl = `${env_1.env.FRONTEND_URL.split(",")[0].trim()}/reset-password?token=${rawToken}`;
        await (0, emailService_1.sendEmail)({
            to: user.email,
            subject: "Password reset request",
            text: `You requested a password reset. Click the link to reset your password (valid for 1 hour):\n\n${resetUrl}\n\nIf you did not request this, ignore this email.`
        });
        return (0, response_1.sendSuccess)(res, { status: "ok" });
    }
    catch (error) {
        return next(error);
    }
};
exports.forgotPassword = forgotPassword;
const resetPassword = async (req, res, next) => {
    try {
        const { token, newPassword } = req.body;
        if (!token || !newPassword) {
            throw new ApiError_1.ApiError(400, "BAD_REQUEST", "Token and new password are required");
        }
        const tokenHash = crypto_1.default.createHash("sha256").update(String(token)).digest("hex");
        const user = await User_1.User.findOne({
            resetPasswordToken: tokenHash,
            resetPasswordExpires: { $gt: new Date() }
        });
        if (!user) {
            throw new ApiError_1.ApiError(400, "INVALID_TOKEN", "Reset token is invalid or has expired");
        }
        user.passwordHash = await bcryptjs_1.default.hash(newPassword, 10);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();
        return (0, response_1.sendSuccess)(res, { status: "ok" });
    }
    catch (error) {
        return next(error);
    }
};
exports.resetPassword = resetPassword;
