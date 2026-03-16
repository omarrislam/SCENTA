"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPage = exports.getBlogPost = exports.listBlogPosts = void 0;
const Content_1 = require("../models/Content");
const ApiError_1 = require("../utils/ApiError");
const response_1 = require("../utils/response");
const resolveLocale = (req) => {
    const q = req.query.locale;
    return q === "ar" ? "ar" : "en";
};
const flattenBlogPost = (post, locale) => {
    const translations = post.translations?.get(locale) ??
        post.translations?.get("en") ??
        {};
    const t = translations;
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
const flattenPage = (page, locale) => {
    const translations = page.translations?.get(locale) ??
        page.translations?.get("en") ??
        {};
    const t = translations;
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
const listBlogPosts = async (req, res, next) => {
    try {
        const locale = resolveLocale(req);
        const posts = await Content_1.BlogPost.find({ status: "published" }).lean();
        return (0, response_1.sendSuccess)(res, posts.map((p) => flattenBlogPost(p, locale)));
    }
    catch (error) {
        return next(error);
    }
};
exports.listBlogPosts = listBlogPosts;
const getBlogPost = async (req, res, next) => {
    try {
        const locale = resolveLocale(req);
        const post = await Content_1.BlogPost.findOne({ slug: req.params.slug, status: "published" }).lean();
        if (!post)
            throw new ApiError_1.ApiError(404, "NOT_FOUND", "Blog post not found");
        return (0, response_1.sendSuccess)(res, flattenBlogPost(post, locale));
    }
    catch (error) {
        return next(error);
    }
};
exports.getBlogPost = getBlogPost;
const getPage = async (req, res, next) => {
    try {
        const locale = resolveLocale(req);
        const page = await Content_1.Page.findOne({ slug: req.params.slug, status: "published" }).lean();
        if (!page)
            throw new ApiError_1.ApiError(404, "NOT_FOUND", "Page not found");
        return (0, response_1.sendSuccess)(res, flattenPage(page, locale));
    }
    catch (error) {
        return next(error);
    }
};
exports.getPage = getPage;
