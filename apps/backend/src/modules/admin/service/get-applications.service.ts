import { applicationRepository } from '../../../database/repository/application.repository';
import { userRepository } from '../../../database/repository/user.repository';
import { AppError } from '../../../reuse-components/AppError';

/**
 * @description Fetches all applications for admin with pagination
 * @param {string} userId - Admin user ID
 * @param {number} page - Page number
 * @param {number} limit - Items per page
 * @returns {Promise<{ success: boolean; data: any; message: string }>}
 */
export const getApplicationsService = async (userId: string, page: number = 1, limit: number = 20) => {
  if (!userId) {
    throw new AppError('Unauthorized', 401);
  }

  const user = await userRepository.findUserById(userId);
  if (!user || user.getRole() !== 'admin') {
    throw new AppError('Forbidden: Admin access required', 403);
  }

  const skip = (page - 1) * limit;
  const { applications, total } = await applicationRepository.findAllApplications(skip, limit);
  
  return {
    success: true,
    data: {
      items: applications,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    },
    message: 'All applications fetched successfully'
  };
};
