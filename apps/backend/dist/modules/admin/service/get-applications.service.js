"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getApplicationsService = void 0;
const application_repository_1 = require("../../../database/repository/application.repository");
const user_repository_1 = require("../../../database/repository/user.repository");
const AppError_1 = require("../../../reuse-components/AppError");
/**
 * @description Fetches all applications for admin with pagination
 * @param {string} userId - Admin user ID
 * @param {number} page - Page number
 * @param {number} limit - Items per page
 * @returns {Promise<{ success: boolean; data: any; message: string }>}
 */
const getApplicationsService = async (userId, page = 1, limit = 20) => {
    if (!userId) {
        throw new AppError_1.AppError('Unauthorized', 401);
    }
    const user = await user_repository_1.userRepository.findUserById(userId);
    if (!user || user.getRole() !== 'admin') {
        throw new AppError_1.AppError('Forbidden: Admin access required', 403);
    }
    const skip = (page - 1) * limit;
    const { applications, total } = await application_repository_1.applicationRepository.findAllApplications(skip, limit);
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
        message: 'All applications fetched successfully'
    };
};
exports.getApplicationsService = getApplicationsService;
