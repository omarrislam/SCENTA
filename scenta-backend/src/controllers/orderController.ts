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

type OrderItemInput = {
  productId: string;
  productTitleSnapshot: string;
  productSlugSnapshot: string;
  variantKey: string;
  sizeMl: number;
  unitPrice: number;
  qty: number;
  imageSnapshot?: string;
};

const buildOrderItems = async (
  items: Array<{ productId?: string; productSlug?: string; variantKey: string; qty: number }>,
  session: mongoose.ClientSession
): Promise<OrderItemInput[]> => {
  const orderItems: OrderItemInput[] = [];

  for (const item of items) {
    const product = mongoose.Types.ObjectId.isValid(item.productId ?? "")
      ? await Product.findOne({ _id: item.productId, deletedAt: null }).session(session)
      : await Product.findOne({ slug: item.productSlug, deletedAt: null }).session(session);

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

  return orderItems;
};

const decrementStock = async (
  orderItems: OrderItemInput[],
  rawItems: Array<{ productId?: string; productSlug?: string; variantKey: string; qty: number }>,
  session: mongoose.ClientSession
) => {
  for (let i = 0; i < orderItems.length; i++) {
    const orderItem = orderItems[i];
    const rawItem = rawItems[i];
    const updateResult = await Product.updateOne(
      {
        _id: orderItem.productId,
        "variants.key": rawItem.variantKey,
        "variants.stock": { $gte: rawItem.qty }
      },
      { $inc: { "variants.$.stock": -rawItem.qty } },
      { session }
    );
    if (!updateResult.modifiedCount) {
      throw new ApiError(409, "OUT_OF_STOCK", "Insufficient stock", {
        productId: orderItem.productId,
        variantKey: rawItem.variantKey
      });
    }
  }
};

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
  if (!req.user) return next(new ApiError(401, "UNAUTHORIZED", "Missing token"));

  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const { items, shippingAddress, couponCode } = req.body;
    const totals = await validateCheckout(items, couponCode);
    const orderItems = await buildOrderItems(items, session);
    await decrementStock(orderItems, items, session);

    const order = await createOrder(
      {
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
      },
      "placed",
      session
    );

    await session.commitTransaction();

    try {
      await sendEmail({
        to: req.body.email ?? "customer@example.com",
        subject: `Order ${order.orderNumber} confirmed`,
        text: "Thanks for your order. We are preparing your shipment."
      });
    } catch (emailError) {
      // eslint-disable-next-line no-console
      console.error("Order confirmation email failed", emailError);
    }

    return sendSuccess(res, order, 201);
  } catch (error) {
    await session.abortTransaction();
    return next(error);
  } finally {
    await session.endSession();
  }
};

export const createStripeIntent = async (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) return next(new ApiError(401, "UNAUTHORIZED", "Missing token"));

  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const { items, shippingAddress, couponCode } = req.body;
    const totals = await validateCheckout(items, couponCode);
    const orderItems = await buildOrderItems(items, session);

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
      "pending",
      session
    );

    await session.commitTransaction();
    return sendSuccess(res, { clientSecret: intent.client_secret, orderId: order.id });
  } catch (error) {
    await session.abortTransaction();
    return next(error);
  } finally {
    await session.endSession();
  }
};

export const listMyOrders = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return next(new ApiError(401, "UNAUTHORIZED", "Missing token"));
    const orders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 }).lean();
    return sendSuccess(res, orders);
  } catch (error) {
    return next(error);
  }
};

export const getMyOrder = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return next(new ApiError(401, "UNAUTHORIZED", "Missing token"));
    const order = await Order.findOne({ userId: req.user.id, _id: req.params.orderId }).lean();
    if (!order) throw new ApiError(404, "NOT_FOUND", "Order not found");
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
      } catch (emailError) {
        // eslint-disable-next-line no-console
        console.error("Stripe confirmation email failed", emailError);
      }
    }
    return sendSuccess(res, { status: "received" });
  } catch (error) {
    return next(error);
  }
};
