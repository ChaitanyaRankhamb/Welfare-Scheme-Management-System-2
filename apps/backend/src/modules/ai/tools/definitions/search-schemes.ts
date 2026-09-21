export const searchSchemesDefinition = {
  type: "function",
  function: {
    name: "searchSchemes",
    description: `
Use this tool to search for government schemes based on general keywords, categories, or user needs.

This tool is designed for discovery when the user does NOT know exact scheme names.

It returns:
- a list of relevant schemes
- basic details like name, short description, and category

Use this tool ONLY when:
- The user asks for schemes related to a topic or category
- The user does not mention a specific scheme name
- The user is exploring options

Examples:
- "Schemes for farmers"
- "Education schemes in India"
- "Government benefits for women"
- "Yojanas for small businesses"
- "What are the schemes for women of Maharashtra"

STRICT RULES:
- Do NOT use this tool if the user mentions a specific scheme name
  → use 'getSchemeDetails' instead.
- Do NOT use this tool for personalized eligibility queries
  → use 'getEligibleSchemes' or 'recommendSchemes'.
- Do NOT use this tool for comparison queries
  → use 'compareSchemes'.
- Do NOT guess or fabricate schemes — always rely on backend search results.
- If the query is too vague (e.g., "schemes"), ask a clarification question instead.

NOTES:
- The query should be extracted directly from the user's input.
- Keep the query concise and meaningful (avoid unnecessary words).
`,
    parameters: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: `
Keyword or phrase extracted from the user's query to search for schemes.

Guidelines:
- Must reflect the user's intent (e.g., "farmer", "student", "women", "startup", "pension")
- Keep it short and relevant
- Do NOT include unnecessary words like "show me", "find", etc.

Examples:
- "farmer"
- "education"
- "women entrepreneur"
- "pension scheme"
`
        }
      },
      required: ["query"],
      additionalProperties: false
    }
  }
};