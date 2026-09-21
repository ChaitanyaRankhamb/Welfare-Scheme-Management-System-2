import { Response } from 'express';
import { AuthRequest } from '../../../middlewares/auth.middleware';
import { updateSchemeService } from '../service/update-scheme.service';
import { updateSchemeValidation } from '../../../validations/scheme/update-scheme.validation';
import { successResponse, errorResponse } from '../../../reuse-components/response';
import { AppError } from '../../../reuse-components/AppError';

/**
 * @description Controller for admin to update an existing scheme
 * @param {AuthRequest} req - Authenticated request
 * @param {Response} res - Express response
 * @returns {Promise<Response>}
 * @flow
 * 1. Extract user from AuthRequest
 * 2. Validate params and body using Zod
 * 3. Call UpdateSchemeService
 * 4. Send success/error response
 */
export const updateSchemeController = async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req;
    if (!userId) throw new AppError('Unauthorized', 401);

    // Validate Input
    const validation = updateSchemeValidation.safeParse({ 
      params: req.params,
      body: req.body 
    });
    if (!validation.success) {
      throw new AppError(validation.error.errors[0].message, 400);
    }

    const { id } = validation.data.params;
    const updateData = validation.data.body;

    const result = await updateSchemeService(userId, id, updateData);
    return successResponse(res, result.data, result.message);
  } catch (error: any) {
    return errorResponse(res, error.message || 'Internal Server Error', error.statusCode || 500);
  }
};
