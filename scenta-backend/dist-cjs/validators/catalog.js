"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productFilterSchema = void 0;
const zod_1 = require("zod");
exports.productFilterSchema = zod_1.z.object({
    query: zod_1.z.object({
        q: zod_1.z.string().optional(),
        sort: zod_1.z.string().optional(),
        page: zod_1.z.string().optional(),
        limit: zod_1.z.string().optional()
    })
});
