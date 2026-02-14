"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listQuizQuestions = void 0;
const Quiz_1 = require("../models/Quiz");
const quizDefaults_1 = require("../data/quizDefaults");
const response_1 = require("../utils/response");
const listQuizQuestions = async (_req, res, next) => {
    try {
        const questions = await Quiz_1.QuizQuestion.find().sort({ position: 1, createdAt: 1 });
        if (!questions.length) {
            return (0, response_1.sendSuccess)(res, quizDefaults_1.quizDefaults);
        }
        return (0, response_1.sendSuccess)(res, questions);
    }
    catch (error) {
        return next(error);
    }
};
exports.listQuizQuestions = listQuizQuestions;
