import { Request, Response, NextFunction } from "express";
import { Review } from "../models/Review";
import { User } from "../models/User";
import { sendSuccess } from "../utils/response";
import { ApiError } from "../utils/ApiError";
import { AuthRequest } from "../middleware/auth";

export const listReviews = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const reviews = await Review.find({ productId: req.params.productId, status: "published" })
      .sort({ createdAt: -1 })
      .lean();
    return sendSuccess(res, reviews);
  } catch (error) {
    return next(error);
  }
};

export const createReview = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const existing = await Review.findOne({
      productId: req.params.productId,
      userId: req.user?.id
    });
    if (existing) {
      return next(new ApiError(409, "DUPLICATE_REVIEW", "You have already reviewed this product"));
    }

    // Prefer name from JWT (fast, no DB round-trip).
    // Fall back to a DB lookup for sessions issued before this change.
    const userName =
      req.user!.name ||
      ((await User.findById(req.user!.id).select("name").lean()) as { name: string } | null)?.name ||
      "Anonymous";

    const review = await Review.create({
      productId: req.params.productId,
      userId: req.user?.id,
      userName,
      rating: req.body.rating,
      title: req.body.title,
      body: req.body.body,
      status: "published"
    });
    return sendSuccess(res, review, 201);
  } catch (error) {
    return next(error);
  }
};
