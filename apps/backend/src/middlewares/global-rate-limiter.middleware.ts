import rateLimit from "express-rate-limit";
import RedisStore from "rate-limit-redis";
import redisClient from "../config/redis.connection";
import dotenv from "dotenv";

dotenv.config();

const MAX_REQUESTS = parseInt(process.env.MAX_REQUESTS || "100", 10);
const WINDOW_MS = parseInt(process.env.WINDOW_MS || "60000", 10);

/**
 * Global Redis-backed Rate Limiter Middleware.
 * Works across multiple Express server instances in a distributed system setup.
 */
export const globalRateLimiter = rateLimit({
  windowMs: WINDOW_MS,
  max: MAX_REQUESTS,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests. Please try again later.",
  },
  store: new RedisStore({
    sendCommand: (...args: string[]) => redisClient.sendCommand(args),
  }),
});
