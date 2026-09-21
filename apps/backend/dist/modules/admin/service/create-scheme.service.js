"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSchemeService = void 0;
const scheme_repository_1 = require("../../../database/repository/scheme.repository");
const user_repository_1 = require("../../../database/repository/user.repository");
const AppError_1 = require("../../../reuse-components/AppError");
/**
 * @description Creates a new scheme after checking for duplicates
 * @param {string} userId - ID of the authenticated user (admin)
 * @param {CreateSchemeData} data - Scheme data
 * @returns {Promise<{ success: boolean; data: any; message: string }>}
 * @flow
 * 1. Validate userId presence
 * 2. Find user in database
 * 3. Check if user is admin
 * 4. Check if a scheme with the same title already exists
 * 5. If exists, throw AppError (409)
 * 4. Create new scheme via repository
 * 5. Return structured response
 */
const createSchemeService = async (userId, data) => {
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
    // Check for duplicate title
    const { schemes: existingSchemes } = await scheme_repository_1.schemeRepository.findAllSchemes();
    const isDuplicate = existingSchemes.find((s) => s.getTitle() === data.title);
    if (isDuplicate) {
        throw new AppError_1.AppError('Scheme with this title already exists', 409);
    }
    // All new schemes start in 'drafted' status
    // Updated scheme status system: active/deactive → drafted/published/archived
    data.status = 'drafted';
    const newScheme = await scheme_repository_1.schemeRepository.createScheme(data);
    return {
        success: true,
        data: newScheme,
        message: 'Scheme created successfully'
    };
};
exports.createSchemeService = createSchemeService;
