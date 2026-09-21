import { Request, Response } from 'express';
import { deleteDocumentService } from '../service/delete-document.service';
import { AppError } from '../../../reuse-components/AppError';
import { AuthRequest } from '../../../middlewares/auth.middleware';

export const deleteDocumentController = async (req: AuthRequest, res: Response) => {
  try {
    const {userId} = req;
    const documentId = req.params.id;

    if (!userId) {
      throw new AppError('Unauthorized', 401);
    }

    if (!documentId) {
      throw new AppError('Document ID is required', 400);
    }

    const result = await deleteDocumentService(userId, documentId);

    res.status(200).json({
      success: true,
      message: result.message
    });
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message
      });
      return;
    }

    console.error('[DeleteDocumentController] Error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while deleting document'
    });
  }
};
