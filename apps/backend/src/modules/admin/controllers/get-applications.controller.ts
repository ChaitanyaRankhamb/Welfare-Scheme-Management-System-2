import { Response } from 'express';
import { AuthRequest } from '../../../middlewares/auth.middleware';
import { getApplicationsService } from '../service/get-applications.service';
import { successResponse, errorResponse } from '../../../reuse-components/response';
import { AppError } from '../../../reuse-components/AppError';
import { paginationSchema } from '../../../validations/pagination.validation';

/**
 * @description Controller for admin to fetch all applications with pagination
 */
export const getApplicationsController = async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req;
    if (!userId) throw new AppError('Unauthorized', 401);

    // Validate Input
    const validation = paginationSchema.safeParse({ query: req.query });
    if (!validation.success) {
      throw new AppError(validation.error.errors[0].message, 400);
    }

    const { page, limit } = validation.data.query;

    const result = await getApplicationsService(userId, page, limit);
    return successResponse(res, result.data, result.message);
  } catch (error: any) {
    return errorResponse(res, error.message || 'Internal Server Error', error.statusCode || 500);
  }
};
