import dotenv from "dotenv";
dotenv.config({
  path: process.env.NODE_ENV === "production" ? ".env.production" : ".env",
});

import connectDB from "./config/mongodb.connection";
import { redisConnection } from "./config/redis.connection";
import { eligibilityWorker } from "./queue/eligibility/eligibility.worker";
import { sendNotificationWorker } from "./queue/notifications/scheme-notifications/notification.worker";
import { userStatusUpdateWorker } from "./queue/notifications/user-status-notifications/userStatusUpdate.worker";
import { profileUpdateWorker } from "./queue/profile/profile.worker";
import { verifyOtpNotificationWorker } from "./queue/notifications/verify-otp-notifications/verifyOtpNotification.worker";
import { createQueueEventMonitors } from "./queue/queue-events.monitor";

let isShuttingDown = false;
let queueEventMonitors: Awaited<
  ReturnType<typeof createQueueEventMonitors>
> = [];

const shutdownWorkers = async (reason: string, exitCode = 0) => {
  if (isShuttingDown) return;
  isShuttingDown = true;

  console.log(`${reason}: shutting down queue workers...`);

  const closeResults = await Promise.allSettled([
    eligibilityWorker.close(),
    sendNotificationWorker.close(),
    userStatusUpdateWorker.close(),
    profileUpdateWorker.close(),
    verifyOtpNotificationWorker.close(),
    ...queueEventMonitors.map((queueEvents) => queueEvents.close()),
  ]);

  closeResults.forEach((result) => {
    if (result.status === "rejected") {
      console.error("Failed to close a queue worker:", result.reason);
      exitCode = 1;
    }
  });

  console.log("Queue workers shut down.");
  process.exit(exitCode);
};

// Fatal process errors are logged and workers are closed before the process exits.
process.on("uncaughtException", (error) => {
  console.error("Uncaught exception:", error);
  void shutdownWorkers("Uncaught exception", 1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled rejection:", { promise, reason });
  void shutdownWorkers("Unhandled rejection", 1);
});

const startWorkers = async () => {
  try {
    await connectDB();
    console.log("Database connected for Queue Workers");
    await redisConnection();
    console.log("Redis connected for Queue Workers");

    // QueueEvents report state changes for jobs across all workers on each queue.
    queueEventMonitors = await createQueueEventMonitors();

    console.log(
      `[Worker Process] Eligibility Worker listening on queue: ${eligibilityWorker.name}`,
    );
    console.log(
      `[Worker Process] Notification Worker listening on queue: ${sendNotificationWorker.name}`,
    );
    console.log(
      `[Worker Process] User Status Update Worker listening on queue: ${userStatusUpdateWorker.name}`,
    );
    console.log(
      `[Worker Process] Profile Update Worker listening on queue: ${profileUpdateWorker.name}`,
    );
    console.log(
      `[Worker Process] Verify OTP Notification Worker listening on queue: ${verifyOtpNotificationWorker.name}`,
    );

    // will receive SIGINT when you press Ctrl+C in the terminal and SIGTERM when the process is terminated through docker or other means
    process.on("SIGINT", () => void shutdownWorkers("SIGINT"));
    process.on("SIGTERM", () => void shutdownWorkers("SIGTERM"));
  } catch (error) {
    console.error("Failed to start worker process:", error);
    process.exit(1);
  }
};

startWorkers();
