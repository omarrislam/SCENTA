import mongoose, { Schema } from "mongoose";
import { FragranceAttrsSchema } from "../domain/fragrance/fragranceSchema";

const VariantSchema = new Schema({
  key: { type: String, required: true },
  sizeMl: Number,
  price: Number,
  compareAtPrice: Number,
  sku: String,
  stock: { type: Number, default: 0 },
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
    flags: {
      isNew: Boolean,
      isBestSeller: Boolean,
      isFeatured: Boolean
    },
    images: [ImageSchema],
    variants: [VariantSchema],
    fragranceAttrs: { type: FragranceAttrsSchema, default: undefined },
    seo: {
      metaTitle: String,
      metaDescription: String
    },
    status: { type: String, enum: ["draft", "published"], default: "draft" },
    deletedAt: { type: Date, default: null, index: true }
  },
  { timestamps: true }
);

ProductSchema.index({ "flags.isNew": 1 });
ProductSchema.index({ "flags.isBestSeller": 1 });
ProductSchema.index({ "flags.isFeatured": 1 });
ProductSchema.index({ "fragranceAttrs.gender": 1 });
ProductSchema.index({ "variants.price": 1 });
ProductSchema.index({ "variants.stock": 1 });
ProductSchema.index({ "fragranceAttrs.notes.top": 1 });
ProductSchema.index({ "fragranceAttrs.notes.middle": 1 });
ProductSchema.index({ "fragranceAttrs.notes.base": 1 });
// Partial index: only index non-deleted products for catalog queries
ProductSchema.index({ status: 1, deletedAt: 1 });

export const Product = mongoose.model("Product", ProductSchema);
