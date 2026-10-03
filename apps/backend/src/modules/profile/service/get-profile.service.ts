import { profileRepository } from "../../../database/repository/profile.repository";
import { userRepository } from "../../../database/repository/user.repository";
import { AppError } from "../../../reuse-components/AppError";
import {
  cacheProfile,
  getCachedProfile,
} from "../../../redis-cache/profile-cache.service";

/**
 * @description Fetches the profile of the logged-in user
 * @param {string} userId - Authenticated user ID
 * @returns {Promise<{ success: boolean; data: any; message: string }>}
 */
export const getProfileService = async (userId: string) => {
  if (!userId) {
    throw new AppError("Unauthorized", 401);
  }

  const user = await userRepository.findUserById(userId);
  if (!user) {
    throw new AppError("User not found", 404);
  }

  // 1. Fetch profile data from Redis cache first
  const cachedProfile = await getCachedProfile(userId);
  if (cachedProfile) {
    return {
      success: true,
      data: cachedProfile,
      message: "Profile fetched successfully",
    };
  }

  // 2. If cache miss, fetch from database
  const profile = await profileRepository.findProfileByUserId(userId);

  if (!profile) {
    return {
      success: true,
      data: null,
      message: "No profile found for this user",
    };
  }

  const snapshot = profile.getSnapshot();

  // 3. Cache it for future requests
  await cacheProfile(userId, snapshot);

  return {
    success: true,
    data: snapshot,
    message: "Profile fetched successfully",
  };
};
