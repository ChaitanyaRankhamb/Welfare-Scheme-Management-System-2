"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProfileController = void 0;
const get_profile_service_1 = require("../service/get-profile.service");
const response_1 = require("../../../reuse-components/response");
const AppError_1 = require("../../../reuse-components/AppError");
/**
 * @description Controller to fetch the authenticated user's profile
 * @param {AuthRequest} req - Authenticated request
 * @param {Response} res - Express response
 */
const getProfileController = async (req, res) => {
    try {
        const { userId } = req;
        if (!userId) {
            throw new AppError_1.AppError('Unauthorized', 401);
        }
        const result = await (0, get_profile_service_1.getProfileService)(userId);
        return (0, response_1.successResponse)(res, result.data, result.message);
    }
    catch (error) {
        return (0, response_1.errorResponse)(res, error.message || 'Error fetching profile', error.statusCode || 500);
    }
};
exports.getProfileController = getProfileController;
