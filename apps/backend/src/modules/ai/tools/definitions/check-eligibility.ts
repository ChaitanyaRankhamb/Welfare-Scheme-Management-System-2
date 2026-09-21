export const checkEligibilityForSchemeDefinition = {
  type: "function",
  function: {
    name: "checkEligibilityForScheme",
    description: `
Use this tool to check whether the current user is eligible for a specific government scheme.

This tool performs a detailed eligibility analysis by comparing the user's verified profile 
(age, income, occupation, gender, location, etc.) against the scheme's eligibility criteria.

It returns:
- overall eligibility status (eligible / not eligible)
- list of matched criteria
- list of unmatched criteria (if any)
- explanation for ineligibility (if applicable)

Use this tool ONLY when:
- The user asks about their eligibility for a specific scheme.
- The user asks why they are not eligible for a scheme.
- The user wants a detailed eligibility breakdown.

Examples:
- "Am I eligible for PM-KISAN?"
- "Why am I not eligible for Ayushman Bharat?"
- "Check my eligibility for PM Fasal Bima Yojana"

STRICT RULES:
- Do NOT use this tool if the scheme name is missing or unclear.
- Do NOT guess or assume the scheme name.
- If the scheme is not specified, ask a clarification question instead.
- Do NOT use this tool for general eligibility queries like "What schemes am I eligible for?" 
  → use 'getEligibleSchemes' instead.
- Do NOT fabricate eligibility results — always rely on backend computation.

NOTES:
- The userId is automatically inferred from the session context.
`,
    parameters: {
      type: "object",
      properties: {
        schemeName: {
          type: "string",
          description: `
Exact name of the government scheme mentioned by the user.

Must be explicitly present in the user query.
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