import { applicationRepository } from '../../../database/repository/application.repository';
import { schemeRepository } from '../../../database/repository/scheme.repository';
import { userRepository } from '../../../database/repository/user.repository';
import { AppError } from '../../../reuse-components/AppError';

/**
 * @description Creates a new application tracking record with status INITIATED.
 * @param {string} userId - ID of the user initiating the application
 * @param {string} schemeId - ID of the scheme being applied to
 * @returns {Promise<{ success: boolean; data: any; message: string }>}
 * @flow
 * 1. Validate userId presence
 * 2. Find user in database
 * 3. Validate scheme existence
 * 4. Prevent duplicate application attempt
 * 5. Create application record
 * 6. Return structured response
 */
export const createApplicationService = async (userId: string, schemeId: string) => {
  if (!userId) {
    throw new AppError('Unauthorized', 401);
  }

  const user = await userRepository.findUserById(userId);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  if (!schemeId) {
    throw new AppError('Scheme ID is required', 400);
  }

  // 1. Validate scheme existence
  const scheme = await schemeRepository.findSchemeById(schemeId);
  if (!scheme) {
    throw new AppError('Scheme not found', 404);
  }

  if (user.getRole() !== "citizen") {
    throw new AppError('Only citizens can apply for schemes', 403);
  }

  // 2. Prevent duplicate application attempt
  const existingApplication = await applicationRepository.findApplicationByUserAndScheme(userId, schemeId);

  if (existingApplication?.getStatus() === "APPLIED") {
    throw new AppError('Application already applied for this scheme', 409);
  }

  // 3. Create application record
  const application = await applicationRepository.createApplication({
    userId,
    schemeId,
    status: 'INITIATED',
  });

  return {
    success: true,
    data: application,
    message: 'Application initiated successfully'
  };
};
