import Stripe from "stripe";
import { env } from "../config/env";

export const stripe = new Stripe(env.STRIPE_SECRET_KEY, { apiVersion: "2025-02-24.acacia" });

export const createPaymentIntent = async (amount: number, metadata: Record<string, string>) => {
  const normalizedAmount = Math.max(50, Math.round(Number(amount)));
  if (!Number.isFinite(normalizedAmount)) {
    throw new Error("Invalid payment amount");
  }
  return stripe.paymentIntents.create({
    amount: normalizedAmount,
    currency: "egp",
    metadata
  });
};

export const verifyStripeSignature = (payload: Buffer, signature: string) =>
  stripe.webhooks.constructEvent(payload, signature, env.STRIPE_WEBHOOK_SECRET);
