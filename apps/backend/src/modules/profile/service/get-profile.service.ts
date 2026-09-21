import { profileRepository } from '../../../database/repository/profile.repository';
import { userRepository } from '../../../database/repository/user.repository';
import { AppError } from '../../../reuse-components/AppError';

/**
 * @description Fetches the profile of the logged-in user
 * @param {string} userId - Authenticated user ID
 * @returns {Promise<{ success: boolean; data: any; message: string }>}
 * @flow
 * 1. Validate userId presence
 * 2. Find user in database
 * 3. Fetch profile from repository
 * 4. If not found, throw AppError (404)
 * 5. Return structured response
 */
export const getProfileService = async (userId: string) => {
  if (!userId) {
    throw new AppError('Unauthorized', 401);
  }

  const user = await userRepository.findUserById(userId);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  const profile = await profileRepository.findProfileByUserId(userId);
  
  if (!profile) {
    return {
      success: true,
      data: null,
      message: 'No profile found for this user'
    };
  }

  return {
    success: true,
    data: profile.getSnapshot(),
    message: 'Profile fetched successfully'
  };
};
