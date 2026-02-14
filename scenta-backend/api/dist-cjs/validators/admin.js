"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminOrderStatusSchema = void 0;
const zod_1 = require("zod");
exports.adminOrderStatusSchema = zod_1.z.object({
    body: zod_1.z.object({
        status: zod_1.z.enum(["pending", "placed", "paid", "fulfilled", "completed", "cancelled"])
    })
});
