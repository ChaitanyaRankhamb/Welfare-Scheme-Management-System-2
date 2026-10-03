import { Response } from "express";
import { AuthRequest } from "../../../middlewares/auth.middleware";
import {
  errorResponse,
  successResponse,
} from "../../../reuse-components/response";
import { AppError } from "../../../reuse-components/AppError";
import { markAllNotificationsAsReadService } from "../services/mark-all-notifications-as-read.service";

export const markAllNotificationsAsReadController = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    if (!req.userId) throw new AppError("Unauthorized", 401);

    const result = await markAllNotificationsAsReadService(req.userId);
    
    return successResponse(res, result.data, result.message);
  } catch (error: any) {
    return errorResponse(
      res,
      error.message || "Internal Server Error",
      error.statusCode || 500,
    );
  }
};
