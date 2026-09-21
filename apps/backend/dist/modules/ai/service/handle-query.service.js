"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleQueryService = void 0;
const user_repository_1 = require("../../../database/repository/user.repository");
const appError_1 = require("../../../Error/appError");
const ai_agent_system_prompt_1 = require("../ai-agent-system-prompt");
const tools_1 = require("../tools");
const handleQueryService = async (query, userId) => {
    try {
        // Validate user
        const user = await user_repository_1.userRepository.findUserById(userId.toString());
        if (!user) {
            throw new appError_1.AppError('User not found', 404);
        }
        const apiKey = process.env.OPENROUTER_API_KEY;
        if (!apiKey) {
            throw new appError_1.AppError('OpenRouter API key not found', 500);
        }
        if (!ai_agent_system_prompt_1.aiAgentSystemPrompt) {
            throw new appError_1.AppError('AI Agent System Prompt not found', 500);
        }
        // Messages array (important for loop)
        const messages = [
            { role: 'system', content: ai_agent_system_prompt_1.aiAgentSystemPrompt },
            { role: 'user', content: query },
        ];
        let finalResponse = null;
        let recommendSchemesResult = null;
        let schemeDetailsResult = null;
        let iterations = 0;
        const MAX_ITERATIONS = 5;
        while (iterations < MAX_ITERATIONS) {
            iterations++;
            const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    "HTTP-Referer": "http://localhost:3000",
                    "X-OpenRouter-Title": "Welfare Scheme Management System",
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: "openrouter/free",
                    messages,
                    tools: tools_1.aiTools,
                    tool_choice: "auto",
                }),
            });
            const data = await response.json();
            const message = data.choices?.[0]?.message;
            if (!message) {
                throw new appError_1.AppError('Invalid AI response', 500);
            }
            // If NO tool call → final answer
            if (!message.tool_calls) {
                finalResponse = message.content;
                break;
            }
            // Add assistant message (tool call)
            messages.push(message);
            // Handle tool calls (support multiple)
            for (const toolCall of message.tool_calls) {
                const toolName = toolCall.function.name;
                const toolArgs = JSON.parse(toolCall.function.arguments || "{}");
                const func = tools_1.aiToolFunctions[toolName];
                if (!func) {
                    throw new appError_1.AppError(`Unknown tool: ${toolName}`, 400);
                }
                let toolResult;
                // Determine if tool needs userId (basic heuristic for now based on tool names)
                const needsUserId = ["getEligibleSchemes", "checkEligibilityForScheme", "getApplicationStatus", "recommendSchemes", "getAllApplicationStatuses"].includes(toolName);
                if (needsUserId) {
                    toolResult = await func(userId.toString(), toolArgs);
                }
                else {
                    toolResult = await func(toolArgs);
                }
                if (toolName === "recommendSchemes") {
                    recommendSchemesResult = toolResult;
                }
                if (toolName === "getSchemeDetails") {
                    schemeDetailsResult = toolResult;
                }
                // Push tool result back to conversation
                messages.push({
                    role: "tool",
                    tool_call_id: toolCall.id,
                    name: toolName,
                    content: JSON.stringify(toolResult),
                });
            }
        }
        if (!finalResponse && recommendSchemesResult) {
            finalResponse = recommendSchemesResult.message || "Here are your top recommended schemes.";
        }
        if (!finalResponse) {
            throw new appError_1.AppError('AI failed to generate response', 500);
        }
        return {
            success: true,
            data: finalResponse,
            recommendations: recommendSchemesResult?.recommendations || [],
            recommendationStatus: recommendSchemesResult?.status || null,
            totalRecommended: recommendSchemesResult?.totalRecommended || 0,
            schemeTitle: schemeDetailsResult?.scheme?.title || null,
            requiredDocuments: Array.isArray(schemeDetailsResult?.scheme?.documentsRequired)
                ? schemeDetailsResult.scheme.documentsRequired
                : [],
        };
    }
    catch (error) {
        console.error("AI Service Error:", error);
        throw new appError_1.AppError(error.message || 'AI query processing failed', error.statusCode || 500);
    }
};
exports.handleQueryService = handleQueryService;
