import mongoose, { Schema } from "mongoose";

const OrderItemSchema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: "Product" },
  productTitleSnapshot: String,
  productSlugSnapshot: String,
  variantKey: String,
  sizeMl: Number,
  unitPrice: Number,
  qty: Number,
  imageSnapshot: String
});

const OrderSchema = new Schema(
  {
    orderNumber: String,
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    status: { type: String, default: "pending" },
    items: [OrderItemSchema],
    shippingAddress: {
      fullName: String,
      phone: String,
      city: String,
      area: String,
      street: String,
      building: String,
      notes: String
    },
    shipping: {
      method: { type: String, default: "standard" },
      fee: Number
    },
    payment: {
      method: { type: String, enum: ["cod", "stripe"] },
      stripePaymentIntentId: String,
      stripeStatus: String
    },
    totals: {
      subtotal: Number,
      discountTotal: Number,
      shippingFee: Number,
      grandTotal: Number
    },
    coupon: Schema.Types.Mixed
  },
  { timestamps: true }
);

export const Order = mongoose.model("Order", OrderSchema);
