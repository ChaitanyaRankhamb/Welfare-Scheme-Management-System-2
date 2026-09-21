"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.recommendSchemes = recommendSchemes;
const scheme_repository_1 = require("../../../../database/repository/scheme.repository");
const appError_1 = require("../../../../Error/appError");
const recommend_schemes_service_1 = require("../../../citizenDashboardData/recommend-schemes.service");
const profile_service_1 = require("../../../citizenDashboardData/profile.service");
const userId_1 = require("../../../../entity/user/userId");
async function recommendSchemes(userId) {
    if (!userId)
        throw new appError_1.AppError("Authentication required", 401);
    try {
        const userDomainId = new userId_1.UserId(userId);
        const [profileData, allSchemes] = await Promise.all([
            (0, profile_service_1.getUserProfileData)(userDomainId).catch(() => null),
            scheme_repository_1.schemeRepository.findAllSchemesWithoutLimit()
        ]);
        if (!profileData) {
            return {
                message: "Please complete your profile.",
                recommendations: [],
                status: "PROFILE_INCOMPLETE"
            };
        }
        // ✅ Use central engine
        const result = await recommend_schemes_service_1.recommendSchemesService.getRecommendations(profileData, userDomainId, allSchemes);
        const recommendations = result.recommendations;
        if (!recommendations.length) {
            return {
                message: "No matching schemes found.",
                recommendations: []
            };
        }
        const topChoices = recommendations.slice(0, 5).map((s) => ({
            title: s.title,
            score: s.aiScore,
            category: s.category,
            ministry: s.ministry
        }));
        return {
            success: true,
            totalRecommended: recommendations.length,
            recommendations: topChoices,
            message: "Top personalized schemes for you."
        };
    }
    catch (error) {
        console.error("Recommend Tool Error:", error);
        throw new appError_1.AppError("Failed to generate recommendations", 500);
    }
}
