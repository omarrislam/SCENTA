"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePage = exports.createPage = exports.deleteBlogPost = exports.updateBlogPost = exports.createBlogPost = exports.listPages = exports.listBlogPosts = void 0;
const Content_1 = require("../../models/Content");
const response_1 = require("../../utils/response");
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
const listPages = async (_req, res, next) => {
    try {
        const pages = await Content_1.Page.find();
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
        const post = await Content_1.BlogPost.findByIdAndUpdate(req.params.id, req.body, { new: true });
        return (0, response_1.sendSuccess)(res, post);
    }
    catch (error) {
        return next(error);
    }
};
exports.updateBlogPost = updateBlogPost;
const deleteBlogPost = async (req, res, next) => {
    try {
        await Content_1.BlogPost.findByIdAndDelete(req.params.id);
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
        const page = await Content_1.Page.findByIdAndUpdate(req.params.id, req.body, { new: true });
        return (0, response_1.sendSuccess)(res, page);
    }
    catch (error) {
        return next(error);
    }
};
exports.updatePage = updatePage;
