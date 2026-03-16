import { Request, Response, NextFunction } from "express";
import { Product } from "../../models/Product";
import { ApiError } from "../../utils/ApiError";
import { sendSuccess } from "../../utils/response";

export const listAdminProducts = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const products = await Product.find({ deletedAt: null }).lean();
    return sendSuccess(res, products);
  } catch (error) {
    return next(error);
  }
};

export const getAdminProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, deletedAt: null }).lean();
    if (!product) throw new ApiError(404, "NOT_FOUND", "Product not found");
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
    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, deletedAt: null },
      req.body,
      { new: true }
    ).lean();
    if (!product) throw new ApiError(404, "NOT_FOUND", "Product not found");
    return sendSuccess(res, product);
  } catch (error) {
    return next(error);
  }
};

export const deleteAdminProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await Product.findOneAndUpdate(
      { _id: req.params.id, deletedAt: null },
      { deletedAt: new Date() },
      { new: true }
    );
    if (!result) throw new ApiError(404, "NOT_FOUND", "Product not found");
    return sendSuccess(res, { status: "deleted" });
  } catch (error) {
    return next(error);
  }
};
