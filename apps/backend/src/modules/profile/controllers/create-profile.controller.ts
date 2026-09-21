import { Response } from 'express';
import { AuthRequest } from '../../../middlewares/auth.middleware';
import { createProfileService } from '../service/create-profile.service';
import { profileValidationSchema } from '../../../validations/profile/profile.validation';
import { successResponse, errorResponse } from '../../../reuse-components/response';
import { AppError } from '../../../reuse-components/AppError';

/**
 * @description Controller to create a new user profile
 * @param {AuthRequest} req - Authenticated request
 * @param {Response} res - Express response
 */
export const createProfileController = async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req;
    if (!userId) {
      throw new AppError('Unauthorized', 401);
    }

    // Validate Input
    const validation = profileValidationSchema.safeParse({ body: req.body });
    if (!validation.success) {
      throw new AppError(validation.error.errors[0].message, 400);
    }

    const result = await createProfileService(userId, validation.data.body);
    return successResponse(res, result.data, result.message);
  } catch (error: any) {
    return errorResponse(res, error.message || 'Error creating profile', error.statusCode || 500);
  }
};
