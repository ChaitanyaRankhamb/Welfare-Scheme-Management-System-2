import { applicationRepository } from '../../../database/repository/application.repository';
import { userRepository } from '../../../database/repository/user.repository';
import { AppError } from '../../../reuse-components/AppError';

/**
 * @description Soft deletes an application record.
 * @param {string} userId - ID of the user (for ownership validation)
 * @param {string} applicationId - ID of the application to remove
 * @returns {Promise<{ success: boolean; data: any; message: string }>}
 * @flow
 * 1. Validate userId presence
 * 2. Find user in database
 * 3. Find application by ID
 * 4. Validate ownership
 * 5. Check if already deleted
 * 6. Perform soft delete and save
 * 7. Return structured response
 */
export const removeApplicationService = async (userId: string, applicationId: string) => {
  if (!userId) {
    throw new AppError('Unauthorized', 401);
  }

  const user = await userRepository.findUserById(userId);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  const application = await applicationRepository.findApplicationById(applicationId);

  if (!application) {
    throw new AppError('Application not found', 404);
  }

  // Validate ownership
  if (application.getUserId().toString() !== userId) {
    throw new AppError('Unauthorized access to this application', 403);
  }

  // Check if already deleted
  if (application.getIsDeleted()) {
    throw new AppError('Application already removed', 400);
  }

  application.remove();

  const updated = await applicationRepository.updateApplication(applicationId, application);
  if (!updated) {
    throw new AppError('Failed to remove application', 500);
  }

  return {
    success: true,
    data: updated,
    message: 'Application removed successfully'
  };
};
