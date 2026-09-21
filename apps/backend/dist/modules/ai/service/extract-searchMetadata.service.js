"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractSearchMetadata = exports.ruleBasedKeywordExtractions = void 0;
const extract_metadata_prompt_1 = require("./extract-metadata.prompt");
const ruleBasedKeywordExtractions = (normalizedQuery) => {
    // Simple extraction: remove common stop words and keep meaningful terms
    const stopWords = ["a", "an", "the", "in", "on", "at", "for", "of", "with", "is", "are", "to", "and", "under", "scheme", "schemes", "government", "gov"];
    return normalizedQuery
        .split(" ")
        .filter(word => word.length > 2 && !stopWords.includes(word));
};
exports.ruleBasedKeywordExtractions = ruleBasedKeywordExtractions;
const extractSearchMetadata = async (normalizedQuery) => {
    try {
        const apiKey = process.env.OPENROUTER_API_KEY;
        if (!apiKey) {
            console.warn("[AI] No API Key for metadata extraction, falling back to rule-based.");
            return {
                keywords: (0, exports.ruleBasedKeywordExtractions)(normalizedQuery),
                filters: { intent: "search" }
            };
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
                        content: extract_metadata_prompt_1.METADATA_EXTRACTION_PROMPT.replace("{{query}}", normalizedQuery),
                    }
                ],
                response_format: { type: "json_object" },
            }),
        });
        if (!response.ok) {
            throw new Error(`AI API failed: ${response.statusText}`);
        }
        const data = await response.json();
        const content = data?.choices?.[0]?.message?.content;
        if (!content) {
            return {
                keywords: (0, exports.ruleBasedKeywordExtractions)(normalizedQuery),
                filters: { intent: "search" }
            };
        }
        const metadata = JSON.parse(content);
        // Split keywords and other filters
        const { keywords, ...filters } = metadata;
        return {
            keywords: keywords || (0, exports.ruleBasedKeywordExtractions)(normalizedQuery),
            filters
        };
    }
    catch (error) {
        console.error("[AI] Metadata extraction error:", error);
        return {
            keywords: (0, exports.ruleBasedKeywordExtractions)(normalizedQuery),
            filters: {}
        };
    }
};
exports.extractSearchMetadata = extractSearchMetadata;
