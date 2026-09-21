import { Response } from 'express';
import { AuthRequest } from '../../../middlewares/auth.middleware';
import { applicationRepository } from '../../../database/repository/application.repository';
import { successResponse, errorResponse } from '../../../reuse-components/response';
import { AppError } from '../../../reuse-components/AppError';
import { ApplicationModel } from '../../../database/mongo/models/application.model';

/**
 * @description Controller for admin to fetch applications of a specific user
 */
export const getUserApplicationsController = async (req: AuthRequest, res: Response) => {
  try {
    const { userId: adminId } = req;
    const { id: targetUserId } = req.params;

    if (!adminId) throw new AppError('Unauthorized', 401);
    if (!targetUserId) throw new AppError('User ID is required', 400);

    // Fetch applications with populated scheme info using Mongoose directly for ease of data transfer in admin view
    const applications = await ApplicationModel.find({ userId: targetUserId, isDeleted: false })
      .populate('schemeId', 'title category ministry')
      .sort({ createdAt: -1 });

    return successResponse(res, applications, 'User applications fetched successfully');
  } catch (error: any) {
    return errorResponse(res, error.message || 'Internal Server Error', error.statusCode || 500);
  }
};
