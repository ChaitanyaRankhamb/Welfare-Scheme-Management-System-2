"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jwt_utils_1 = require("../utils/jwt.utils");
const redis_connection_1 = __importDefault(require("../config/redis.connection"));
const user_repository_1 = require("../database/repository/user.repository");
const authMiddleware = async (req, res, next) => {
    // take token from cookies
    const token = req.cookies?.accessToken;
    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }
    try {
        const payload = (0, jwt_utils_1.verifyAccessToken)(token);
        if (typeof payload === "string" || !payload.userId) {
            return res.status(401).json({ message: "Invalid or expired token" });
        }
        // Check if token is blacklisted
        const isBlacklisted = await redis_connection_1.default.get(`blacklist:${token}`);
        if (isBlacklisted) {
            return res.status(401).json({ message: "Token invalidated" });
        }
        // Fetch user and attach to request
        const user = await user_repository_1.userRepository.findUserById(payload.userId);
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }
        req.userId = payload.userId;
        req.user = user;
        next();
    }
    catch (error) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};
exports.authMiddleware = authMiddleware;
