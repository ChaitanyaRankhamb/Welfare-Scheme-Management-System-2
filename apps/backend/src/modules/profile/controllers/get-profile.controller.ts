import { Response } from 'express';
import { AuthRequest } from '../../../middlewares/auth.middleware';
import { getProfileService } from '../service/get-profile.service';
import { successResponse, errorResponse } from '../../../reuse-components/response';
import { AppError } from '../../../reuse-components/AppError';

/**
 * @description Controller to fetch the authenticated user's profile
 * @param {AuthRequest} req - Authenticated request
 * @param {Response} res - Express response
 */
export const getProfileController = async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req;
    if (!userId) {
      throw new AppError('Unauthorized', 401);
    }

    const result = await getProfileService(userId);
    return successResponse(res, result.data, result.message);
  } catch (error: any) {
    return errorResponse(res, error.message || 'Error fetching profile', error.statusCode || 500);
  }
};
