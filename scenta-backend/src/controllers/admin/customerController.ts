import { Request, Response, NextFunction } from "express";
import { User } from "../../models/User";
import { Order } from "../../models/Order";
import { sendSuccess } from "../../utils/response";

export const listCustomers = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.find({ role: { $ne: "admin" } }).select("name email").lean();
    const userIds = users.map((user) => user._id);
    const orderCounts = await Order.aggregate<{ _id: string; orders: number }>([
      { $match: { userId: { $in: userIds } } },
      { $group: { _id: "$userId", orders: { $sum: 1 } } }
    ]);
    const orderCountByUser = new Map(orderCounts.map((entry) => [String(entry._id), entry.orders]));

    return sendSuccess(
      res,
      users.map((user) => ({
        ...user,
        orders: orderCountByUser.get(String(user._id)) ?? 0
      }))
    );
  } catch (error) {
    return next(error);
  }
};
