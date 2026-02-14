import mongoose, { Schema } from "mongoose";

const WishlistSchema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: "Product" },
  variantKey: { type: String }
});

const UserSchema = new Schema(
  {
    email: { type: String, unique: true, required: true },
    passwordHash: { type: String, required: true },
    name: { type: String, required: true },
    role: { type: String, enum: ["customer", "admin"], default: "customer" },
    wishlist: [WishlistSchema],
    resetPasswordToken: String,
    resetPasswordExpires: Date
  },
  { timestamps: true }
);

export const User = mongoose.model("User", UserSchema);
