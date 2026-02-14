import mongoose, { Schema } from "mongoose";

const CollectionSchema = new Schema(
  {
    slug: { type: String, unique: true, required: true },
    title: { type: String, required: true },
    description: String,
    type: { type: String, enum: ["manual", "smart"], default: "manual" },
    rules: Schema.Types.Mixed,
    productIds: [{ type: Schema.Types.ObjectId, ref: "Product" }],
    image: String
  },
  { timestamps: true }
);

export const Collection = mongoose.model("Collection", CollectionSchema);
