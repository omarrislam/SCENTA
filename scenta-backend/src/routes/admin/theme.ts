import { Router } from "express";
import { requireAuth, requireRole } from "../../middleware/auth";
import { auditLog } from "../../middleware/auditLog";
import { getTheme, updateTheme } from "../../controllers/admin/themeController";

const router = Router();

router.use(requireAuth, requireRole("admin"), auditLog);
router.get("/", getTheme);
router.patch("/", updateTheme);

export default router;
