import mongoose, { Schema } from "mongoose";

// Smart collection rule: filter products by a field matching a value
const SmartRuleSchema = new Schema(
  {
    field: { type: String, required: true },   // e.g. "fragranceAttrs.gender"
    operator: { type: String, enum: ["eq", "in", "gt", "lt"], required: true },
    value: Schema.Types.Mixed                   // the value to match against
  },
  { _id: false }
);

const CollectionSchema = new Schema(
  {
    slug: { type: String, unique: true, required: true },
    title: { type: String, required: true },
    description: String,
    type: { type: String, enum: ["manual", "smart"], default: "manual" },
    rules: { type: [SmartRuleSchema], default: undefined },
    productIds: [{ type: Schema.Types.ObjectId, ref: "Product" }],
    image: String
  },
  { timestamps: true }
);

export const Collection = mongoose.model("Collection", CollectionSchema);
