"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsersController = void 0;
const get_users_service_1 = require("../service/get-users.service");
const response_1 = require("../../../reuse-components/response");
const AppError_1 = require("../../../reuse-components/AppError");
const pagination_validation_1 = require("../../../validations/pagination.validation");
/**
 * @description Controller for admin to fetch all citizen users with pagination
 */
const getUsersController = async (req, res) => {
    try {
        const { userId } = req;
        if (!userId)
            throw new AppError_1.AppError('Unauthorized', 401);
        // Validate Input
        const validation = pagination_validation_1.paginationSchema.safeParse({ query: req.query });
        if (!validation.success) {
            throw new AppError_1.AppError(validation.error.errors[0].message, 400);
        }
        const { page, limit, status } = validation.data.query;
        const result = await (0, get_users_service_1.getUsersService)(userId, page, limit, status);
        return (0, response_1.successResponse)(res, result.data, result.message);
    }
    catch (error) {
        return (0, response_1.errorResponse)(res, error.message || 'Internal Server Error', error.statusCode || 500);
    }
};
exports.getUsersController = getUsersController;
