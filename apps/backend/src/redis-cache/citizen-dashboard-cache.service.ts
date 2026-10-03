import redisClient from "../config/redis.connection";


const CACHE_TTL_SECONDS = Math.max(
  1,
  Number(process.env.CITIZEN_DASHBOARD_CACHE_TTL_SECONDS) || 7 * 24 * 60 * 60, // Default to 7 days
);

const dashboardCacheKey = (userId: string) =>
  `citizen-dashboard:${userId}:data`;

export const getCachedCitizenDashboardData = async <T>(
  userId: string,
): Promise<T | null> => {
  if (!redisClient.isReady) return null;

  try {
    const cached = await redisClient.get(dashboardCacheKey(userId));
    if (!cached) return null;

    return JSON.parse(cached) as T;
  } catch (error) {
    console.warn("[Redis] Failed to read citizen dashboard cache:", error);
    await invalidateCitizenDashboardCache(userId);
    return null;
  }
};

export const cacheCitizenDashboardData = async <T>(
  userId: string,
  data: T,
): Promise<void> => {
  if (!redisClient.isReady) return;

  try {
    await redisClient.set(dashboardCacheKey(userId), JSON.stringify(data), {
      EX: CACHE_TTL_SECONDS,
    });
  } catch (error) {
    console.warn("[Redis] Failed to write citizen dashboard cache:", error);
  }
};

export const invalidateCitizenDashboardCache = async (
  userId: string,
): Promise<void> => {
  if (!redisClient.isReady) return;

  try {
    await redisClient.del(dashboardCacheKey(userId));
  } catch (error) {
    console.warn(
      "[Redis] Failed to invalidate citizen dashboard cache:",
      error,
    );
  }
};

export const invalidateAllCitizenDashboardCaches = async (): Promise<void> => {
  if (!redisClient.isReady) return;

  try {
    let cursor = "0";
    do {
      const result = await redisClient.scan(cursor, {
        MATCH: "citizen-dashboard:*:data",
        COUNT: 100,
      });
      cursor = result.cursor;
      if (result.keys.length > 0) {
        await redisClient.del(result.keys);
      }
    } while (cursor !== "0");
  } catch (error) {
    console.warn(
      "[Redis] Failed to invalidate all citizen dashboard caches:",
      error,
    );
  }
};
