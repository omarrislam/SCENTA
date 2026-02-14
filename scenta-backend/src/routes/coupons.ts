import { Router } from "express";
import { listActiveCoupons } from "../controllers/couponController";

const router = Router();

router.get("/coupons", listActiveCoupons);

export default router;
