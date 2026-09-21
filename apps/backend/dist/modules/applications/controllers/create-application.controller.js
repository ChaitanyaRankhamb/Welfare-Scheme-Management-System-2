"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApplicationController = void 0;
const create_application_service_1 = require("../service/create-application.service");
const application_validation_1 = require("../../../validations/application.validation");
const response_1 = require("../../../reuse-components/response");
const AppError_1 = require("../../../reuse-components/AppError");
/**
 * @description Initiates a new application for a scheme.
 * @param {AuthRequest} req - Authenticated Request (expects schemeId in body)
 * @param {Response} res - Express Response
 * @returns {Promise<Response>}
 * @flow
 * 1. Extract userId from AuthRequest
 * 2. Validate Input using Zod
 * 3. Call CreateApplicationService
 * 4. Send success/error response
 */
const createApplicationController = async (req, res) => {
    try {
        const { userId } = req;
        if (!userId)
            throw new AppError_1.AppError('Unauthorized', 401);
        // Validate Input
        const validation = application_validation_1.createApplicationSchema.safeParse({ body: req.body });
        if (!validation.success) {
            throw new AppError_1.AppError(validation.error.errors[0].message, 400);
        }
        const { schemeId } = validation.data.body;
        const result = await (0, create_application_service_1.createApplicationService)(userId, schemeId);
        return (0, response_1.successResponse)(res, result.data, result.message);
    }
    catch (error) {
        return (0, response_1.errorResponse)(res, error.message || 'Internal Server Error', error.statusCode || 500);
    }
};
exports.createApplicationController = createApplicationController;
