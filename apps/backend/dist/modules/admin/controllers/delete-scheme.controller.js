"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSchemeController = void 0;
const delete_scheme_service_1 = require("../service/delete-scheme.service");
const delete_scheme_validation_1 = require("../../../validations/scheme/delete-scheme.validation");
const response_1 = require("../../../reuse-components/response");
const AppError_1 = require("../../../reuse-components/AppError");
/**
 * @description Controller for admin to delete a scheme
 * @param {AuthRequest} req - Authenticated request
 * @param {Response} res - Express response
 * @returns {Promise<Response>}
 * @flow
 * 1. Extract user from AuthRequest
 * 2. Validate params (id) using Zod
 * 3. Call DeleteSchemeService
 * 4. Send success/error response
 */
const deleteSchemeController = async (req, res) => {
    try {
        const { userId } = req;
        if (!userId)
            throw new AppError_1.AppError('Unauthorized', 401);
        // Validate Input
        const validation = delete_scheme_validation_1.deleteSchemeValidation.safeParse({ params: req.params });
        if (!validation.success) {
            throw new AppError_1.AppError(validation.error.errors[0].message, 400);
        }
        const { id } = validation.data.params;
        const result = await (0, delete_scheme_service_1.deleteSchemeService)(userId, id);
        return (0, response_1.successResponse)(res, null, result.message);
    }
    catch (error) {
        return (0, response_1.errorResponse)(res, error.message || 'Internal Server Error', error.statusCode || 500);
    }
};
exports.deleteSchemeController = deleteSchemeController;
