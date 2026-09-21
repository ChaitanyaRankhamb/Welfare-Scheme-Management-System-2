"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleUserStatusService = void 0;
const user_repository_1 = require("../../../database/repository/user.repository");
const AppError_1 = require("../../../reuse-components/AppError");
/**
 * @description Toggles the isActive status of a user
 * @param {string} adminId - ID of the admin performing the action
 * @param {string} targetUserId - ID of the user to toggle
 * @returns {Promise<{ success: boolean; data: any; message: string }>}
 */
const toggleUserStatusService = async (adminId, targetUserId) => {
    const admin = await user_repository_1.userRepository.findUserById(adminId);
    if (!admin || admin.getRole() !== 'admin') {
        throw new AppError_1.AppError('Forbidden: Admin access required', 403);
    }
    const user = await user_repository_1.userRepository.findUserById(targetUserId);
    if (!user) {
        throw new AppError_1.AppError('User not found', 404);
    }
    // Toggle status
    const currentStatus = user.isUserActive();
    user.setActiveStatus(!currentStatus);
    const updatedUser = await user_repository_1.userRepository.updateUser(targetUserId, user);
    if (!updatedUser) {
        throw new AppError_1.AppError('Failed to update user status', 500);
    }
    return {
        success: true,
        data: updatedUser,
        message: `User ${!currentStatus ? 'activated' : 'deactivated'} successfully`
    };
};
exports.toggleUserStatusService = toggleUserStatusService;
