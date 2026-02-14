"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adjustInventory = void 0;
const Product_1 = require("../../models/Product");
const response_1 = require("../../utils/response");
const adjustInventory = async (req, res, next) => {
    try {
        const { productId, variantKey, stock } = req.body;
        const product = await Product_1.Product.findById(productId);
        const variant = product?.variants.find((item) => item.key === variantKey);
        if (variant && typeof stock === "number") {
            variant.stock = stock;
            await product?.save();
        }
        return (0, response_1.sendSuccess)(res, product);
    }
    catch (error) {
        return next(error);
    }
};
exports.adjustInventory = adjustInventory;
