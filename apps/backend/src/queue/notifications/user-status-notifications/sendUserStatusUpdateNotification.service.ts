import { UnrecoverableError } from "bullmq";
import { novu } from "../../../config/novu.config";
import { userRepository } from "../../../database/repository/user.repository";
import { notificationRepository } from "../../../database/repository/notification.repository";
import { invalidateNotificationCache } from "../../../redis-cache/notification-cache.service";
import { UserStatusUpdateJobData } from "./userStatusUpdate.queue";

export const sendUserStatusUpdateNotification = async ({
  userId,
  isActive,
}: UserStatusUpdateJobData) => {
  const user = await userRepository.findUserById(userId);
  if (!user) {
    throw new UnrecoverableError(
      `User ${userId} no longer exists; status email cannot be sent.`,
    );
  }

  const status = isActive ? "activated" : "deactivated";
  const username = user.getUsername() || "Citizen";
  const workflowId = isActive
    ? process.env.NOVU_USER_ACTIVATED_WORKFLOW_ID || "user-activation"
    : process.env.NOVU_USER_DEACTIVATED_WORKFLOW_ID || "user-deactivation";

  const title = isActive ? "Account Activated" : "Account Deactivated";
  const message = isActive
    ? "Your account has been activated by an administrator. You can now sign in and access available welfare schemes."
    : "Your account has been deactivated by an administrator. You can no longer access services until reactivated.";

  // 1. Save Notification Record to Database for Dashboard Display
  try {
    await notificationRepository.createNotification({
      userId: user.id.toString(),
      type: "user_status",
      title,
      message,
      data: {
        title,
        description: message,
        username,
        isActive,
        status,
      },
      workflowId,
      status: "sent",
    });
    console.log(
      `[Database] Saved user_status notification record for user ${userId} (${status}).`,
    );
  } catch (dbError) {
    console.error(
      `[Database] Failed to save user_status notification for user ${userId}:`,
      dbError,
    );
  }

  // 2. Redis Cache Invalidation: Refresh unread count & notification cache for user's dashboard
  try {
    await invalidateNotificationCache(user.id.toString());
    console.log(`[Redis] Invalidated notification cache for user ${userId}.`);
  } catch (redisError) {
    console.error(
      `[Redis] Failed to invalidate notification cache for user ${userId}:`,
      redisError,
    );
  }

  // 3. Deliver External Email/Push Notification via Novu if configured
  if (!user.getEmail() || !novu) {
    console.warn(
      `[Novu] Novu or user email not present for ${userId}. Dashboard notification created; external delivery skipped.`,
    );
    return;
  }

  try {
    await novu.trigger({
      workflowId,
      to: {
        subscriberId: user.id.toString(),
        email: user.getEmail(),
        firstName: username,
      },
      payload: {
        username,
        isActive,
        status,
        heading: isActive
          ? "Your account is active"
          : "Your account is inactive",
        message,
      },
    });
    console.log(
      `[Novu] User status workflow triggered for user ${userId} (${status}).`,
    );
  } catch (error: any) {
    const statusCode = error?.status || error?.statusCode;
    if (statusCode >= 400 && statusCode < 500 && statusCode !== 429) {
      throw new UnrecoverableError(
        `Permanent Novu delivery error for user ${userId}: ${error.message || error}`,
      );
    }
    throw error;
  }
};
