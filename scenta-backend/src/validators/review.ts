import { z } from "zod";

export const reviewSchema = z.object({
  body: z.object({
    rating: z.number().min(1).max(5),
    title: z.string().optional(),
    body: z.string().min(1)
  })
});
