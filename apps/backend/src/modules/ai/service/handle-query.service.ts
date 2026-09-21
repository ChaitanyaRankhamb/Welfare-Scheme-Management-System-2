import { userRepository } from '../../../database/repository/user.repository';
import { UserId } from '../../../entity/user/userId';
import { AppError } from '../../../Error/appError';
import { aiAgentSystemPrompt } from '../ai-agent-system-prompt';
import { aiTools, aiToolFunctions } from '../tools';

export const handleQueryService = async (query: string, userId: UserId): Promise<any> => {
  try {
    // Validate user
    const user = await userRepository.findUserById(userId.toString());
    if (!user) {
      throw new AppError('User not found', 404);
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      throw new AppError('OpenRouter API key not found', 500);
    }

    if (!aiAgentSystemPrompt) {
      throw new AppError('AI Agent System Prompt not found', 500);
    }

    // Messages array (important for loop)
    const messages: any[] = [
      { role: 'system', content: aiAgentSystemPrompt },
      { role: 'user', content: query },
    ];

    let finalResponse = null;
    let recommendSchemesResult: any = null;
    let schemeDetailsResult: any = null;
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
          tools: aiTools,
          tool_choice: "auto",
        }),
      });

      const data = await response.json();
      const message = data.choices?.[0]?.message;

      if (!message) {
        throw new AppError('Invalid AI response', 500);
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
        const toolName = toolCall.function.name as keyof typeof aiToolFunctions;
        const toolArgs = JSON.parse(toolCall.function.arguments || "{}");

        const func = aiToolFunctions[toolName];
        if (!func) {
          throw new AppError(`Unknown tool: ${toolName}`, 400);
        }

        let toolResult;

        // Determine if tool needs userId (basic heuristic for now based on tool names)
        const needsUserId = ["getEligibleSchemes", "checkEligibilityForScheme", "getApplicationStatus", "recommendSchemes", "getAllApplicationStatuses"].includes(toolName);
        
        if (needsUserId) {
          toolResult = await (func as any)(userId.toString(), toolArgs);
        } else {
          toolResult = await (func as any)(toolArgs);
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
      throw new AppError('AI failed to generate response', 500);
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

  } catch (error: any) {
    console.error("AI Service Error:", error);

    throw new AppError(
      error.message || 'AI query processing failed',
      error.statusCode || 500
    );
  }
};