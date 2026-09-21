"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSchemeByIdController = void 0;
const get_scheme_by_id_service_1 = require("../service/get-scheme-by-id.service");
const get_scheme_by_id_validation_1 = require("../../../validations/scheme/get-scheme-by-id.validation");
const response_1 = require("../../../reuse-components/response");
const AppError_1 = require("../../../reuse-components/AppError");
/**
 * @description Controller to fetch a single scheme by ID
 * @param {AuthRequest} req - Authenticated request
 * @param {Response} res - Express response
 * @returns {Promise<Response>}
 * @flow
 * 1. Extract user from AuthRequest
 * 2. Validate params (id) using Zod
 * 3. Call GetSchemeByIdService
 * 4. Send success/error response
 */
const getSchemeByIdController = async (req, res) => {
    try {
        const { userId } = req;
        if (!userId)
            throw new AppError_1.AppError('Unauthorized', 401);
        // Validate Input
        const validation = get_scheme_by_id_validation_1.getSchemeByIdValidation.safeParse({ params: req.params });
        if (!validation.success) {
            throw new AppError_1.AppError(validation.error.errors[0].message, 400);
        }
        const { id } = validation.data.params;
        const result = await (0, get_scheme_by_id_service_1.getSchemeByIdService)(userId, id);
        return (0, response_1.successResponse)(res, result.data, result.message);
    }
    catch (error) {
        return (0, response_1.errorResponse)(res, error.message || 'Internal Server Error', error.statusCode || 500);
    }
};
exports.getSchemeByIdController = getSchemeByIdController;
