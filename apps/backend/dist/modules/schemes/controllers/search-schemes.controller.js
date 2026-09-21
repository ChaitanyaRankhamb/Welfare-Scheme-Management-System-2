"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchSchemesController = void 0;
const search_schemes_service_1 = require("../service/search-schemes.service");
const search_schemes_validation_1 = require("../../../validations/scheme/search-schemes.validation");
const response_1 = require("../../../reuse-components/response");
const AppError_1 = require("../../../reuse-components/AppError");
/**
 * @description Controller to search for schemes based on criteria
 * @param {AuthRequest} req - Authenticated request
 * @param {Response} res - Express response
 * @returns {Promise<Response>}
 * @flow
 * 1. Extract user from AuthRequest
 * 2. Validate query params using Joi
 * 3. Call SearchSchemesService
 * 4. Send success/error response
 */
const searchSchemesController = async (req, res) => {
    try {
        const { userId } = req;
        if (!userId)
            throw new AppError_1.AppError('Unauthorized', 401);
        // Validate Input
        const validation = search_schemes_validation_1.searchSchemesValidation.safeParse({ query: req.query });
        if (!validation.success) {
            throw new AppError_1.AppError(validation.error.errors[0].message, 400);
        }
        const result = await (0, search_schemes_service_1.searchSchemesService)(userId, validation.data.query);
        return (0, response_1.successResponse)(res, result.data, result.message);
    }
    catch (error) {
        return (0, response_1.errorResponse)(res, error.message || 'Internal Server Error', error.statusCode || 500);
    }
};
exports.searchSchemesController = searchSchemesController;
