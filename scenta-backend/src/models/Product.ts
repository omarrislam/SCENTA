import mongoose, { Schema } from "mongoose";

const VariantSchema = new Schema({
  key: { type: String, required: true },
  sizeMl: Number,
  price: Number,
  compareAtPrice: Number,
  sku: String,
  stock: Number,
  isActive: { type: Boolean, default: true }
});

const ImageSchema = new Schema({
  url: String,
  alt: String,
  sortOrder: Number
});

const ProductSchema = new Schema(
  {
    slug: { type: String, unique: true, required: true },
    title: { type: String, required: true },
    description: String,
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
    sillage: String,
    flags: {
      isNew: Boolean,
      isBestSeller: Boolean,
      isFeatured: Boolean
    },
    images: [ImageSchema],
    variants: [VariantSchema],
    seo: {
      metaTitle: String,
      metaDescription: String
    },
    status: { type: String, enum: ["draft", "published"], default: "draft" }
  },
  { timestamps: true }
);

ProductSchema.index({ "flags.isNew": 1 });
ProductSchema.index({ "flags.isBestSeller": 1 });
ProductSchema.index({ "flags.isFeatured": 1 });
ProductSchema.index({ gender: 1 });
ProductSchema.index({ "variants.price": 1 });
ProductSchema.index({ "variants.stock": 1 });
ProductSchema.index({ "notes.top": 1 });
ProductSchema.index({ "notes.middle": 1 });
ProductSchema.index({ "notes.base": 1 });

export const Product = mongoose.model("Product", ProductSchema);
