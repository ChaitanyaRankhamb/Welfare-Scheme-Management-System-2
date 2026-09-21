"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisConnection = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const redis_1 = require("redis");
dotenv_1.default.config({
    path: process.env.NODE_ENV === "production" ? ".env.production" : ".env",
});
// create a redis client with createClient method by passing options as parameter
const redisClient = (0, redis_1.createClient)({
    url: process.env.REDIS_URI,
});
redisClient.on("error", (err) => console.log("Redis Client Error", err));
const redisConnection = async () => {
    await redisClient.connect();
    console.log("Redis connected successfully!");
};
exports.redisConnection = redisConnection;
exports.default = redisClient;
