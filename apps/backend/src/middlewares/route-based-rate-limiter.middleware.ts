import rateLimit from "express-rate-limit";
import RedisStore from "rate-limit-redis";
import redisClient from "../config/redis.connection";

export type RouteRateLimiterConfig = {
  max: number;
  windowMs?: number;
  message?: string;
  prefix?: string;
};

/**
 * Route-Based Redis Rate Limiter Middleware Factory.
 * Simply pass the max request count (and optional windowMs or config object) from any route definition.
 */
export const routeBasedRateLimiter = (
  maxOrConfig: number | RouteRateLimiterConfig,
  windowMs: number = 60 * 1000,
  prefix?: string,
) => {
  let max: number;
  let duration: number;
  let customPrefix: string;
  let message: string;

  if (typeof maxOrConfig === "number") {
    max = maxOrConfig;
    duration = windowMs;
    customPrefix = prefix || `rl:route:${max}-${duration}:`;
    message = `Too many requests for this endpoint. Please try again later.`;
  } else {
    max = maxOrConfig.max;
    duration = maxOrConfig.windowMs ?? 60 * 1000;
    customPrefix = maxOrConfig.prefix || `rl:route:${max}-${duration}:`;
    message =
      maxOrConfig.message ||
      `Too many requests for this endpoint. Please try again later.`;
  }

  return rateLimit({
    windowMs: duration,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      success: false,
      message,
    },
    store: new RedisStore({
      prefix: customPrefix,
      sendCommand: (...args: string[]) => redisClient.sendCommand(args),
    }),
  });
};
