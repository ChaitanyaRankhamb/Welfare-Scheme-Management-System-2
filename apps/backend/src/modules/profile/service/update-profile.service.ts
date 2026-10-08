import { profileRepository } from "../../../database/repository/profile.repository";
import { userRepository } from "../../../database/repository/user.repository";
import { AppError } from "../../../reuse-components/AppError";
import { profileUpdateQueue } from "../../../queue/profile/profile.queue";
import { invalidateProfileCache } from "../../../redis-cache/profile-cache.service";
import { invalidateCitizenDashboardCache } from "../../../redis-cache/citizen-dashboard-cache.service";

const PROFILE_UPDATE_DEBOUNCE_MS = 5000;

const getProfileUpdateJobOptions = (userId: string) => ({
  deduplication: {
    id: `profile-updated-${userId}`,
    ttl: PROFILE_UPDATE_DEBOUNCE_MS,
    extend: true,
    replace: true,
  },
});

/**
 * @description Updates an existing user profile and recalculates completion
 * @param {string} userId - Authenticated user ID
 * @param {any} updateData - Partial profile details to update
 * @returns {Promise<{ success: boolean; data: any; message: string }>}
 */
export const updateProfileService = async (userId: string, updateData: any) => {
  if (!userId) {
    throw new AppError("Unauthorized", 401);
  }

  const user = await userRepository.findUserById(userId);
  if (!user) {
    throw new AppError("User not found", 404);
  }

  let profile = await profileRepository.findProfileByUserId(userId);

  if (!profile) {
    // Create new profile if not found (Upsert)
    const { Profile } = await import("../../../entity/profile/profile.entity");
    const { ProfileId } = await import("../../../entity/profile/profileId");
    const { UserId } = await import("../../../entity/user/userId");

    profile = new Profile(
      new ProfileId("temp"),
      {
        userId: new UserId(userId),
        firstName: updateData.firstName || "User",
        middleName: updateData.middleName || "",
        lastName: updateData.lastName || "Pending",
        gender: updateData.gender || "OTHER",
        dateOfBirth: updateData.dateOfBirth
          ? new Date(updateData.dateOfBirth)
          : new Date(),
        mobileNumber: updateData.mobileNumber || "0000000000",
        country: updateData.country || "India",
        state: updateData.state || "Maharashtra", // Default state
        district: updateData.district || "Pending",
        taluka: updateData.taluka || "",
        village: updateData.village || "",
        pincode: updateData.pincode || "400001",
        areaType: updateData.areaType || "RURAL",
        annualIncome: Number(updateData.annualIncome) || 0,
        bplStatus: !!updateData.bplStatus,
        casteCategory: updateData.casteCategory || "general",
        religion: updateData.religion || "other",
        occupationType: updateData.occupationType || "other",
        employmentStatus: updateData.employmentStatus || "unemployed",
        accountHolderName: updateData.accountHolderName || "",
        accountNumber: updateData.accountNumber || "",
        bankName: updateData.bankName || "",
        branchName: updateData.branchName || "",
        ifscCode: updateData.ifscCode || "",
        accountType: updateData.accountType || "",
        ...updateData,
        profileCompletionPercentage: 0,
      },
      new Date(),
      new Date(),
    );

    profile.recalculateCompletion();
    const savedProfile = await profileRepository.createProfile({
      ...profile.getSnapshot(),
      userId: userId,
    });

    // Invalidate profile cache in Redis
    await invalidateProfileCache(userId);
    await invalidateCitizenDashboardCache(userId);

    // Queue background profile recommendation worker job
    try {
      await profileUpdateQueue.add(
        "profile-updated",
        {
          userId,
          updatedAt: new Date().toISOString(),
        },
        getProfileUpdateJobOptions(userId),
      );
    } catch (queueError) {
      console.error(
        "[Profile Service] Failed to queue profile recommendation job:",
        queueError,
      );
    }

    return {
      success: true,
      data: savedProfile.getSnapshot(),
      message: "Profile initialized and updated successfully",
    };
  }

  // Use entity's patch method for existing profiles
  profile.patch(updateData);

  const updatedProfile = await profileRepository.updateProfile(userId, profile);
  if (!updatedProfile) {
    throw new AppError("Failed to update profile", 500);
  }

  // Invalidate profile cache in Redis
  await invalidateProfileCache(userId);
  await invalidateCitizenDashboardCache(userId);

  // Queue background profile recommendation worker job
  try {
    await profileUpdateQueue.add(
      "profile-updated",
      {
        userId,
        updatedAt: new Date().toISOString(),
      },
      getProfileUpdateJobOptions(userId),
    );
  } catch (queueError) {
    console.error(
      "[Profile Service] Failed to queue profile recommendation job:",
      queueError,
    );
  }

  return {
    success: true,
    data: updatedProfile.getSnapshot(),
    message: "Profile updated successfully",
  };
};
