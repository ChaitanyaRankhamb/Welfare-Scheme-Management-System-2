export const getApplicationStepsDefinition = {
  type: "function",
  function: {
    name: "getApplicationSteps",
    description: `
Use this tool to retrieve the complete step-by-step application process for a specific government scheme,
including required documents and instructions.

This tool returns:
- detailed application steps (in order)
- required documents
- any important notes (e.g., online/offline process, deadlines if available)

Use this tool ONLY when:
- The user asks how to apply for a specific scheme.
- The user asks about the application process.
- The user asks about required documents for a specific scheme.

Examples:
- "How do I apply for Ayushman Bharat?"
- "What is the application process for PM-KISAN?"
- "What documents are required for PM Fasal Bima Yojana?"

STRICT RULES:
- Do NOT use this tool if the scheme name is missing or unclear.
- Do NOT guess or assume the scheme name.
- If the scheme is not specified, ask a clarification question instead.
- Do NOT use this tool for general scheme information
  → use 'getSchemeDetails' instead.
- Do NOT fabricate steps or documents — always rely on backend data.

NOTES:
- The schemeName must be explicitly mentioned in the user query.
`,
    parameters: {
      type: "object",
      properties: {
        schemeName: {
          type: "string",
          description: `
Exact name of the government scheme mentioned by the user.

Must be explicitly present in the query.
Do NOT infer or guess.

Examples:
- "PM-KISAN"
- "Ayushman Bharat"
`
        }
      },
      required: ["schemeName"],
      additionalProperties: false
    }
  }
};