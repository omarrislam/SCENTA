import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { validateCheckout } from "../services/checkoutService";
import { createOrder, finalizeStripeOrder } from "../services/orderService";
import { createPaymentIntent, verifyStripeSignature } from "../services/paymentService";
import { sendSuccess } from "../utils/response";
import { ApiError } from "../utils/ApiError";
import { AuthRequest } from "../middleware/auth";
import { Product } from "../models/Product";
import { Order } from "../models/Order";
import { sendEmail } from "../services/emailService";

export const validateCheckoutHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { items, couponCode } = req.body;
    const totals = await validateCheckout(items, couponCode);
    return sendSuccess(res, totals);
  } catch (error) {
    return next(error);
  }
};

export const createCodOrder = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new ApiError(401, "UNAUTHORIZED", "Missing token");
    }
    const { items, shippingAddress, couponCode } = req.body;
    const totals = await validateCheckout(items, couponCode);

    const orderItems = [] as Array<{
      productId: string;
      productTitleSnapshot: string;
      productSlugSnapshot: string;
      variantKey: string;
      sizeMl: number;
      unitPrice: number;
      qty: number;
      imageSnapshot?: string;
    }>;

    for (const item of items) {
      const productId = item.productId;
      const product = mongoose.Types.ObjectId.isValid(productId)
        ? await Product.findById(productId)
        : await Product.findOne({ slug: item.productSlug });
      if (!product) {
        throw new ApiError(404, "PRODUCT_NOT_FOUND", "Product not found", {
          productId: item.productId,
          productSlug: item.productSlug
        });
      }
      const variant = product.variants.find((v) => v.key === item.variantKey);
      if (!variant) {
        throw new ApiError(404, "VARIANT_NOT_FOUND", "Variant not found");
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
      const updateResult = await Product.updateOne(
        {
          _id: product.id,
          "variants.key": item.variantKey,
          "variants.stock": { $gte: item.qty }
        },
        {
          $inc: { "variants.$.stock": -item.qty }
        }
      );
      if (!updateResult.modifiedCount) {
        throw new ApiError(409, "OUT_OF_STOCK", "Insufficient stock", {
          productId: product.id,
          variantKey: item.variantKey
        });
      }
    }

    const order = await createOrder({
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
      await sendEmail({
        to: req.body.email ?? "customer@example.com",
        subject: `Order ${order.orderNumber} confirmed`,
        text: "Thanks for your order. We are preparing your shipment."
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Order confirmation email failed", error);
    }

    return sendSuccess(res, order, 201);
  } catch (error) {
    return next(error);
  }
};

export const createStripeIntent = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new ApiError(401, "UNAUTHORIZED", "Missing token");
    }
    const { items, shippingAddress, couponCode } = req.body;
    const totals = await validateCheckout(items, couponCode);

    const orderItems = [] as Array<{
      productId: string;
      productTitleSnapshot: string;
      productSlugSnapshot: string;
      variantKey: string;
      sizeMl: number;
      unitPrice: number;
      qty: number;
      imageSnapshot?: string;
    }>;

    for (const item of items) {
      const productId = item.productId;
      const product = mongoose.Types.ObjectId.isValid(productId)
        ? await Product.findById(productId)
        : await Product.findOne({ slug: item.productSlug });
      if (!product) {
        throw new ApiError(404, "PRODUCT_NOT_FOUND", "Product not found", {
          productId: item.productId,
          productSlug: item.productSlug
        });
      }
      const variant = product.variants.find((v) => v.key === item.variantKey);
      if (!variant) {
        throw new ApiError(404, "VARIANT_NOT_FOUND", "Variant not found");
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

    const intent = await createPaymentIntent(totals.grandTotal * 100, {
      userId: req.user.id,
      orderSource: "scenta"
    });

    const order = await createOrder(
      {
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
      },
      "pending"
    );

    return sendSuccess(res, { clientSecret: intent.client_secret, orderId: order.id });
  } catch (error) {
    return next(error);
  }
};

export const listMyOrders = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new ApiError(401, "UNAUTHORIZED", "Missing token");
    }
    const orders = await Order.find({ userId: req.user.id });
    return sendSuccess(res, orders);
  } catch (error) {
    return next(error);
  }
};

export const getMyOrder = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new ApiError(401, "UNAUTHORIZED", "Missing token");
    }
    const order = await Order.findOne({ userId: req.user.id, _id: req.params.orderId });
    if (!order) {
      throw new ApiError(404, "NOT_FOUND", "Order not found");
    }
    return sendSuccess(res, order);
  } catch (error) {
    return next(error);
  }
};

export const stripeWebhook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const signature = req.headers["stripe-signature"];
    if (!signature || Array.isArray(signature)) {
      throw new ApiError(400, "INVALID_SIGNATURE", "Missing Stripe signature");
    }
    const event = verifyStripeSignature(req.body as Buffer, signature);
    if (event.type === "payment_intent.succeeded") {
      const intent = event.data.object as { id: string; receipt_email?: string };
      const order = await finalizeStripeOrder(intent.id);
      try {
        await sendEmail({
          to: intent.receipt_email ?? "customer@example.com",
          subject: `Order ${order.orderNumber} confirmed`,
          text: "Your payment was confirmed and your order is processing."
        });
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Stripe confirmation email failed", error);
      }
    }
    return sendSuccess(res, { status: "received" });
  } catch (error) {
    return next(error);
  }
};
