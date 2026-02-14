"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCoupon = exports.updateCoupon = exports.createCoupon = exports.listCoupons = void 0;
const Coupon_1 = require("../../models/Coupon");
const response_1 = require("../../utils/response");
const listCoupons = async (_req, res, next) => {
    try {
        const coupons = await Coupon_1.Coupon.find();
        return (0, response_1.sendSuccess)(res, coupons);
    }
    catch (error) {
        return next(error);
    }
};
exports.listCoupons = listCoupons;
const createCoupon = async (req, res, next) => {
    try {
        const coupon = await Coupon_1.Coupon.create(req.body);
        return (0, response_1.sendSuccess)(res, coupon, 201);
    }
    catch (error) {
        return next(error);
    }
};
exports.createCoupon = createCoupon;
const updateCoupon = async (req, res, next) => {
    try {
        const coupon = await Coupon_1.Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true });
        return (0, response_1.sendSuccess)(res, coupon);
    }
    catch (error) {
        return next(error);
    }
};
exports.updateCoupon = updateCoupon;
const deleteCoupon = async (req, res, next) => {
    try {
        await Coupon_1.Coupon.findByIdAndDelete(req.params.id);
        return (0, response_1.sendSuccess)(res, { status: "deleted" });
    }
    catch (error) {
        return next(error);
    }
};
exports.deleteCoupon = deleteCoupon;
