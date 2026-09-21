"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfileService = void 0;
const profile_repository_1 = require("../../../database/repository/profile.repository");
const user_repository_1 = require("../../../database/repository/user.repository");
const AppError_1 = require("../../../reuse-components/AppError");
/**
 * @description Updates an existing user profile and recalculates completion
 * @param {string} userId - Authenticated user ID
 * @param {any} updateData - Partial profile details to update
 * @returns {Promise<{ success: boolean; data: any; message: string }>}
 */
const updateProfileService = async (userId, updateData) => {
    if (!userId) {
        throw new AppError_1.AppError('Unauthorized', 401);
    }
    const user = await user_repository_1.userRepository.findUserById(userId);
    if (!user) {
        throw new AppError_1.AppError('User not found', 404);
    }
    let profile = await profile_repository_1.profileRepository.findProfileByUserId(userId);
    if (!profile) {
        // Create new profile if not found (Upsert)
        const { Profile } = await Promise.resolve().then(() => __importStar(require('../../../entity/profile/profile.entity')));
        const { ProfileId } = await Promise.resolve().then(() => __importStar(require('../../../entity/profile/profileId')));
        const { UserId } = await Promise.resolve().then(() => __importStar(require('../../../entity/user/userId')));
        profile = new Profile(new ProfileId('temp'), {
            userId: new UserId(userId),
            firstName: updateData.firstName || 'User',
            middleName: updateData.middleName || '',
            lastName: updateData.lastName || 'Pending',
            gender: updateData.gender || 'OTHER',
            dateOfBirth: updateData.dateOfBirth ? new Date(updateData.dateOfBirth) : new Date(),
            mobileNumber: updateData.mobileNumber || '0000000000',
            country: updateData.country || 'India',
            state: updateData.state || 'Maharashtra', // Default state
            district: updateData.district || 'Pending',
            taluka: updateData.taluka || '',
            village: updateData.village || '',
            pincode: updateData.pincode || '400001',
            areaType: updateData.areaType || 'RURAL',
            annualIncome: Number(updateData.annualIncome) || 0,
            bplStatus: !!updateData.bplStatus,
            casteCategory: updateData.casteCategory || 'general',
            religion: updateData.religion || 'other',
            occupationType: updateData.occupationType || 'other',
            employmentStatus: updateData.employmentStatus || 'unemployed',
            ...updateData,
            profileCompletionPercentage: 0
        }, new Date(), new Date());
        profile.recalculateCompletion();
        const savedProfile = await profile_repository_1.profileRepository.createProfile({
            ...profile.getSnapshot(),
            userId: userId
        });
        return {
            success: true,
            data: savedProfile.getSnapshot(),
            message: 'Profile initialized and updated successfully'
        };
    }
    // Use entity's patch method for existing profiles
    profile.patch(updateData);
    const updatedProfile = await profile_repository_1.profileRepository.updateProfile(userId, profile);
    if (!updatedProfile) {
        throw new AppError_1.AppError('Failed to update profile', 500);
    }
    return {
        success: true,
        data: updatedProfile.getSnapshot(),
        message: 'Profile updated successfully'
    };
};
exports.updateProfileService = updateProfileService;
