import { Response } from 'express';
import { AuthRequest } from '../../../middlewares/auth.middleware';
import { ProfileModel } from '../../../database/mongo/models/profile.model';
import { successResponse, errorResponse } from '../../../reuse-components/response';
import { AppError } from '../../../reuse-components/AppError';

/**
 * @description Controller for admin to fetch detailed profile of a specific user
 */
export const getUserProfileController = async (req: AuthRequest, res: Response) => {
  try {
    const { userId: adminId } = req;
    const { id: targetUserId } = req.params;

    if (!adminId) throw new AppError('Unauthorized', 401);
    if (!targetUserId) throw new AppError('User ID is required', 400);

    const profile = await ProfileModel.findOne({ userId: targetUserId });

    if (!profile) {
      return successResponse(res, null, 'User has not updated their profile yet');
    }

    return successResponse(res, profile, 'User profile fetched successfully');
  } catch (error: any) {
    return errorResponse(res, error.message || 'Internal Server Error', error.statusCode || 500);
  }
};
