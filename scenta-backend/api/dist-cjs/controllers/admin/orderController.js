"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOrderStatus = exports.getAdminOrder = exports.listAdminOrders = void 0;
const Order_1 = require("../../models/Order");
const ApiError_1 = require("../../utils/ApiError");
const response_1 = require("../../utils/response");
const listAdminOrders = async (_req, res, next) => {
    try {
        const orders = await Order_1.Order.find().sort({ createdAt: -1 }).lean();
        return (0, response_1.sendSuccess)(res, orders);
    }
    catch (error) {
        return next(error);
    }
};
exports.listAdminOrders = listAdminOrders;
const getAdminOrder = async (req, res, next) => {
    try {
        const order = await Order_1.Order.findById(req.params.id).lean();
        if (!order)
            throw new ApiError_1.ApiError(404, "NOT_FOUND", "Order not found");
        return (0, response_1.sendSuccess)(res, order);
    }
    catch (error) {
        return next(error);
    }
};
exports.getAdminOrder = getAdminOrder;
const updateOrderStatus = async (req, res, next) => {
    try {
        const order = await Order_1.Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true }).lean();
        if (!order)
            throw new ApiError_1.ApiError(404, "NOT_FOUND", "Order not found");
        return (0, response_1.sendSuccess)(res, order);
    }
    catch (error) {
        return next(error);
    }
};
exports.updateOrderStatus = updateOrderStatus;
