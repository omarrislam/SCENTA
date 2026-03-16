import mongoose, { Schema } from "mongoose";

// Translations are stored as a Map keyed by locale (e.g. "en", "ar").
// This pattern scales to any number of languages without schema changes.
const TranslationSchema = new Schema(
  {
    title: String,
    excerpt: String,
    body: String
  },
  { _id: false }
);

const BlogPostSchema = new Schema(
  {
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
  },
  { timestamps: true }
);

const PageTranslationSchema = new Schema(
  {
    title: String,
    body: String
  },
  { _id: false }
);

const PageSchema = new Schema(
  {
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
  },
  { timestamps: true }
);

BlogPostSchema.index({ status: 1 });
PageSchema.index({ status: 1 });

export const BlogPost = mongoose.model("BlogPost", BlogPostSchema);
export const Page = mongoose.model("Page", PageSchema);
