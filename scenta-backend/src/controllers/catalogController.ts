import { Request, Response, NextFunction } from "express";
import { listProducts, getProductBySlug } from "../services/catalogService";
import { ApiError } from "../utils/ApiError";
import { sendSuccess } from "../utils/response";
import { Collection } from "../models/Collection";
import { Product } from "../models/Product";

export const listCatalog = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await listProducts(req.query);
    res.setHeader("Cache-Control", "public, max-age=60");
    return sendSuccess(res, data);
  } catch (error) {
    return next(error);
  }
};

export const getProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await getProductBySlug(req.params.slug);
    if (!product) {
      throw new ApiError(404, "NOT_FOUND", "Product not found");
    }
    res.setHeader("Cache-Control", "public, max-age=120");
    return sendSuccess(res, product);
  } catch (error) {
    return next(error);
  }
};

export const getProductsByIds = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const idsParam = req.query.ids;
    const ids =
      typeof idsParam === "string"
        ? idsParam.split(",").map((id) => id.trim()).filter(Boolean)
        : [];
    if (!ids.length) {
      return sendSuccess(res, []);
    }
    const products = await Product.find({ _id: { $in: ids }, status: "published" });
    return sendSuccess(res, products);
  } catch (error) {
    return next(error);
  }
};

export const listCollections = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const collections = await Collection.find();
    res.setHeader("Cache-Control", "public, max-age=120");
    return sendSuccess(res, collections);
  } catch (error) {
    return next(error);
  }
};

export const getCollection = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const collection = await Collection.findOne({ slug: req.params.slug });
    if (!collection) {
      throw new ApiError(404, "NOT_FOUND", "Collection not found");
    }
    return sendSuccess(res, collection);
  } catch (error) {
    return next(error);
  }
};
