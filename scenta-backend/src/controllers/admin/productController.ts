import { Request, Response, NextFunction } from "express";
import { Product } from "../../models/Product";
import { ApiError } from "../../utils/ApiError";
import { sendSuccess } from "../../utils/response";

export const listAdminProducts = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const products = await Product.find();
    return sendSuccess(res, products);
  } catch (error) {
    return next(error);
  }
};

export const getAdminProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      throw new ApiError(404, "NOT_FOUND", "Product not found");
    }
    return sendSuccess(res, product);
  } catch (error) {
    return next(error);
  }
};

export const createAdminProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await Product.create(req.body);
    return sendSuccess(res, product, 201);
  } catch (error) {
    return next(error);
  }
};

export const updateAdminProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    return sendSuccess(res, product);
  } catch (error) {
    return next(error);
  }
};

export const deleteAdminProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    return sendSuccess(res, { status: "deleted" }, 204);
  } catch (error) {
    return next(error);
  }
};
