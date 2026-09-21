"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMyApplicationsController = void 0;
const get_my_applications_service_1 = require("../service/get-my-applications.service");
const response_1 = require("../../../reuse-components/response");
const AppError_1 = require("../../../reuse-components/AppError");
const pagination_validation_1 = require("../../../validations/pagination.validation");
/**
 * @description Gets all non-deleted applications for the authenticated user with pagination.
 * @param {AuthRequest} req - Authenticated Request
 * @param {Response} res - Express Response
 * @returns {Promise<Response>}
 * @flow
 * 1. Extract userId from AuthRequest
 * 2. Validate pagination query params
 * 3. Call GetMyApplicationsService
 * 4. Send success/error response
 */
const getMyApplicationsController = async (req, res) => {
    try {
        const { userId } = req;
        if (!userId)
            throw new AppError_1.AppError('Unauthorized', 401);
        // Validate Input
        const validation = pagination_validation_1.paginationSchema.safeParse({ query: req.query });
        if (!validation.success) {
            throw new AppError_1.AppError(validation.error.errors[0].message, 400);
        }
        const { page, limit } = validation.data.query;
        const result = await (0, get_my_applications_service_1.getMyApplicationsService)(userId, page, limit);
        return (0, response_1.successResponse)(res, result.data, result.message);
    }
    catch (error) {
        return (0, response_1.errorResponse)(res, error.message || 'Internal Server Error', error.statusCode || 500);
    }
};
exports.getMyApplicationsController = getMyApplicationsController;
