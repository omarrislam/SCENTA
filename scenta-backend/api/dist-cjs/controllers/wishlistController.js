"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleWishlist = exports.getWishlist = void 0;
const response_1 = require("../utils/response");
const User_1 = require("../models/User");
const getWishlist = async (req, res, next) => {
    try {
        const user = await User_1.User.findById(req.user?.id).select("wishlist");
        return (0, response_1.sendSuccess)(res, user?.wishlist ?? []);
    }
    catch (error) {
        return next(error);
    }
};
exports.getWishlist = getWishlist;
const toggleWishlist = async (req, res, next) => {
    try {
        const { productId, variantKey } = req.body;
        const user = await User_1.User.findById(req.user?.id);
        if (!user) {
            return (0, response_1.sendSuccess)(res, []);
        }
        const existing = user.wishlist.find((item) => item.productId?.toString() === productId && item.variantKey === variantKey);
        if (existing) {
            user.wishlist.pull(existing._id);
        }
        else {
            user.wishlist.push({ productId, variantKey });
        }
        await user.save();
        return (0, response_1.sendSuccess)(res, user.wishlist);
    }
    catch (error) {
        return next(error);
    }
};
exports.toggleWishlist = toggleWishlist;
