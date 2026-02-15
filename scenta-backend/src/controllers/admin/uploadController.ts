import { NextFunction, Request, Response } from "express";
import path from "path";
import { ApiError } from "../../utils/ApiError";
import { sendSuccess } from "../../utils/response";

type UploadRequest = Request & { file?: { filename?: string } };

export const uploadAdminImage = (req: UploadRequest, res: Response, next: NextFunction) => {
  const file = req.file;
  if (!file) {
    return next(new ApiError(400, "BAD_REQUEST", "No file uploaded"));
  }

  const memoryFile = file as {
    buffer?: Buffer;
    mimetype?: string;
    filename?: string;
  };
  if (memoryFile.buffer?.length && memoryFile.mimetype?.startsWith("image/")) {
    const encoded = memoryFile.buffer.toString("base64");
    const url = `data:${memoryFile.mimetype};base64,${encoded}`;
    return sendSuccess(res, { url });
  }

  if (!memoryFile.filename) {
    return next(new ApiError(400, "BAD_REQUEST", "Upload failed"));
  }

  const url = `/uploads/${path.basename(memoryFile.filename)}`;
  return sendSuccess(res, { url });
};
