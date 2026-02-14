import { Response, NextFunction } from "express";
import { AuthRequest } from "../middleware/auth";
import { sendSuccess } from "../utils/response";
import { User } from "../models/User";

export const getWishlist = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.user?.id).select("wishlist");
    return sendSuccess(res, user?.wishlist ?? []);
  } catch (error) {
    return next(error);
  }
};

export const toggleWishlist = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { productId, variantKey } = req.body;
    const user = await User.findById(req.user?.id);
    if (!user) {
      return sendSuccess(res, []);
    }
    const existing = user.wishlist.find((item) => item.productId?.toString() === productId && item.variantKey === variantKey);
    if (existing) {
      user.wishlist.pull(existing._id);
    } else {
      user.wishlist.push({ productId, variantKey });
    }
    await user.save();
    return sendSuccess(res, user.wishlist);
  } catch (error) {
    return next(error);
  }
};
