import { Request, Response, NextFunction } from "express";
import { Coupon } from "../../models/Coupon";
import { sendSuccess } from "../../utils/response";

export const listCoupons = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const coupons = await Coupon.find();
    return sendSuccess(res, coupons);
  } catch (error) {
    return next(error);
  }
};

export const createCoupon = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const coupon = await Coupon.create(req.body);
    return sendSuccess(res, coupon, 201);
  } catch (error) {
    return next(error);
  }
};

export const updateCoupon = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true });
    return sendSuccess(res, coupon);
  } catch (error) {
    return next(error);
  }
};

export const deleteCoupon = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await Coupon.findByIdAndDelete(req.params.id);
    return sendSuccess(res, { status: "deleted" });
  } catch (error) {
    return next(error);
  }
};
