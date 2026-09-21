"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSchemesService = void 0;
const scheme_repository_1 = require("../../../database/repository/scheme.repository");
const user_repository_1 = require("../../../database/repository/user.repository");
const AppError_1 = require("../../../reuse-components/AppError");
/**
 * @description Fetches all active schemes with pagination
 * @param {string} userId - ID of the authenticated user
 * @param {number} page - Page number
 * @param {number} limit - Items per page
 * @returns {Promise<{ success: boolean; data: any; message: string }>}
 * @flow
 * 1. Validate userId presence
 * 2. Find user in database
 * 3. Calculate pagination (skip)
 * 4. Fetch schemes and total count from repository
 * 5. Return structured response with metadata
 */
const getSchemesService = async (userId, page = 1, limit = 20) => {
    if (!userId) {
        throw new AppError_1.AppError('Unauthorized', 401);
    }
    const user = await user_repository_1.userRepository.findUserById(userId);
    if (!user) {
        throw new AppError_1.AppError('User not found', 404);
    }
    const skip = (page - 1) * limit;
    // Only published schemes are visible to users
    // Updated scheme status system: active/deactive → drafted/published/archived
    const filters = { status: 'published' };
    const { schemes, total } = await scheme_repository_1.schemeRepository.findAllSchemes(filters, skip, limit);
    return {
        success: true,
        data: {
            items: schemes,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        },
        message: 'Schemes fetched successfully'
    };
};
exports.getSchemesService = getSchemesService;
