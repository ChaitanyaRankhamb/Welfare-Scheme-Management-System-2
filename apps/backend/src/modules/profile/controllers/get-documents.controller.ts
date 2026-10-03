import { Response } from "express";
import { AuthRequest } from "../../../middlewares/auth.middleware";
import { AppError } from "../../../reuse-components/AppError";
import {
  errorResponse,
  successResponse,
} from "../../../reuse-components/response";
import { getDocumentsService } from "../service/get-documents.service";

export const getDocumentsController = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    if (!req.userId) throw new AppError("Unauthorized", 401);

    const documents = await getDocumentsService(req.userId);
    return successResponse(res, documents, "Documents fetched successfully");
  } catch (error: any) {
    return errorResponse(
      res,
      error.message || "Error fetching documents",
      error.statusCode || 500,
    );
  }
};
