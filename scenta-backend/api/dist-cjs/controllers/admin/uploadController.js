"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadAdminImage = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const ApiError_1 = require("../../utils/ApiError");
const response_1 = require("../../utils/response");
const uploadAdminImage = (req, res, next) => {
    const file = req.file;
    if (!file) {
        return next(new ApiError_1.ApiError(400, "BAD_REQUEST", "No file uploaded"));
    }
    const memoryFile = file;
    if (memoryFile.buffer?.length && memoryFile.mimetype?.startsWith("image/")) {
        const encoded = memoryFile.buffer.toString("base64");
        const url = `data:${memoryFile.mimetype};base64,${encoded}`;
        return (0, response_1.sendSuccess)(res, { url });
    }
    if (process.env.NODE_ENV === "production" &&
        memoryFile.path &&
        memoryFile.mimetype?.startsWith("image/") &&
        fs_1.default.existsSync(memoryFile.path)) {
        const encoded = fs_1.default.readFileSync(memoryFile.path).toString("base64");
        const url = `data:${memoryFile.mimetype};base64,${encoded}`;
        return (0, response_1.sendSuccess)(res, { url });
    }
    if (!memoryFile.filename) {
        return next(new ApiError_1.ApiError(400, "BAD_REQUEST", "Upload failed"));
    }
    const url = `/uploads/${path_1.default.basename(memoryFile.filename)}`;
    return (0, response_1.sendSuccess)(res, { url });
};
exports.uploadAdminImage = uploadAdminImage;
