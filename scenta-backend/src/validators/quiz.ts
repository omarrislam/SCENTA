import { z } from "zod";

const quizOptionSchema = z.object({
  label: z.string().min(1),
  labelAr: z.string().optional(),
  score: z.number(),
  note: z.string().min(1)
});

const quizQuestionSchema = z.object({
  prompt: z.string().min(1),
  promptAr: z.string().optional(),
  options: z.array(quizOptionSchema).min(1)
});

export const quizUpdateSchema = z.object({
  questions: z.array(quizQuestionSchema).min(1)
});
