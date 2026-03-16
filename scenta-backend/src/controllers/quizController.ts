import { Request, Response, NextFunction } from "express";
import { QuizQuestion } from "../models/Quiz";
import { quizDefaults } from "../data/quizDefaults";
import { sendSuccess } from "../utils/response";

type Locale = "en" | "ar";

const resolveLocale = (req: Request): Locale => (req.query.locale === "ar" ? "ar" : "en");

const flattenQuestion = (question: Record<string, unknown>, locale: Locale) => {
  const translations = (question.translations as Map<string, unknown>);
  const t = (translations?.get(locale) ?? translations?.get("en") ?? {}) as { prompt?: string };
  return {
    id: question._id,
    prompt: t.prompt ?? "",
    options: ((question.options ?? []) as Array<Record<string, unknown>>).map((opt) => {
      const optTranslations = opt.translations as Map<string, unknown>;
      const ot = (optTranslations?.get(locale) ?? optTranslations?.get("en") ?? {}) as { label?: string };
      return { label: ot.label ?? "", score: opt.score, note: opt.note };
    })
  };
};

export const listQuizQuestions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const locale = resolveLocale(req);
    const questions = await QuizQuestion.find().sort({ position: 1, createdAt: 1 }).lean();
    if (!questions.length) {
      return sendSuccess(res, quizDefaults.map((q, i) => ({ id: `default-${i}`, ...q })));
    }
    return sendSuccess(res, questions.map((q) => flattenQuestion(q as unknown as Record<string, unknown>, locale)));
  } catch (error) {
    return next(error);
  }
};
