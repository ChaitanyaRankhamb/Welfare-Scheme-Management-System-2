"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.streamQueryService = void 0;
const user_repository_1 = require("../../../database/repository/user.repository");
const appError_1 = require("../../../Error/appError");
const ai_agent_system_prompt_1 = require("../ai-agent-system-prompt");
const tools_1 = require("../tools");
const streamQueryService = async (query, userId, onChunk) => {
    try {
        const user = await user_repository_1.userRepository.findUserById(userId.toString());
        if (!user) {
            throw new appError_1.AppError('User not found', 404);
        }
        const apiKey = process.env.OPENROUTER_API_KEY;
        if (!apiKey) {
            throw new appError_1.AppError('OpenRouter API key not found', 500);
        }
        // 1. Understanding Query
        onChunk({ type: "status", message: "Understanding your request..." });
        const messages = [
            { role: 'system', content: ai_agent_system_prompt_1.aiAgentSystemPrompt },
            { role: 'user', content: query },
        ];
        // Call AI to detect intent (get tool calls)
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
                stream: false, // We only need the tool intent for this structured event flow
            }),
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new appError_1.AppError(`AI API Error: ${errorText}`, response.status);
        }
        const data = await response.json();
        const message = data.choices?.[0]?.message;
        if (!message) {
            throw new appError_1.AppError('Failed to get response', 500);
        }
        if (message.tool_calls && message.tool_calls.length > 0) {
            // 1. Check for getSchemeDetails
            const schemeDetailsCall = message.tool_calls.find((tc) => tc.function.name === 'getSchemeDetails');
            if (schemeDetailsCall) {
                // Flow for scheme details
                onChunk({ type: "intent", message: "Fetching scheme details" });
                onChunk({ type: "status", message: "Identifying scheme..." });
                const toolArgs = JSON.parse(schemeDetailsCall.function.arguments || "{}");
                if (toolArgs.schemeName) {
                    onChunk({ type: "info", message: `Matched scheme: ${toolArgs.schemeName}` });
                }
                onChunk({ type: "status", message: "Retrieving scheme details..." });
                const func = tools_1.aiToolFunctions['getSchemeDetails'];
                const toolResult = await func(toolArgs);
                if (toolResult && toolResult.success && toolResult.scheme) {
                    onChunk({ type: "success", message: "Scheme details found" });
                    onChunk({ type: "status", message: "Preparing response..." });
                    onChunk({
                        type: "result",
                        data: {
                            name: toolResult.scheme.title,
                            benefits: toolResult.scheme.benefits?.join(', ') || "Contact department for details",
                            eligibility: typeof toolResult.scheme.eligibility === 'object'
                                ? JSON.stringify(toolResult.scheme.eligibility)
                                : toolResult.scheme.eligibility,
                            documents: toolResult.scheme.documentsRequired?.join(', ') || "No specific documents listed"
                        }
                    });
                }
                else {
                    onChunk({ type: "error", message: "No scheme found" });
                    onChunk({ type: "content", content: toolResult?.message || "I couldn't find the details for that scheme." });
                }
            }
            else {
                // 2. Handle other tools
                onChunk({ type: "status", message: "Processing with AI Agent..." });
                // For other tools, we just use the first one for now as a simple implementation
                const firstToolCall = message.tool_calls[0];
                const toolName = firstToolCall.function.name;
                const toolArgs = JSON.parse(firstToolCall.function.arguments || "{}");
                onChunk({ type: "intent", message: `Executing tool: ${toolName}` });
                const func = tools_1.aiToolFunctions[toolName];
                if (func) {
                    // Determine if tool needs userId (simplified)
                    const needsUserId = ["getEligibleSchemes", "checkEligibilityForScheme", "getApplicationStatus", "recommendSchemes", "getAllApplicationStatuses"].includes(toolName);
                    const toolResult = needsUserId
                        ? await func(userId.toString(), toolArgs)
                        : await func(toolArgs);
                    onChunk({ type: "status", message: "Finalizing response..." });
                    // Pass back to AI to summarize (re-using non-stream call for simplicity)
                    messages.push(message);
                    messages.push({
                        role: "tool",
                        tool_call_id: firstToolCall.id,
                        name: toolName,
                        content: JSON.stringify(toolResult)
                    });
                    const finalResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                        method: 'POST',
                        headers: {
                            Authorization: `Bearer ${apiKey}`,
                            "Content-Type": 'application/json',
                        },
                        body: JSON.stringify({
                            model: "openai/gpt-4o-mini",
                            messages
                        }),
                    });
                    const finalData = await finalResponse.json();
                    const finalContent = finalData.choices?.[0]?.message?.content;
                    if (finalContent) {
                        onChunk({ type: "content", content: finalContent });
                    }
                }
            }
        }
        else if (message.content) {
            // 3. No tool call, just text
            onChunk({ type: "content", content: message.content });
        }
        else {
            onChunk({ type: "error", message: "Could not identify how to help with your query." });
        }
    }
    catch (error) {
        console.error("Stream AI Service Error:", error);
        throw error;
    }
};
exports.streamQueryService = streamQueryService;
