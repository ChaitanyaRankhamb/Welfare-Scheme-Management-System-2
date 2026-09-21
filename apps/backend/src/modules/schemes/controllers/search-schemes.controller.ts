import { Response } from 'express';
import { AuthRequest } from '../../../middlewares/auth.middleware';
import { searchSchemesService } from '../service/search-schemes.service';
import { searchSchemesValidation } from '../../../validations/scheme/search-schemes.validation';
import { successResponse, errorResponse } from '../../../reuse-components/response';
import { AppError } from '../../../reuse-components/AppError';

/**
 * @description Controller to search for schemes based on criteria
 * @param {AuthRequest} req - Authenticated request
 * @param {Response} res - Express response
 * @returns {Promise<Response>}
 * @flow
 * 1. Extract user from AuthRequest
 * 2. Validate query params using Joi
 * 3. Call SearchSchemesService
 * 4. Send success/error response
 */
export const searchSchemesController = async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req;
    if (!userId) throw new AppError('Unauthorized', 401);

    // Validate Input
    const validation = searchSchemesValidation.safeParse({ query: req.query });
    if (!validation.success) {
      throw new AppError(validation.error.errors[0].message, 400);
    }

    const result = await searchSchemesService(userId, validation.data.query);
    return successResponse(res, result.data, result.message);
  } catch (error: any) {
    return errorResponse(res, error.message || 'Internal Server Error', error.statusCode || 500);
  }
};
