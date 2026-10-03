import { Queue } from "bullmq";
import { queueConnection } from "../../../config/bullmqQueue.config";

export interface VerifyOtpNotificationJobData {
  userId: string;
}

export const verifyOtpNotificationQueue =
  new Queue<VerifyOtpNotificationJobData>("verify-otp-notification-queue", {
    connection: queueConnection,
    defaultJobOptions: {
      attempts: 5,
      backoff: {
        type: "exponential",
        delay: 3000,
      },
      removeOnComplete: { age: 86400, count: 1000 },
      removeOnFail: { age: 604800, count: 5000 },
    },
  });

verifyOtpNotificationQueue.on("error", (error) => {
  console.error("Verify OTP Notification Queue Connection Error:", error);
});
