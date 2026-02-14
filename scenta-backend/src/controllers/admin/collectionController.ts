import { Request, Response, NextFunction } from "express";
import { Collection } from "../../models/Collection";
import { sendSuccess } from "../../utils/response";

export const createCollection = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const collection = await Collection.create(req.body);
    return sendSuccess(res, collection, 201);
  } catch (error) {
    return next(error);
  }
};

export const listCollections = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const collections = await Collection.find();
    return sendSuccess(res, collections);
  } catch (error) {
    return next(error);
  }
};

export const updateCollection = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const collection = await Collection.findByIdAndUpdate(req.params.id, req.body, { new: true });
    return sendSuccess(res, collection);
  } catch (error) {
    return next(error);
  }
};
