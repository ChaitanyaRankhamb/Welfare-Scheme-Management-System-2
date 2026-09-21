import { Response } from 'express';
import { AuthRequest } from '../../../middlewares/auth.middleware';
import { uploadDocumentService } from '../service/upload-documents.service';
import { successResponse, errorResponse } from '../../../reuse-components/response';
import { AppError } from '../../../reuse-components/AppError';

/**
 * @description Controller to handle document upload and OCR extraction
 * @param {AuthRequest} req - Authenticated request (contains file and documentType)
 * @param {Response} res - Express response
 */
export const uploadDocumentController = async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req;
    if (!userId) {
      throw new AppError('Unauthorized', 401);
    }

    if (!req.file) {
      throw new AppError('No document file uploaded', 400);
    }

    const { documentType } = req.body;
    if (!documentType) {
      throw new AppError('documentType is required', 400);
    }

    const language = (req.body.language || req.query.language || 'en') as string;

    const result = await uploadDocumentService(userId, req.file, documentType, language);
    return successResponse(res, result.data, result.message);
  } catch (error: any) {
    return errorResponse(res, error.message || 'Error processing document', error.statusCode || 500);
  }
};
