"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createReview = exports.listReviews = void 0;
const Review_1 = require("../models/Review");
const response_1 = require("../utils/response");
const listReviews = async (req, res, next) => {
    try {
        const reviews = await Review_1.Review.find({ productId: req.params.productId, status: "published" });
        return (0, response_1.sendSuccess)(res, reviews);
    }
    catch (error) {
        return next(error);
    }
};
exports.listReviews = listReviews;
const createReview = async (req, res, next) => {
    try {
        const review = await Review_1.Review.create({
            productId: req.params.productId,
            userId: req.user?.id,
            rating: req.body.rating,
            title: req.body.title,
            body: req.body.body,
            status: "pending"
        });
        return (0, response_1.sendSuccess)(res, review, 201);
    }
    catch (error) {
        return next(error);
    }
};
exports.createReview = createReview;
