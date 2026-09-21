"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.markAsAppliedService = void 0;
const application_repository_1 = require("../../../database/repository/application.repository");
const user_repository_1 = require("../../../database/repository/user.repository");
const AppError_1 = require("../../../reuse-components/AppError");
/**
 * @description Updates an application status to APPLIED.
 * @param {string} userId - ID of the user (for ownership validation)
 * @param {string} applicationId - ID of the application to update
 * @returns {Promise<{ success: boolean; data: any; message: string }>}
 * @flow
 * 1. Validate userId presence
 * 2. Find user in database
 * 3. Find application by ID
 * 4. Validate ownership
 * 5. Prevent updating deleted records
 * 6. Mark applied and save
 * 7. Return structured response
 */
const markAsAppliedService = async (userId, applicationId) => {
    if (!userId) {
        throw new AppError_1.AppError('Unauthorized', 401);
    }
    const user = await user_repository_1.userRepository.findUserById(userId);
    if (!user) {
        throw new AppError_1.AppError('User not found', 404);
    }
    const application = await application_repository_1.applicationRepository.findApplicationById(applicationId);
    if (!application) {
        throw new AppError_1.AppError('Application not found', 404);
    }
    // Validate ownership
    if (application.getUserId().toString() !== userId) {
        throw new AppError_1.AppError('Unauthorized access to this application', 403);
    }
    // Prevent updating deleted records
    if (application.getIsDeleted()) {
        throw new AppError_1.AppError('Cannot update a deleted application', 400);
    }
    application.markApplied();
    const updated = await application_repository_1.applicationRepository.updateApplication(applicationId, application);
    if (!updated) {
        throw new AppError_1.AppError('Failed to update application', 500);
    }
    return {
        success: true,
        data: updated,
        message: 'Application marked as applied'
    };
};
exports.markAsAppliedService = markAsAppliedService;
