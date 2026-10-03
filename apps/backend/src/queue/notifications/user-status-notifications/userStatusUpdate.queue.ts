import { Queue } from "bullmq";
import { queueConnection } from "../../../config/bullmqQueue.config";

export type UserStatusUpdateJobData = {
  userId: string;
  isActive: boolean;
};

export const userStatusUpdateQueue = new Queue<UserStatusUpdateJobData>(
  "user-status-update-notification-queue",
  {
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
  },
);

userStatusUpdateQueue.on("error", (error) => {
  console.error("User Status Notification Queue Connection Error:", error);
});
