import { Router } from "express";
import { listReviews, createReview } from "../controllers/reviewController";
import { requireAuth } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { reviewSchema } from "../validators/review";

const router = Router();

router.get("/products/:productId/reviews", listReviews);
router.post("/products/:productId/reviews", requireAuth, validate(reviewSchema), createReview);

export default router;
