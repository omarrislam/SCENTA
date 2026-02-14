"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listActiveCoupons = void 0;
const Coupon_1 = require("../models/Coupon");
const response_1 = require("../utils/response");
const listActiveCoupons = async (_req, res, next) => {
    try {
        const now = new Date();
        const coupons = await Coupon_1.Coupon.find({
            status: "active",
            $and: [
                {
                    $or: [{ startsAt: { $exists: false } }, { startsAt: null }, { startsAt: { $lte: now } }]
                },
                {
                    $or: [{ endsAt: { $exists: false } }, { endsAt: null }, { endsAt: { $gte: now } }]
                }
            ]
        });
        return (0, response_1.sendSuccess)(res, coupons);
    }
    catch (error) {
        return next(error);
    }
};
exports.listActiveCoupons = listActiveCoupons;
