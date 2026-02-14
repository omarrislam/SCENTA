import { Router } from "express";
import { requireAuth, requireRole } from "../../middleware/auth";
import { auditLog } from "../../middleware/auditLog";
import { salesReport, topProductsReport } from "../../controllers/admin/reportsController";

const router = Router();

router.use(requireAuth, requireRole("admin"), auditLog);
router.get("/sales", salesReport);
router.get("/top-products", topProductsReport);

export default router;
