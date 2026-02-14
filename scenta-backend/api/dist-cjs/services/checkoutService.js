"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCheckout = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Coupon_1 = require("../models/Coupon");
const Order_1 = require("../models/Order");
const Product_1 = require("../models/Product");
const ApiError_1 = require("../utils/ApiError");
const validateCheckout = async (items, couponCode) => {
    if (!items.length) {
        throw new ApiError_1.ApiError(400, "EMPTY_CART", "Cart is empty");
    }
    let subtotal = 0;
    let discountTotal = 0;
    let coupon;
    for (const item of items) {
        const productId = item.productId;
        const product = mongoose_1.default.Types.ObjectId.isValid(productId)
            ? await Product_1.Product.findById(productId)
            : await Product_1.Product.findOne({ slug: item.productSlug });
        if (!product) {
            throw new ApiError_1.ApiError(404, "PRODUCT_NOT_FOUND", "Product not found", {
                productId: item.productId,
                productSlug: item.productSlug
            });
        }
        const variant = product.variants.find((v) => v.key === item.variantKey);
        if (!variant) {
            throw new ApiError_1.ApiError(404, "VARIANT_NOT_FOUND", "Variant not found", item.variantKey);
        }
        if ((variant.stock ?? 0) < item.qty) {
            throw new ApiError_1.ApiError(409, "OUT_OF_STOCK", "Insufficient stock", {
                productId: item.productId,
                variantKey: item.variantKey
            });
        }
        subtotal += (variant.price ?? 0) * item.qty;
    }
    if (couponCode) {
        const normalized = couponCode.trim().toUpperCase();
        const now = new Date();
        const match = await Coupon_1.Coupon.findOne({
            code: normalized,
            status: "active",
            $and: [
                { $or: [{ startsAt: { $exists: false } }, { startsAt: null }, { startsAt: { $lte: now } }] },
                { $or: [{ endsAt: { $exists: false } }, { endsAt: null }, { endsAt: { $gte: now } }] }
            ]
        });
        if (!match) {
            throw new ApiError_1.ApiError(400, "INVALID_COUPON", "Coupon is invalid or expired");
        }
        if (match.usageLimit && match.usageLimit > 0) {
            const used = await Order_1.Order.countDocuments({ "coupon.code": match.code });
            if (used >= match.usageLimit) {
                throw new ApiError_1.ApiError(400, "COUPON_LIMIT", "Coupon usage limit reached");
            }
        }
        if (match.type === "percent") {
            discountTotal = (subtotal * (match.value ?? 0)) / 100;
        }
        discountTotal = Math.min(discountTotal, subtotal);
        coupon = { code: match.code ?? normalized, type: match.type ?? "percent", value: match.value ?? 0 };
    }
    const shippingFee = 60;
    const grandTotal = Math.max(0, subtotal - discountTotal) + shippingFee;
    return { subtotal, shippingFee, discountTotal, grandTotal, coupon };
};
exports.validateCheckout = validateCheckout;
