export const getApplicationStatusDefinition = {
  type: "function",
  function: {
    name: "getApplicationStatus",
    description: `
Use this tool to check the current status of the user's application within this platform for a specific scheme.

IMPORTANT:
This platform does NOT track real-time government processing.
It only reflects the application's status within this system.

Possible statuses include:
- initiated (user started application but not submitted)
- applied (application submitted through platform)
- rejected (application marked as rejected in system)

Use this tool ONLY when:
- The user asks about their application status on this platform.
- The user refers to an application they submitted through this system.

Examples:
- "What is my application status for PM-KISAN?"
- "Did my application get approved or rejected?"

STRICT RULES:
- Do NOT assume real-world government processing stages (e.g., under review, approved by ministry).
- Do NOT fabricate external tracking details.
- If the scheme name is missing, ask a clarification question.
- If no application exists for the user, return a clear message.

NOTES:
- The userId is inferred from session context.
- The result reflects only platform-level tracking.
`,
    parameters: {
      type: "object",
      properties: {
        schemeName: {
          type: "string",
          description: `
Exact name of the scheme for which the user wants to check application status.

Must be explicitly mentioned in the query.
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