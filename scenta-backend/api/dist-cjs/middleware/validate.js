"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const ApiError_1 = require("../utils/ApiError");
const validate = (schema) => (req, _res, next) => {
    const result = schema.safeParse({
        body: req.body,
        query: req.query,
        params: req.params
    });
    if (!result.success) {
        return next(new ApiError_1.ApiError(400, "VALIDATION_ERROR", "Invalid request", result.error.flatten()));
    }
    return next();
};
exports.validate = validate;
