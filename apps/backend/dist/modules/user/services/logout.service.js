"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logoutService = void 0;
const user_repository_1 = require("../../../database/repository/user.repository");
const redis_connection_1 = __importDefault(require("../../../config/redis.connection"));
/**
 * Handles user logout logic
 * 1. Clears the refresh token from Redis
 */
const logoutService = async (userId) => {
    const user = await user_repository_1.userRepository.findUserById(userId);
    if (user) {
        // CLEAR REFRESH TOKEN FROM REDIs
        await redis_connection_1.default.del(`refresh:${user.id}`);
    }
};
exports.logoutService = logoutService;
