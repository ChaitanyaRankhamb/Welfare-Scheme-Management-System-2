"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppError = void 0;
class AppError extends Error {
    // make them public
    success;
    statusCode;
    constructor(message, statusCode) {
        super(message);
        this.success = false;
        this.statusCode = statusCode;
        // maintain proper stack trace for where our error was thrown 
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;
