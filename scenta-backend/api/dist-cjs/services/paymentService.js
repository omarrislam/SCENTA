"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyStripeSignature = exports.createPaymentIntent = exports.stripe = void 0;
const stripe_1 = __importDefault(require("stripe"));
const env_1 = require("../config/env");
exports.stripe = new stripe_1.default(env_1.env.STRIPE_SECRET_KEY, { apiVersion: "2025-02-24.acacia" });
const createPaymentIntent = async (amount, metadata) => {
    const normalizedAmount = Math.max(50, Math.round(Number(amount)));
    if (!Number.isFinite(normalizedAmount)) {
        throw new Error("Invalid payment amount");
    }
    return exports.stripe.paymentIntents.create({
        amount: normalizedAmount,
        currency: "egp",
        metadata
    });
};
exports.createPaymentIntent = createPaymentIntent;
const verifyStripeSignature = (payload, signature) => exports.stripe.webhooks.constructEvent(payload, signature, env_1.env.STRIPE_WEBHOOK_SECRET);
exports.verifyStripeSignature = verifyStripeSignature;
