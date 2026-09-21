"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProfileService = void 0;
const profile_repository_1 = require("../../../database/repository/profile.repository");
const user_repository_1 = require("../../../database/repository/user.repository");
const AppError_1 = require("../../../reuse-components/AppError");
const profile_entity_1 = require("../../../entity/profile/profile.entity");
const profileId_1 = require("../../../entity/profile/profileId");
const userId_1 = require("../../../entity/user/userId");
/**
 * @description Creates a new profile for the user with completion percentage
 * @param {string} userId - Authenticated user ID
 * @param {any} profileData - Profile details
 * @returns {Promise<{ success: boolean; data: any; message: string }>}
 */
const createProfileService = async (userId, profileData) => {
    if (!userId) {
        throw new AppError_1.AppError('Unauthorized', 401);
    }
    const user = await user_repository_1.userRepository.findUserById(userId);
    if (!user) {
        throw new AppError_1.AppError('User not found', 404);
    }
    const existingProfile = await profile_repository_1.profileRepository.findProfileByUserId(userId);
    if (existingProfile) {
        throw new AppError_1.AppError('Profile already exists for this user', 409);
    }
    // Create temporary entity to calculate completion percentage
    const tempId = 'temp';
    const newProfileEntity = new profile_entity_1.Profile(new profileId_1.ProfileId(tempId), {
        userId: new userId_1.UserId(userId),
        ...profileData,
        profileCompletionPercentage: 0
    }, new Date(), new Date());
    newProfileEntity.recalculateCompletion();
    const snapshot = newProfileEntity.getSnapshot();
    const newProfile = await profile_repository_1.profileRepository.createProfile({
        ...snapshot,
        userId: userId // Ensure it's a string for repo
    });
    return {
        success: true,
        data: newProfile.getSnapshot(),
        message: 'Profile created successfully'
    };
};
exports.createProfileService = createProfileService;
