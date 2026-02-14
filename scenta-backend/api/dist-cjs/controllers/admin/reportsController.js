"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.topProductsReport = exports.salesReport = void 0;
const response_1 = require("../../utils/response");
const salesReport = async (_req, res, next) => {
    try {
        return (0, response_1.sendSuccess)(res, { total: 0, currency: "EGP" });
    }
    catch (error) {
        return next(error);
    }
};
exports.salesReport = salesReport;
const topProductsReport = async (_req, res, next) => {
    try {
        return (0, response_1.sendSuccess)(res, { items: [] });
    }
    catch (error) {
        return next(error);
    }
};
exports.topProductsReport = topProductsReport;
