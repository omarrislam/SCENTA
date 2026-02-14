"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewSchema = void 0;
const zod_1 = require("zod");
exports.reviewSchema = zod_1.z.object({
    body: zod_1.z.object({
        rating: zod_1.z.number().min(1).max(5),
        title: zod_1.z.string().optional(),
        body: zod_1.z.string().min(1)
    })
});
