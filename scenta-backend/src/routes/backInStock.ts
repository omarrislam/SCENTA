import { Router } from "express";
import { subscribeBackInStock, listBackInStock, notifyBackInStock } from "../controllers/backInStockController";
import { requireAuth, requireRole } from "../middleware/auth";

const router = Router();

router.post("/back-in-stock/subscribe", requireAuth, subscribeBackInStock);
router.get("/back-in-stock/me", requireAuth, listBackInStock);
router.post("/admin/back-in-stock/notify", requireAuth, requireRole("admin"), notifyBackInStock);

export default router;
