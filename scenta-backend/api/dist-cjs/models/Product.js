"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const VariantSchema = new mongoose_1.Schema({
    key: { type: String, required: true },
    sizeMl: Number,
    price: Number,
    compareAtPrice: Number,
    sku: String,
    stock: Number,
    isActive: { type: Boolean, default: true }
});
const ImageSchema = new mongoose_1.Schema({
    url: String,
    alt: String,
    sortOrder: Number
});
const ProductSchema = new mongoose_1.Schema({
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
}, { timestamps: true });
ProductSchema.index({ "flags.isNew": 1 });
ProductSchema.index({ "flags.isBestSeller": 1 });
ProductSchema.index({ "flags.isFeatured": 1 });
ProductSchema.index({ gender: 1 });
ProductSchema.index({ "variants.price": 1 });
ProductSchema.index({ "variants.stock": 1 });
ProductSchema.index({ "notes.top": 1 });
ProductSchema.index({ "notes.middle": 1 });
ProductSchema.index({ "notes.base": 1 });
exports.Product = mongoose_1.default.model("Product", ProductSchema);
