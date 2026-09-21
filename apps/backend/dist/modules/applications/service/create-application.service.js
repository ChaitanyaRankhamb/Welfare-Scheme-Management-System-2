"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApplicationService = void 0;
const application_repository_1 = require("../../../database/repository/application.repository");
const scheme_repository_1 = require("../../../database/repository/scheme.repository");
const user_repository_1 = require("../../../database/repository/user.repository");
const AppError_1 = require("../../../reuse-components/AppError");
/**
 * @description Creates a new application tracking record with status INITIATED.
 * @param {string} userId - ID of the user initiating the application
 * @param {string} schemeId - ID of the scheme being applied to
 * @returns {Promise<{ success: boolean; data: any; message: string }>}
 * @flow
 * 1. Validate userId presence
 * 2. Find user in database
 * 3. Validate scheme existence
 * 4. Prevent duplicate application attempt
 * 5. Create application record
 * 6. Return structured response
 */
const createApplicationService = async (userId, schemeId) => {
    if (!userId) {
        throw new AppError_1.AppError('Unauthorized', 401);
    }
    const user = await user_repository_1.userRepository.findUserById(userId);
    if (!user) {
        throw new AppError_1.AppError('User not found', 404);
    }
    if (!schemeId) {
        throw new AppError_1.AppError('Scheme ID is required', 400);
    }
    // 1. Validate scheme existence
    const scheme = await scheme_repository_1.schemeRepository.findSchemeById(schemeId);
    if (!scheme) {
        throw new AppError_1.AppError('Scheme not found', 404);
    }
    if (user.getRole() !== "citizen") {
        throw new AppError_1.AppError('Only citizens can apply for schemes', 403);
    }
    // 2. Prevent duplicate application attempt
    const existingApplication = await application_repository_1.applicationRepository.findApplicationByUserAndScheme(userId, schemeId);
    if (existingApplication?.getStatus() === "APPLIED") {
        throw new AppError_1.AppError('Application already applied for this scheme', 409);
    }
    // 3. Create application record
    const application = await application_repository_1.applicationRepository.createApplication({
        userId,
        schemeId,
        status: 'INITIATED',
    });
    return {
        success: true,
        data: application,
        message: 'Application initiated successfully'
    };
};
exports.createApplicationService = createApplicationService;
