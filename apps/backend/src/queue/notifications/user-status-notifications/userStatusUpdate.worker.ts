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
