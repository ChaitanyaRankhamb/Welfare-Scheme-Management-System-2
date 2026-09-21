"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMyApplicationsService = void 0;
const application_repository_1 = require("../../../database/repository/application.repository");
const user_repository_1 = require("../../../database/repository/user.repository");
const AppError_1 = require("../../../reuse-components/AppError");
/**
 * @description Retrieves all non-deleted applications for a specific user with pagination.
 * @param {string} userId - ID of the user whose applications are being fetched
 * @param {number} page - Page number
 * @param {number} limit - Items per page
 * @returns {Promise<{ success: boolean; data: any; message: string }>}
 * @flow
 * 1. Validate userId presence
 * 2. Find user in database
 * 3. Calculate skip
 * 4. Fetch non-deleted applications and total from repository
 * 5. Return structured response with meta
 */
const getMyApplicationsService = async (userId, page = 1, limit = 20) => {
    if (!userId) {
        throw new AppError_1.AppError('Unauthorized', 401);
    }
    const user = await user_repository_1.userRepository.findUserById(userId);
    if (!user) {
        throw new AppError_1.AppError('User not found', 404);
    }
    const skip = (page - 1) * limit;
    const { applications, total } = await application_repository_1.applicationRepository.findApplicationsByUserId(userId, false, skip, limit);
    return {
        success: true,
        data: {
            items: applications,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        },
        message: 'Applications fetched successfully'
    };
};
exports.getMyApplicationsService = getMyApplicationsService;
