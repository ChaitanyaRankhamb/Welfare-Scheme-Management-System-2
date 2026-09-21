"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.recommendSchemesDefinition = void 0;
exports.recommendSchemesDefinition = {
    type: "function",
    function: {
        name: "recommendSchemes",
        description: `
Use this tool to generate a personalized, prioritized list of the most relevant government schemes
for the current user based on their profile (age, income, occupation, gender, location, etc.).

Unlike 'getEligibleSchemes', this tool:
- ranks schemes based on relevance and usefulness
- highlights top matches instead of returning all eligible schemes
- focuses on quality over quantity

This tool should be used ONLY when the user is asking for recommendations or guidance.

Valid use cases:
- "Recommend me some schemes"
- "Which schemes are best for me?"
- "What should I apply for?"
- "Suggest top government benefits for me"

STRICT RULES:
- Do NOT use this tool if the user is asking about a specific scheme.
- Do NOT use this tool for general discovery queries like "schemes for farmers"
  → use 'searchSchemes' instead.
- Do NOT use this tool when the user explicitly asks for ALL eligible schemes
  → use 'getEligibleSchemes' instead.
- Do NOT guess or generate schemes manually — always rely on backend recommendations.

NOTES:
- The userId is automatically inferred from session context.
- The result will contain a ranked list of schemes with priority scores or relevance indicators.
`,
        parameters: {
            type: "object",
            properties: {},
            additionalProperties: false
        }
    }
};
