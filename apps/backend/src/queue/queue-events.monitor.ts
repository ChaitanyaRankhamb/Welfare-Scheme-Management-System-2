import { QueueEvents } from "bullmq";
import { queueConnection } from "../config/bullmqQueue.config";

const QUEUE_NAMES = [
  "eligibility-queue",
  "notification-queue",
  "user-status-update-notification-queue",
  "profile-update-queue",
  "verify-otp-notification-queue",
];

const logJobEvent = (
  queueName: string,
  jobId: string,
  state: string,
  details = "",
) => {
  console.log(
    `[${new Date().toISOString()}] [Queue: ${queueName}] Job ${jobId} ${state}${details}`,
  );
};

/**
 * Listen for queue-wide job state changes so events are visible across workers.
 */
export const createQueueEventMonitors = async () => {
  const monitors = QUEUE_NAMES.map((queueName) => {
    const queueEvents = new QueueEvents(queueName, {
      connection: queueConnection,
    });

    queueEvents.on("added", ({ jobId, name }) => {
      logJobEvent(queueName, jobId, `(${name}) was added.`);
    });

    queueEvents.on("waiting", ({ jobId }) => {
      logJobEvent(queueName, jobId, "is waiting.");
    });

    queueEvents.on("active", ({ jobId }) => {
      logJobEvent(queueName, jobId, "is processing.");
    });

    queueEvents.on("delayed", ({ jobId, delay }) => {
      logJobEvent(
        queueName,
        jobId,
        `is delayed until ${new Date(delay).toISOString()}.`,
      );
    });

    queueEvents.on("progress", ({ jobId, data }) => {
      logJobEvent(
        queueName,
        jobId,
        "reported progress:",
        ` ${JSON.stringify(data)}`,
      );
    });

    queueEvents.on("completed", ({ jobId }) => {
      logJobEvent(queueName, jobId, "completed successfully.");
    });

    queueEvents.on("failed", ({ jobId, failedReason }) => {
      console.error(
        `[${new Date().toISOString()}] [Queue: ${queueName}] Job ${jobId} failed: ${failedReason}`,
      );
    });

    queueEvents.on("stalled", ({ jobId }) => {
      logJobEvent(queueName, jobId, "stalled and may be retried.");
    });

    queueEvents.on("error", (error) => {
      console.error(
        `[${new Date().toISOString()}] [Queue: ${queueName}] Event monitor error:`,
        error,
      );
    });

    return queueEvents;
  });

  await Promise.all(monitors.map((monitor) => monitor.waitUntilReady()));
  return monitors;
};
