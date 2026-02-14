"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.quizUpdateSchema = void 0;
const zod_1 = require("zod");
const quizOptionSchema = zod_1.z.object({
    label: zod_1.z.string().min(1),
    labelAr: zod_1.z.string().optional(),
    score: zod_1.z.number(),
    note: zod_1.z.string().min(1)
});
const quizQuestionSchema = zod_1.z.object({
    prompt: zod_1.z.string().min(1),
    promptAr: zod_1.z.string().optional(),
    options: zod_1.z.array(quizOptionSchema).min(1)
});
exports.quizUpdateSchema = zod_1.z.object({
    questions: zod_1.z.array(quizQuestionSchema).min(1)
});
