import { Router } from "express";
import { requireAuth, requireRole } from "../../middleware/auth";
import { auditLog } from "../../middleware/auditLog";
import { createCoupon, deleteCoupon, listCoupons, updateCoupon } from "../../controllers/admin/couponController";

const router = Router();

router.use(requireAuth, requireRole("admin"), auditLog);
router.get("/", listCoupons);
router.post("/", createCoupon);
router.patch("/:id", updateCoupon);
router.delete("/:id", deleteCoupon);

export default router;
