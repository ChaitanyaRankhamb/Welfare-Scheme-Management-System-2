"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshService = void 0;
const user_repository_1 = require("../../../database/repository/user.repository");
const appError_1 = require("../../../Error/appError");
const jwt_utils_1 = require("../../../utils/jwt.utils");
const redis_connection_1 = __importDefault(require("../../../config/redis.connection"));
/**
 * Handles token refresh logic
 * 1. Verifies the provided refresh token
 * 2. Checks if it matches the one in Redis
 * 3. Generates new tokens and updates Redis
 */
const refreshService = async (refreshToken) => {
    try {
        // VERIFY REFRESH TOKEN
        const decoded = (0, jwt_utils_1.verifyRefreshToken)(refreshToken);
        const user = await user_repository_1.userRepository.findUserById(decoded.userId);
        // CHECK IF TOKEN EXISTS IN REDIS AND MATCHES
        const storedToken = await redis_connection_1.default.get(`refresh:${decoded.userId}`);
        if (!user || storedToken !== refreshToken) {
            throw new appError_1.AppError("Invalid or expired refresh token", 401);
        }
        // GENERATE NEW TOKENS
        const accessToken = (0, jwt_utils_1.generateAccessToken)({
            userId: user.id.toString(),
            email: user.getEmail(),
        });
        const newRefreshToken = (0, jwt_utils_1.generateRefreshToken)({
            userId: user.id.toString(),
            email: user.getEmail(),
        });
        // UPDATE REFRESH TOKEN IN REDIS
        await redis_connection_1.default.set(`refresh:${user.id}`, newRefreshToken, {
            EX: 7 * 24 * 60 * 60,
        });
        return { accessToken, refreshToken: newRefreshToken };
    }
    catch (error) {
        throw new appError_1.AppError("Invalid refresh token", 401);
    }
};
exports.refreshService = refreshService;
