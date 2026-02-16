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

const roundMoney = (value: number) => Math.round(value * 100) / 100;

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
    const unitPrice = Number(variant.price ?? 0);
    if (!Number.isFinite(unitPrice) || unitPrice < 0) {
      throw new ApiError(400, "INVALID_PRODUCT_PRICE", "Product price is invalid", {
        productId: item.productId,
        variantKey: item.variantKey
      });
    }
    subtotal += unitPrice * item.qty;
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
    const couponValue = Number(match.value ?? 0);
    if (!Number.isFinite(couponValue) || couponValue < 0) {
      throw new ApiError(400, "INVALID_COUPON", "Coupon configuration is invalid");
    }
    const couponType = String(match.type ?? "percent").toLowerCase();
    if (couponType === "percent") {
      discountTotal = (subtotal * couponValue) / 100;
    } else if (couponType === "flat" || couponType === "fixed") {
      discountTotal = couponValue;
    } else {
      discountTotal = 0;
    }
    discountTotal = Math.min(roundMoney(discountTotal), roundMoney(subtotal));
    coupon = {
      code: match.code ?? normalized,
      type: couponType || "percent",
      value: couponValue
    };
  }

  subtotal = roundMoney(subtotal);
  const shippingFee = 60;
  const grandTotal = roundMoney(Math.max(0, subtotal - discountTotal) + shippingFee);

  return { subtotal, shippingFee, discountTotal, grandTotal, coupon };
};
