"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const appError_1 = require("../Error/appError");
// Load environment variables from the backend .env file.
dotenv_1.default.config({
    path: ".env",
});
const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_URI_FALLBACK = process.env.MONGODB_URI_FALLBACK;
const mongoUri = MONGODB_URI_FALLBACK && MONGODB_URI?.startsWith("mongodb+srv://")
    ? MONGODB_URI_FALLBACK
    : MONGODB_URI;
if (!mongoUri) {
    throw new appError_1.AppError("MONGODB_URI is not defined in environment variables", 500);
}
mongoose_1.default.set("strictQuery", false);
// Cache connection (important for Node apps)
let isConnected = false;
const connectDB = async () => {
    if (isConnected) {
        console.log("Using existing DB connection");
        return;
    }
    try {
        const conn = await mongoose_1.default.connect(mongoUri, {
            family: 4,
            connectTimeoutMS: 10000,
            serverSelectionTimeoutMS: 10000,
        });
        isConnected = conn.connections[0].readyState === 1;
        console.log("MongoDB Connected Successfully");
    }
    catch (error) {
        console.error("MongoDB Connection Error:", error);
        console.error("MongoDB connection string used:", mongoUri?.startsWith("mongodb+srv://") ? "SRV" : "Standard");
        if (error?.code === "ECONNREFUSED" && error?.syscall === "querySrv") {
            console.error("Atlas SRV DNS lookup failed. If your network blocks SRV records, set MONGODB_URI_FALLBACK to the standard MongoDB connection string from Atlas.");
        }
        process.exit(1);
    }
};
exports.default = connectDB;
