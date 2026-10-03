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
  { connection: queueConnection },
);
