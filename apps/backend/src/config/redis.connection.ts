import dotenv from 'dotenv';
import { createClient } from "redis";
import { queueConnection } from "./bullmqQueue.config";

dotenv.config({
  path: process.env.NODE_ENV === "production" ? ".env.production" : ".env",
});

const redisUrl =
  process.env.REDIS_URI || `redis://${queueConnection.host}:${queueConnection.port}`;

const redisClient = createClient({
  url: redisUrl,
  ...(queueConnection.password && { password: queueConnection.password }),
});

redisClient.on("error", (err: Error) =>
  console.log("Redis Client Error", err),
);

export const redisConnection = async () => {
  if (!redisClient.isOpen) {
    await redisClient.connect();
    console.log(`Redis connected successfully to ${queueConnection.host}:${queueConnection.port}`);
  }
};

export default redisClient;