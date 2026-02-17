import { NextFunction, Request, Response } from "express";
import fs from "fs";
import path from "path";
import sharp from "sharp";
import { ApiError } from "../../utils/ApiError";
import { sendSuccess } from "../../utils/response";

type UploadRequest = Request & {
  file?: { filename?: string; path?: string; mimetype?: string };
};

const buildVariantName = (filename: string, suffix: "sm" | "md" | "lg") => {
  const ext = path.extname(filename);
  const base = path.basename(filename, ext);
  return `${base}-${suffix}.webp`;
};

const createResponsiveVariants = async (sourcePath: string, outputDir: string, filename: string) => {
  const smName = buildVariantName(filename, "sm");
  const mdName = buildVariantName(filename, "md");
  const lgName = buildVariantName(filename, "lg");

  const smPath = path.join(outputDir, smName);
  const mdPath = path.join(outputDir, mdName);
  const lgPath = path.join(outputDir, lgName);

  await Promise.all([
    sharp(sourcePath).rotate().resize({ width: 480, withoutEnlargement: true }).webp({ quality: 78 }).toFile(smPath),
    sharp(sourcePath).rotate().resize({ width: 960, withoutEnlargement: true }).webp({ quality: 80 }).toFile(mdPath),
    sharp(sourcePath)
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

const createInlineDataUrl = async (sourcePath: string, mimetype: string, transformable: boolean) => {
  if (transformable) {
    const optimized = await sharp(sourcePath)
      .rotate()
      .resize({ width: 1200, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toBuffer();
    return `data:image/webp;base64,${optimized.toString("base64")}`;
  }
  const raw = await fs.promises.readFile(sourcePath);
  const safeMime = mimetype || "application/octet-stream";
  return `data:${safeMime};base64,${raw.toString("base64")}`;
};

export const uploadAdminImage = async (req: UploadRequest, res: Response, next: NextFunction) => {
  const file = req.file;
  if (!file) {
    return next(new ApiError(400, "BAD_REQUEST", "No file uploaded"));
  }

  if (!file.filename || !file.path) {
    return next(new ApiError(400, "BAD_REQUEST", "Upload failed"));
  }

  const uploadDir = path.dirname(file.path);
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const mimetype = file.mimetype ?? "";
  const isTransformableImage = mimetype.startsWith("image/") && !mimetype.includes("svg") && !mimetype.includes("gif");
  const useInlineMode = process.env.UPLOAD_MODE !== "disk";

  if (useInlineMode) {
    try {
      const url = await createInlineDataUrl(file.path, mimetype, isTransformableImage);
      await fs.promises.unlink(file.path).catch(() => undefined);
      return sendSuccess(res, { url, mode: "inline" });
    } catch (error) {
      return next(error);
    }
  }

  if (!isTransformableImage) {
    const url = `/uploads/${path.basename(file.filename)}`;
    return sendSuccess(res, { url });
  }

  try {
    const variants = await createResponsiveVariants(file.path, uploadDir, file.filename);
    return sendSuccess(res, { url: variants.lg, variants });
  } catch (error) {
    return next(error);
  }
};
