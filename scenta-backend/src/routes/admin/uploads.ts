import { Router } from "express";
import fs from "fs";
import path from "path";
import multer from "multer";
import { uploadAdminImage } from "../../controllers/admin/uploadController";
import { requireAuth, requireRole } from "../../middleware/auth";
import { auditLog } from "../../middleware/auditLog";
import { env } from "../../config/env";

const router = Router();

const buildStorage = () => {
  if (env.UPLOAD_PROVIDER === "cloudinary") {
    return multer.memoryStorage();
  }
  const isVercel = Boolean(process.env.VERCEL);
  const uploadDir = isVercel ? path.join("/tmp", "uploads") : path.join(process.cwd(), "uploads");
  return multer.diskStorage({
    destination: (_req, _file, cb) => {
      try {
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
      } catch (error) {
        cb(error as Error, uploadDir);
      }
    },
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname);
      const safeExt = ext && ext.length <= 10 ? ext : "";
      cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${safeExt}`);
    }
  });
};

const upload = multer({
  storage: buildStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    cb(null, file.mimetype.startsWith("image/"));
  }
});

router.use(requireAuth, requireRole("admin"), auditLog);
router.post("/", upload.single("file"), uploadAdminImage);

export default router;
