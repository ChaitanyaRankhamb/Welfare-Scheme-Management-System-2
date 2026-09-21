import { Response } from 'express';
import { AuthRequest } from '../../../middlewares/auth.middleware';
import { getSchemeByIdService } from '../service/get-scheme-by-id.service';
import { getSchemeByIdValidation } from '../../../validations/scheme/get-scheme-by-id.validation';
import { successResponse, errorResponse } from '../../../reuse-components/response';
import { AppError } from '../../../reuse-components/AppError';

/**
 * @description Controller to fetch a single scheme by ID
 * @param {AuthRequest} req - Authenticated request
 * @param {Response} res - Express response
 * @returns {Promise<Response>}
 * @flow
 * 1. Extract user from AuthRequest
 * 2. Validate params (id) using Zod
 * 3. Call GetSchemeByIdService
 * 4. Send success/error response
 */
export const getSchemeByIdController = async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req;
    if (!userId) throw new AppError('Unauthorized', 401);

    // Validate Input
    const validation = getSchemeByIdValidation.safeParse({ params: req.params });
    if (!validation.success) {
      throw new AppError(validation.error.errors[0].message, 400);
    }

    const { id } = validation.data.params;

    const result = await getSchemeByIdService(userId, id);
    return successResponse(res, result.data, result.message);
  } catch (error: any) {
    return errorResponse(res, error.message || 'Internal Server Error', error.statusCode || 500);
  }
};
