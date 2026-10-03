import { queueConnection } from "../../config/bullmqQueue.config";
import { Queue } from "bullmq";

export const eligibilityQueue = new Queue("eligibility-queue", {
  connection: queueConnection,
  defaultJobOptions: {
    attempts: 5,
    backoff: {
      type: "exponential",
      delay: 3000, // Retry after 3s, 6s, 12s, 24s...
    },
    removeOnComplete: { age: 86400, count: 1000 }, // Clean up completed jobs
    removeOnFail: { age: 604800, count: 5000 }, // Keep failed jobs for auditing
  },
});

eligibilityQueue.on("error", (err) => {
  console.error("Eligibility Queue Connection Error:", err);
});
