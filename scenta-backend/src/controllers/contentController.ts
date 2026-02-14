import { Request, Response, NextFunction } from "express";
import { BlogPost, Page } from "../models/Content";
import { ApiError } from "../utils/ApiError";
import { sendSuccess } from "../utils/response";

export const listBlogPosts = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const posts = await BlogPost.find();
    return sendSuccess(res, posts);
  } catch (error) {
    return next(error);
  }
};

export const getBlogPost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const post = await BlogPost.findOne({ slug: req.params.slug });
    if (!post) {
      throw new ApiError(404, "NOT_FOUND", "Blog post not found");
    }
    return sendSuccess(res, post);
  } catch (error) {
    return next(error);
  }
};

export const getPage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = await Page.findOne({ slug: req.params.slug });
    if (!page) {
      throw new ApiError(404, "NOT_FOUND", "Page not found");
    }
    return sendSuccess(res, page);
  } catch (error) {
    return next(error);
  }
};
