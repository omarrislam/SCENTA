import { Router } from "express";
import { getWishlist, toggleWishlist } from "../controllers/wishlistController";
import { requireAuth } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { wishlistSchema } from "../validators/wishlist";

const router = Router();

router.get("/wishlist", requireAuth, getWishlist);
router.post("/wishlist/toggle", requireAuth, validate(wishlistSchema), toggleWishlist);

export default router;
