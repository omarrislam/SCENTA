import { Request, Response, NextFunction } from "express";
import { Review } from "../models/Review";
import { sendSuccess } from "../utils/response";
import { AuthRequest } from "../middleware/auth";

export const listReviews = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const reviews = await Review.find({ productId: req.params.productId, status: "published" });
    return sendSuccess(res, reviews);
  } catch (error) {
    return next(error);
  }
};

export const createReview = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const review = await Review.create({
      productId: req.params.productId,
      userId: req.user?.id,
      rating: req.body.rating,
      title: req.body.title,
      body: req.body.body,
      status: "pending"
    });
    return sendSuccess(res, review, 201);
  } catch (error) {
    return next(error);
  }
};
