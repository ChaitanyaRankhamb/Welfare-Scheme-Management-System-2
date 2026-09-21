"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAdminSchemesService = void 0;
const scheme_repository_1 = require("../../../database/repository/scheme.repository");
const user_repository_1 = require("../../../database/repository/user.repository");
const AppError_1 = require("../../../reuse-components/AppError");
const roles_enum_1 = require("../../../types/roles.enum");
/**
 * @description Fetches all schemes with pagination for admin
 * @param {string} userId - ID of the authenticated admin
 * @param {number} page - Page number
 * @param {number} limit - Items per page
 * @param {string} status - Filter by status (drafted, published, archived)
 */
const getAdminSchemesService = async (userId, page = 1, limit = 10, status) => {
    if (!userId)
        throw new AppError_1.AppError('Unauthorized', 401);
    const user = await user_repository_1.userRepository.findUserById(userId.toString());
    if (!user) {
        throw new AppError_1.AppError('User not found', 404);
    }
    if (user.getRole() !== roles_enum_1.Role.ADMIN) {
        throw new AppError_1.AppError('Forbidden: Admin access required', 403);
    }
    // Pagination applied using skip & limit
    const skip = (page - 1) * limit;
    const filters = {};
    if (status && ['drafted', 'published', 'archived'].includes(status)) {
        filters.status = status;
    }
    const { schemes, total } = await scheme_repository_1.schemeRepository.findAllSchemes(filters, skip, limit);
    return {
        success: true,
        data: schemes,
        page,
        totalPages: Math.ceil(total / limit),
        totalSchemes: total,
        message: 'Schemes fetched successfully'
    };
};
exports.getAdminSchemesService = getAdminSchemesService;
