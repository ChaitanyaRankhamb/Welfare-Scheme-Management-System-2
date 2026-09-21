"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAdminSchemesController = void 0;
const get_schemes_service_1 = require("../service/get-schemes.service");
const response_1 = require("../../../reuse-components/response");
const userId_1 = require("../../../entity/user/userId");
const appError_1 = require("../../../Error/appError");
/**
 * @description Controller to fetch schemes for admin with pagination and status filter
 */
const getAdminSchemesController = async (req, res, next) => {
    try {
        const userId = req.userId;
        if (!userId) {
            throw new appError_1.AppError('Unauthorized', 401);
        }
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const status = req.query.status;
        const result = await (0, get_schemes_service_1.getAdminSchemesService)(new userId_1.UserId(userId.toString()), page, limit, status);
        // Response Format: data (schemes), page, totalPages, totalSchemes
        return (0, response_1.successResponse)(res, {
            schemes: result.data,
            page: result.page,
            totalPages: result.totalPages,
            totalSchemes: result.totalSchemes
        }, result.message);
    }
    catch (error) {
        next(error);
    }
};
exports.getAdminSchemesController = getAdminSchemesController;
