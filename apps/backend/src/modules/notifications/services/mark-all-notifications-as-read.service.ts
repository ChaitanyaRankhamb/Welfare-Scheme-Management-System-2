import { notificationRepository } from "../../../database/repository/notification.repository";
import { userRepository } from "../../../database/repository/user.repository";
import { AppError } from "../../../reuse-components/AppError";
import { invalidateNotificationCache } from "../../../redis-cache/notification-cache.service";

export const markAllNotificationsAsReadService = async (userId: string) => {
  const user = await userRepository.findUserById(userId);

  if (!user) throw new AppError("User not found", 404);

  // what happens when 10000 users clicks on mark all as read. All user should see changes in while. We should not use workers for it.

  const updatedCount =
    await notificationRepository.markAllAsReadByUserId(userId);
  await invalidateNotificationCache(userId);

  return {
    success: true,
    data: { updatedCount },
    message: "All notifications marked as read",
  };
};
