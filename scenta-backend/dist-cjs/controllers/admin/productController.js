"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAdminProduct = exports.updateAdminProduct = exports.createAdminProduct = exports.getAdminProduct = exports.listAdminProducts = void 0;
const Product_1 = require("../../models/Product");
const ApiError_1 = require("../../utils/ApiError");
const response_1 = require("../../utils/response");
const listAdminProducts = async (_req, res, next) => {
    try {
        const products = await Product_1.Product.find();
        return (0, response_1.sendSuccess)(res, products);
    }
    catch (error) {
        return next(error);
    }
};
exports.listAdminProducts = listAdminProducts;
const getAdminProduct = async (req, res, next) => {
    try {
        const product = await Product_1.Product.findById(req.params.id);
        if (!product) {
            throw new ApiError_1.ApiError(404, "NOT_FOUND", "Product not found");
        }
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
        const product = await Product_1.Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        return (0, response_1.sendSuccess)(res, product);
    }
    catch (error) {
        return next(error);
    }
};
exports.updateAdminProduct = updateAdminProduct;
const deleteAdminProduct = async (req, res, next) => {
    try {
        await Product_1.Product.findByIdAndDelete(req.params.id);
        return (0, response_1.sendSuccess)(res, { status: "deleted" }, 204);
    }
    catch (error) {
        return next(error);
    }
};
exports.deleteAdminProduct = deleteAdminProduct;
