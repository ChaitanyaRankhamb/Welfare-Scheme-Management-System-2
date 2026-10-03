import redisClient from "../config/redis.connection";

const CACHE_TTL_SECONDS = Number(process.env.PROFILE_CACHE_TTL_SECONDS || 3600);

const profileCacheKey = (userId: string) => `profile:${userId}:data`;
const uploadedDocumentsKey = (userId: string) =>
  `profile:${userId}:uploaded-documents`;

const isRedisReady = () => redisClient.isReady;

// ─── 1. PROFILE CACHE FUNCTIONS ──────────────────────────────────────────────

export const getCachedProfile = async (userId: string): Promise<any | null> => {
  if (!isRedisReady()) return null;

  try {
    const value = await redisClient.get(profileCacheKey(userId));
    return value ? JSON.parse(value) : null;
  } catch (error) {
    console.error("Failed to read profile from Redis:", error);
    return null;
  }
};

export const cacheProfile = async (
  userId: string,
  profileData: any,
): Promise<void> => {
  if (!isRedisReady()) return;

  try {
    await redisClient.set(
      profileCacheKey(userId),
      JSON.stringify(profileData),
      { EX: CACHE_TTL_SECONDS },
    );
  } catch (error) {
    console.error("Failed to cache profile in Redis:", error);
  }
};

export const invalidateProfileCache = async (userId: string): Promise<void> => {
  if (!isRedisReady()) return;

  try {
    await redisClient.del(profileCacheKey(userId));
  } catch (error) {
    console.error("Failed to invalidate profile cache:", error);
  }
};

// ─── 2. DOCUMENT CACHE FUNCTIONS ─────────────────────────────────────────────

export const getCachedDocuments = async (
  userId: string,
): Promise<any[] | null> => {
  if (!isRedisReady()) return null;

  try {
    const value = await redisClient.get(uploadedDocumentsKey(userId));
    return value ? (JSON.parse(value) as any[]) : null;
  } catch (error) {
    console.error("Failed to read documents from Redis:", error);
    return null;
  }
};

export const cacheDocuments = async (
  userId: string,
  documents: any[],
): Promise<void> => {
  if (!isRedisReady()) return;

  try {
    await redisClient.set(
      uploadedDocumentsKey(userId),
      JSON.stringify(documents),
      { EX: CACHE_TTL_SECONDS },
    );
  } catch (error) {
    console.error("Failed to cache documents in Redis:", error);
  }
};

export const invalidateDocumentsCache = async (
  userId: string,
): Promise<void> => {
  if (!isRedisReady()) return;

  try {
    await redisClient.del(uploadedDocumentsKey(userId));
  } catch (error) {
    console.error("Failed to invalidate documents cache:", error);
  }
};

// ─── 3. COMBINED CACHE INVALIDATION ──────────────────────────────────────────

export const invalidateAllProfileAndDocumentCache = async (
  userId: string,
): Promise<void> => {
  if (!isRedisReady()) return;

  try {
    await redisClient.del([
      profileCacheKey(userId),
      uploadedDocumentsKey(userId),
    ]);
  } catch (error) {
    console.error(
      "Failed to invalidate all profile and document cache:",
      error,
    );
  }
};
