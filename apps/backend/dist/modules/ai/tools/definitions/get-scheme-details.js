"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSchemeDetailsDefinition = void 0;
exports.getSchemeDetailsDefinition = {
    type: "function",
    function: {
        name: "getSchemeDetails",
        description: `
Use this tool ONLY when the user explicitly asks about a specific government scheme 
and the scheme name is clearly mentioned in the query.

This tool returns complete structured information about a scheme including:
- detailed schemes discription
- benefits
- eligibility criteria
- required documents
- application process
- deadlines (if available)

STRICT RULES:
- Do NOT call this tool if the scheme name is missing, vague, or unclear.
- Do NOT guess or assume the scheme name.
- If the user query does not specify a scheme, ask a clarification question instead.
- If multiple schemes are mentioned, call this tool separately for each if needed.
`,
        parameters: {
            type: "object",
            properties: {
                schemeName: {
                    type: "string",
                    description: `
Exact name of the government scheme mentioned by the user.
Must be extracted directly from the user's query.

Examples:
- "PM-KISAN"
- "Ayushman Bharat"
- "PM Fasal Bima Yojana"

Do NOT fabricate or assume scheme names. If it is not clear, ask a clarification question instead. 
`
                }
            },
            required: ["schemeName"]
        }
    }
};
