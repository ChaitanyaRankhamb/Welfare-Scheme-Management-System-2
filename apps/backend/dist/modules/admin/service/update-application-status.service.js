"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateApplicationStatusService = void 0;
const application_repository_1 = require("../../../database/repository/application.repository");
const user_repository_1 = require("../../../database/repository/user.repository");
const AppError_1 = require("../../../reuse-components/AppError");
const updateApplicationStatusService = async (userId, applicationId, status) => {
    if (!userId) {
        throw new AppError_1.AppError('Unauthorized', 401);
    }
    const adminUser = await user_repository_1.userRepository.findUserById(userId);
    if (!adminUser || adminUser.getRole() !== 'admin') {
        throw new AppError_1.AppError('Forbidden: Admin access required', 403);
    }
    const application = await application_repository_1.applicationRepository.findApplicationById(applicationId);
    if (!application) {
        throw new AppError_1.AppError('Application not found', 404);
    }
    // Update status directly since tracking module also uses statuses
    if (status === 'APPLIED') {
        application.markApplied();
    }
    const updated = await application_repository_1.applicationRepository.updateApplication(applicationId, application);
    return {
        success: true,
        data: updated,
        message: 'Application status updated successfully'
    };
};
exports.updateApplicationStatusService = updateApplicationStatusService;
