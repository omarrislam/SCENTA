"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadAdminImage = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const sharp_1 = __importDefault(require("sharp"));
const ApiError_1 = require("../../utils/ApiError");
const response_1 = require("../../utils/response");
const env_1 = require("../../config/env");
const storageService_1 = require("../../services/storageService");
const buildVariantName = (filename, suffix) => {
    const ext = path_1.default.extname(filename);
    const base = path_1.default.basename(filename, ext);
    return `${base}-${suffix}.webp`;
};
const createDiskVariants = async (sourcePath, outputDir, filename) => {
    const smName = buildVariantName(filename, "sm");
    const mdName = buildVariantName(filename, "md");
    const lgName = buildVariantName(filename, "lg");
    const smPath = path_1.default.join(outputDir, smName);
    const mdPath = path_1.default.join(outputDir, mdName);
    const lgPath = path_1.default.join(outputDir, lgName);
    await Promise.all([
        (0, sharp_1.default)(sourcePath).rotate().resize({ width: 480, withoutEnlargement: true }).webp({ quality: 78 }).toFile(smPath),
        (0, sharp_1.default)(sourcePath).rotate().resize({ width: 960, withoutEnlargement: true }).webp({ quality: 80 }).toFile(mdPath),
        (0, sharp_1.default)(sourcePath).rotate().resize({ width: 1440, withoutEnlargement: true }).webp({ quality: 82 }).toFile(lgPath)
    ]);
    return {
        url: `/uploads/${lgName}`,
        variants: {
            sm: `/uploads/${smName}`,
            md: `/uploads/${mdName}`,
            lg: `/uploads/${lgName}`
        }
    };
};
const uploadAdminImage = async (req, res, next) => {
    const file = req.file;
    if (!file) {
        return next(new ApiError_1.ApiError(400, "BAD_REQUEST", "No file uploaded"));
    }
    const mimetype = file.mimetype ?? "";
    const isTransformable = mimetype.startsWith("image/") && !mimetype.includes("svg") && !mimetype.includes("gif");
    if (env_1.env.UPLOAD_PROVIDER === "cloudinary") {
        if (!file.buffer) {
            return next(new ApiError_1.ApiError(400, "BAD_REQUEST", "Upload buffer missing"));
        }
        try {
            const baseName = `uploads/${Date.now()}-${Math.round(Math.random() * 1e9)}`;
            if (!isTransformable) {
                const result = await (0, storageService_1.uploadToCloudinary)(file.buffer, baseName);
                return (0, response_1.sendSuccess)(res, { url: result.url });
            }
            const result = await (0, storageService_1.uploadToCloudinary)(file.buffer, baseName);
            return (0, response_1.sendSuccess)(res, result);
        }
        catch (error) {
            return next(error);
        }
    }
    // Disk storage path
    if (!file.filename || !file.path) {
        return next(new ApiError_1.ApiError(400, "BAD_REQUEST", "Upload failed"));
    }
    const uploadDir = path_1.default.dirname(file.path);
    if (!fs_1.default.existsSync(uploadDir)) {
        fs_1.default.mkdirSync(uploadDir, { recursive: true });
    }
    if (!isTransformable) {
        return (0, response_1.sendSuccess)(res, { url: `/uploads/${path_1.default.basename(file.filename)}` });
    }
    try {
        const result = await createDiskVariants(file.path, uploadDir, file.filename);
        return (0, response_1.sendSuccess)(res, result);
    }
    catch (error) {
        return next(error);
    }
};
exports.uploadAdminImage = uploadAdminImage;
