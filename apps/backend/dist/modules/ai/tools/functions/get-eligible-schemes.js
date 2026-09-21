"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEligibleSchemes = getEligibleSchemes;
const scheme_repository_1 = require("../../../../database/repository/scheme.repository");
const appError_1 = require("../../../../Error/appError");
const profile_service_1 = require("../../../citizenDashboardData/profile.service");
const rule_based_filteration_service_1 = require("../../../citizenDashboardData/rule-based-filteration.service");
async function getEligibleSchemes(userId) {
    if (!userId) {
        throw new appError_1.AppError("User ID is required", 400);
    }
    // get all schemes
    const allSchemes = await scheme_repository_1.schemeRepository.findAllSchemesWithoutLimit();
    if (!allSchemes || allSchemes.length === 0) {
        return {
            success: true,
            totalEligible: 0,
            schemes: [],
            message: "No schemes available"
        };
    }
    // get profile data
    const profileData = await (0, profile_service_1.getUserProfileData)(userId);
    if (!profileData) {
        return {
            success: false,
            status: "PROFILE_INCOMPLETE",
            message: "Please complete your profile to check eligibility",
            schemes: []
        };
    }
    // apply rule based filteration
    const filteredSchemes = await (0, rule_based_filteration_service_1.ruleBasedFilterationService)(profileData, allSchemes);
    return {
        success: true,
        totalEligible: filteredSchemes.length,
        schemes: filteredSchemes,
        message: filteredSchemes.length
            ? "Eligible schemes fetched successfully"
            : "No eligible schemes found"
    };
}
