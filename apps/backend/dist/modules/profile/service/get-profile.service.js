"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProfileService = void 0;
const profile_repository_1 = require("../../../database/repository/profile.repository");
const user_repository_1 = require("../../../database/repository/user.repository");
const AppError_1 = require("../../../reuse-components/AppError");
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
const getProfileService = async (userId) => {
    if (!userId) {
        throw new AppError_1.AppError('Unauthorized', 401);
    }
    const user = await user_repository_1.userRepository.findUserById(userId);
    if (!user) {
        throw new AppError_1.AppError('User not found', 404);
    }
    const profile = await profile_repository_1.profileRepository.findProfileByUserId(userId);
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
exports.getProfileService = getProfileService;
