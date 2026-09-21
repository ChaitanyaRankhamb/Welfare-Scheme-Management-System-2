"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeApplicationService = void 0;
const application_repository_1 = require("../../../database/repository/application.repository");
const user_repository_1 = require("../../../database/repository/user.repository");
const AppError_1 = require("../../../reuse-components/AppError");
/**
 * @description Soft deletes an application record.
 * @param {string} userId - ID of the user (for ownership validation)
 * @param {string} applicationId - ID of the application to remove
 * @returns {Promise<{ success: boolean; data: any; message: string }>}
 * @flow
 * 1. Validate userId presence
 * 2. Find user in database
 * 3. Find application by ID
 * 4. Validate ownership
 * 5. Check if already deleted
 * 6. Perform soft delete and save
 * 7. Return structured response
 */
const removeApplicationService = async (userId, applicationId) => {
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
    // Check if already deleted
    if (application.getIsDeleted()) {
        throw new AppError_1.AppError('Application already removed', 400);
    }
    application.remove();
    const updated = await application_repository_1.applicationRepository.updateApplication(applicationId, application);
    if (!updated) {
        throw new AppError_1.AppError('Failed to remove application', 500);
    }
    return {
        success: true,
        data: updated,
        message: 'Application removed successfully'
    };
};
exports.removeApplicationService = removeApplicationService;
