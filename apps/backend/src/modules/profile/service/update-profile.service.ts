import { profileRepository } from '../../../database/repository/profile.repository';
import { userRepository } from '../../../database/repository/user.repository';
import { AppError } from '../../../reuse-components/AppError';

/**
 * @description Updates an existing user profile and recalculates completion
 * @param {string} userId - Authenticated user ID
 * @param {any} updateData - Partial profile details to update
 * @returns {Promise<{ success: boolean; data: any; message: string }>}
 */
export const updateProfileService = async (userId: string, updateData: any) => {
  if (!userId) {
    throw new AppError('Unauthorized', 401);
  }

  const user = await userRepository.findUserById(userId);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  let profile = await profileRepository.findProfileByUserId(userId);
  
  if (!profile) {
    // Create new profile if not found (Upsert)
    const { Profile } = await import('../../../entity/profile/profile.entity');
    const { ProfileId } = await import('../../../entity/profile/profileId');
    const { UserId } = await import('../../../entity/user/userId');
    
    profile = new Profile(
      new ProfileId('temp'), 
      {
        userId: new UserId(userId),
        firstName: updateData.firstName || 'User',
        middleName: updateData.middleName || '',
        lastName: updateData.lastName || 'Pending',
        gender: updateData.gender || 'OTHER',
        dateOfBirth: updateData.dateOfBirth ? new Date(updateData.dateOfBirth) : new Date(),
        mobileNumber: updateData.mobileNumber || '0000000000',
        country: updateData.country || 'India',
        state: updateData.state || 'Maharashtra', // Default state
        district: updateData.district || 'Pending',
        taluka: updateData.taluka || '',
        village: updateData.village || '',
        pincode: updateData.pincode || '400001',
        areaType: updateData.areaType || 'RURAL',
        annualIncome: Number(updateData.annualIncome) || 0,
        bplStatus: !!updateData.bplStatus,
        casteCategory: updateData.casteCategory || 'general',
        religion: updateData.religion || 'other',
        occupationType: updateData.occupationType || 'other',
        employmentStatus: updateData.employmentStatus || 'unemployed',
        ...updateData,
        profileCompletionPercentage: 0
      },
      new Date(),
      new Date()
    );
    
    profile.recalculateCompletion();
    const savedProfile = await profileRepository.createProfile({
      ...profile.getSnapshot(),
      userId: userId
    });
    
    return {
      success: true,
      data: savedProfile.getSnapshot(),
      message: 'Profile initialized and updated successfully'
    };
  }

  // Use entity's patch method for existing profiles
  profile.patch(updateData);

  const updatedProfile = await profileRepository.updateProfile(userId, profile);
  if (!updatedProfile) {
    throw new AppError('Failed to update profile', 500);
  }

  return {
    success: true,
    data: updatedProfile.getSnapshot(),
    message: 'Profile updated successfully'
  };
};
