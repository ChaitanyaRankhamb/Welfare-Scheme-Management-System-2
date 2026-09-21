import { schemeRepository } from '../../../database/repository/scheme.repository';
import { userRepository } from '../../../database/repository/user.repository';
import { UserId } from '../../../entity/user/userId';
import { AppError } from '../../../reuse-components/AppError';
import { Role } from '../../../types/roles.enum';

/**
 * @description Fetches all schemes with pagination for admin
 * @param {string} userId - ID of the authenticated admin
 * @param {number} page - Page number
 * @param {number} limit - Items per page
 * @param {string} status - Filter by status (drafted, published, archived)
 */
export const getAdminSchemesService = async (userId: UserId, page: number = 1, limit: number = 10, status?: string) => {
  if (!userId) throw new AppError('Unauthorized', 401);

  const user = await userRepository.findUserById(userId.toString());
  if (!user) {
    throw new AppError('User not found', 404);
  }

  if (user.getRole() !== Role.ADMIN) {
    throw new AppError('Forbidden: Admin access required', 403);
  }

  // Pagination applied using skip & limit
  const skip = (page - 1) * limit;
  
  const filters: any = {};
  if (status && ['drafted', 'published', 'archived'].includes(status)) {
    filters.status = status;
  }

  const { schemes, total } = await schemeRepository.findAllSchemes(filters, skip, limit);

  return {
    success: true,
    data: schemes,
    page,
    totalPages: Math.ceil(total / limit),
    totalSchemes: total,
    message: 'Schemes fetched successfully'
  };
};
