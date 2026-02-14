import mongoose, { Schema } from "mongoose";

const BackInStockSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    productId: { type: Schema.Types.ObjectId, ref: "Product" },
    variantKey: String,
    email: String,
    status: { type: String, enum: ["active", "notified", "cancelled"], default: "active" }
  },
  { timestamps: true }
);

export const BackInStockSubscription = mongoose.model("BackInStock", BackInStockSchema);
