import mongoose, { Schema } from "mongoose";

const ReviewSchema = new Schema(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product" },
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    rating: Number,
    title: String,
    body: String,
    status: { type: String, enum: ["published", "hidden", "pending"], default: "pending" },
    isVerifiedPurchase: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export const Review = mongoose.model("Review", ReviewSchema);
