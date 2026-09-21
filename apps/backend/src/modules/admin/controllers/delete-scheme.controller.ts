import { Response } from 'express';
import { AuthRequest } from '../../../middlewares/auth.middleware';
import { deleteSchemeService } from '../service/delete-scheme.service';
import { deleteSchemeValidation } from '../../../validations/scheme/delete-scheme.validation';
import { successResponse, errorResponse } from '../../../reuse-components/response';
import { AppError } from '../../../reuse-components/AppError';

/**
 * @description Controller for admin to delete a scheme
 * @param {AuthRequest} req - Authenticated request
 * @param {Response} res - Express response
 * @returns {Promise<Response>}
 * @flow
 * 1. Extract user from AuthRequest
 * 2. Validate params (id) using Zod
 * 3. Call DeleteSchemeService
 * 4. Send success/error response
 */
export const deleteSchemeController = async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req;
    if (!userId) throw new AppError('Unauthorized', 401);

    // Validate Input
    const validation = deleteSchemeValidation.safeParse({ params: req.params });
    if (!validation.success) {
      throw new AppError(validation.error.errors[0].message, 400);
    }

    const { id } = validation.data.params;

    const result = await deleteSchemeService(userId, id);
    return successResponse(res, null, result.message);
  } catch (error: any) {
    return errorResponse(res, error.message || 'Internal Server Error', error.statusCode || 500);
  }
};
