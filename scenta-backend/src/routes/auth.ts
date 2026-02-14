import { Router } from "express";
import { register, login, me, forgotPassword, resetPassword, changePassword } from "../controllers/authController";
import { validate } from "../middleware/validate";
import { registerSchema, loginSchema, changePasswordSchema } from "../validators/auth";
import { requireAuth } from "../middleware/auth";
import { authLimiter } from "../middleware/rateLimit";

const router = Router();

router.post("/register", authLimiter, validate(registerSchema), register);
router.post("/login", authLimiter, validate(loginSchema), login);
router.post("/forgot-password", authLimiter, forgotPassword);
router.post("/reset-password", authLimiter, resetPassword);
router.get("/me", requireAuth, me);
router.post("/change-password", requireAuth, validate(changePasswordSchema), changePassword);

export default router;
