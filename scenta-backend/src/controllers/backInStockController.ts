import { Request, Response, NextFunction } from "express";
import { BackInStockSubscription } from "../models/BackInStock";
import { sendSuccess } from "../utils/response";
import { AuthRequest } from "../middleware/auth";

export const subscribeBackInStock = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const subscription = await BackInStockSubscription.create({
      userId: req.user?.id,
      productId: req.body.productId,
      variantKey: req.body.variantKey,
      email: req.body.email
    });
    return sendSuccess(res, subscription, 201);
  } catch (error) {
    return next(error);
  }
};

export const listBackInStock = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const items = await BackInStockSubscription.find({ userId: req.user?.id });
    return sendSuccess(res, items);
  } catch (error) {
    return next(error);
  }
};

export const notifyBackInStock = async (_req: Request, res: Response) => sendSuccess(res, { status: "queued" });
