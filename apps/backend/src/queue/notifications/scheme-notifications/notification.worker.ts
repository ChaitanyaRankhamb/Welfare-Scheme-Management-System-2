import { Worker, Job } from "bullmq";
import { Scheme } from "../../../entity/schemes/scheme.entity";
import { UserId, } from "../../../entity/user/userId";
import { queueConnection } from "../../../config/bullmqQueue.config";
import { sendNotificationToCitizens } from "./sendNotificationToCitizen.service";
import { SchemeId } from "../../../entity/schemes/schemeId";


export type sendNotificationJoBData = {
  schemeId: SchemeId;
  userId: UserId;
};

export const sendNotificationWorker = new Worker<sendNotificationJoBData>(
  "notification-queue",
  async (job: Job<sendNotificationJoBData>) => {
    try {
      const { schemeId, userId } = job.data;
      console.log(`Processing notification job for scheme ${schemeId.toString()} and user ${userId.toString()}`);
      await sendNotificationToCitizens(schemeId, userId);
    } catch (error) {
      console.error("Error processing notification job:", error);
      throw error; // Rethrow the error to let BullMQ handle retries if configured
    }
  },
  { connection: queueConnection },
);