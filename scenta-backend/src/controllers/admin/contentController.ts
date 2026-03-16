import { Request, Response, NextFunction } from "express";
import { BlogPost, Page } from "../../models/Content";
import { ApiError } from "../../utils/ApiError";
import { sendSuccess } from "../../utils/response";

// Admin returns full documents (all translations) so the editor can show all locales.

export const listBlogPosts = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const posts = await BlogPost.find().lean();
    return sendSuccess(res, posts);
  } catch (error) {
    return next(error);
  }
};

export const getBlogPost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const post = await BlogPost.findById(req.params.id).lean();
    if (!post) throw new ApiError(404, "NOT_FOUND", "Blog post not found");
    return sendSuccess(res, post);
  } catch (error) {
    return next(error);
  }
};

export const listPages = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const pages = await Page.find().lean();
    return sendSuccess(res, pages);
  } catch (error) {
    return next(error);
  }
};

export const createBlogPost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const post = await BlogPost.create(req.body);
    return sendSuccess(res, post, 201);
  } catch (error) {
    return next(error);
  }
};

export const updateBlogPost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const post = await BlogPost.findByIdAndUpdate(req.params.id, req.body, { new: true }).lean();
    if (!post) throw new ApiError(404, "NOT_FOUND", "Blog post not found");
    return sendSuccess(res, post);
  } catch (error) {
    return next(error);
  }
};

export const deleteBlogPost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await BlogPost.findByIdAndDelete(req.params.id);
    if (!result) throw new ApiError(404, "NOT_FOUND", "Blog post not found");
    return sendSuccess(res, { status: "deleted" });
  } catch (error) {
    return next(error);
  }
};

export const createPage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = await Page.create(req.body);
    return sendSuccess(res, page, 201);
  } catch (error) {
    return next(error);
  }
};

export const updatePage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = await Page.findByIdAndUpdate(req.params.id, req.body, { new: true }).lean();
    if (!page) throw new ApiError(404, "NOT_FOUND", "Page not found");
    return sendSuccess(res, page);
  } catch (error) {
    return next(error);
  }
};

export const deletePage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await Page.findByIdAndDelete(req.params.id);
    if (!result) throw new ApiError(404, "NOT_FOUND", "Page not found");
    return sendSuccess(res, { status: "deleted" });
  } catch (error) {
    return next(error);
  }
};
