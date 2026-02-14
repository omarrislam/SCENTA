"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const env_1 = require("../config/env");
const ApiError_1 = require("../utils/ApiError");
const response_1 = require("../utils/response");
const errorHandler = (err, _req, res, _next) => {
    if (err instanceof ApiError_1.ApiError) {
        return (0, response_1.sendError)(res, err.status, err.code, err.message, err.details);
    }
    const details = env_1.env.NODE_ENV === "production" ? undefined : err.message;
    return (0, response_1.sendError)(res, 500, "INTERNAL_ERROR", "Unexpected error", details);
};
exports.errorHandler = errorHandler;
