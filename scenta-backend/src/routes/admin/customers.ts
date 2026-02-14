import { Router } from "express";
import { requireAuth, requireRole } from "../../middleware/auth";
import { auditLog } from "../../middleware/auditLog";
import { listCustomers } from "../../controllers/admin/customerController";

const router = Router();

router.use(requireAuth, requireRole("admin"), auditLog);
router.get("/", listCustomers);

export default router;
