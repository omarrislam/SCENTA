import { Request, Response, NextFunction } from "express";
import { QuizQuestion } from "../../models/Quiz";
import { quizDefaults } from "../../data/quizDefaults";
import { sendSuccess } from "../../utils/response";

export const listAdminQuiz = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const questions = await QuizQuestion.find().sort({ position: 1, createdAt: 1 });
    if (!questions.length) {
      return sendSuccess(res, quizDefaults);
    }
    return sendSuccess(res, questions);
  } catch (error) {
    return next(error);
  }
};

export const replaceQuiz = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const questions = req.body.questions ?? [];
    await QuizQuestion.deleteMany({});
    const created = await QuizQuestion.insertMany(
      questions.map((question: Record<string, unknown>, index: number) => ({
        ...question,
        position: index
      }))
    );
    return sendSuccess(res, created);
  } catch (error) {
    return next(error);
  }
};
