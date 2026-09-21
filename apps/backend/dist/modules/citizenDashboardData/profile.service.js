"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserProfileData = void 0;
const profile_repository_1 = require("../../database/repository/profile.repository");
const user_repository_1 = require("../../database/repository/user.repository");
const appError_1 = require("../../Error/appError");
function normalizeLocation(raw) {
    return {
        country: raw?.country,
        state: raw?.state,
        district: raw?.district,
        taluka: raw?.taluka,
        village: raw?.village,
        areaType: raw?.ruralOrUrban === 'rural'
            ? 'rural'
            : raw?.ruralOrUrban === 'urban'
                ? 'urban'
                : undefined,
    };
}
const getUserProfileData = async (userId) => {
    const user = await user_repository_1.userRepository.findUserById(userId.toString());
    if (!user) {
        throw new appError_1.AppError('User not found', 404);
    }
    if (user.getRole() !== 'citizen') {
        throw new appError_1.AppError('User is not a citizen', 400);
    }
    const profileData = await profile_repository_1.profileRepository.findProfileByUserId(userId.toString());
    if (!profileData) {
        throw new appError_1.AppError('Profile data not found', 404);
    }
    return {
        age: profileData.getAge(),
        gender: profileData.getGender().toLowerCase(),
        annualIncome: Number(profileData.getAnnualIncome()),
        location: normalizeLocation(profileData.getLocation()),
        employmentStatus: profileData.getEmploymentStatus(),
        occupationType: (profileData.getSnapshot().occupationType || "").toLowerCase(),
        casteCategory: profileData.getCasteCategory(),
        religion: profileData.getReligion(),
    };
};
exports.getUserProfileData = getUserProfileData;
