import { applicationRepository } from '../../../database/repository/application.repository';
import { userRepository } from '../../../database/repository/user.repository';
import { AppError } from '../../../reuse-components/AppError';

/**
 * @description Retrieves all non-deleted applications for a specific user with pagination.
 * @param {string} userId - ID of the user whose applications are being fetched
 * @param {number} page - Page number
 * @param {number} limit - Items per page
 * @returns {Promise<{ success: boolean; data: any; message: string }>}
 * @flow
 * 1. Validate userId presence
 * 2. Find user in database
 * 3. Calculate skip
 * 4. Fetch non-deleted applications and total from repository
 * 5. Return structured response with meta
 */
export const getMyApplicationsService = async (userId: string, page: number = 1, limit: number = 20) => {
  if (!userId) {
    throw new AppError('Unauthorized', 401);
  }

  const user = await userRepository.findUserById(userId);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  const skip = (page - 1) * limit;
  const { applications, total } = await applicationRepository.findApplicationsByUserId(userId, false, skip, limit);

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
    message: 'Applications fetched successfully'
  };
};
