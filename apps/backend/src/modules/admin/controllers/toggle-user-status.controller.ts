import { Response } from 'express';
import { AuthRequest } from '../../../middlewares/auth.middleware';
import { toggleUserStatusService } from '../service/toggle-user-status.service';
import { successResponse, errorResponse } from '../../../reuse-components/response';
import { AppError } from '../../../reuse-components/AppError';

/**
 * @description Controller for admin to toggle user active status
 */
export const toggleUserStatusController = async (req: AuthRequest, res: Response) => {
  try {
    const { userId: adminId } = req;
    const { id: targetUserId } = req.params;

    if (!adminId) throw new AppError('Unauthorized', 401);
    if (!targetUserId) throw new AppError('User ID is required', 400);

    const result = await toggleUserStatusService(adminId, targetUserId);
    return successResponse(res, result.data, result.message);
  } catch (error: any) {
    return errorResponse(res, error.message || 'Internal Server Error', error.statusCode || 500);
  }
};
