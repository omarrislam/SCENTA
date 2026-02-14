"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkoutSchema = void 0;
const zod_1 = require("zod");
exports.checkoutSchema = zod_1.z.object({
    body: zod_1.z.object({
        items: zod_1.z.array(zod_1.z.object({
            productId: zod_1.z.string(),
            productSlug: zod_1.z.string().optional(),
            variantKey: zod_1.z.string(),
            qty: zod_1.z.number().min(1)
        })),
        couponCode: zod_1.z.string().optional(),
        shippingAddress: zod_1.z.object({
            fullName: zod_1.z.string(),
            phone: zod_1.z.string(),
            city: zod_1.z.string(),
            area: zod_1.z.string(),
            street: zod_1.z.string(),
            building: zod_1.z.string(),
            notes: zod_1.z.string().optional()
        })
    })
});
