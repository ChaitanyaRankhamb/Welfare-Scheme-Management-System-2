import { schemeRepository } from '../../../database/repository/scheme.repository';
import { userRepository } from '../../../database/repository/user.repository';
import { AppError } from '../../../reuse-components/AppError';

/**
 * @description Updates an existing scheme
 * @param {string} userId - ID of the authenticated user (admin)
 * @param {string} id - Scheme ID
 * @param {any} updateData - Partial scheme data to update
 * @returns {Promise<{ success: boolean; data: any; message: string }>}
 * @flow
 * 1. Validate userId presence
 * 2. Find user in database
 * 3. Check if user is admin
 * 4. Check if scheme exists
 * 5. Update scheme details using domain entity methods
 * 6. Save updated scheme via repository
 * 7. Return structured response
 */
export const updateSchemeService = async (userId: string, id: string, updateData: any) => {
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

  // Only drafted schemes can be edited
  // Updated scheme status system: active/deactive → drafted/published/archived
  if (scheme.getStatus() !== 'drafted') {
    throw new AppError('Only drafted schemes can be edited', 400);
  }

  scheme.updateDetails(updateData);

  const updated = await schemeRepository.updateScheme(id, scheme);
  if (!updated) {
    throw new AppError('Failed to update scheme', 500);
  }

  return {
    success: true,
    data: updated,
    message: 'Scheme updated successfully'
  };
};
