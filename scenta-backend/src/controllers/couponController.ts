import { Request, Response, NextFunction } from "express";
import { Coupon } from "../models/Coupon";
import { sendSuccess } from "../utils/response";

export const listActiveCoupons = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const now = new Date();
    const coupons = await Coupon.find({
      status: "active",
      $and: [
        {
          $or: [{ startsAt: { $exists: false } }, { startsAt: null }, { startsAt: { $lte: now } }]
        },
        {
          $or: [{ endsAt: { $exists: false } }, { endsAt: null }, { endsAt: { $gte: now } }]
        }
      ]
    });
    return sendSuccess(res, coupons);
  } catch (error) {
    return next(error);
  }
};
