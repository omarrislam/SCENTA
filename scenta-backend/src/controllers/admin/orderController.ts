import { Request, Response, NextFunction } from "express";
import { Order } from "../../models/Order";
import { ApiError } from "../../utils/ApiError";
import { sendSuccess } from "../../utils/response";

export const listAdminOrders = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const orders = await Order.find();
    return sendSuccess(res, orders);
  } catch (error) {
    return next(error);
  }
};

export const getAdminOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      throw new ApiError(404, "NOT_FOUND", "Order not found");
    }
    return sendSuccess(res, order);
  } catch (error) {
    return next(error);
  }
};

export const updateOrderStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    return sendSuccess(res, order);
  } catch (error) {
    return next(error);
  }
};
