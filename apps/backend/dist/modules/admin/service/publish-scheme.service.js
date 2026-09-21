"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.publishSchemeService = void 0;
const scheme_repository_1 = require("../../../database/repository/scheme.repository");
const user_repository_1 = require("../../../database/repository/user.repository");
const AppError_1 = require("../../../reuse-components/AppError");
/**
 * @description Publishes a drafted scheme
 */
const publishSchemeService = async (userId, id) => {
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
    // drafted → published
    // Updated scheme status system: active/deactive → drafted/published/archived
    if (scheme.getStatus() !== 'drafted') {
        throw new AppError_1.AppError('Only drafted schemes can be published', 400);
    }
    scheme.setStatus('published');
    const updated = await scheme_repository_1.schemeRepository.updateScheme(id, scheme);
    return {
        success: true,
        data: updated,
        message: 'Scheme published successfully'
    };
};
exports.publishSchemeService = publishSchemeService;
