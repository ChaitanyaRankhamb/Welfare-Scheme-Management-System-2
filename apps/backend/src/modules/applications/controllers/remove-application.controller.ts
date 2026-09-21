import { Response } from 'express';
import { AuthRequest } from '../../../middlewares/auth.middleware';
import { removeApplicationService } from '../service/remove-application.service';
import { applicationIdSchema } from '../../../validations/application.validation';
import { successResponse, errorResponse } from '../../../reuse-components/response';
import { AppError } from '../../../reuse-components/AppError';

/**
 * @description Removes an application record (soft delete).
 * @param {AuthRequest} req - Authenticated Request (expects application ID in params)
 * @param {Response} res - Express Response
 * @returns {Promise<Response>}
 * @flow
 * 1. Extract userId from AuthRequest
 * 2. Validate Input using Zod
 * 3. Call RemoveApplicationService
 * 4. Send success/error response
 */
export const removeApplicationController = async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req;
    if (!userId) throw new AppError('Unauthorized', 401);

    // Validate Input
    const validation = applicationIdSchema.safeParse({ params: req.params });
    if (!validation.success) {
      throw new AppError(validation.error.errors[0].message, 400);
    }

    const { id } = validation.data.params;

    const result = await removeApplicationService(userId, id);
    
    return successResponse(res, result.data, result.message);
  } catch (error: any) {
    return errorResponse(res, error.message || 'Internal Server Error', error.statusCode || 500);
  }
};
