import { Request, Response, NextFunction } from "express";
import { QuizQuestion } from "../models/Quiz";
import { quizDefaults } from "../data/quizDefaults";
import { sendSuccess } from "../utils/response";

export const listQuizQuestions = async (_req: Request, res: Response, next: NextFunction) => {
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
