"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAdminProduct = exports.updateAdminProduct = exports.createAdminProduct = exports.getAdminProduct = exports.listAdminProducts = void 0;
const Product_1 = require("../../models/Product");
const ApiError_1 = require("../../utils/ApiError");
const response_1 = require("../../utils/response");
const listAdminProducts = async (_req, res, next) => {
    try {
        const products = await Product_1.Product.find({ deletedAt: null }).lean();
        return (0, response_1.sendSuccess)(res, products);
    }
    catch (error) {
        return next(error);
    }
};
exports.listAdminProducts = listAdminProducts;
const getAdminProduct = async (req, res, next) => {
    try {
        const product = await Product_1.Product.findOne({ _id: req.params.id, deletedAt: null }).lean();
        if (!product)
            throw new ApiError_1.ApiError(404, "NOT_FOUND", "Product not found");
        return (0, response_1.sendSuccess)(res, product);
    }
    catch (error) {
        return next(error);
    }
};
exports.getAdminProduct = getAdminProduct;
const createAdminProduct = async (req, res, next) => {
    try {
        const product = await Product_1.Product.create(req.body);
        return (0, response_1.sendSuccess)(res, product, 201);
    }
    catch (error) {
        return next(error);
    }
};
exports.createAdminProduct = createAdminProduct;
const updateAdminProduct = async (req, res, next) => {
    try {
        const product = await Product_1.Product.findOneAndUpdate({ _id: req.params.id, deletedAt: null }, req.body, { new: true }).lean();
        if (!product)
            throw new ApiError_1.ApiError(404, "NOT_FOUND", "Product not found");
        return (0, response_1.sendSuccess)(res, product);
    }
    catch (error) {
        return next(error);
    }
};
exports.updateAdminProduct = updateAdminProduct;
const deleteAdminProduct = async (req, res, next) => {
    try {
        const result = await Product_1.Product.findOneAndUpdate({ _id: req.params.id, deletedAt: null }, { deletedAt: new Date() }, { new: true });
        if (!result)
            throw new ApiError_1.ApiError(404, "NOT_FOUND", "Product not found");
        return (0, response_1.sendSuccess)(res, { status: "deleted" });
    }
    catch (error) {
        return next(error);
    }
};
exports.deleteAdminProduct = deleteAdminProduct;
