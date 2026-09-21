import { Response } from 'express';
import { AuthRequest } from '../../../middlewares/auth.middleware';
import { getMyApplicationsService } from '../service/get-my-applications.service';
import { successResponse, errorResponse } from '../../../reuse-components/response';
import { AppError } from '../../../reuse-components/AppError';
import { paginationSchema } from '../../../validations/pagination.validation';

/**
 * @description Gets all non-deleted applications for the authenticated user with pagination.
 * @param {AuthRequest} req - Authenticated Request
 * @param {Response} res - Express Response
 * @returns {Promise<Response>}
 * @flow
 * 1. Extract userId from AuthRequest
 * 2. Validate pagination query params
 * 3. Call GetMyApplicationsService
 * 4. Send success/error response
 */
export const getMyApplicationsController = async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req;
    if (!userId) throw new AppError('Unauthorized', 401);

    // Validate Input
    const validation = paginationSchema.safeParse({ query: req.query });
    if (!validation.success) {
      throw new AppError(validation.error.errors[0].message, 400);
    }

    const { page, limit } = validation.data.query;

    const result = await getMyApplicationsService(userId, page, limit);
    
    return successResponse(res, result.data, result.message);
  } catch (error: any) {
    return errorResponse(res, error.message || 'Internal Server Error', error.statusCode || 500);
  }
};
