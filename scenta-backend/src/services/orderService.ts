import { nanoid } from "nanoid";
import { Order } from "../models/Order";
import { Product } from "../models/Product";
import { ApiError } from "../utils/ApiError";

interface OrderInput {
  userId: string;
  items: Array<{
    productId: string;
    productTitleSnapshot: string;
    productSlugSnapshot: string;
    variantKey: string;
    sizeMl: number;
    unitPrice: number;
    qty: number;
    imageSnapshot?: string;
  }>;
  shippingAddress: {
    fullName: string;
    phone: string;
    city: string;
    area: string;
    street: string;
    building: string;
    notes?: string;
  };
  payment: {
    method: "cod" | "stripe";
    stripePaymentIntentId?: string;
    stripeStatus?: string;
  };
  totals: {
    subtotal: number;
    discountTotal: number;
    shippingFee: number;
    grandTotal: number;
  };
  coupon?: {
    code: string;
    type: string;
    value: number;
  };
}

export const createOrder = async (input: OrderInput, statusOverride?: string) => {
  return Order.create({
    ...input,
    orderNumber: `SCN-${nanoid(6).toUpperCase()}`,
    status: statusOverride ?? (input.payment.method === "cod" ? "placed" : "pending")
  });
};

export const finalizeStripeOrder = async (paymentIntentId: string) => {
  const order = await Order.findOne({ "payment.stripePaymentIntentId": paymentIntentId });
  if (!order) {
    throw new ApiError(404, "ORDER_NOT_FOUND", "Order not found for payment intent");
  }
  if (order.status === "paid") {
    return order;
  }

  for (const item of order.items) {
    const product = await Product.findById(item.productId);
    if (!product) continue;
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
