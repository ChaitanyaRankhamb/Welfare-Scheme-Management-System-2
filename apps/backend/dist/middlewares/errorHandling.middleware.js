"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const appError_1 = require("../Error/appError");
const errorHandler = (err, req, res, next) => {
    let statusCode = 500;
    let message = "Internal Server Error";
    // If it's our custom error
    if (err instanceof appError_1.AppError) {
        statusCode = err.statusCode;
        message = err.message;
    }
    else {
        // fallback for unknown errors
        message = err.message || message;
    }
    res.status(statusCode).json({
        success: false,
        message,
    });
};
exports.errorHandler = errorHandler;
