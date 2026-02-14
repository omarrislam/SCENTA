import { Request, Response, NextFunction } from "express";
import { Product } from "../../models/Product";
import { sendSuccess } from "../../utils/response";

export const adjustInventory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { productId, variantKey, stock } = req.body;
    const product = await Product.findById(productId);
    const variant = product?.variants.find((item) => item.key === variantKey);
    if (variant && typeof stock === "number") {
      variant.stock = stock;
      await product?.save();
    }
    return sendSuccess(res, product);
  } catch (error) {
    return next(error);
  }
};
