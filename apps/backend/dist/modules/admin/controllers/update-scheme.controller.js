"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSchemeController = void 0;
const update_scheme_service_1 = require("../service/update-scheme.service");
const update_scheme_validation_1 = require("../../../validations/scheme/update-scheme.validation");
const response_1 = require("../../../reuse-components/response");
const AppError_1 = require("../../../reuse-components/AppError");
/**
 * @description Controller for admin to update an existing scheme
 * @param {AuthRequest} req - Authenticated request
 * @param {Response} res - Express response
 * @returns {Promise<Response>}
 * @flow
 * 1. Extract user from AuthRequest
 * 2. Validate params and body using Zod
 * 3. Call UpdateSchemeService
 * 4. Send success/error response
 */
const updateSchemeController = async (req, res) => {
    try {
        const { userId } = req;
        if (!userId)
            throw new AppError_1.AppError('Unauthorized', 401);
        // Validate Input
        const validation = update_scheme_validation_1.updateSchemeValidation.safeParse({
            params: req.params,
            body: req.body
        });
        if (!validation.success) {
            throw new AppError_1.AppError(validation.error.errors[0].message, 400);
        }
        const { id } = validation.data.params;
        const updateData = validation.data.body;
        const result = await (0, update_scheme_service_1.updateSchemeService)(userId, id, updateData);
        return (0, response_1.successResponse)(res, result.data, result.message);
    }
    catch (error) {
        return (0, response_1.errorResponse)(res, error.message || 'Internal Server Error', error.statusCode || 500);
    }
};
exports.updateSchemeController = updateSchemeController;
