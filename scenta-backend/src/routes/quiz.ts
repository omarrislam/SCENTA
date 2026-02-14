import { Router } from "express";
import { listQuizQuestions } from "../controllers/quizController";

const router = Router();

router.get("/quiz", listQuizQuestions);

export default router;
