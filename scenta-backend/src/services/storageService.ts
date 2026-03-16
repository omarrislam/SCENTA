import { v2 as cloudinary } from "cloudinary";
import sharp from "sharp";
import { env } from "../config/env";

if (env.UPLOAD_PROVIDER === "cloudinary") {
  cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
    secure: true
  });
}

export interface UploadResult {
  url: string;
  variants?: { sm: string; md: string; lg: string };
}

const WIDTHS = { sm: 480, md: 960, lg: 1440 } as const;
const QUALITY = { sm: 78, md: 80, lg: 82 } as const;

const toCloudinaryBuffer = async (
  buffer: Buffer,
  width: number,
  quality: number
): Promise<Buffer> =>
  sharp(buffer)
    .rotate()
    .resize({ width, withoutEnlargement: true })
    .webp({ quality })
    .toBuffer();

const uploadBufferToCloudinary = (
  buffer: Buffer,
  publicId: string
): Promise<string> =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { public_id: publicId, resource_type: "image", format: "webp" },
      (err, result) => {
        if (err || !result) return reject(err ?? new Error("Cloudinary upload failed"));
        resolve(result.secure_url);
      }
    );
    stream.end(buffer);
  });

export const uploadToCloudinary = async (
  buffer: Buffer,
  baseName: string
): Promise<UploadResult> => {
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
