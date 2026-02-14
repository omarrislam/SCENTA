import { Request, Response, NextFunction } from "express";
import { ThemeConfig } from "../../models/ThemeConfig";
import { sendSuccess } from "../../utils/response";

export const getTheme = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const theme = await ThemeConfig.findOne({ locale: req.query.locale ?? "en" });
    return sendSuccess(res, theme);
  } catch (error) {
    return next(error);
  }
};

export const updateTheme = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const theme = await ThemeConfig.findOneAndUpdate(
      { locale: req.body.locale },
      req.body,
      { new: true, upsert: true }
    );
    return sendSuccess(res, theme);
  } catch (error) {
    return next(error);
  }
};
