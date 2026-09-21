"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginService = void 0;
const user_repository_1 = require("../../../database/repository/user.repository");
const appError_1 = require("../../../Error/appError");
const jwt_utils_1 = require("../../../utils/jwt.utils");
const redis_connection_1 = __importDefault(require("../../../config/redis.connection"));
const loginService = async (email) => {
    const user = await user_repository_1.userRepository.findUserByEmail(email);
    if (!user) {
        throw new appError_1.AppError("User not found with this email", 401);
    }
    // GENERATE TOKENS
    const accessToken = (0, jwt_utils_1.generateAccessToken)({
        userId: user.id.toString(),
        email: user.getEmail(),
    });
    const refreshToken = (0, jwt_utils_1.generateRefreshToken)({
        userId: user.id.toString(),
        email: user.getEmail(),
    });
    // SAVE REFRESH TOKEN TO REDIS (EXPIRES IN 7 DAYS)
    try {
        await redis_connection_1.default.set(`refresh:${user.id}`, refreshToken, {
            EX: 7 * 24 * 60 * 60,
        });
    }
    catch (error) {
        console.error("Redis storage error:", error);
        if (error.message.includes("NOAUTH")) {
            throw new appError_1.AppError("Internal Server Error: Cache authentication failed. Please check Redis configuration.", 500);
        }
        // If it's not a NOAUTH error, we might still want to fail or just log it
        // For production, failing is safer if session management depends on Redis
        throw new appError_1.AppError("Failed to initialize session. Please try again.", 500);
    }
    return { user, accessToken, refreshToken };
};
exports.loginService = loginService;
