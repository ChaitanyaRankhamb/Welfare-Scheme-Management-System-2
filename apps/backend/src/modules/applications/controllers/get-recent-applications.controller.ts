import { Response } from 'express';
import { AuthRequest } from '../../../middlewares/auth.middleware';
import { applicationRepository } from '../../../database/repository/application.repository';
import { successResponse, errorResponse } from '../../../reuse-components/response';

export const getRecentApplicationsController = async (req: AuthRequest, res: Response) => {
  try {
    const limit = Number(req.query.limit) || 5;
    const isAdmin = req.query.isAdmin === 'true';
    const userId = isAdmin ? undefined : req.userId;

    const recent = await applicationRepository.findRecentApplications(limit, userId);
    return successResponse(res, recent, 'Recent applications retrieved successfully');
  } catch (error: any) {
    return errorResponse(res, error.message || 'Internal Server Error', error.statusCode || 500);
  }
};
