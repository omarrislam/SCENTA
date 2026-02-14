"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadAdminImage = void 0;
const path_1 = __importDefault(require("path"));
const ApiError_1 = require("../../utils/ApiError");
const response_1 = require("../../utils/response");
const uploadAdminImage = (req, res, next) => {
    const file = req.file;
    if (!file?.filename) {
        return next(new ApiError_1.ApiError(400, "BAD_REQUEST", "No file uploaded"));
    }
    const url = `/uploads/${path_1.default.basename(file.filename)}`;
    return (0, response_1.sendSuccess)(res, { url });
};
exports.uploadAdminImage = uploadAdminImage;
