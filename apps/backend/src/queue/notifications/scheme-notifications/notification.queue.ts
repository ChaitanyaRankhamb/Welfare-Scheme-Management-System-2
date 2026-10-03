import { Queue } from "bullmq";
import { queueConnection } from "../../../config/bullmqQueue.config";

export const sendNotificationQueue = new Queue("notification-queue", {
  connection: queueConnection,
  defaultJobOptions: {
    attempts: 5,
    backoff: {
      type: "exponential",
      delay: 3000,
    },
    removeOnComplete: { age: 86400, count: 1000 }, // Clean up completed jobs
    removeOnFail: { age: 604800, count: 5000 }, // Keep failed jobs for auditing
  },
});

sendNotificationQueue.on("error", (err) => {
  console.error("Notification Queue Connection Error:", err);
});
