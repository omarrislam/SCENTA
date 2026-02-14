import { z } from "zod";

export const productFilterSchema = z.object({
  query: z.object({
    q: z.string().optional(),
    sort: z.string().optional(),
    page: z.string().optional(),
    limit: z.string().optional()
  })
});
