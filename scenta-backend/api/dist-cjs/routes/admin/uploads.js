"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const multer_1 = __importDefault(require("multer"));
const uploadController_1 = require("../../controllers/admin/uploadController");
const auth_1 = require("../../middleware/auth");
const auditLog_1 = require("../../middleware/auditLog");
const router = (0, express_1.Router)();
const isVercelRuntime = Boolean(process.env.VERCEL);
const uploadDir = isVercelRuntime ? path_1.default.join("/tmp", "uploads") : path_1.default.join(process.cwd(), "uploads");
const storage = multer_1.default.diskStorage({
    destination: (_req, _file, cb) => {
        try {
            if (!fs_1.default.existsSync(uploadDir)) {
                fs_1.default.mkdirSync(uploadDir, { recursive: true });
            }
            cb(null, uploadDir);
        }
        catch (error) {
            cb(error, uploadDir);
        }
    },
    filename: (_req, file, cb) => {
        const ext = path_1.default.extname(file.originalname);
        const safeExt = ext && ext.length <= 10 ? ext : "";
        const name = `${Date.now()}-${Math.round(Math.random() * 1e9)}${safeExt}`;
        cb(null, name);
    }
});
const upload = (0, multer_1.default)({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
        cb(null, file.mimetype.startsWith("image/"));
    }
});
router.use(auth_1.requireAuth, (0, auth_1.requireRole)("admin"), auditLog_1.auditLog);
router.post("/", upload.single("file"), uploadController_1.uploadAdminImage);
exports.default = router;
