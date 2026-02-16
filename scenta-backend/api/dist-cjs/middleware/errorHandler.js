"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const env_1 = require("../config/env");
const ApiError_1 = require("../utils/ApiError");
const response_1 = require("../utils/response");
const errorHandler = (err, req, res, _next) => {
    const expressError = err;
    if (expressError.type === "entity.too.large" || expressError.status === 413 || expressError.statusCode === 413) {
        return (0, response_1.sendError)(res, 413, "PAYLOAD_TOO_LARGE", "Request payload is too large");
    }
    if (err instanceof ApiError_1.ApiError) {
        // eslint-disable-next-line no-console
        console.error("API_ERROR", {
            method: req.method,
            path: req.originalUrl,
            code: err.code,
            status: err.status,
            message: err.message,
            details: err.details
        });
        return (0, response_1.sendError)(res, err.status, err.code, err.message, err.details);
    }
    // eslint-disable-next-line no-console
    console.error("UNEXPECTED_ERROR", {
        method: req.method,
        path: req.originalUrl,
        message: err.message,
        stack: err.stack
    });
    const details = env_1.env.NODE_ENV === "production" ? undefined : err.message;
    return (0, response_1.sendError)(res, 500, "INTERNAL_ERROR", "Unexpected error", details);
};
exports.errorHandler = errorHandler;
