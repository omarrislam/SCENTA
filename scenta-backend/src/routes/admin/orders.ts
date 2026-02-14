import { Router } from "express";
import { requireAuth, requireRole } from "../../middleware/auth";
import { auditLog } from "../../middleware/auditLog";
import { validate } from "../../middleware/validate";
import { getAdminOrder, listAdminOrders, updateOrderStatus } from "../../controllers/admin/orderController";
import { adminOrderStatusSchema } from "../../validators/admin";

const router = Router();

router.use(requireAuth, requireRole("admin"), auditLog);
router.get("/", listAdminOrders);
router.get("/:id", getAdminOrder);
router.patch("/:id/status", validate(adminOrderStatusSchema), updateOrderStatus);

export default router;
