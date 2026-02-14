import { Router } from "express";
import {
  validateCheckoutHandler,
  createCodOrder,
  createStripeIntent,
  listMyOrders,
  getMyOrder,
  stripeWebhook
} from "../controllers/orderController";
import { requireAuth } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { checkoutSchema } from "../validators/checkout";
import { checkoutLimiter } from "../middleware/rateLimit";

const router = Router();

router.post("/checkout/validate", checkoutLimiter, requireAuth, validate(checkoutSchema), validateCheckoutHandler);
router.post("/orders", checkoutLimiter, requireAuth, validate(checkoutSchema), createCodOrder);
router.post("/payments/stripe/create-intent", checkoutLimiter, requireAuth, validate(checkoutSchema), createStripeIntent);
router.post("/payments/stripe/webhook", stripeWebhook);
router.get("/orders/me", requireAuth, listMyOrders);
router.get("/orders/me/:orderId", requireAuth, getMyOrder);

export default router;
