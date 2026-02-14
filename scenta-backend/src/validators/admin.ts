import { z } from "zod";

export const adminOrderStatusSchema = z.object({
  body: z.object({
    status: z.enum(["pending", "placed", "paid", "fulfilled", "completed", "cancelled"])
  })
});
