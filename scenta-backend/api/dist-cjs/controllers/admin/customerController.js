"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listCustomers = void 0;
const User_1 = require("../../models/User");
const Order_1 = require("../../models/Order");
const response_1 = require("../../utils/response");
const listCustomers = async (_req, res, next) => {
    try {
        const users = await User_1.User.find({ role: { $ne: "admin" } }).select("name email").lean();
        const userIds = users.map((user) => user._id);
        const orderCounts = await Order_1.Order.aggregate([
            { $match: { userId: { $in: userIds } } },
            { $group: { _id: "$userId", orders: { $sum: 1 } } }
        ]);
        const orderCountByUser = new Map(orderCounts.map((entry) => [String(entry._id), entry.orders]));
        return (0, response_1.sendSuccess)(res, users.map((user) => ({
            ...user,
            orders: orderCountByUser.get(String(user._id)) ?? 0
        })));
    }
    catch (error) {
        return next(error);
    }
};
exports.listCustomers = listCustomers;
