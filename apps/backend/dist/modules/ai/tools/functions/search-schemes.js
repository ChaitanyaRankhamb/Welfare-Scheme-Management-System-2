"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchSchemes = searchSchemes;
const appError_1 = require("../../../../Error/appError");
const query_normalization_service_1 = require("../../service/query-normalization.service");
const extract_searchMetadata_service_1 = require("../../service/extract-searchMetadata.service");
const scheme_repository_1 = require("../../../../database/repository/scheme.repository");
async function searchSchemes(query) {
    if (!query) {
        throw new appError_1.AppError("Query is required", 400);
    }
    try {
        // 1. Normalize query
        const normalizedQuery = (0, query_normalization_service_1.normalizeQuery)(query);
        // 2. Extract intent + filters + keywords
        const { keywords, filters } = await (0, extract_searchMetadata_service_1.extractSearchMetadata)(normalizedQuery);
        // 3. Fetch schemes (broad match)
        const schemes = await scheme_repository_1.schemeRepository.searchByKeywords(keywords);
        // 4. Apply rule-based filtering
        const filteredSchemes = applyFilters(schemes, filters);
        // 5. Rank results
        const rankedSchemes = rankSchemes(filteredSchemes, keywords);
        // 6. Fallback (if empty)
        if (rankedSchemes.length === 0) {
            return await fallbackSearch(query);
        }
        // Map to plain objects for AI tool response
        return rankedSchemes.map(s => ({
            id: s.id.toString(),
            title: s.getTitle(),
            description: s.getDescription(),
            category: s.getCategory(),
            ministry: s.getMinistry(),
            benefits: s.getBenefits().slice(0, 2)
        }));
    }
    catch (error) {
        console.error("Search Tool Error:", error);
        throw new appError_1.AppError("Failed to search schemes", 500);
    }
}
/**
 * Filter schemes based on extracted metadata
 */
function applyFilters(schemes, filters) {
    return schemes.filter(scheme => {
        const eligibility = scheme.getEligibility();
        // Category Filter
        if (filters.category && scheme.getCategory().toLowerCase() !== filters.category.toLowerCase()) {
            return false;
        }
        // State Filter
        if (filters.state) {
            const states = eligibility.location.states || [];
            if (states.length > 0 && !states.some(s => s.toLowerCase().includes(filters.state.toLowerCase()))) {
                return false;
            }
        }
        // Caste Filter
        if (filters.caste) {
            const castes = eligibility.social.caste || [];
            if (castes.length > 0 && !castes.some(c => c.toLowerCase().includes(filters.caste.toLowerCase()))) {
                return false;
            }
        }
        // Beneficiary Type Filter (Mapped to employment or tags)
        if (filters.beneficiaryType) {
            const bType = filters.beneficiaryType.toLowerCase();
            const hasMatch = scheme.getTags().some(t => t.toLowerCase().includes(bType)) ||
                eligibility.employment.employmentStatus.some(s => s.toLowerCase().includes(bType));
            if (!hasMatch)
                return false;
        }
        return true;
    });
}
/**
 * Simple ranking based on keyword matches
 */
function rankSchemes(schemes, keywords) {
    if (keywords.length === 0)
        return schemes;
    const scored = schemes.map(scheme => {
        let score = 0;
        const text = (scheme.getTitle() + " " + scheme.getDescription()).toLowerCase();
        keywords.forEach(kw => {
            const regex = new RegExp(kw.toLowerCase(), "g");
            const count = (text.match(regex) || []).length;
            score += count;
        });
        return { scheme, score };
    });
    return scored
        .filter(item => item.score > 0)
        .sort((a, b) => b.score - a.score)
        .map(item => item.scheme);
}
/**
 * Fallback to standard full-text search if structured search fails
 */
async function fallbackSearch(query) {
    const { schemes } = await scheme_repository_1.schemeRepository.searchSchemes(query, 0, 5);
    return schemes.map(s => ({
        id: s.id.toString(),
        title: s.getTitle(),
        description: s.getDescription(),
        category: s.getCategory(),
        ministry: s.getMinistry()
    }));
}
