import { Response } from 'express';
import { AuthRequest } from '../../../middlewares/auth.middleware';
import { createSchemeService } from '../service/create-scheme.service';
import { createSchemeValidation } from '../../../validations/scheme/create-scheme.validation';
import { successResponse, errorResponse } from '../../../reuse-components/response';
import { AppError } from '../../../reuse-components/AppError';

/**
 * @description Controller for admin to create a new scheme
 * @param {AuthRequest} req - Authenticated request
 * @param {Response} res - Express response
 * @returns {Promise<Response>}
 * @flow
 * 1. Extract user from AuthRequest
 * 2. Validate request body using Zod
 * 3. Call CreateSchemeService
 * 4. Send success/error response
 */
export const createSchemeController = async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req;
    if (!userId) throw new AppError('Unauthorized', 401);

    // Validate Input
    const validation = createSchemeValidation.safeParse({ body: req.body });
    if (!validation.success) {
      throw new AppError(validation.error.errors[0].message, 400);
    }

    const result = await createSchemeService(userId, req.body);
    return successResponse(res, result.data, result.message);
  } catch (error: any) {
    return errorResponse(res, error.message || 'Internal Server Error', error.statusCode || 500);
  }
};
