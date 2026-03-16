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

const AppliedCouponSchema = new Schema(
  {
    code: { type: String, required: true },
    type: { type: String, enum: ["percent", "bxgy"], required: true },
    value: { type: Number, required: true },
    discountTotal: { type: Number, required: true }
  },
  { _id: false }
);

const OrderSchema = new Schema(
  {
    orderNumber: String,
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    status: {
      type: String,
      enum: ["pending", "placed", "paid", "processing", "fulfilled", "completed", "cancelled"],
      default: "pending"
    },
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
    coupon: { type: AppliedCouponSchema, default: undefined }
  },
  { timestamps: true }
);

OrderSchema.index({ userId: 1 });
OrderSchema.index({ status: 1 });
OrderSchema.index({ orderNumber: 1 }, { unique: true, sparse: true });

export const Order = mongoose.model("Order", OrderSchema);
