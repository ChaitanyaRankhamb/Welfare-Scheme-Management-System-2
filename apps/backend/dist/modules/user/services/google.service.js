"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleGoogleLoginService = void 0;
const jwt_utils_1 = require("../../../utils/jwt.utils");
const redis_connection_1 = __importDefault(require("../../../config/redis.connection"));
const user_repository_1 = require("../../../database/repository/user.repository");
const appError_1 = require("../../../Error/appError");
/**
 * Handles token generation after successful Google OAuth login
 * 1. Generates tokens
 * 2. Stores refresh token in Redis
 */
const handleGoogleLoginService = async (user) => {
    // check user exist or not
    const existingUser = await user_repository_1.userRepository.findUserByEmail(user.getEmail());
    if (!existingUser) {
        throw new appError_1.AppError('User not found', 404);
    }
    // GENERATE ACCESS TOKEN (15 min)
    const accessToken = (0, jwt_utils_1.generateAccessToken)({
        userId: existingUser.id.toString(),
        email: existingUser.getEmail(),
    });
    // GENERATE REFRESH TOKEN (7 days)
    const refreshToken = (0, jwt_utils_1.generateRefreshToken)({
        userId: existingUser.id.toString(),
        email: existingUser.getEmail(),
    });
    // store refresh token in redis for better performance and scalability
    // EX sets the expiration to 7 days
    await redis_connection_1.default.set(`refresh:${existingUser.id}`, refreshToken, {
        EX: 7 * 24 * 60 * 60,
    });
    return { accessToken, refreshToken, existingUser };
};
exports.handleGoogleLoginService = handleGoogleLoginService;
