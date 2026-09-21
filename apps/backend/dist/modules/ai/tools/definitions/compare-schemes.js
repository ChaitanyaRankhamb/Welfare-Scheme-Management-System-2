"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compareSchemesDefinition = void 0;
exports.compareSchemesDefinition = {
    type: "function",
    function: {
        name: "compareSchemes",
        description: `
Use this tool to compare two or more specific government schemes based on their key attributes.

This tool provides a structured comparison including:
- scheme discription
- benefits
- eligibility criteria
- required documents
- ministry or department
- key differences

Use this tool ONLY when:
- The user explicitly asks to compare multiple schemes.
- The user asks for differences between schemes.
- The user asks which scheme is better among given options.

Examples:
- "Compare PM-KISAN and PMFBY"
- "What is the difference between Ayushman Bharat and PMJAY?"
- "Which is better for me: Scheme A or Scheme B?"

STRICT RULES:
- Do NOT use this tool if fewer than 2 schemes are mentioned.
- Do NOT guess or assume scheme names.
- If only one scheme is mentioned → use 'getSchemeDetails' instead.
- If no scheme names are provided → ask a clarification question.
- Do NOT use this tool for general recommendations → use 'recommendSchemes'.
- Do NOT fabricate comparison data — always rely on backend results.

NOTES:
- The tool expects at least 2 valid scheme names.
- The backend will return structured comparison data.
`,
        parameters: {
            type: "object",
            properties: {
                schemeNames: {
                    type: "array",
                    items: {
                        type: "string"
                    },
                    minItems: 2,
                    description: `
List of exact scheme names to compare.

Requirements:
- Must contain at least 2 scheme names.
- Each name must be explicitly mentioned in the user query.
- Do NOT infer or guess scheme names.

Examples:
["PM-KISAN", "PM Fasal Bima Yojana"]
`
                }
            },
            required: ["schemeNames"],
            additionalProperties: false
        }
    }
};
