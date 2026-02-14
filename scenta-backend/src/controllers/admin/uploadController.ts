import { NextFunction, Request, Response } from "express";
import path from "path";
import { ApiError } from "../../utils/ApiError";
import { sendSuccess } from "../../utils/response";

type UploadRequest = Request & { file?: { filename?: string } };

export const uploadAdminImage = (req: UploadRequest, res: Response, next: NextFunction) => {
  const file = req.file;
  if (!file?.filename) {
    return next(new ApiError(400, "BAD_REQUEST", "No file uploaded"));
  }
  const url = `/uploads/${path.basename(file.filename)}`;
  return sendSuccess(res, { url });
};
