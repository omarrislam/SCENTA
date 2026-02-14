"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notifyBackInStock = exports.listBackInStock = exports.subscribeBackInStock = void 0;
const BackInStock_1 = require("../models/BackInStock");
const response_1 = require("../utils/response");
const subscribeBackInStock = async (req, res, next) => {
    try {
        const subscription = await BackInStock_1.BackInStockSubscription.create({
            userId: req.user?.id,
            productId: req.body.productId,
            variantKey: req.body.variantKey,
            email: req.body.email
        });
        return (0, response_1.sendSuccess)(res, subscription, 201);
    }
    catch (error) {
        return next(error);
    }
};
exports.subscribeBackInStock = subscribeBackInStock;
const listBackInStock = async (req, res, next) => {
    try {
        const items = await BackInStock_1.BackInStockSubscription.find({ userId: req.user?.id });
        return (0, response_1.sendSuccess)(res, items);
    }
    catch (error) {
        return next(error);
    }
};
exports.listBackInStock = listBackInStock;
const notifyBackInStock = async (_req, res) => (0, response_1.sendSuccess)(res, { status: "queued" });
exports.notifyBackInStock = notifyBackInStock;
