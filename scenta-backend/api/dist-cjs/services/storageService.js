"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadToCloudinary = void 0;
const cloudinary_1 = require("cloudinary");
const sharp_1 = __importDefault(require("sharp"));
const env_1 = require("../config/env");
if (env_1.env.UPLOAD_PROVIDER === "cloudinary") {
    cloudinary_1.v2.config({
        cloud_name: env_1.env.CLOUDINARY_CLOUD_NAME,
        api_key: env_1.env.CLOUDINARY_API_KEY,
        api_secret: env_1.env.CLOUDINARY_API_SECRET,
        secure: true
    });
}
const WIDTHS = { sm: 480, md: 960, lg: 1440 };
const QUALITY = { sm: 78, md: 80, lg: 82 };
const toCloudinaryBuffer = async (buffer, width, quality) => (0, sharp_1.default)(buffer)
    .rotate()
    .resize({ width, withoutEnlargement: true })
    .webp({ quality })
    .toBuffer();
const uploadBufferToCloudinary = (buffer, publicId) => new Promise((resolve, reject) => {
    const stream = cloudinary_1.v2.uploader.upload_stream({ public_id: publicId, resource_type: "image", format: "webp" }, (err, result) => {
        if (err || !result)
            return reject(err ?? new Error("Cloudinary upload failed"));
        resolve(result.secure_url);
    });
    stream.end(buffer);
});
const uploadToCloudinary = async (buffer, baseName) => {
    const [smBuf, mdBuf, lgBuf] = await Promise.all([
        toCloudinaryBuffer(buffer, WIDTHS.sm, QUALITY.sm),
        toCloudinaryBuffer(buffer, WIDTHS.md, QUALITY.md),
        toCloudinaryBuffer(buffer, WIDTHS.lg, QUALITY.lg)
    ]);
    const [smUrl, mdUrl, lgUrl] = await Promise.all([
        uploadBufferToCloudinary(smBuf, `${baseName}-sm`),
        uploadBufferToCloudinary(mdBuf, `${baseName}-md`),
        uploadBufferToCloudinary(lgBuf, `${baseName}-lg`)
    ]);
    return {
        url: lgUrl,
        variants: { sm: smUrl, md: mdUrl, lg: lgUrl }
    };
};
exports.uploadToCloudinary = uploadToCloudinary;
