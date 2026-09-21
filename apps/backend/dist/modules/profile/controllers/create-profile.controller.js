"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProfileController = void 0;
const create_profile_service_1 = require("../service/create-profile.service");
const profile_validation_1 = require("../../../validations/profile/profile.validation");
const response_1 = require("../../../reuse-components/response");
const AppError_1 = require("../../../reuse-components/AppError");
/**
 * @description Controller to create a new user profile
 * @param {AuthRequest} req - Authenticated request
 * @param {Response} res - Express response
 */
const createProfileController = async (req, res) => {
    try {
        const { userId } = req;
        if (!userId) {
            throw new AppError_1.AppError('Unauthorized', 401);
        }
        // Validate Input
        const validation = profile_validation_1.profileValidationSchema.safeParse({ body: req.body });
        if (!validation.success) {
            throw new AppError_1.AppError(validation.error.errors[0].message, 400);
        }
        const result = await (0, create_profile_service_1.createProfileService)(userId, validation.data.body);
        return (0, response_1.successResponse)(res, result.data, result.message);
    }
    catch (error) {
        return (0, response_1.errorResponse)(res, error.message || 'Error creating profile', error.statusCode || 500);
    }
};
exports.createProfileController = createProfileController;
