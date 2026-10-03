import { Response } from 'express';
import { AuthRequest } from '../../../middlewares/auth.middleware';
import { applicationRepository } from '../../../database/repository/application.repository';
import { successResponse, errorResponse } from '../../../reuse-components/response';

export const getApplicationStatsController = async (req: AuthRequest, res: Response) => {
  try {
    const stats = await applicationRepository.getApplicationStats();
    return successResponse(res, stats, 'Application stats retrieved successfully');
  } catch (error: any) {
    return errorResponse(res, error.message || 'Internal Server Error', error.statusCode || 500);
  }
};
