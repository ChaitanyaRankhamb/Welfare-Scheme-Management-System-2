import { userRepository } from "../../../database/repository/user.repository";
import { schemeRepository } from "../../../database/repository/scheme.repository";
import { novu } from "../../../config/novu.config";
import { notificationRepository } from "../../../database/repository/notification.repository";
import { UserId } from "../../../entity/user/userId";
import { SchemeId } from "../../../entity/schemes/schemeId";
import { UnrecoverableError } from "bullmq";
import { invalidateNotificationCache } from "../../../redis-cache/notification-cache.service";

export type SchemeNotification = {
  title: string;
  description: string;
  benefits: string[];
  requiredDocuments: string[];
  applicationUrl: string;
};

export const sendNotificationToCitizens = async (
  schemeId: SchemeId,
  userId: UserId,
) => {
  try {
    const scheme = await schemeRepository.findSchemeById(schemeId.toString());
    if (!scheme) {
      throw new UnrecoverableError(
        `Scheme ${schemeId} no longer exists, job terminated.`,
      );
    }

    const user = await userRepository.findUserById(userId.toString());
    if (!user) {
      throw new UnrecoverableError(
        `User ${userId} no longer exists, job terminated.`,
      );
    }

    if (!user.getEmail()) {
      throw new UnrecoverableError(
        `User ${userId} does not have a valid email address, job terminated.`,
      );
    }

    const applicationUrl = scheme.getApplicationUrl() || "";

    const notification: SchemeNotification = {
      title: scheme.getTitle(),
      description: scheme.getDescription(),
      benefits: scheme.getBenefits(),
      requiredDocuments: scheme.getDocumentsRequired(),
      applicationUrl,
    };

    const workflowId =
      process.env.NOVU_SCHEME_PUBLISHED_WORKFLOW_ID || "scheme-published";
    let notificationRecord =
      await notificationRepository.findNotificationByUserAndScheme(
        user.id.toString(),
        scheme.id.toString(),
        "scheme_match",
      );

    if (!notificationRecord) {
      console.log(
        `Creating new notification record for user ${userId} and scheme ${schemeId}`,
      );
      notificationRecord = await notificationRepository.createNotification({
        userId: user.id.toString(),
        schemeId: scheme.id.toString(),
        type: "scheme_match",
        title: `New welfare scheme: ${notification.title}`,
        message:
          "A new welfare scheme matching your profile has been published.",
        data: {
          ...notification,
          username: user.getUsername() || "Citizen",
        },
        workflowId,
      });
      // Invalidate the cache for this user since a new notification has been created
      await invalidateNotificationCache(user.id.toString());
    }

    try {
      if (!novu) {
        notificationRecord.markFailed();
        await notificationRepository.updateNotification(
          notificationRecord.id.toString(),
          notificationRecord,
        );
        throw new UnrecoverableError(
          "Novu is not configured; scheme notification cannot be delivered.",
        );
      }

      const subscriberId = user.id.toString();
      await novu.trigger({
        workflowId,
        to: {
          subscriberId,
          email: user.getEmail(),
          firstName: user.getUsername() || "Citizen",
        },
        payload: {
          ...notification,
          username: user.getUsername() || "Citizen",
        },
      });
      console.log(
        `[Novu] Scheme notification workflow triggered for user ${subscriberId}`,
      );
      notificationRecord.markSent();
      await notificationRepository.updateNotification(
        notificationRecord.id.toString(),
        notificationRecord,
      );
    } catch (providerError: any) {
      if (notificationRecord.getStatus() !== "failed") {
        notificationRecord.markFailed();
        await notificationRepository.updateNotification(
          notificationRecord.id.toString(),
          notificationRecord,
        );
      }
      // 1. Permanent Errors (HTTP 4xx status like 400 Bad Request, invalid recipient format, blocked address):
      //    Throw UnrecoverableError so BullMQ does NOT retry endlessly.
      const status = providerError?.status || providerError?.statusCode;
      if (status >= 400 && status < 500 && status !== 429) {
        console.error(
          `[Notification] Permanent failure sending to user ${userId}:`,
          providerError,
        );
        throw new UnrecoverableError(
          `Permanent notification delivery error for user ${userId}: ${providerError.message || providerError}`,
        );
      }

      // 2. Transient Errors (HTTP 429 Rate Limit, HTTP 5xx Server Outage, Network Timeout):
      //    Re-throw normal error so BullMQ triggers automated backoff retries.
      console.error(
        `[Notification] Transient error sending to user ${userId}, queuing retry:`,
        providerError,
      );
      throw providerError;
    }
  } catch (error) {
    console.error("Error sending notification to citizen:", error);
    throw error; // Rethrow to let BullMQ handle according to UnrecoverableError or retry settings
  }
};
