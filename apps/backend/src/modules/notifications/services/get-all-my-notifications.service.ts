import { notificationRepository } from "../../../database/repository/notification.repository";
import { userRepository } from "../../../database/repository/user.repository";
import { AppError } from "../../../reuse-components/AppError";
import {
  cacheNotifications,
  getCachedNotifications,
} from "../../../redis-cache/notification-cache.service";

export const getAllMyNotificationsService = async (userId: string) => {
  const user = await userRepository.findUserById(userId);

  if (!user) throw new AppError("User not found", 404);

  const cachedNotifications = await getCachedNotifications(userId);
  if (cachedNotifications) {
    return {
      success: true,
      data: { items: cachedNotifications },
      message: "All notifications fetched successfully",
    };
  }

  const notifications =
    await notificationRepository.findAllNotificationsByUserId(userId);
  await cacheNotifications(userId, notifications);

  return {
    success: true,
    data: {
      items: notifications,
    },
    message: "All notifications fetched successfully",
  };
};
