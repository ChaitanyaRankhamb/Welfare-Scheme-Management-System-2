import { Job, Worker } from "bullmq";
import { queueConnection } from "../../../config/bullmqQueue.config";
import { sendUserStatusUpdateNotification } from "./sendUserStatusUpdateNotification.service";
import { UserStatusUpdateJobData } from "./userStatusUpdate.queue";

export const userStatusUpdateWorker = new Worker<UserStatusUpdateJobData>(
  "user-status-update-notification-queue",
  async (job: Job<UserStatusUpdateJobData>) => {
    await sendUserStatusUpdateNotification(job.data);
  },
  { connection: queueConnection },
);