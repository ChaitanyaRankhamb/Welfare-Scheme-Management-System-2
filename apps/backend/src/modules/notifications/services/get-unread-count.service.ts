import { notificationRepository } from "../../../database/repository/notification.repository";
import { userRepository } from "../../../database/repository/user.repository";
import { AppError } from "../../../reuse-components/AppError";
import {
  cacheUnreadCount,
  getCachedUnreadCount,
} from "../../../redis-cache/notification-cache.service";

export const getUnreadNotificationCountService = async (userId: string) => {
  const user = await userRepository.findUserById(userId);

  if (!user) throw new AppError("User not found", 404);

  const cachedUnreadCount = await getCachedUnreadCount(userId);
  const unreadCount =
    cachedUnreadCount ??
    (await notificationRepository.countUnreadByUserId(userId));

  if (cachedUnreadCount === null) {
    await cacheUnreadCount(userId, unreadCount);
  }

  if (unreadCount === null) {
    throw new AppError("Failed to fetch unread notification count", 500);
  }

  return {
    success: true,
    data: { count: unreadCount },
    message: "Unread notification count fetched successfully",
  };
};
