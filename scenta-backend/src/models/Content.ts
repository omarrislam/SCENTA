import mongoose, { Schema } from "mongoose";

const BlogPostSchema = new Schema(
  {
    slug: { type: String, unique: true },
    title: String,
    titleAr: String,
    excerpt: String,
    excerptAr: String,
    body: String,
    bodyAr: String,
    cover: String,
    content: String,
    status: { type: String, default: "draft" },
    seo: {
      metaTitle: String,
      metaDescription: String
    },
    featuredImage: String
  },
  { timestamps: true }
);

const PageSchema = new Schema(
  {
    slug: { type: String, unique: true },
    title: String,
    titleAr: String,
    body: String,
    bodyAr: String,
    content: String,
    status: { type: String, default: "draft" },
    seo: {
      metaTitle: String,
      metaDescription: String
    }
  },
  { timestamps: true }
);

export const BlogPost = mongoose.model("BlogPost", BlogPostSchema);
export const Page = mongoose.model("Page", PageSchema);
