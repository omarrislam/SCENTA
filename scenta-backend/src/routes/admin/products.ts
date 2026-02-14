import { Router } from "express";
import { requireAuth, requireRole } from "../../middleware/auth";
import { auditLog } from "../../middleware/auditLog";
import {
  listAdminProducts,
  getAdminProduct,
  createAdminProduct,
  updateAdminProduct,
  deleteAdminProduct
} from "../../controllers/admin/productController";

const router = Router();

router.use(requireAuth, requireRole("admin"), auditLog);
router.get("/", listAdminProducts);
router.get("/:id", getAdminProduct);
router.post("/", createAdminProduct);
router.patch("/:id", updateAdminProduct);
router.delete("/:id", deleteAdminProduct);

export default router;
