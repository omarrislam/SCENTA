"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePage = exports.updatePage = exports.createPage = exports.deleteBlogPost = exports.updateBlogPost = exports.createBlogPost = exports.listPages = exports.getBlogPost = exports.listBlogPosts = void 0;
const Content_1 = require("../../models/Content");
const ApiError_1 = require("../../utils/ApiError");
const response_1 = require("../../utils/response");
// Admin returns full documents (all translations) so the editor can show all locales.
const listBlogPosts = async (_req, res, next) => {
    try {
        const posts = await Content_1.BlogPost.find().lean();
        return (0, response_1.sendSuccess)(res, posts);
    }
    catch (error) {
        return next(error);
    }
};
exports.listBlogPosts = listBlogPosts;
const getBlogPost = async (req, res, next) => {
    try {
        const post = await Content_1.BlogPost.findById(req.params.id).lean();
        if (!post)
            throw new ApiError_1.ApiError(404, "NOT_FOUND", "Blog post not found");
        return (0, response_1.sendSuccess)(res, post);
    }
    catch (error) {
        return next(error);
    }
};
exports.getBlogPost = getBlogPost;
const listPages = async (_req, res, next) => {
    try {
        const pages = await Content_1.Page.find().lean();
        return (0, response_1.sendSuccess)(res, pages);
    }
    catch (error) {
        return next(error);
    }
};
exports.listPages = listPages;
const createBlogPost = async (req, res, next) => {
    try {
        const post = await Content_1.BlogPost.create(req.body);
        return (0, response_1.sendSuccess)(res, post, 201);
    }
    catch (error) {
        return next(error);
    }
};
exports.createBlogPost = createBlogPost;
const updateBlogPost = async (req, res, next) => {
    try {
        const post = await Content_1.BlogPost.findByIdAndUpdate(req.params.id, req.body, { new: true }).lean();
        if (!post)
            throw new ApiError_1.ApiError(404, "NOT_FOUND", "Blog post not found");
        return (0, response_1.sendSuccess)(res, post);
    }
    catch (error) {
        return next(error);
    }
};
exports.updateBlogPost = updateBlogPost;
const deleteBlogPost = async (req, res, next) => {
    try {
        const result = await Content_1.BlogPost.findByIdAndDelete(req.params.id);
        if (!result)
            throw new ApiError_1.ApiError(404, "NOT_FOUND", "Blog post not found");
        return (0, response_1.sendSuccess)(res, { status: "deleted" });
    }
    catch (error) {
        return next(error);
    }
};
exports.deleteBlogPost = deleteBlogPost;
const createPage = async (req, res, next) => {
    try {
        const page = await Content_1.Page.create(req.body);
        return (0, response_1.sendSuccess)(res, page, 201);
    }
    catch (error) {
        return next(error);
    }
};
exports.createPage = createPage;
const updatePage = async (req, res, next) => {
    try {
        const page = await Content_1.Page.findByIdAndUpdate(req.params.id, req.body, { new: true }).lean();
        if (!page)
            throw new ApiError_1.ApiError(404, "NOT_FOUND", "Page not found");
        return (0, response_1.sendSuccess)(res, page);
    }
    catch (error) {
        return next(error);
    }
};
exports.updatePage = updatePage;
const deletePage = async (req, res, next) => {
    try {
        const result = await Content_1.Page.findByIdAndDelete(req.params.id);
        if (!result)
            throw new ApiError_1.ApiError(404, "NOT_FOUND", "Page not found");
        return (0, response_1.sendSuccess)(res, { status: "deleted" });
    }
    catch (error) {
        return next(error);
    }
};
exports.deletePage = deletePage;
