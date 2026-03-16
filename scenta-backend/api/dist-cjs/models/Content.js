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
exports.Page = exports.BlogPost = void 0;
const mongoose_1 = __importStar(require("mongoose"));
// Translations are stored as a Map keyed by locale (e.g. "en", "ar").
// This pattern scales to any number of languages without schema changes.
const TranslationSchema = new mongoose_1.Schema({
    title: String,
    excerpt: String,
    body: String
}, { _id: false });
const BlogPostSchema = new mongoose_1.Schema({
    slug: { type: String, unique: true },
    translations: {
        type: Map,
        of: TranslationSchema,
        default: {}
    },
    cover: String,
    status: { type: String, enum: ["draft", "published"], default: "draft" },
    seo: {
        metaTitle: String,
        metaDescription: String
    },
    featuredImage: String
}, { timestamps: true });
const PageTranslationSchema = new mongoose_1.Schema({
    title: String,
    body: String
}, { _id: false });
const PageSchema = new mongoose_1.Schema({
    slug: { type: String, unique: true },
    translations: {
        type: Map,
        of: PageTranslationSchema,
        default: {}
    },
    status: { type: String, enum: ["draft", "published"], default: "draft" },
    seo: {
        metaTitle: String,
        metaDescription: String
    }
}, { timestamps: true });
BlogPostSchema.index({ status: 1 });
PageSchema.index({ status: 1 });
exports.BlogPost = mongoose_1.default.model("BlogPost", BlogPostSchema);
exports.Page = mongoose_1.default.model("Page", PageSchema);
