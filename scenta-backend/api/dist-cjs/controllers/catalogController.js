"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCollection = exports.listCollections = exports.getProductsByIds = exports.getProduct = exports.listCatalog = void 0;
const catalogService_1 = require("../services/catalogService");
const ApiError_1 = require("../utils/ApiError");
const response_1 = require("../utils/response");
const Collection_1 = require("../models/Collection");
const Product_1 = require("../models/Product");
const listCatalog = async (req, res, next) => {
    try {
        const data = await (0, catalogService_1.listProducts)(req.query);
        res.setHeader("Cache-Control", "public, max-age=60");
        return (0, response_1.sendSuccess)(res, data);
    }
    catch (error) {
        return next(error);
    }
};
exports.listCatalog = listCatalog;
const getProduct = async (req, res, next) => {
    try {
        const product = await (0, catalogService_1.getProductBySlug)(req.params.slug);
        if (!product) {
            throw new ApiError_1.ApiError(404, "NOT_FOUND", "Product not found");
        }
        res.setHeader("Cache-Control", "public, max-age=120");
        return (0, response_1.sendSuccess)(res, product);
    }
    catch (error) {
        return next(error);
    }
};
exports.getProduct = getProduct;
const getProductsByIds = async (req, res, next) => {
    try {
        const idsParam = req.query.ids;
        const ids = typeof idsParam === "string"
            ? idsParam.split(",").map((id) => id.trim()).filter(Boolean)
            : [];
        if (!ids.length) {
            return (0, response_1.sendSuccess)(res, []);
        }
        const products = await Product_1.Product.find({ _id: { $in: ids }, status: "published" });
        return (0, response_1.sendSuccess)(res, products);
    }
    catch (error) {
        return next(error);
    }
};
exports.getProductsByIds = getProductsByIds;
const listCollections = async (_req, res, next) => {
    try {
        const collections = await Collection_1.Collection.find();
        res.setHeader("Cache-Control", "public, max-age=120");
        return (0, response_1.sendSuccess)(res, collections);
    }
    catch (error) {
        return next(error);
    }
};
exports.listCollections = listCollections;
const getCollection = async (req, res, next) => {
    try {
        const collection = await Collection_1.Collection.findOne({ slug: req.params.slug });
        if (!collection) {
            throw new ApiError_1.ApiError(404, "NOT_FOUND", "Collection not found");
        }
        return (0, response_1.sendSuccess)(res, collection);
    }
    catch (error) {
        return next(error);
    }
};
exports.getCollection = getCollection;
