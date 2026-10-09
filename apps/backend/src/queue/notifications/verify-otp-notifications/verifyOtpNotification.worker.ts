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
    {
      connection: queueConnection,
      concurrency: 5, // Adjust concurrency based on your system's capacity
      // Limit this queue to 10 jobs per second; excess jobs wait in BullMQ.
      limiter: {
        max: 10,
        duration: 1000,
      },
    },
  );

verifyOtpNotificationWorker.on("active", (job) => {
  console.log(`[Verify OTP Worker] Job ${job.id} is processing.`);
});

verifyOtpNotificationWorker.on("completed", (job) => {
  console.log(`[Verify OTP Worker] Job ${job.id} completed successfully.`);
});

verifyOtpNotificationWorker.on("failed", (job, error) => {
  console.error(
    `[Verify OTP Worker] Job ${job?.id} failed after ${job?.attemptsMade} attempts:`,
    error,
  );
});

verifyOtpNotificationWorker.on("stalled", (jobId) => {
  console.warn(
    `[Verify OTP Worker] Job ${jobId} stalled and will be re-processed.`,
  );
});
