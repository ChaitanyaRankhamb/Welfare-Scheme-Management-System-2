"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserApplicationsController = void 0;
const response_1 = require("../../../reuse-components/response");
const AppError_1 = require("../../../reuse-components/AppError");
const application_model_1 = require("../../../database/mongo/models/application.model");
/**
 * @description Controller for admin to fetch applications of a specific user
 */
const getUserApplicationsController = async (req, res) => {
    try {
        const { userId: adminId } = req;
        const { id: targetUserId } = req.params;
        if (!adminId)
            throw new AppError_1.AppError('Unauthorized', 401);
        if (!targetUserId)
            throw new AppError_1.AppError('User ID is required', 400);
        // Fetch applications with populated scheme info using Mongoose directly for ease of data transfer in admin view
        const applications = await application_model_1.ApplicationModel.find({ userId: targetUserId, isDeleted: false })
            .populate('schemeId', 'title category ministry')
            .sort({ createdAt: -1 });
        return (0, response_1.successResponse)(res, applications, 'User applications fetched successfully');
    }
    catch (error) {
        return (0, response_1.errorResponse)(res, error.message || 'Internal Server Error', error.statusCode || 500);
    }
};
exports.getUserApplicationsController = getUserApplicationsController;
