"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsersService = void 0;
const user_repository_1 = require("../../../database/repository/user.repository");
const AppError_1 = require("../../../reuse-components/AppError");
/**
 * @description Fetches all citizen users for admin with pagination
 * @param {string} userId - Admin user ID
 * @param {number} page - Page number
 * @param {number} limit - Items per page
 * @returns {Promise<{ success: boolean; data: any; message: string }>}
 */
const getUsersService = async (userId, page = 1, limit = 20, status) => {
    if (!userId) {
        throw new AppError_1.AppError('Unauthorized', 401);
    }
    const adminUser = await user_repository_1.userRepository.findUserById(userId);
    if (!adminUser || adminUser.getRole() !== 'admin') {
        throw new AppError_1.AppError('Forbidden: Admin access required', 403);
    }
    const skip = (page - 1) * limit;
    const { users, total } = await user_repository_1.userRepository.findAllUsers(skip, limit, status);
    return {
        success: true,
        data: {
            items: users,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        },
        message: 'All users fetched successfully'
    };
};
exports.getUsersService = getUsersService;
