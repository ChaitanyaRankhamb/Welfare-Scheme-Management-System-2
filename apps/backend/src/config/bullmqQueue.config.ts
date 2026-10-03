import { RedisOptions } from "bullmq";
import dotenv from "dotenv";

dotenv.config({
  path: process.env.NODE_ENV === "production" ? ".env.production" : ".env",
});

let redisHost = process.env.REDIS_HOST || "localhost";
let redisPort = parseInt(process.env.REDIS_PORT || "6385");
let redisPassword = process.env.REDIS_PASSWORD || undefined;

if (process.env.REDIS_URI) {
  try {
    const parsed = new URL(process.env.REDIS_URI);
    redisHost = parsed.hostname || redisHost;
    redisPort = parsed.port ? parseInt(parsed.port) : redisPort;
    if (parsed.password) {
      redisPassword = parsed.password;
    }
  } catch (e) {
    console.warn("[BullMQ Config] Invalid REDIS_URI provided, using REDIS_HOST/REDIS_PORT.");
  }
}

export const queueConnection: RedisOptions = {
  host: redisHost,
  port: redisPort,
  password: redisPassword,
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
};
