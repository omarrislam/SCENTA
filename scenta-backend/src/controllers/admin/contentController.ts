import { Request, Response, NextFunction } from "express";
import { BlogPost, Page } from "../../models/Content";
import { sendSuccess } from "../../utils/response";

export const listBlogPosts = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const posts = await BlogPost.find();
    return sendSuccess(res, posts);
  } catch (error) {
    return next(error);
  }
};

export const listPages = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const pages = await Page.find();
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
    const post = await BlogPost.findByIdAndUpdate(req.params.id, req.body, { new: true });
    return sendSuccess(res, post);
  } catch (error) {
    return next(error);
  }
};

export const deleteBlogPost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await BlogPost.findByIdAndDelete(req.params.id);
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
    const page = await Page.findByIdAndUpdate(req.params.id, req.body, { new: true });
    return sendSuccess(res, page);
  } catch (error) {
    return next(error);
  }
};
