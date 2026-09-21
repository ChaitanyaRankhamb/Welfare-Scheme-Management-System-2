import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../../middlewares/auth.middleware';
import { getAdminSchemesService } from '../service/get-schemes.service';
import { successResponse } from '../../../reuse-components/response';
import { UserId } from '../../../entity/user/userId';
import { AppError } from '../../../Error/appError';

/**
 * @description Controller to fetch schemes for admin with pagination and status filter
 */
export const getAdminSchemesController = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId;
    if (!userId) {
      throw new AppError('Unauthorized', 401);
    }
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const status = req.query.status as string;

    const result = await getAdminSchemesService(new UserId(userId.toString()), page, limit, status);
    
    // Response Format: data (schemes), page, totalPages, totalSchemes
    return successResponse(res, {
      schemes: result.data,
      page: result.page,
      totalPages: result.totalPages,
      totalSchemes: result.totalSchemes
    }, result.message);
  } catch (error) {
    next(error);
  }
};
