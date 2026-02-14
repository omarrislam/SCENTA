"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.forgotPassword = exports.changePassword = exports.me = exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../models/User");
const ApiError_1 = require("../utils/ApiError");
const env_1 = require("../config/env");
const response_1 = require("../utils/response");
const signToken = (payload) => jsonwebtoken_1.default.sign(payload, env_1.env.JWT_SECRET, { expiresIn: env_1.env.JWT_EXPIRES_IN });
const register = async (req, res, next) => {
    try {
        const { email, password, name } = req.body;
        const existing = await User_1.User.findOne({ email });
        if (existing) {
            throw new ApiError_1.ApiError(409, "EMAIL_EXISTS", "Email already registered");
        }
        const passwordHash = await bcryptjs_1.default.hash(password, 10);
        const user = await User_1.User.create({ email, passwordHash, name, role: "customer" });
        const token = signToken({ id: user.id, role: user.role });
        return (0, response_1.sendSuccess)(res, { token, user: { id: user.id, email, name, role: user.role } }, 201);
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
        return (0, response_1.sendSuccess)(res, { token, user: { id: user.id, email, name: user.name, role: user.role } });
    }
    catch (error) {
        return next(error);
    }
};
exports.login = login;
const me = async (req, res, next) => {
    try {
        if (!req.user) {
            throw new ApiError_1.ApiError(401, "UNAUTHORIZED", "Missing token");
        }
        const user = await User_1.User.findById(req.user.id).select("email name role");
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
const forgotPassword = async (_req, res) => (0, response_1.sendSuccess)(res, { status: "ok" });
exports.forgotPassword = forgotPassword;
const resetPassword = async (_req, res) => (0, response_1.sendSuccess)(res, { status: "ok" });
exports.resetPassword = resetPassword;
