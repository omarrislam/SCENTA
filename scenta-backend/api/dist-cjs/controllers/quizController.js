"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listQuizQuestions = void 0;
const Quiz_1 = require("../models/Quiz");
const quizDefaults_1 = require("../data/quizDefaults");
const response_1 = require("../utils/response");
const resolveLocale = (req) => (req.query.locale === "ar" ? "ar" : "en");
const flattenQuestion = (question, locale) => {
    const translations = question.translations;
    const t = (translations?.get(locale) ?? translations?.get("en") ?? {});
    return {
        id: question._id,
        prompt: t.prompt ?? "",
        options: (question.options ?? []).map((opt) => {
            const optTranslations = opt.translations;
            const ot = (optTranslations?.get(locale) ?? optTranslations?.get("en") ?? {});
            return { label: ot.label ?? "", score: opt.score, note: opt.note };
        })
    };
};
const listQuizQuestions = async (req, res, next) => {
    try {
        const locale = resolveLocale(req);
        const questions = await Quiz_1.QuizQuestion.find().sort({ position: 1, createdAt: 1 }).lean();
        if (!questions.length) {
            return (0, response_1.sendSuccess)(res, quizDefaults_1.quizDefaults.map((q, i) => ({ id: `default-${i}`, ...q })));
        }
        return (0, response_1.sendSuccess)(res, questions.map((q) => flattenQuestion(q, locale)));
    }
    catch (error) {
        return next(error);
    }
};
exports.listQuizQuestions = listQuizQuestions;
