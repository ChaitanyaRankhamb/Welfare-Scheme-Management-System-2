import { userRepository } from '../../../database/repository/user.repository';
import { AppError } from '../../../reuse-components/AppError';
import { userStatusUpdateQueue } from '../../../queue/notifications/user-status-notifications/userStatusUpdate.queue';

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
  const newStatus = !currentStatus;
  user.setActiveStatus(newStatus);

  const updatedUser = await userRepository.updateUser(targetUserId, user);

  if (!updatedUser) {
    user.setActiveStatus(currentStatus); // revert status on failure
    throw new AppError('Failed to update user status', 500);
  }

  let notificationQueued = false;
  try {
    await userStatusUpdateQueue.add('user-status-updated', {
      userId: targetUserId,
      isActive: newStatus,
    });
    notificationQueued = true;
  } catch (error) {
    console.error(
      `[User Status Notification] Could not queue email for user ${targetUserId}:`,
      error,
    );
  }

  // 

  return {
    success: true,
    data: updatedUser,
    message: `User ${newStatus ? 'activated' : 'deactivated'} successfully`,
    notificationQueued,
  };
};
