"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorResponse = exports.successResponse = void 0;
/**
 * @description Sends a success response
 * @param {Response} res - Express response object
 * @param {any} data - Data to send in the response
 * @param {string} message - Success message
 * @returns {Response}
 */
const successResponse = (res, data, message) => {
    return res.status(200).json({
        success: true,
        message,
        data,
    });
};
exports.successResponse = successResponse;
/**
 * @description Sends an error response
 * @param {Response} res - Express response object
 * @param {string} message - Error message
 * @param {number} statusCode - HTTP status code
 * @returns {Response}
 */
const errorResponse = (res, message, statusCode) => {
    return res.status(statusCode).json({
        success: false,
        message,
    });
};
exports.errorResponse = errorResponse;
