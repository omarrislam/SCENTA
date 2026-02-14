import { z } from "zod";

export const wishlistSchema = z.object({
  body: z.object({
    productId: z.string(),
    variantKey: z.string()
  })
});
