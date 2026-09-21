"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getApplicationSteps = getApplicationSteps;
const scheme_repository_1 = require("../../../../database/repository/scheme.repository");
const appError_1 = require("../../../../Error/appError");
/**
 * Retrieves the application process, steps, and required documents for a scheme.
 */
async function getApplicationSteps(schemeName) {
    if (!schemeName || typeof schemeName !== "string" || !schemeName.trim()) {
        return {
            success: false,
            message: "A valid scheme name is required to fetch application steps.",
        };
    }
    const normalizedName = schemeName.trim();
    try {
        // 1. Fetch scheme (Exact match first)
        let scheme = await scheme_repository_1.schemeRepository.findSchemeByName(normalizedName);
        // 2. Fuzzy match if exact match is not found
        if (!scheme) {
            scheme = await scheme_repository_1.schemeRepository.findFuzzySchemeByName(normalizedName);
        }
        if (!scheme) {
            return {
                success: false,
                message: `We couldn't find any scheme matching "${schemeName}". Please verify the name.`,
            };
        }
        const trackingMeta = scheme.getTrackingMeta();
        const documents = scheme.getDocumentsRequired();
        const applicationUrl = scheme.getApplicationUrl();
        return {
            success: true,
            schemeTitle: scheme.getTitle(),
            processType: trackingMeta?.type || "Standard",
            applicationUrl: applicationUrl || "Search on the official government portal",
            steps: (trackingMeta?.instructions && trackingMeta.instructions.length > 0)
                ? trackingMeta.instructions
                : [
                    "Visit the official department/ministry portal.",
                    "Register as a new user or login to your existing account.",
                    "Locate the scheme in the application or services section.",
                    "Complete the online application form with personal and financial details.",
                    "Upload all required documents as per the specified formats.",
                    "Review and submit the application.",
                    "Download/Print the acknowledgment receipt for future tracking."
                ],
            requiredDocuments: documents.length > 0
                ? documents
                : [
                    "Identity Proof (Aadhar, Voter ID, etc.)",
                    "Address Proof (Utility bill, Domicile certificate, etc.)",
                    "Income Certificate (if applicable)",
                    "Caste Certificate (if applying under a category)",
                    "Bank Account Details"
                ],
            notes: "Please double-check all information before final submission. Late or incomplete applications are typically rejected."
        };
    }
    catch (error) {
        console.error("Get Application Steps Error:", error);
        // Distinguish between handled app errors and system errors
        if (error instanceof appError_1.AppError)
            throw error;
        throw new appError_1.AppError("An error occurred while retrieving the application process.", 500);
    }
}
