"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSchemeService = void 0;
const scheme_repository_1 = require("../../../database/repository/scheme.repository");
const user_repository_1 = require("../../../database/repository/user.repository");
const AppError_1 = require("../../../reuse-components/AppError");
/**
 * @description Updates an existing scheme
 * @param {string} userId - ID of the authenticated user (admin)
 * @param {string} id - Scheme ID
 * @param {any} updateData - Partial scheme data to update
 * @returns {Promise<{ success: boolean; data: any; message: string }>}
 * @flow
 * 1. Validate userId presence
 * 2. Find user in database
 * 3. Check if user is admin
 * 4. Check if scheme exists
 * 5. Update scheme details using domain entity methods
 * 6. Save updated scheme via repository
 * 7. Return structured response
 */
const updateSchemeService = async (userId, id, updateData) => {
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
    // Only drafted schemes can be edited
    // Updated scheme status system: active/deactive → drafted/published/archived
    if (scheme.getStatus() !== 'drafted') {
        throw new AppError_1.AppError('Only drafted schemes can be edited', 400);
    }
    scheme.updateDetails(updateData);
    const updated = await scheme_repository_1.schemeRepository.updateScheme(id, scheme);
    if (!updated) {
        throw new AppError_1.AppError('Failed to update scheme', 500);
    }
    return {
        success: true,
        data: updated,
        message: 'Scheme updated successfully'
    };
};
exports.updateSchemeService = updateSchemeService;
