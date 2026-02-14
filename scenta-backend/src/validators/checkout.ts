import { z } from "zod";

export const checkoutSchema = z.object({
  body: z.object({
    items: z.array(
      z.object({
        productId: z.string(),
        productSlug: z.string().optional(),
        variantKey: z.string(),
        qty: z.number().min(1)
      })
    ),
    couponCode: z.string().optional(),
    shippingAddress: z.object({
      fullName: z.string(),
      phone: z.string(),
      city: z.string(),
      area: z.string(),
      street: z.string(),
      building: z.string(),
      notes: z.string().optional()
    })
  })
});
