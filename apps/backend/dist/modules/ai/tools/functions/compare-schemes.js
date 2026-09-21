"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compareSchemes = compareSchemes;
const scheme_repository_1 = require("../../../../database/repository/scheme.repository");
const appError_1 = require("../../../../Error/appError");
/**
 * Provides a side-by-side comparison between multiple welfare schemes.
 */
async function compareSchemes(schemeNames) {
    // 1. Validation
    if (!Array.isArray(schemeNames) || schemeNames.length < 2) {
        return {
            success: false,
            message: "At least two scheme names are required for a comparison.",
        };
    }
    // Cap the number of schemes to prevent performance issues and UI clutter
    const limitedNames = schemeNames.slice(0, 4);
    try {
        // 2. Fetch all schemes
        const fetchPromises = limitedNames.map(async (name) => {
            const normalized = name.trim();
            let scheme = await scheme_repository_1.schemeRepository.findSchemeByName(normalized);
            if (!scheme) {
                scheme = await scheme_repository_1.schemeRepository.findFuzzySchemeByName(normalized);
            }
            return { requestedName: name, scheme };
        });
        const results = await Promise.all(fetchPromises);
        const validSchemes = results.filter((r) => r.scheme !== null).map((r) => r.scheme);
        const missingNames = results.filter((r) => r.scheme === null).map((r) => r.requestedName);
        if (validSchemes.length < 2) {
            return {
                success: false,
                message: "We could not find enough matching schemes to perform a comparison.",
                found: validSchemes.length,
                missing: missingNames,
            };
        }
        // 3. Build Comparison Data
        const comparisonData = validSchemes.map((s) => {
            const eligibility = s.getEligibility();
            return {
                id: s.id.toString(),
                title: s.getTitle(),
                ministry: s.getMinistry(),
                category: s.getCategory(),
                benefitHighlights: s.getBenefits().slice(0, 3), // Show first 3 benefits
                eligibilityRules: {
                    age: `${eligibility.age.min} to ${eligibility.age.max} years`,
                    annualIncome: eligibility.income.max > 9999999
                        ? "No upper limit"
                        : `Up to ₹${eligibility.income.max}`,
                    gender: eligibility.gender === "any" ? "All Genders" : eligibility.gender,
                    employment: eligibility.employment.employmentStatus.length > 0
                        ? eligibility.employment.employmentStatus.join(", ")
                        : "All backgrounds"
                },
                documentsCount: s.getDocumentsRequired().length,
                tags: s.getTags().slice(0, 5)
            };
        });
        return {
            success: true,
            comparedCount: validSchemes.length,
            data: comparisonData,
            skipped: missingNames,
            summary: `Generated comparison for ${validSchemes.length} schemes: ${validSchemes.map(s => s.getTitle()).join(", ")}.`
        };
    }
    catch (error) {
        console.error("Compare Schemes Error:", error);
        if (error instanceof appError_1.AppError)
            throw error;
        throw new appError_1.AppError("An error occurred while generating the scheme comparison.", 500);
    }
}
