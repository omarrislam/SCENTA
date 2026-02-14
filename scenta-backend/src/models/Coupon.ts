import mongoose, { Schema } from "mongoose";

const CouponSchema = new Schema(
  {
    code: { type: String, unique: true },
    type: { type: String, enum: ["percent", "bxgy"] },
    value: Number,
    status: { type: String, enum: ["active", "expired", "draft"], default: "draft" },
    usageLimit: Number,
    startsAt: Date,
    endsAt: Date
  },
  { timestamps: true }
);

export const Coupon = mongoose.model("Coupon", CouponSchema);
