import { userRepository } from "../../../database/repository/user.repository";
import redisClient from "../../../config/redis.connection";

/**
 * Handles user logout logic
 * 1. Clears the refresh token from Redis
 */
export const logoutService = async (userId: string) => {
  const user = await userRepository.findUserById(userId);
  if (user) {
    // CLEAR REFRESH TOKEN FROM REDIs
    await redisClient.del(`refresh:${user.id}`);
  }
};
