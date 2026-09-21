import { schemeRepository } from '../../../database/repository/scheme.repository';
import { userRepository } from '../../../database/repository/user.repository';
import { AppError } from '../../../reuse-components/AppError';

/**
 * @description Fetches a single scheme by its ID
 * @param {string} userId - ID of the authenticated user
 * @param {string} id - Scheme ID
 * @returns {Promise<{ success: boolean; data: any; message: string }>}
 * @flow
 * 1. Validate userId presence
 * 2. Find user in database
 * 3. Fetch scheme from repository by ID
 * 4. If not found, throw AppError (404)
 * 5. Return structured response
 */
export const getSchemeByIdService = async (userId: string, id: string) => {
  if (!userId) {
    throw new AppError('Unauthorized', 401);
  }

  const user = await userRepository.findUserById(userId);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  const scheme = await schemeRepository.findSchemeById(id);
  // Only published schemes are visible to users
  // Updated scheme status system: active/deactive → drafted/published/archived
  if (!scheme || scheme.getStatus() !== 'published') {
    throw new AppError('Scheme not found or unavailable', 404);
  }

  return {
    success: true,
    data: scheme,
    message: 'Scheme details fetched successfully'
  };
};
