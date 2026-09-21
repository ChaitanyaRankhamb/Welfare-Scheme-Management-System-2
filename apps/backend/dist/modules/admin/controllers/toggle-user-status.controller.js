"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleUserStatusController = void 0;
const toggle_user_status_service_1 = require("../service/toggle-user-status.service");
const response_1 = require("../../../reuse-components/response");
const AppError_1 = require("../../../reuse-components/AppError");
/**
 * @description Controller for admin to toggle user active status
 */
const toggleUserStatusController = async (req, res) => {
    try {
        const { userId: adminId } = req;
        const { id: targetUserId } = req.params;
        if (!adminId)
            throw new AppError_1.AppError('Unauthorized', 401);
        if (!targetUserId)
            throw new AppError_1.AppError('User ID is required', 400);
        const result = await (0, toggle_user_status_service_1.toggleUserStatusService)(adminId, targetUserId);
        return (0, response_1.successResponse)(res, result.data, result.message);
    }
    catch (error) {
        return (0, response_1.errorResponse)(res, error.message || 'Internal Server Error', error.statusCode || 500);
    }
};
exports.toggleUserStatusController = toggleUserStatusController;
