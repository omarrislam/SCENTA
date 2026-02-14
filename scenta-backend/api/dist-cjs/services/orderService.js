"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.finalizeStripeOrder = exports.createOrder = void 0;
const nanoid_1 = require("nanoid");
const Order_1 = require("../models/Order");
const Product_1 = require("../models/Product");
const ApiError_1 = require("../utils/ApiError");
const createOrder = async (input, statusOverride) => {
    return Order_1.Order.create({
        ...input,
        orderNumber: `SCN-${(0, nanoid_1.nanoid)(6).toUpperCase()}`,
        status: statusOverride ?? (input.payment.method === "cod" ? "placed" : "pending")
    });
};
exports.createOrder = createOrder;
const finalizeStripeOrder = async (paymentIntentId) => {
    const order = await Order_1.Order.findOne({ "payment.stripePaymentIntentId": paymentIntentId });
    if (!order) {
        throw new ApiError_1.ApiError(404, "ORDER_NOT_FOUND", "Order not found for payment intent");
    }
    if (order.status === "paid") {
        return order;
    }
    for (const item of order.items) {
        const product = await Product_1.Product.findById(item.productId);
        if (!product)
            continue;
        const variant = product.variants.find((v) => v.key === item.variantKey);
        if (variant) {
            variant.stock = Math.max(0, (variant.stock ?? 0) - (item.qty ?? 0));
            await product.save();
        }
    }
    order.status = "paid";
    order.payment = order.payment ?? { method: "stripe" };
    order.payment.stripeStatus = "succeeded";
    await order.save();
    return order;
};
exports.finalizeStripeOrder = finalizeStripeOrder;
