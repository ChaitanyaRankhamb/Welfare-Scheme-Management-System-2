"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.restoreSchemeService = void 0;
const scheme_repository_1 = require("../../../database/repository/scheme.repository");
const user_repository_1 = require("../../../database/repository/user.repository");
const AppError_1 = require("../../../reuse-components/AppError");
/**
 * @description Restores an archived scheme to drafted status
 */
const restoreSchemeService = async (userId, id) => {
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
    // archived → drafted
    // Updated scheme status system: active/deactive → drafted/published/archived
    if (scheme.getStatus() !== 'archived') {
        throw new AppError_1.AppError('Only archived schemes can be restored', 400);
    }
    scheme.setStatus('drafted');
    const updated = await scheme_repository_1.schemeRepository.updateScheme(id, scheme);
    return {
        success: true,
        data: updated,
        message: 'Scheme restored to drafted successfully'
    };
};
exports.restoreSchemeService = restoreSchemeService;
