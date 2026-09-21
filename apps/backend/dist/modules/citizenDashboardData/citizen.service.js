"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.citizenDataService = void 0;
const redis_connection_1 = __importDefault(require("../../config/redis.connection"));
const user_repository_1 = require("../../database/repository/user.repository");
const appError_1 = require("../../Error/appError");
const profile_service_1 = require("./profile.service");
const application_repository_1 = require("../../database/repository/application.repository");
const scheme_repository_1 = require("../../database/repository/scheme.repository");
const recommend_schemes_service_1 = require("./recommend-schemes.service");
const cache_TTL = 60 * 60 * 24; // 1 day
const citizenDataService = async (userId) => {
    try {
        // check user and it's role
        const user = await user_repository_1.userRepository.findUserById(userId.toString());
        if (!user) {
            throw new appError_1.AppError("User not found", 404);
        }
        if (user.getRole() !== "citizen") {
            throw new appError_1.AppError("User is not a citizen", 400);
        }
        // check if user has already logged in
        const cacheKey = `schemes:${userId.toString()}`;
        try {
            const cached = await redis_connection_1.default.get(cacheKey);
            if (cached) {
                try {
                    const parsed = JSON.parse(cached);
                    console.log("cache parsed data", parsed);
                    return {
                        fromCache: true,
                        ...parsed
                    };
                }
                catch (error) {
                    console.warn("[redis] cache is currupted, deleting it");
                    redis_connection_1.default.del(cacheKey);
                }
            }
        }
        catch {
            console.warn("[redis] is failed, continuing with normal flow");
        }
        // call the profile data service
        const profileData = await (0, profile_service_1.getUserProfileData)(userId);
        if (!profileData) {
            throw new appError_1.AppError("Profile not found", 404);
        }
        console.log("Profile used for filtering:", profileData);
        const allSchemes = await scheme_repository_1.schemeRepository.findAllSchemesWithoutLimit();
        const result = await recommend_schemes_service_1.recommendSchemesService.getRecommendations(profileData, userId, allSchemes);
        const { filteredSchemes, recommendations } = result;
        // Fetch application data
        const { applications } = await application_repository_1.applicationRepository.findApplicationsByUserId(userId.toString(), false);
        // Categorize applications
        const categorizedApps = {
            applied: [],
            approved: [],
            rejected: [],
            inProgress: []
        };
        for (const app of applications) {
            const scheme = await scheme_repository_1.schemeRepository.findSchemeById(app.getSchemeId().toString());
            const appData = {
                id: app.id.toString(),
                schemeName: scheme?.getTitle() || "Unknown Scheme",
                status: app.getStatus() === 'APPLIED' ? 'Applied' : 'Initiated',
                date: app.getCreatedAt().toISOString().split('T')[0]
            };
            if (app.getStatus() === 'APPLIED') {
                categorizedApps.applied.push(appData);
            }
            else {
                categorizedApps.inProgress.push(appData);
            }
        }
        // Mock scores/health for now or calculate if logic exists
        const profileHealthScore = 75; // Initial placeholder, can be calculated based on profile completion
        const responseData = {
            summary: {
                totalSchemes: allSchemes.map(s => ({
                    id: s.id.toString(),
                    title: s.getTitle(),
                    category: s.getCategory(),
                    description: s.getDescription(),
                    ministry: s.getMinistry(),
                    state: "National",
                    eligibility: s.getEligibility(),
                    benefits: s.getBenefits(),
                    applicationLink: s.getApplicationUrl(),
                    trackingMeta: s.getTrackingMeta()
                })),
                totalMatchedSchemes: filteredSchemes.length,
                totalApplications: applications.length,
                totalApproved: 0, // Not yet tracked in schema
                profileHealthScore
            },
            matchedSchemes: filteredSchemes.map((s) => ({
                id: s.id.toString(),
                title: s.getTitle(),
                category: s.getCategory(),
                state: "National", // Or fetch from eligibility
                description: s.getDescription()
            })),
            applications: categorizedApps,
            recommendations: {
                schemes: recommendations.slice(0, 10).map((s) => ({
                    ...s,
                    matchReason: "AI Score: " + s.aiScore + "%"
                })),
                applications: []
            }
        };
        console.log("Response data to be sent:", {
            summary: responseData.summary,
            matchedCount: responseData.matchedSchemes.length,
            recommendationsCount: responseData.recommendations.schemes.length
        });
        // Redis Write
        try {
            await redis_connection_1.default.set(cacheKey, JSON.stringify(responseData), {
                EX: cache_TTL,
            });
        }
        catch (error) {
            console.warn("[redis] write failed", error);
        }
        console.log("response data", responseData);
        return {
            fromCache: false,
            ...responseData
        };
    }
    catch (error) {
        throw error;
    }
};
exports.citizenDataService = citizenDataService;
