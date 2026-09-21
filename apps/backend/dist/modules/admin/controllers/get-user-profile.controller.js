"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserProfileController = void 0;
const profile_model_1 = require("../../../database/mongo/models/profile.model");
const response_1 = require("../../../reuse-components/response");
const AppError_1 = require("../../../reuse-components/AppError");
/**
 * @description Controller for admin to fetch detailed profile of a specific user
 */
const getUserProfileController = async (req, res) => {
    try {
        const { userId: adminId } = req;
        const { id: targetUserId } = req.params;
        if (!adminId)
            throw new AppError_1.AppError('Unauthorized', 401);
        if (!targetUserId)
            throw new AppError_1.AppError('User ID is required', 400);
        const profile = await profile_model_1.ProfileModel.findOne({ userId: targetUserId });
        if (!profile) {
            return (0, response_1.successResponse)(res, null, 'User has not updated their profile yet');
        }
        return (0, response_1.successResponse)(res, profile, 'User profile fetched successfully');
    }
    catch (error) {
        return (0, response_1.errorResponse)(res, error.message || 'Internal Server Error', error.statusCode || 500);
    }
};
exports.getUserProfileController = getUserProfileController;
