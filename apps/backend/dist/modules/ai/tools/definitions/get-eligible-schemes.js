"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEligibleSchemesDefinition = void 0;
exports.getEligibleSchemesDefinition = {
    type: "function",
    function: {
        name: "getEligibleSchemes",
        description: `
Use this tool to retrieve all government welfare schemes that the current user is eligible for,
based on their verified profile data such as age, income, occupation, gender, and location.

This tool should be used ONLY when the user is asking for personalized scheme suggestions.

Valid use cases:
- "What schemes am I eligible for?"
- "Show me schemes I can apply for"
- "Are there any government benefits for me?"
- "Suggest schemes based on my profile"

STRICT RULES:
- Do NOT use this tool for general scheme discovery (e.g., "schemes for farmers").
- Do NOT use this tool if the user is asking about a specific scheme.
- Do NOT assume eligibility without checking user profile.
- Do NOT guess or generate schemes manually — always rely on this tool for accuracy.
- If user has not completed their profile, ask them to complete their profile first.

NOTES:
- The userId is automatically inferred from the session context on the backend.
- This tool returns a list of eligible schemes with basic details.
`,
        parameters: {
            type: "object",
            properties: {},
            additionalProperties: false
        }
    }
};
