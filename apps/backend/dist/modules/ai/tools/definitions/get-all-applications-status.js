"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllApplicationStatusesDefinition = void 0;
exports.getAllApplicationStatusesDefinition = {
    type: "function",
    function: {
        name: "getAllApplicationStatuses",
        description: `
Use this tool to retrieve the status of all applications submitted by the current user on this platform.

IMPORTANT:
This platform does NOT track real-time government processing.
It only reflects application states within this system.

Possible statuses:
- initiated (application started but not submitted)
- applied (application submitted through platform)
- rejected (application marked as rejected in system)

This tool returns:
- a list of all applications
- scheme names
- their corresponding statuses

Use this tool ONLY when:
- The user asks for all application statuses
- The user asks to view all their applications
- The user wants a list of schemes they have applied for

Examples:
- "Show all my applications"
- "Give me the status of all my applications"
- "Which schemes have I applied for?"
- "List my applications"

STRICT RULES:
- Do NOT use this tool for a single scheme → use 'getApplicationStatus'
- Do NOT assume or generate real-world government processing stages
- Do NOT fabricate application data
- If the user has no applications, return an empty list with a clear message

CLARIFICATION RULE:
- If the user query is ambiguous (e.g., "application status"), ask whether they want:
  - a specific scheme status, OR
  - all applications

NOTES:
- userId is inferred from session context
`,
        parameters: {
            type: "object",
            properties: {},
            additionalProperties: false
        }
    }
};
