import { Response } from 'express';

/**
 * @description Sends a success response
 * @param {Response} res - Express response object
 * @param {any} data - Data to send in the response
 * @param {string} message - Success message
 * @returns {Response}
 */
export const successResponse = (res: Response, data: any, message: string) => {
  return res.status(200).json({
    success: true,
    message,
    data,
  });
};

/**
 * @description Sends an error response
 * @param {Response} res - Express response object
 * @param {string} message - Error message
 * @param {number} statusCode - HTTP status code
 * @returns {Response}
 */
export const errorResponse = (res: Response, message: string, statusCode: number) => {
  return res.status(statusCode).json({
    success: false,
    message,
  });
};
