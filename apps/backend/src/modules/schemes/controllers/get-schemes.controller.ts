import { Response } from 'express';
import { AuthRequest } from '../../../middlewares/auth.middleware';
import { getSchemesService } from '../service/get-schemes.service';
import { getSchemesValidation } from '../../../validations/scheme/get-schemes.validation';
import { successResponse, errorResponse } from '../../../reuse-components/response';
import { AppError } from '../../../reuse-components/AppError';

/**
 * @description Controller to fetch all schemes with pagination
 * @param {AuthRequest} req - Authenticated request
 * @param {Response} res - Express response
 * @returns {Promise<Response>}
 * @flow
 * 1. Extract user from AuthRequest
 * 2. Validate query params (page, limit) using Zod
 * 3. Call GetSchemesService
 * 4. Send success/error response
 */
export const getSchemesController = async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req;
    if (!userId) throw new AppError('Unauthorized', 401);

    // Validate Input
    const validation = getSchemesValidation.safeParse({ query: req.query });
    if (!validation.success) {
      throw new AppError(validation.error.errors[0].message, 400);
    }

    const { page, limit } = validation.data.query;

    const result = await getSchemesService(userId, page, limit);
    return successResponse(res, result.data, result.message);
  } catch (error: any) {
    return errorResponse(res, error.message || 'Internal Server Error', error.statusCode || 500);
  }
};
