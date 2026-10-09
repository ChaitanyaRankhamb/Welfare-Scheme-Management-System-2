import { Job, Worker } from "bullmq";
import { queueConnection } from "../../../config/bullmqQueue.config";
import { sendUserStatusUpdateNotification } from "./sendUserStatusUpdateNotification.service";
import { UserStatusUpdateJobData } from "./userStatusUpdate.queue";

export const userStatusUpdateWorker = new Worker<UserStatusUpdateJobData>(
  "user-status-update-notification-queue",
  async (job: Job<UserStatusUpdateJobData>) => {
    await sendUserStatusUpdateNotification(job.data);
  },
  {
    connection: queueConnection,
    concurrency: 5, // Adjust concurrency based on your system's capacity
    limiter: {
      // Limit this queue to 10 jobs per second; excess jobs wait in BullMQ.
      max: 10,
      duration: 1000,
    },
  },
);

userStatusUpdateWorker.on("active", (job) => {
  console.log(`[User Status Worker] Job ${job.id} is processing.`);
});

userStatusUpdateWorker.on("completed", (job) => {
  console.log(`[User Status Worker] Job ${job.id} completed successfully.`);
});

userStatusUpdateWorker.on("failed", (job, error) => {
  console.error(
    `[User Status Worker] Job ${job?.id} failed after ${job?.attemptsMade} attempts:`,
    error,
  );
});

userStatusUpdateWorker.on("stalled", (jobId) => {
  console.warn(
    `[User Status Worker] Job ${jobId} stalled and will be re-processed.`,
  );
});
