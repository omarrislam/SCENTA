"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendError = exports.sendSuccess = void 0;
const sendSuccess = (res, data, status = 200) => res.status(status).json({ success: true, data });
exports.sendSuccess = sendSuccess;
const sendError = (res, status, code, message, details) => res.status(status).json({
    success: false,
    error: { code, message, details }
});
exports.sendError = sendError;
