import { Job, Worker } from "bullmq";
import { queueConnection } from "../../config/bullmqQueue.config";
import { ProfileUpdateJobData } from "./profile.queue";
import { processProfileUpdateJob } from "./processProfileUpdate.service";

export const profileUpdateWorker = new Worker<ProfileUpdateJobData>(
  "profile-update-queue",
  async (job: Job<ProfileUpdateJobData>) => {
    try {
      console.log(
        `[Profile Worker] Picked up job ${job.id} for user ${job.data.userId}`,
      );
      await processProfileUpdateJob(job.data);
    } catch (error) {
      console.error(
        `[Profile Worker] Error processing profile update job for user ${job.data.userId}:`,
        error,
      );
      throw error;
    }
  },
  {
    connection: queueConnection,
    concurrency: 10, // Adjust concurrency based on your system's capacity
    // Limit this queue to 10 jobs per second; excess jobs wait in BullMQ.
    limiter: {
      max: 10,
      duration: 1000,
    },
  },
);

profileUpdateWorker.on("active", (job) => {
  console.log(`[Profile Worker] Job ${job.id} is processing.`);
});

profileUpdateWorker.on("completed", (job) => {
  console.log(`[Profile Worker] Job ${job.id} completed successfully.`);
});

profileUpdateWorker.on("failed", (job, error) => {
  console.error(
    `[Profile Worker] Job ${job?.id} failed after ${job?.attemptsMade} attempts:`,
    error,
  );
});

profileUpdateWorker.on("stalled", (jobId) => {
  console.warn(`[Profile Worker] Job ${jobId} stalled and will be re-processed.`);
});
