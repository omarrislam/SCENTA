import { NextFunction, Request, Response } from "express";
import fs from "fs";
import path from "path";
import sharp from "sharp";
import { ApiError } from "../../utils/ApiError";
import { sendSuccess } from "../../utils/response";
import { env } from "../../config/env";
import { uploadToCloudinary } from "../../services/storageService";

type UploadRequest = Request & {
  file?: { filename?: string; path?: string; mimetype?: string; buffer?: Buffer };
};

const buildVariantName = (filename: string, suffix: "sm" | "md" | "lg") => {
  const ext = path.extname(filename);
  const base = path.basename(filename, ext);
  return `${base}-${suffix}.webp`;
};

const createDiskVariants = async (sourcePath: string, outputDir: string, filename: string) => {
  const smName = buildVariantName(filename, "sm");
  const mdName = buildVariantName(filename, "md");
  const lgName = buildVariantName(filename, "lg");

  const smPath = path.join(outputDir, smName);
  const mdPath = path.join(outputDir, mdName);
  const lgPath = path.join(outputDir, lgName);

  await Promise.all([
    sharp(sourcePath).rotate().resize({ width: 480, withoutEnlargement: true }).webp({ quality: 78 }).toFile(smPath),
    sharp(sourcePath).rotate().resize({ width: 960, withoutEnlargement: true }).webp({ quality: 80 }).toFile(mdPath),
    sharp(sourcePath).rotate().resize({ width: 1440, withoutEnlargement: true }).webp({ quality: 82 }).toFile(lgPath)
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

export const uploadAdminImage = async (req: UploadRequest, res: Response, next: NextFunction) => {
  const file = req.file;
  if (!file) {
    return next(new ApiError(400, "BAD_REQUEST", "No file uploaded"));
  }

  const mimetype = file.mimetype ?? "";
  const isTransformable = mimetype.startsWith("image/") && !mimetype.includes("svg") && !mimetype.includes("gif");

  if (env.UPLOAD_PROVIDER === "cloudinary") {
    if (!file.buffer) {
      return next(new ApiError(400, "BAD_REQUEST", "Upload buffer missing"));
    }
    try {
      const baseName = `uploads/${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      if (!isTransformable) {
        const result = await uploadToCloudinary(file.buffer, baseName);
        return sendSuccess(res, { url: result.url });
      }
      const result = await uploadToCloudinary(file.buffer, baseName);
      return sendSuccess(res, result);
    } catch (error) {
      return next(error);
    }
  }

  // Disk storage path
  if (!file.filename || !file.path) {
    return next(new ApiError(400, "BAD_REQUEST", "Upload failed"));
  }

  const uploadDir = path.dirname(file.path);
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  if (!isTransformable) {
    return sendSuccess(res, { url: `/uploads/${path.basename(file.filename)}` });
  }

  try {
    const result = await createDiskVariants(file.path, uploadDir, file.filename);
    return sendSuccess(res, result);
  } catch (error) {
    return next(error);
  }
};
