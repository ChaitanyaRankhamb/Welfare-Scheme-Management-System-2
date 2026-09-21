import { schemeRepository } from '../../../database/repository/scheme.repository';
import { userRepository } from '../../../database/repository/user.repository';
import { AppError } from '../../../reuse-components/AppError';

/**
 * @description Deletes an existing scheme
 * @param {string} userId - ID of the authenticated user (admin)
 * @param {string} id - Scheme ID
 * @returns {Promise<{ success: boolean; message: string }>}
 * @flow
 * 1. Validate userId presence
 * 2. Find user in database
 * 3. Check if user is admin
 * 4. Check if scheme exists
 * 5. Delete scheme via repository
 * 6. Return structured response
 */
export const deleteSchemeService = async (userId: string, id: string) => {
  if (!userId) {
    throw new AppError('Unauthorized', 401);
  }

  const user = await userRepository.findUserById(userId);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  if (user.getRole() !== 'admin') {
    throw new AppError('Forbidden: Admin access required', 403);
  }

  const scheme = await schemeRepository.findSchemeById(id);
  if (!scheme) {
    throw new AppError('Scheme not found', 404);
  }

  // Only drafted schemes can be deleted
  // Updated scheme status system: active/deactive → drafted/published/archived
  if (scheme.getStatus() !== 'drafted') {
    throw new AppError('Only drafted schemes can be deleted permanently', 400);
  }

  await schemeRepository.deleteScheme(id);

  return {
    success: true,
    message: 'Scheme deleted successfully'
  };
};
