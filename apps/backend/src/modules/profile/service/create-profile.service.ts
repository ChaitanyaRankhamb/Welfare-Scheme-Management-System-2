import { profileRepository } from '../../../database/repository/profile.repository';
import { userRepository } from '../../../database/repository/user.repository';
import { AppError } from '../../../reuse-components/AppError';
import { Profile } from '../../../entity/profile/profile.entity';
import { ProfileId } from '../../../entity/profile/profileId';
import { UserId } from '../../../entity/user/userId';

/**
 * @description Creates a new profile for the user with completion percentage
 * @param {string} userId - Authenticated user ID
 * @param {any} profileData - Profile details
 * @returns {Promise<{ success: boolean; data: any; message: string }>}
 */
export const createProfileService = async (userId: string, profileData: any) => {
  if (!userId) {
    throw new AppError('Unauthorized', 401);
  }

  const user = await userRepository.findUserById(userId);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  const existingProfile = await profileRepository.findProfileByUserId(userId);
  if (existingProfile) {
    throw new AppError('Profile already exists for this user', 409);
  }

  // Create temporary entity to calculate completion percentage
  const tempId = 'temp'; 
  const newProfileEntity = new Profile(
    new ProfileId(tempId),
    {
      userId: new UserId(userId),
      ...profileData,
      profileCompletionPercentage: 0
    },
    new Date(),
    new Date()
  );

  newProfileEntity.recalculateCompletion();
  const snapshot = newProfileEntity.getSnapshot();

  const newProfile = await profileRepository.createProfile({
    ...snapshot,
    userId: userId // Ensure it's a string for repo
  });

  return {
    success: true,
    data: newProfile.getSnapshot(),
    message: 'Profile created successfully'
  };
};
