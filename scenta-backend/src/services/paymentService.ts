import Stripe from "stripe";
import { env } from "../config/env";

export const stripe = new Stripe(env.STRIPE_SECRET_KEY, { apiVersion: "2025-02-24.acacia" });

export const createPaymentIntent = async (amount: number, metadata: Record<string, string>) => {
  return stripe.paymentIntents.create({
    amount,
    currency: "egp",
    metadata
  });
};

export const verifyStripeSignature = (payload: Buffer, signature: string) =>
  stripe.webhooks.constructEvent(payload, signature, env.STRIPE_WEBHOOK_SECRET);
