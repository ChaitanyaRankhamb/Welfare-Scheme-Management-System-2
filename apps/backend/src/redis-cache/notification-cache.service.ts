import redisClient from "../config/redis.connection";
import { Notification } from "../entity/notification/notification.entity";
import dotenv from "dotenv";
dotenv.config();

const CACHE_TTL_SECONDS = Number(
  process.env.NOTIFICATION_CACHE_TTL_SECONDS || 7 * 24 * 3600, // Default to 7 days
);

const allNotificationsKey = (userId: string) => `notifications:${userId}:all`;
const unreadCountKey = (userId: string) =>
  `notifications:${userId}:unread-count`;

type CachedNotification = ReturnType<Notification["toJSON"]>;

const isRedisReady = () => redisClient.isReady;

export const getCachedNotifications = async (
  userId: string,
): Promise<CachedNotification[] | null> => {
  if (!isRedisReady()) return null;

  try {
    const value = await redisClient.get(allNotificationsKey(userId));
    return value ? (JSON.parse(value) as CachedNotification[]) : null;
  } catch (error) {
    console.error("Failed to read notifications from Redis:", error);
    return null;
  }
};

export const cacheNotifications = async (
  userId: string,
  notifications: Notification[],
): Promise<void> => {
  if (!isRedisReady()) return;

  try {
    await redisClient.set(
      allNotificationsKey(userId),
      JSON.stringify(
        notifications.map((notification) => notification.toJSON()),
      ),
      { EX: CACHE_TTL_SECONDS },
    );
  } catch (error) {
    console.error("Failed to cache notifications in Redis:", error);
  }
};

export const getCachedUnreadCount = async (
  userId: string,
): Promise<number | null> => {
  if (!isRedisReady()) return null;

  try {
    const value = await redisClient.get(unreadCountKey(userId));
    return value === null ? null : Number(value);
  } catch (error) {
    console.error(
      "Failed to read unread notification count from Redis:",
      error,
    );
    return null;
  }
};

export const cacheUnreadCount = async (
  userId: string,
  count: number,
): Promise<void> => {
  if (!isRedisReady()) return;

  try {
    await redisClient.set(unreadCountKey(userId), String(count), {
      EX: CACHE_TTL_SECONDS,
    });
  } catch (error) {
    console.error("Failed to cache unread notification count in Redis:", error);
  }
};

export const invalidateNotificationCache = async (
  userId: string,
): Promise<void> => {
  if (!isRedisReady()) return;

  try {
    await redisClient.del([
      allNotificationsKey(userId),
      unreadCountKey(userId),
    ]);
  } catch (error) {
    console.error("Failed to invalidate notification cache:", error);
  }
};
