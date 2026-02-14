import mongoose from "mongoose";
import { Coupon } from "../models/Coupon";
import { Order } from "../models/Order";
import { Product } from "../models/Product";
import { ApiError } from "../utils/ApiError";

interface CheckoutItem {
  productId: string;
  productSlug?: string;
  variantKey: string;
  qty: number;
}

export const validateCheckout = async (items: CheckoutItem[], couponCode?: string) => {
  if (!items.length) {
    throw new ApiError(400, "EMPTY_CART", "Cart is empty");
  }

  let subtotal = 0;
  let discountTotal = 0;
  let coupon: { code: string; type: string; value: number } | undefined;

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
      throw new ApiError(404, "VARIANT_NOT_FOUND", "Variant not found", item.variantKey);
    }
    if ((variant.stock ?? 0) < item.qty) {
      throw new ApiError(409, "OUT_OF_STOCK", "Insufficient stock", {
        productId: item.productId,
        variantKey: item.variantKey
      });
    }
    subtotal += (variant.price ?? 0) * item.qty;
  }

  if (couponCode) {
    const normalized = couponCode.trim().toUpperCase();
    const now = new Date();
    const match = await Coupon.findOne({
      code: normalized,
      status: "active",
      $and: [
        { $or: [{ startsAt: { $exists: false } }, { startsAt: null }, { startsAt: { $lte: now } }] },
        { $or: [{ endsAt: { $exists: false } }, { endsAt: null }, { endsAt: { $gte: now } }] }
      ]
    });
    if (!match) {
      throw new ApiError(400, "INVALID_COUPON", "Coupon is invalid or expired");
    }
    if (match.usageLimit && match.usageLimit > 0) {
      const used = await Order.countDocuments({ "coupon.code": match.code });
      if (used >= match.usageLimit) {
        throw new ApiError(400, "COUPON_LIMIT", "Coupon usage limit reached");
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
