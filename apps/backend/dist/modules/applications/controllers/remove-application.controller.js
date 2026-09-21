"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeApplicationController = void 0;
const remove_application_service_1 = require("../service/remove-application.service");
const application_validation_1 = require("../../../validations/application.validation");
const response_1 = require("../../../reuse-components/response");
const AppError_1 = require("../../../reuse-components/AppError");
/**
 * @description Removes an application record (soft delete).
 * @param {AuthRequest} req - Authenticated Request (expects application ID in params)
 * @param {Response} res - Express Response
 * @returns {Promise<Response>}
 * @flow
 * 1. Extract userId from AuthRequest
 * 2. Validate Input using Zod
 * 3. Call RemoveApplicationService
 * 4. Send success/error response
 */
const removeApplicationController = async (req, res) => {
    try {
        const { userId } = req;
        if (!userId)
            throw new AppError_1.AppError('Unauthorized', 401);
        // Validate Input
        const validation = application_validation_1.applicationIdSchema.safeParse({ params: req.params });
        if (!validation.success) {
            throw new AppError_1.AppError(validation.error.errors[0].message, 400);
        }
        const { id } = validation.data.params;
        const result = await (0, remove_application_service_1.removeApplicationService)(userId, id);
        return (0, response_1.successResponse)(res, result.data, result.message);
    }
    catch (error) {
        return (0, response_1.errorResponse)(res, error.message || 'Internal Server Error', error.statusCode || 500);
    }
};
exports.removeApplicationController = removeApplicationController;
