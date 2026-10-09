import { Scheme } from "../../entity/schemes/scheme.entity";
import { Job, Worker } from "bullmq";
import { queueConnection } from "../../config/bullmqQueue.config";
import { getEligibleCitizens } from "./getEligibleCitizen.service";
import { SchemeId } from "../../entity/schemes/schemeId";

export type eligibilityJobData = {
  schemeId: SchemeId;
};

export const eligibilityWorker = new Worker<eligibilityJobData>(
  "eligibility-queue",
  async (job: Job<eligibilityJobData>) => {
    try {
      const { schemeId } = job.data;
      console.log(
        `Processing eligibility job for scheme ${schemeId.toString()}`,
      );
      await getEligibleCitizens(schemeId);
    } catch (error) {
      console.error("Error processing eligibility job:", error);
      throw error; // Rethrow the error to let BullMQ handle retries if configured
    }
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

eligibilityWorker.on("active", (job) => {
  console.log(`[Eligibility Worker] Job ${job.id} is processing.`);
});

eligibilityWorker.on("completed", (job) => {
  console.log(`[Eligibility Worker] Job ${job.id} completed successfully.`);
});

eligibilityWorker.on("failed", (job, error) => {
  console.error(
    `[Eligibility Worker] Job ${job?.id} failed after ${job?.attemptsMade} attempts:`,
    error,
  );
});

eligibilityWorker.on("stalled", (jobId) => {
  console.warn(
    `[Eligibility Worker] Job ${jobId} stalled and will be re-processed.`,
  );
});
