import { Router } from "express";
import { requireAuth, requireRole } from "../../middleware/auth";
import { auditLog } from "../../middleware/auditLog";
import { adjustInventory } from "../../controllers/admin/inventoryController";

const router = Router();

router.use(requireAuth, requireRole("admin"), auditLog);
router.patch("/adjust", adjustInventory);

export default router;
