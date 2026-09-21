import { Request, Response, NextFunction } from 'express';
import { publishSchemeService } from '../service/publish-scheme.service';
import { archiveSchemeService } from '../service/archive-scheme.service';
import { restoreSchemeService } from '../service/restore-scheme.service';
import { AuthRequest } from '../../../middlewares/auth.middleware';
import { UserId } from '../../../entity/user/userId';
import { AppError } from '../../../Error/appError';
import { successResponse } from '../../../reuse-components/response';

/**
 * @description General controller for updating scheme status (publish, archive, restore)
 */
export const updateSchemeStatusController = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id, action } = req.params;
    const userId = req.userId;

    if (!userId) {
      throw new AppError('User not authenticated', 401);
    }

    let result;
    switch (action) {
      case 'publish':
        result = await publishSchemeService(new UserId(userId), id);
        break;
      case 'archive':
        result = await archiveSchemeService(new UserId(userId), id);
        break;
      case 'restore':
        result = await restoreSchemeService(new UserId(userId), id);
        break;
      default:
        return res.json({
          success: false,
          message: "Invalid action",
          data: null,
          status: 400
        });
    }

    if (!result) {
      return res.json({
        success: false,
        message: "Failed to update scheme status",
        data: null,
        status: 500
      })
    }

    return successResponse(res, result.data, result.message);
  } catch (error) {
    next(error);
  }
};
