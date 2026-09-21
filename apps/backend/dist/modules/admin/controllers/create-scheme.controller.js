"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSchemeController = void 0;
const create_scheme_service_1 = require("../service/create-scheme.service");
const create_scheme_validation_1 = require("../../../validations/scheme/create-scheme.validation");
const response_1 = require("../../../reuse-components/response");
const AppError_1 = require("../../../reuse-components/AppError");
/**
 * @description Controller for admin to create a new scheme
 * @param {AuthRequest} req - Authenticated request
 * @param {Response} res - Express response
 * @returns {Promise<Response>}
 * @flow
 * 1. Extract user from AuthRequest
 * 2. Validate request body using Zod
 * 3. Call CreateSchemeService
 * 4. Send success/error response
 */
const createSchemeController = async (req, res) => {
    try {
        const { userId } = req;
        if (!userId)
            throw new AppError_1.AppError('Unauthorized', 401);
        // Validate Input
        const validation = create_scheme_validation_1.createSchemeValidation.safeParse({ body: req.body });
        if (!validation.success) {
            throw new AppError_1.AppError(validation.error.errors[0].message, 400);
        }
        const result = await (0, create_scheme_service_1.createSchemeService)(userId, req.body);
        return (0, response_1.successResponse)(res, result.data, result.message);
    }
    catch (error) {
        return (0, response_1.errorResponse)(res, error.message || 'Internal Server Error', error.statusCode || 500);
    }
};
exports.createSchemeController = createSchemeController;
