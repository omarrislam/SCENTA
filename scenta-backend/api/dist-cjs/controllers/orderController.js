"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stripeWebhook = exports.getMyOrder = exports.listMyOrders = exports.createStripeIntent = exports.createCodOrder = exports.validateCheckoutHandler = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const checkoutService_1 = require("../services/checkoutService");
const orderService_1 = require("../services/orderService");
const paymentService_1 = require("../services/paymentService");
const response_1 = require("../utils/response");
const ApiError_1 = require("../utils/ApiError");
const Product_1 = require("../models/Product");
const Order_1 = require("../models/Order");
const emailService_1 = require("../services/emailService");
const validateCheckoutHandler = async (req, res, next) => {
    try {
        const { items, couponCode } = req.body;
        const totals = await (0, checkoutService_1.validateCheckout)(items, couponCode);
        return (0, response_1.sendSuccess)(res, totals);
    }
    catch (error) {
        return next(error);
    }
};
exports.validateCheckoutHandler = validateCheckoutHandler;
const createCodOrder = async (req, res, next) => {
    try {
        if (!req.user) {
            throw new ApiError_1.ApiError(401, "UNAUTHORIZED", "Missing token");
        }
        const { items, shippingAddress, couponCode } = req.body;
        const totals = await (0, checkoutService_1.validateCheckout)(items, couponCode);
        const orderItems = [];
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
                throw new ApiError_1.ApiError(404, "VARIANT_NOT_FOUND", "Variant not found");
            }
            orderItems.push({
                productId: product.id,
                productTitleSnapshot: product.title,
                productSlugSnapshot: product.slug,
                variantKey: item.variantKey,
                sizeMl: variant.sizeMl ?? 0,
                unitPrice: variant.price ?? 0,
                qty: item.qty,
                imageSnapshot: product.images[0]?.url ?? undefined
            });
            variant.stock = Math.max(0, (variant.stock ?? 0) - item.qty);
            await product.save();
        }
        const order = await (0, orderService_1.createOrder)({
            userId: req.user.id,
            items: orderItems,
            shippingAddress,
            payment: { method: "cod" },
            totals: {
                subtotal: totals.subtotal,
                discountTotal: totals.discountTotal ?? 0,
                shippingFee: totals.shippingFee,
                grandTotal: totals.grandTotal
            },
            coupon: totals.coupon
        });
        try {
            await (0, emailService_1.sendEmail)({
                to: req.body.email ?? "customer@example.com",
                subject: `Order ${order.orderNumber} confirmed`,
                text: "Thanks for your order. We are preparing your shipment."
            });
        }
        catch (error) {
            // eslint-disable-next-line no-console
            console.error("Order confirmation email failed", error);
        }
        return (0, response_1.sendSuccess)(res, order, 201);
    }
    catch (error) {
        return next(error);
    }
};
exports.createCodOrder = createCodOrder;
const createStripeIntent = async (req, res, next) => {
    try {
        if (!req.user) {
            throw new ApiError_1.ApiError(401, "UNAUTHORIZED", "Missing token");
        }
        const { items, shippingAddress, couponCode } = req.body;
        const totals = await (0, checkoutService_1.validateCheckout)(items, couponCode);
        const orderItems = [];
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
                throw new ApiError_1.ApiError(404, "VARIANT_NOT_FOUND", "Variant not found");
            }
            orderItems.push({
                productId: product.id,
                productTitleSnapshot: product.title,
                productSlugSnapshot: product.slug,
                variantKey: item.variantKey,
                sizeMl: variant.sizeMl ?? 0,
                unitPrice: variant.price ?? 0,
                qty: item.qty,
                imageSnapshot: product.images[0]?.url ?? undefined
            });
        }
        const intent = await (0, paymentService_1.createPaymentIntent)(totals.grandTotal * 100, {
            userId: req.user.id,
            orderSource: "scenta"
        });
        const order = await (0, orderService_1.createOrder)({
            userId: req.user.id,
            items: orderItems,
            shippingAddress,
            payment: {
                method: "stripe",
                stripePaymentIntentId: intent.id,
                stripeStatus: "requires_payment"
            },
            totals: {
                subtotal: totals.subtotal,
                discountTotal: totals.discountTotal ?? 0,
                shippingFee: totals.shippingFee,
                grandTotal: totals.grandTotal
            },
            coupon: totals.coupon
        }, "pending");
        return (0, response_1.sendSuccess)(res, { clientSecret: intent.client_secret, orderId: order.id });
    }
    catch (error) {
        return next(error);
    }
};
exports.createStripeIntent = createStripeIntent;
const listMyOrders = async (req, res, next) => {
    try {
        if (!req.user) {
            throw new ApiError_1.ApiError(401, "UNAUTHORIZED", "Missing token");
        }
        const orders = await Order_1.Order.find({ userId: req.user.id });
        return (0, response_1.sendSuccess)(res, orders);
    }
    catch (error) {
        return next(error);
    }
};
exports.listMyOrders = listMyOrders;
const getMyOrder = async (req, res, next) => {
    try {
        if (!req.user) {
            throw new ApiError_1.ApiError(401, "UNAUTHORIZED", "Missing token");
        }
        const order = await Order_1.Order.findOne({ userId: req.user.id, _id: req.params.orderId });
        if (!order) {
            throw new ApiError_1.ApiError(404, "NOT_FOUND", "Order not found");
        }
        return (0, response_1.sendSuccess)(res, order);
    }
    catch (error) {
        return next(error);
    }
};
exports.getMyOrder = getMyOrder;
const stripeWebhook = async (req, res, next) => {
    try {
        const signature = req.headers["stripe-signature"];
        if (!signature || Array.isArray(signature)) {
            throw new ApiError_1.ApiError(400, "INVALID_SIGNATURE", "Missing Stripe signature");
        }
        const event = (0, paymentService_1.verifyStripeSignature)(req.body, signature);
        if (event.type === "payment_intent.succeeded") {
            const intent = event.data.object;
            const order = await (0, orderService_1.finalizeStripeOrder)(intent.id);
            try {
                await (0, emailService_1.sendEmail)({
                    to: intent.receipt_email ?? "customer@example.com",
                    subject: `Order ${order.orderNumber} confirmed`,
                    text: "Your payment was confirmed and your order is processing."
                });
            }
            catch (error) {
                // eslint-disable-next-line no-console
                console.error("Stripe confirmation email failed", error);
            }
        }
        return (0, response_1.sendSuccess)(res, { status: "received" });
    }
    catch (error) {
        return next(error);
    }
};
exports.stripeWebhook = stripeWebhook;
