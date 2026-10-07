export const getRequiredDocumentsDefinition = {
  type: "function",
  function: {
    name: "getRequiredDocuments",
    description: `
Use this tool when the user asks which documents are required for a specific government scheme.

This tool returns only the required documents stored for the requested scheme.

STRICT RULES:
- Do NOT use this tool if the scheme name is missing or unclear.
- Do NOT guess or assume the scheme name.
- If the scheme is not specified, ask a clarification question instead.
- Do NOT invent or add documents that are not returned by this tool.
- For questions about application steps, use 'getApplicationSteps'.
`,
    parameters: {
      type: "object",
      properties: {
        schemeName: {
          type: "string",
          description: "The scheme name explicitly mentioned in the user's query.",
        },
      },
      required: ["schemeName"],
      additionalProperties: false,
    },
  },
};
