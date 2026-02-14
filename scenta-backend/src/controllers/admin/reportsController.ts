import { Request, Response, NextFunction } from "express";
import { sendSuccess } from "../../utils/response";

export const salesReport = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    return sendSuccess(res, { total: 0, currency: "EGP" });
  } catch (error) {
    return next(error);
  }
};

export const topProductsReport = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    return sendSuccess(res, { items: [] });
  } catch (error) {
    return next(error);
  }
};
