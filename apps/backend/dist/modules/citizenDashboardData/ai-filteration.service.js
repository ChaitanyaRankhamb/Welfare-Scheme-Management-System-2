"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.aiFilterationService = void 0;
const appError_1 = require("../../Error/appError");
const openRouter_system_prompt_1 = require("./openRouter.system.prompt");
/* ---------------- MAIN SERVICE ---------------- */
const aiFilterationService = async (userId, filteredSchemes, profileData) => {
    if (!userId) {
        throw new appError_1.AppError("User not found", 404);
    }
    if (!filteredSchemes || filteredSchemes.length === 0) {
        return [];
    }
    if (!profileData) {
        throw new appError_1.AppError("Profile data not found", 404);
    }
    try {
        /* ---------------- USER INPUT ---------------- */
        const userProfileForAI = {
            age: profileData.age,
            annualIncome: profileData.annualIncome,
            gender: profileData.gender,
            location: {
                state: profileData.location?.state,
                district: profileData.location?.district,
                areaType: profileData.location?.areaType, // rural | urban
            },
            employmentStatus: profileData.employmentStatus,
            social: {
                caste: profileData.casteCategory,
                religion: profileData.religion,
            },
        };
        /* ---------------- SCHEMES INPUT (TOKEN OPTIMIZED) ---------------- */
        const schemesForAI = filteredSchemes.map((scheme) => {
            const eligibility = scheme.getEligibility();
            return {
                id: scheme.id.toString(),
                title: scheme.getTitle(),
                eligibility: {
                    age: eligibility.age,
                    income: eligibility.income,
                    gender: eligibility.gender,
                    employmentStatus: eligibility.employment.employmentStatus,
                    states: eligibility.location.states,
                    ruralOnly: eligibility.location.ruralOnly,
                    urbanOnly: eligibility.location.urbanOnly,
                    social: {
                        caste: eligibility.social.caste,
                        minority: eligibility.social.minority,
                        disability: eligibility.social.disability,
                    },
                },
                // compress benefits → reduce tokens
                benefitSummary: scheme.getBenefits().slice(0, 2).join(", "),
            };
        });
        // user input data to ai
        const aiInput = {
            userProfile: userProfileForAI,
            schemes: schemesForAI,
        };
        /* ---------------- AI API CALL ---------------- */
        const apiKey = process.env.OPENROUTER_API_KEY;
        if (!apiKey) {
            console.error("[AI] Missing API key → fallback");
            return addFallbackScores(filteredSchemes);
        }
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${apiKey}`,
                "HTTP-Referer": "http://localhost:3000",
                "X-OpenRouter-Title": "Welfare Scheme Management System",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "openai/gpt-4o-mini",
                temperature: 0,
                messages: [
                    {
                        role: "system",
                        content: openRouter_system_prompt_1.aiSchemesRecommendationSystemPrompt,
                    },
                    {
                        role: "user",
                        content: JSON.stringify(aiInput),
                    },
                ],
                response_format: { type: "json_object" },
            }),
        });
        if (!response.ok) {
            const err = await response.text();
            console.error("[AI] API Error:", err);
            return addFallbackScores(filteredSchemes);
        }
        const data = await response.json();
        const content = data?.choices?.[0]?.message?.content;
        console.log("ai generated content", content);
        if (!content) {
            console.error("[AI] Empty response");
            return addFallbackScores(filteredSchemes);
        }
        /* ---------------- SAFE PARSE ---------------- */
        let aiResults;
        try {
            aiResults = JSON.parse(content);
            if (!Array.isArray(aiResults.results)) {
                throw new Error("Invalid structure");
            }
        }
        catch (err) {
            console.error("[AI] JSON Parse Error:", content);
            return addFallbackScores(filteredSchemes);
        }
        /* ---------------- NORMALIZE SCORES ---------------- */
        const scoreMap = new Map();
        aiResults.results.forEach((r) => {
            if (!r?.id)
                return;
            let score = Number(r.score);
            if (isNaN(score))
                score = 0;
            // clamp + integer
            score = Math.max(0, Math.min(100, Math.round(score)));
            scoreMap.set(r.id, score);
        });
        /* ---------------- MERGE WITH SCHEMES ---------------- */
        const scoredSchemes = filteredSchemes.map((scheme) => {
            const id = scheme.id.toString();
            return {
                ...mapSchemeToJSON(scheme),
                aiScore: scoreMap.get(id) ?? 0,
            };
        });
        /* ---------------- FINAL SORT ---------------- */
        scoredSchemes.sort((a, b) => b.aiScore - a.aiScore);
        return scoredSchemes;
    }
    catch (error) {
        console.error("[AI] Unexpected Error:", error);
        return addFallbackScores(filteredSchemes);
    }
};
exports.aiFilterationService = aiFilterationService;
/* ---------------- FALLBACK ---------------- */
function addFallbackScores(schemes) {
    return schemes.map((scheme) => ({
        ...mapSchemeToJSON(scheme),
        aiScore: 0,
    }));
}
/* ---------------- MAPPER ---------------- */
function mapSchemeToJSON(scheme) {
    return {
        id: scheme.id.toString(),
        title: scheme.getTitle(),
        description: scheme.getDescription(),
        ministry: scheme.getMinistry(),
        category: scheme.getCategory(),
        tags: scheme.getTags(),
        eligibility: scheme.getEligibility(),
        benefits: scheme.getBenefits(),
        documentsRequired: scheme.getDocumentsRequired(),
        applicationUrl: scheme.getApplicationUrl(),
        applicationLink: scheme.getApplicationUrl(),
        trackingMeta: scheme.getTrackingMeta(),
        status: scheme.getStatus(),
        updatedAt: scheme.getUpdatedAt(),
    };
}
