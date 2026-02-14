"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPage = exports.getBlogPost = exports.listBlogPosts = void 0;
const Content_1 = require("../models/Content");
const ApiError_1 = require("../utils/ApiError");
const response_1 = require("../utils/response");
const listBlogPosts = async (_req, res, next) => {
    try {
        const posts = await Content_1.BlogPost.find();
        return (0, response_1.sendSuccess)(res, posts);
    }
    catch (error) {
        return next(error);
    }
};
exports.listBlogPosts = listBlogPosts;
const getBlogPost = async (req, res, next) => {
    try {
        const post = await Content_1.BlogPost.findOne({ slug: req.params.slug });
        if (!post) {
            throw new ApiError_1.ApiError(404, "NOT_FOUND", "Blog post not found");
        }
        return (0, response_1.sendSuccess)(res, post);
    }
    catch (error) {
        return next(error);
    }
};
exports.getBlogPost = getBlogPost;
const getPage = async (req, res, next) => {
    try {
        const page = await Content_1.Page.findOne({ slug: req.params.slug });
        if (!page) {
            throw new ApiError_1.ApiError(404, "NOT_FOUND", "Page not found");
        }
        return (0, response_1.sendSuccess)(res, page);
    }
    catch (error) {
        return next(error);
    }
};
exports.getPage = getPage;
