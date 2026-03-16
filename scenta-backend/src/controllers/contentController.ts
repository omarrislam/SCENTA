import { Request, Response, NextFunction } from "express";
import { BlogPost, Page } from "../models/Content";
import { ApiError } from "../utils/ApiError";
import { sendSuccess } from "../utils/response";

type Locale = "en" | "ar";

const resolveLocale = (req: Request): Locale => {
  const q = req.query.locale;
  return q === "ar" ? "ar" : "en";
};

const flattenBlogPost = (post: Record<string, unknown>, locale: Locale) => {
  const translations = (post.translations as Map<string, unknown> | undefined)?.get(locale) ??
    (post.translations as Map<string, unknown> | undefined)?.get("en") ??
    {};
  const t = translations as { title?: string; excerpt?: string; body?: string };
  return {
    id: post._id,
    slug: post.slug,
    title: t.title ?? "",
    excerpt: t.excerpt ?? "",
    body: t.body ?? "",
    cover: post.cover,
    featuredImage: post.featuredImage,
    status: post.status,
    seo: post.seo,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt
  };
};

const flattenPage = (page: Record<string, unknown>, locale: Locale) => {
  const translations = (page.translations as Map<string, unknown> | undefined)?.get(locale) ??
    (page.translations as Map<string, unknown> | undefined)?.get("en") ??
    {};
  const t = translations as { title?: string; body?: string };
  return {
    id: page._id,
    slug: page.slug,
    title: t.title ?? "",
    body: t.body ?? "",
    status: page.status,
    seo: page.seo,
    createdAt: page.createdAt,
    updatedAt: page.updatedAt
  };
};

export const listBlogPosts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const locale = resolveLocale(req);
    const posts = await BlogPost.find({ status: "published" }).lean();
    return sendSuccess(res, posts.map((p) => flattenBlogPost(p as unknown as Record<string, unknown>, locale)));
  } catch (error) {
    return next(error);
  }
};

export const getBlogPost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const locale = resolveLocale(req);
    const post = await BlogPost.findOne({ slug: req.params.slug, status: "published" }).lean();
    if (!post) throw new ApiError(404, "NOT_FOUND", "Blog post not found");
    return sendSuccess(res, flattenBlogPost(post as unknown as Record<string, unknown>, locale));
  } catch (error) {
    return next(error);
  }
};

export const getPage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const locale = resolveLocale(req);
    const page = await Page.findOne({ slug: req.params.slug, status: "published" }).lean();
    if (!page) throw new ApiError(404, "NOT_FOUND", "Page not found");
    return sendSuccess(res, flattenPage(page as unknown as Record<string, unknown>, locale));
  } catch (error) {
    return next(error);
  }
};
