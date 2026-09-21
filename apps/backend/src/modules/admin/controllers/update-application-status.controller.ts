import { Response } from 'express';
import { AuthRequest } from '../../../middlewares/auth.middleware';
import { updateApplicationStatusService } from '../service/update-application-status.service';
import { successResponse, errorResponse } from '../../../reuse-components/response';
import { AppError } from '../../../reuse-components/AppError';

export const updateApplicationStatusController = async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req;
    if (!userId) throw new AppError('Unauthorized', 401);

    const { id } = req.params;
    const { status } = req.body;

    const result = await updateApplicationStatusService(userId, id, status);
    return successResponse(res, result.data, result.message);
  } catch (error: any) {
    return errorResponse(res, error.message || 'Internal Server Error', error.statusCode || 500);
  }
};
