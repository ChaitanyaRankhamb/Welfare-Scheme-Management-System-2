"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getApplicationsController = void 0;
const get_applications_service_1 = require("../service/get-applications.service");
const response_1 = require("../../../reuse-components/response");
const AppError_1 = require("../../../reuse-components/AppError");
const pagination_validation_1 = require("../../../validations/pagination.validation");
/**
 * @description Controller for admin to fetch all applications with pagination
 */
const getApplicationsController = async (req, res) => {
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
        const result = await (0, get_applications_service_1.getApplicationsService)(userId, page, limit);
        return (0, response_1.successResponse)(res, result.data, result.message);
    }
    catch (error) {
        return (0, response_1.errorResponse)(res, error.message || 'Internal Server Error', error.statusCode || 500);
    }
};
exports.getApplicationsController = getApplicationsController;
