"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.recommendSchemesService = void 0;
const scheme_repository_1 = require("../../database/repository/scheme.repository");
const rule_based_filteration_service_1 = require("./rule-based-filteration.service");
const ai_filteration_service_1 = require("./ai-filteration.service");
exports.recommendSchemesService = {
    async getRecommendations(profile, userId, allSchemes) {
        // 1. Use passed schemes OR fetch once
        const schemes = allSchemes ?? await scheme_repository_1.schemeRepository.findAllSchemesWithoutLimit();
        // 2. Rule-based filtering (PASS schemes to avoid duplicate DB call)
        const filteredSchemes = await (0, rule_based_filteration_service_1.ruleBasedFilterationService)(profile, schemes);
        if (!filteredSchemes.length) {
            return {
                filteredSchemes: [],
                recommendations: []
            };
        }
        // 3. AI scoring
        const scoredSchemes = await (0, ai_filteration_service_1.aiFilterationService)(userId, filteredSchemes, profile);
        // 4. Final sort
        scoredSchemes.sort((a, b) => b.aiScore - a.aiScore);
        return {
            filteredSchemes,
            recommendations: scoredSchemes
        };
    }
};
