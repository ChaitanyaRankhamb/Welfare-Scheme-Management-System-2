"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSchemeDetails = getSchemeDetails;
const scheme_repository_1 = require("../../../../database/repository/scheme.repository");
const appError_1 = require("../../../../Error/appError");
async function getSchemeDetails(input) {
    const schemeName = typeof input === "string" ? input : input?.schemeName;
    // 1. Validate input
    if (!schemeName || typeof schemeName !== "string" || !schemeName.trim()) {
        return {
            success: false,
            status: "INVALID_INPUT",
            message: "Invalid scheme name",
            scheme: null
        };
    }
    const normalizedName = schemeName.trim().toLowerCase();
    try {
        // 2. Exact match search
        const scheme = await scheme_repository_1.schemeRepository.findSchemeByName(normalizedName);
        if (scheme) {
            const eligibility = scheme.getEligibility();
            return {
                success: true,
                status: "FOUND",
                scheme: {
                    id: scheme.id.toString(),
                    title: scheme.getTitle(),
                    description: scheme.getDescription(),
                    ministry: scheme.getMinistry(),
                    category: scheme.getCategory(),
                    benefits: scheme.getBenefits(),
                    documentsRequired: scheme.getDocumentsRequired(),
                    applicationUrl: scheme.getApplicationUrl(),
                    eligibility,
                    trackingMeta: scheme.getTrackingMeta(),
                }
            };
        }
        // 3. Fuzzy suggestion
        const suggestion = await scheme_repository_1.schemeRepository.findFuzzySchemeByName(normalizedName);
        if (suggestion) {
            return {
                success: false,
                status: "SUGGESTION",
                message: "Scheme not found. Did you mean this?",
                suggestion: {
                    title: suggestion.getTitle(),
                    id: suggestion.id // optional
                },
                scheme: null
            };
        }
        // 4. Final fallback
        return {
            success: false,
            status: "NOT_FOUND",
            message: "Scheme is not available on this platform",
            scheme: null
        };
    }
    catch (error) {
        console.error("Get Scheme Details Error:", error);
        // Only throw for true system errors
        throw new appError_1.AppError("Failed to fetch scheme details", 500);
    }
}
