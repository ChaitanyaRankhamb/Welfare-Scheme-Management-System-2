import { notificationRepository } from "../../../database/repository/notification.repository";
import { userRepository } from "../../../database/repository/user.repository";
import { AppError } from "../../../reuse-components/AppError";
import { invalidateNotificationCache } from "../../../redis-cache/notification-cache.service";

export const markNotificationAsReadService = async (
  notificationId: string,
  userId: string,
) => {
  const user = await userRepository.findUserById(userId);

  if (!user) throw new AppError("User not found", 404);

  const notification =
    await notificationRepository.findNotificationByIdAndUserId(
      notificationId,
      userId,
    );
  if (!notification) throw new AppError("Notification not found", 404);

  notification.markRead();

  const updated = await notificationRepository.updateNotification(
    notificationId,
    notification,
  );
  await invalidateNotificationCache(userId);

  return {
    success: true,
    data: updated,
    message: "Notification marked as read",
  };
};
