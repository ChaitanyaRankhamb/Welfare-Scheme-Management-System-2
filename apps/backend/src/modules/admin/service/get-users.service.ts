import { userRepository } from '../../../database/repository/user.repository';
import { AppError } from '../../../reuse-components/AppError';

/**
 * @description Fetches all citizen users for admin with pagination
 * @param {string} userId - Admin user ID
 * @param {number} page - Page number
 * @param {number} limit - Items per page
 * @returns {Promise<{ success: boolean; data: any; message: string }>}
 */
export const getUsersService = async (userId: string, page: number = 1, limit: number = 20, status?: 'active' | 'inactive') => {
  if (!userId) {
    throw new AppError('Unauthorized', 401);
  }

  const adminUser = await userRepository.findUserById(userId);
  if (!adminUser || adminUser.getRole() !== 'admin') {
    throw new AppError('Forbidden: Admin access required', 403);
  }

  const skip = (page - 1) * limit;
  const { users, total } = await userRepository.findAllUsers(skip, limit, status);
  
  return {
    success: true,
    data: {
      items: users,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    },
    message: 'All users fetched successfully'
  };
};
