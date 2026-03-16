import { Schema } from "mongoose";

// Fragrance-specific product attributes.
// To reuse this template for a different store type, delete this file and
// remove the fragranceAttrs field from the Product model.
export const FragranceAttrsSchema = new Schema(
  {
    gender: { type: String, enum: ["men", "women", "unisex"] },
    concentration: { type: String, default: "extrait" },
    bottleType: { type: String, default: "spray" },
    notes: {
      top: [String],
      middle: [String],
      base: [String]
    },
    season: [String],
    occasion: [String],
    longevity: String,
    sillage: String
  },
  { _id: false }
);
