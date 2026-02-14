import { Router } from "express";
import { requireAuth, requireRole } from "../../middleware/auth";
import { auditLog } from "../../middleware/auditLog";
import { validate } from "../../middleware/validate";
import { quizUpdateSchema } from "../../validators/quiz";
import { listAdminQuiz, replaceQuiz } from "../../controllers/admin/quizController";

const router = Router();

router.use(requireAuth, requireRole("admin"), auditLog);
router.get("/", listAdminQuiz);
router.put("/", validate(quizUpdateSchema), replaceQuiz);

export default router;
