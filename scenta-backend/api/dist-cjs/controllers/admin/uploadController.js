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
const buildVariantName = (filename, suffix) => {
    const ext = path_1.default.extname(filename);
    const base = path_1.default.basename(filename, ext);
    return `${base}-${suffix}.webp`;
};
const createResponsiveVariants = async (sourcePath, outputDir, filename) => {
    const smName = buildVariantName(filename, "sm");
    const mdName = buildVariantName(filename, "md");
    const lgName = buildVariantName(filename, "lg");
    const smPath = path_1.default.join(outputDir, smName);
    const mdPath = path_1.default.join(outputDir, mdName);
    const lgPath = path_1.default.join(outputDir, lgName);
    await Promise.all([
        (0, sharp_1.default)(sourcePath).rotate().resize({ width: 480, withoutEnlargement: true }).webp({ quality: 78 }).toFile(smPath),
        (0, sharp_1.default)(sourcePath).rotate().resize({ width: 960, withoutEnlargement: true }).webp({ quality: 80 }).toFile(mdPath),
        (0, sharp_1.default)(sourcePath)
            .rotate()
            .resize({ width: 1440, withoutEnlargement: true })
            .webp({ quality: 82 })
            .toFile(lgPath)
    ]);
    return {
        sm: `/uploads/${smName}`,
        md: `/uploads/${mdName}`,
        lg: `/uploads/${lgName}`
    };
};
const uploadAdminImage = async (req, res, next) => {
    const file = req.file;
    if (!file) {
        return next(new ApiError_1.ApiError(400, "BAD_REQUEST", "No file uploaded"));
    }
    if (!file.filename || !file.path) {
        return next(new ApiError_1.ApiError(400, "BAD_REQUEST", "Upload failed"));
    }
    const uploadDir = path_1.default.dirname(file.path);
    if (!fs_1.default.existsSync(uploadDir)) {
        fs_1.default.mkdirSync(uploadDir, { recursive: true });
    }
    const mimetype = file.mimetype ?? "";
    const isTransformableImage = mimetype.startsWith("image/") && !mimetype.includes("svg") && !mimetype.includes("gif");
    if (!isTransformableImage) {
        const url = `/uploads/${path_1.default.basename(file.filename)}`;
        return (0, response_1.sendSuccess)(res, { url });
    }
    try {
        const variants = await createResponsiveVariants(file.path, uploadDir, file.filename);
        return (0, response_1.sendSuccess)(res, { url: variants.lg, variants });
    }
    catch (error) {
        return next(error);
    }
};
exports.uploadAdminImage = uploadAdminImage;
