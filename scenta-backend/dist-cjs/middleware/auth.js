"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRole = exports.requireAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const ApiError_1 = require("../utils/ApiError");
const requireAuth = (req, _res, next) => {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) {
        return next(new ApiError_1.ApiError(401, "UNAUTHORIZED", "Missing token"));
    }
    try {
        const token = header.replace("Bearer ", "");
        const payload = jsonwebtoken_1.default.verify(token, env_1.env.JWT_SECRET);
        req.user = payload;
        return next();
    }
    catch (error) {
        return next(new ApiError_1.ApiError(401, "UNAUTHORIZED", "Invalid token", error));
    }
};
exports.requireAuth = requireAuth;
const requireRole = (role) => (req, _res, next) => {
    if (!req.user) {
        return next(new ApiError_1.ApiError(401, "UNAUTHORIZED", "Missing token"));
    }
    if (req.user.role !== role) {
        return next(new ApiError_1.ApiError(403, "FORBIDDEN", "Insufficient role"));
    }
    return next();
};
exports.requireRole = requireRole;
