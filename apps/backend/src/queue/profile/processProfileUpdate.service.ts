import { UserId } from "../../entity/user/userId";
import { getUserProfileData } from "../../modules/citizenDashboardData/profile.service";
import { recommendSchemesService } from "../../modules/citizenDashboardData/recommend-schemes.service";
import { invalidateCitizenDashboardCache } from "../../redis-cache/citizen-dashboard-cache.service";
import { invalidateNotificationCache } from "../../redis-cache/notification-cache.service";
import { ProfileUpdateJobData } from "./profile.queue";

export const processProfileUpdateJob = async ({
  userId,
}: ProfileUpdateJobData) => {
  console.log(
    `[Profile Worker] Processing profile update & scheme recommendation for user: ${userId}`,
  );

  const userUserId = new UserId(userId);
  const profileData = await getUserProfileData(userUserId);

  if (!profileData) {
    console.log(
      `[Profile Worker] No completed profile data found for user ${userId}. Skipping recommendation.`,
    );
    return;
  }

  // Calculate new scheme recommendations based on updated profile
  const { recommendations, filteredSchemes } =
    await recommendSchemesService.getRecommendations(profileData, userUserId);

  console.log(
    `[Profile Worker] Successfully recalculated recommendations for user ${userId}: ${recommendations.length} recommended out of ${filteredSchemes.length} filtered schemes.`,
  );

  // Invalidate Redis caches so citizen dashboard immediately displays fresh recommendations
  await invalidateNotificationCache(userId);
  await invalidateCitizenDashboardCache(userId);
};
