import { Response } from "express";
import { AuthRequest } from "../../../middlewares/auth.middleware";
import { AppError } from "../../../reuse-components/AppError";
import {
  errorResponse,
  successResponse,
} from "../../../reuse-components/response";
import { getUnreadNotificationCountService } from "../services/get-unread-count.service";

export const getUnreadNotificationCountController = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    if (!req.userId) throw new AppError("Unauthorized", 401);

    const result = await getUnreadNotificationCountService(req.userId);
    
    return successResponse(res, result.data, result.message);
  } catch (error: any) {
    return errorResponse(
      res,
      error.message || "Internal Server Error",
      error.statusCode || 500,
    );
  }
};
