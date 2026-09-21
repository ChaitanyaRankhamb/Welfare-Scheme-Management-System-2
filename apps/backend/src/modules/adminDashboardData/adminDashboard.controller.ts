import { Response } from 'express';
import { AuthRequest } from '../../middlewares/auth.middleware';
import { adminDashboardService } from './adminDashboard.service';
import { AppError } from '../../Error/appError';

export const getAdminDashboardData = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;

    if (!user || !user.id) {
      throw new AppError('Unauthorized: User not found', 401);
    }

    const data = await adminDashboardService.getAggregatedData(user.id);

    return res.status(200).json({
      success: true,
      data
    });
  } catch (error: any) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      success: false,
      message: error.message || 'Internal Server Error'
    });
  }
};
