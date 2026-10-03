import { Job, Worker } from "bullmq";
import { queueConnection } from "../../../config/bullmqQueue.config";
import { sendVerifyOtpNotification } from "./sendVerifyOtpNotification.service";
import { VerifyOtpNotificationJobData } from "./verifyOtpNotification.queue";

export const verifyOtpNotificationWorker =
  new Worker<VerifyOtpNotificationJobData>(
    "verify-otp-notification-queue",
    async (job: Job<VerifyOtpNotificationJobData>) => {
      await sendVerifyOtpNotification(job.data);
    },
    { connection: queueConnection },
  );
