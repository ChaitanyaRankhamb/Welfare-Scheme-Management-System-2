"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSchemesController = void 0;
const get_schemes_service_1 = require("../service/get-schemes.service");
const get_schemes_validation_1 = require("../../../validations/scheme/get-schemes.validation");
const response_1 = require("../../../reuse-components/response");
const AppError_1 = require("../../../reuse-components/AppError");
/**
 * @description Controller to fetch all schemes with pagination
 * @param {AuthRequest} req - Authenticated request
 * @param {Response} res - Express response
 * @returns {Promise<Response>}
 * @flow
 * 1. Extract user from AuthRequest
 * 2. Validate query params (page, limit) using Zod
 * 3. Call GetSchemesService
 * 4. Send success/error response
 */
const getSchemesController = async (req, res) => {
    try {
        const { userId } = req;
        if (!userId)
            throw new AppError_1.AppError('Unauthorized', 401);
        // Validate Input
        const validation = get_schemes_validation_1.getSchemesValidation.safeParse({ query: req.query });
        if (!validation.success) {
            throw new AppError_1.AppError(validation.error.errors[0].message, 400);
        }
        const { page, limit } = validation.data.query;
        const result = await (0, get_schemes_service_1.getSchemesService)(userId, page, limit);
        return (0, response_1.successResponse)(res, result.data, result.message);
    }
    catch (error) {
        return (0, response_1.errorResponse)(res, error.message || 'Internal Server Error', error.statusCode || 500);
    }
};
exports.getSchemesController = getSchemesController;
