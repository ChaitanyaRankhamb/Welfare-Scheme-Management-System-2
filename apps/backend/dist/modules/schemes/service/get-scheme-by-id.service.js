"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSchemeByIdService = void 0;
const scheme_repository_1 = require("../../../database/repository/scheme.repository");
const user_repository_1 = require("../../../database/repository/user.repository");
const AppError_1 = require("../../../reuse-components/AppError");
/**
 * @description Fetches a single scheme by its ID
 * @param {string} userId - ID of the authenticated user
 * @param {string} id - Scheme ID
 * @returns {Promise<{ success: boolean; data: any; message: string }>}
 * @flow
 * 1. Validate userId presence
 * 2. Find user in database
 * 3. Fetch scheme from repository by ID
 * 4. If not found, throw AppError (404)
 * 5. Return structured response
 */
const getSchemeByIdService = async (userId, id) => {
    if (!userId) {
        throw new AppError_1.AppError('Unauthorized', 401);
    }
    const user = await user_repository_1.userRepository.findUserById(userId);
    if (!user) {
        throw new AppError_1.AppError('User not found', 404);
    }
    const scheme = await scheme_repository_1.schemeRepository.findSchemeById(id);
    // Only published schemes are visible to users
    // Updated scheme status system: active/deactive → drafted/published/archived
    if (!scheme || scheme.getStatus() !== 'published') {
        throw new AppError_1.AppError('Scheme not found or unavailable', 404);
    }
    return {
        success: true,
        data: scheme,
        message: 'Scheme details fetched successfully'
    };
};
exports.getSchemeByIdService = getSchemeByIdService;
