"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSchemeService = void 0;
const scheme_repository_1 = require("../../../database/repository/scheme.repository");
const user_repository_1 = require("../../../database/repository/user.repository");
const AppError_1 = require("../../../reuse-components/AppError");
/**
 * @description Deletes an existing scheme
 * @param {string} userId - ID of the authenticated user (admin)
 * @param {string} id - Scheme ID
 * @returns {Promise<{ success: boolean; message: string }>}
 * @flow
 * 1. Validate userId presence
 * 2. Find user in database
 * 3. Check if user is admin
 * 4. Check if scheme exists
 * 5. Delete scheme via repository
 * 6. Return structured response
 */
const deleteSchemeService = async (userId, id) => {
    if (!userId) {
        throw new AppError_1.AppError('Unauthorized', 401);
    }
    const user = await user_repository_1.userRepository.findUserById(userId);
    if (!user) {
        throw new AppError_1.AppError('User not found', 404);
    }
    if (user.getRole() !== 'admin') {
        throw new AppError_1.AppError('Forbidden: Admin access required', 403);
    }
    const scheme = await scheme_repository_1.schemeRepository.findSchemeById(id);
    if (!scheme) {
        throw new AppError_1.AppError('Scheme not found', 404);
    }
    // Only drafted schemes can be deleted
    // Updated scheme status system: active/deactive → drafted/published/archived
    if (scheme.getStatus() !== 'drafted') {
        throw new AppError_1.AppError('Only drafted schemes can be deleted permanently', 400);
    }
    await scheme_repository_1.schemeRepository.deleteScheme(id);
    return {
        success: true,
        message: 'Scheme deleted successfully'
    };
};
exports.deleteSchemeService = deleteSchemeService;
