import { queueConnection } from "../../config/bullmqQueue.config";
import { Queue } from "bullmq";

export interface ProfileUpdateJobData {
  userId: string;
  updatedAt?: string;
}

export const profileUpdateQueue = new Queue<ProfileUpdateJobData>(
  "profile-update-queue",
  {
    connection: queueConnection,
    defaultJobOptions: {
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 2000,
      },
      removeOnComplete: { age: 86400, count: 1000 },
      removeOnFail: { age: 604800, count: 5000 },
    },
  },
);

profileUpdateQueue.on("error", (err) => {
  console.error("Profile Update Queue Connection Error:", err);
});
