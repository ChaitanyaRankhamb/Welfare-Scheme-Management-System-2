import { userRepository } from '../../../database/repository/user.repository';
import { AppError } from '../../../reuse-components/AppError';

/**
 * @description Toggles the isActive status of a user
 * @param {string} adminId - ID of the admin performing the action
 * @param {string} targetUserId - ID of the user to toggle
 * @returns {Promise<{ success: boolean; data: any; message: string }>}
 */
export const toggleUserStatusService = async (adminId: string, targetUserId: string) => {
  const admin = await userRepository.findUserById(adminId);
  if (!admin || admin.getRole() !== 'admin') {
    throw new AppError('Forbidden: Admin access required', 403);
  }

  const user = await userRepository.findUserById(targetUserId);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  // Toggle status
  const currentStatus = user.isUserActive();
  user.setActiveStatus(!currentStatus);

  const updatedUser = await userRepository.updateUser(targetUserId, user);
  if (!updatedUser) {
    throw new AppError('Failed to update user status', 500);
  }

  return {
    success: true,
    data: updatedUser,
    message: `User ${!currentStatus ? 'activated' : 'deactivated'} successfully`
  };
};
