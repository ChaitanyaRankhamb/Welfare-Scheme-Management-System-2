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

const startWorkers = async () => {
  try {
    await connectDB();
    console.log("Database connected for Queue Workers");
    await redisConnection();
    console.log("Redis connected for Queue Workers");

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

    const gracefulShutdown = async (signal: string) => {
      console.log(
        `Received ${signal}. Shutting down queue workers gracefully...`,
      );
      await Promise.all([
        eligibilityWorker.close(),
        sendNotificationWorker.close(),
        userStatusUpdateWorker.close(),
        profileUpdateWorker.close(),
        verifyOtpNotificationWorker.close(),
      ]);
      console.log("Queue workers shut down successfully.");
      process.exit(0);
    };

    // will receive SIGINT when you press Ctrl+C in the terminal and SIGTERM when the process is terminated through docker or other means
    process.on("SIGINT", () => gracefulShutdown("SIGINT"));
    process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
  } catch (error) {
    console.error("Failed to start worker process:", error);
    process.exit(1);
  }
};

startWorkers();
