import { Response } from "express";
import { AuthRequest } from "../../../middlewares/auth.middleware";
import { AppError } from "../../../reuse-components/AppError";
import {
  errorResponse,
  successResponse,
} from "../../../reuse-components/response";
import { notificationIdSchema } from "../../../validations/notification.validation";
import { markNotificationAsReadService } from "../services/mark-notification-as-read.service";

export const markNotificationAsReadController = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    if (!req.userId) throw new AppError("Unauthorized", 401);

    const validation = notificationIdSchema.safeParse({ params: req.params });
    if (!validation.success)
      throw new AppError(validation.error.errors[0].message, 400);

    const result = await markNotificationAsReadService(
      validation.data.params.id,
      req.userId,
    );
    return successResponse(res, result.data, result.message);
  } catch (error: any) {
    return errorResponse(
      res,
      error.message || "Internal Server Error",
      error.statusCode || 500,
    );
  }
};
