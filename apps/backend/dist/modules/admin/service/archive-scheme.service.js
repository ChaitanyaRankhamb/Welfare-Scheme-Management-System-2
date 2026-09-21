"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.archiveSchemeService = void 0;
const scheme_repository_1 = require("../../../database/repository/scheme.repository");
const user_repository_1 = require("../../../database/repository/user.repository");
const AppError_1 = require("../../../reuse-components/AppError");
/**
 * @description Archives a published scheme
 */
const archiveSchemeService = async (userId, id) => {
    if (!userId)
        throw new AppError_1.AppError('Unauthorized', 401);
    const user = await user_repository_1.userRepository.findUserById(userId.toString());
    if (!user)
        throw new AppError_1.AppError('User not found', 404);
    if (user.getRole() !== 'admin') {
        throw new AppError_1.AppError('Forbidden: Admin access required', 403);
    }
    const scheme = await scheme_repository_1.schemeRepository.findSchemeById(id);
    if (!scheme)
        throw new AppError_1.AppError('Scheme not found', 404);
    // published → archived
    // Updated scheme status system: active/deactive → drafted/published/archived
    if (scheme.getStatus() !== 'published') {
        throw new AppError_1.AppError('Only published schemes can be archived', 400);
    }
    scheme.setStatus('archived');
    const updated = await scheme_repository_1.schemeRepository.updateScheme(id, scheme);
    return {
        success: true,
        data: updated,
        message: 'Scheme archived successfully'
    };
};
exports.archiveSchemeService = archiveSchemeService;
