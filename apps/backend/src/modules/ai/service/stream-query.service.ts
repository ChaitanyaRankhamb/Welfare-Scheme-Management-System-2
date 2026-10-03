import { userRepository } from "../../../database/repository/user.repository";
import { UserId } from "../../../entity/user/userId";
import { AppError } from "../../../Error/appError";
import { aiAgentSystemPrompt } from "../ai-agent-system-prompt";
import { aiTools, aiToolFunctions } from "../tools";

// Helper function to extract structured JSON UI cards from AI response and strip raw JSON code blocks
const emitStructuredCards = (
  content: string,
  onChunk: (chunk: any) => void,
) => {
  let finalContent = content;
  const jsonMatch = finalContent.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);

  if (jsonMatch && jsonMatch[1]) {
    console.log(
      `[Stream-Query] 🧩 Found JSON block in AI response. Extracting UI metadata...`,
    );
    try {
      const parsedJson = JSON.parse(jsonMatch[1].trim());

      if (
        parsedJson.recommendations &&
        Array.isArray(parsedJson.recommendations)
      ) {
        console.log(
          `[Stream-Query] ➡️ Emitting 'recommendations' chunk to frontend.`,
        );
        onChunk({ type: "recommendations", data: parsedJson.recommendations });
      }
      if (parsedJson.schemeDetails) {
        console.log(
          `[Stream-Query] ➡️ Emitting 'scheme_details' chunk to frontend.`,
        );
        onChunk({ type: "scheme_details", data: parsedJson.schemeDetails });
      }
      if (parsedJson.followUps && Array.isArray(parsedJson.followUps)) {
        console.log(
          `[Stream-Query] ➡️ Emitting 'metadata' (followUps) chunk to frontend.`,
        );
        onChunk({
          type: "metadata",
          data: { followUps: parsedJson.followUps },
        });
      }
    } catch (e) {
      console.error(
        "[Stream-Query] ❌ Failed to parse JSON from AI response:",
        e,
      );
    }

    // Always strip the code block so raw JSON code is never rendered in text output
    finalContent = finalContent
      .replace(/```(?:json)?\s*[\s\S]*?\s*```/gi, "")
      .trim();
  }

  console.log(`[Stream-Query] ➡️ Emitting text content chunk to frontend.`);
  onChunk({ type: "content", content: finalContent });
};

const containsToolCallMarkup = (content: string) =>
  /<\/?(?:tool_call|dots_function_call)\b|<function\s*=|<invoke\b/i.test(
    content,
  );

const parseTextToolCalls = (content: string) => {
  if (!content.includes("<dots_function_call>")) return [];

  return Array.from(
    content.matchAll(/<invoke\s+name="([^"]+)"\s*>([\s\S]*?)<\/invoke>/g),
    ([, name, body], index) => {
      const args: Record<string, unknown> = {};
      const parameters = body.matchAll(
        /<parameter\s+name="([^"]+)"\s*>([\s\S]*?)<\/parameter>/g,
      );

      for (const [, parameterName, value] of parameters) {
        args[parameterName] = JSON.parse(value.trim());
      }

      return {
        id: `text-tool-call-${index}`,
        function: { name, arguments: JSON.stringify(args) },
      };
    },
  );
};

export const streamQueryService = async (
  query: string,
  userId: UserId,
  onChunk: (chunk: any) => void,
): Promise<void> => {
  try {
    console.log(`\n======================================================`);
    console.log(`[Stream-Query] 🟢 NEW QUERY RECEIVED`);
    console.log(`[Stream-Query] User ID: ${userId.toString()}`);
    console.log(`[Stream-Query] Query: "${query}"`);
    console.log(`======================================================\n`);

    const user = await userRepository.findUserById(userId.toString());
    if (!user) {
      throw new AppError("User not found", 404);
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      throw new AppError("OpenRouter API key not found", 500);
    }

    const modelName = process.env.OPENROUTER_MODEL || "openrouter/free";

    onChunk({ type: "status", message: "Understanding your request..." });

    const messages: any[] = [
      { role: "system", content: aiAgentSystemPrompt },
      { role: "user", content: query },
    ];

    console.log(
      `[Stream-Query] 📡 Sending request to OpenRouter to detect tool intent...`,
    );

    // Call AI to detect intent
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "HTTP-Referer": process.env.FRONTEND_URL || "http://localhost:3001",
          "X-OpenRouter-Title": "Welfare Scheme Management System",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: modelName,
          messages,
          tools: aiTools,
          tool_choice: "auto",
          stream: false,
        }),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[Stream-Query] ❌ AI API Error: ${errorText}`);
      throw new AppError(`AI API Error: ${errorText}`, response.status as any);
    }

    const data = await response.json();
    const message = data.choices?.[0]?.message;

    if (!message) {
      console.error(`[Stream-Query] ❌ Failed to get response from AI`);
      throw new AppError("Failed to get response", 500);
    }

    const toolCalls =
      message.tool_calls?.length > 0
        ? message.tool_calls
        : parseTextToolCalls(message.content || "");

    if (toolCalls.length > 0) {
      console.log(
        `[Stream-Query] 🛠️ AI requested ${toolCalls.length} tool(s).`,
      );

      onChunk({ type: "status", message: "Processing with AI Agent..." });

      messages.push(
        message.tool_calls?.length > 0
          ? message
          : { role: "assistant", tool_calls: toolCalls },
      );

      const toolResults: Array<{ toolName: string; result: unknown }> = [];

      for (const toolCall of toolCalls) {
        const toolName = toolCall.function.name as keyof typeof aiToolFunctions;
        const toolArgs = JSON.parse(toolCall.function.arguments || "{}");
        const func = aiToolFunctions[toolName];

        console.log(`[Stream-Query] 🔍 Tool detected: ${toolName}`);
        console.log(`[Stream-Query] 📄 Arguments:`, toolArgs);
        onChunk({ type: "intent", message: `Executing tool: ${toolName}` });

        if (!func) {
          throw new AppError(`Unknown tool: ${toolName}`, 500);
        }

        const needsUserId = [
          "getEligibleSchemes",
          "checkEligibilityForScheme",
          "getApplicationStatus",
          "recommendSchemes",
          "getAllApplicationStatuses",
        ].includes(toolName);
        const toolResult =
          toolName === "searchSchemes"
            ? await (func as any)(toolArgs.query)
            : toolName === "compareSchemes"
              ? await (func as any)(toolArgs.schemeNames)
              : needsUserId
                ? await (func as any)(userId.toString(), toolArgs)
                : await (func as any)(toolArgs);

        toolResults.push({ toolName, result: toolResult });
        messages.push({
          role: "tool",
          tool_call_id: toolCall.id,
          name: toolName,
          content: JSON.stringify(toolResult),
        });
      }

      onChunk({ type: "status", message: "Finalizing response..." });

      if (
        toolResults.length === 1 &&
        toolResults[0].toolName === "getApplicationSteps"
      ) {
        const result = toolResults[0].result as {
          success: boolean;
          message?: string;
          schemeTitle?: string;
          processType?: string;
          applicationUrl?: string;
          steps?: string[];
          requiredDocuments?: string[];
          notes?: string;
        };

        const content = !result.success
          ? result.message ||
            "Unable to find application steps for this scheme."
          : [
              `Application steps for ${result.schemeTitle}:`,
              "",
              ...(result.steps || []).map(
                (step, index) => `${index + 1}. ${step}`,
              ),
              "",
              `Process type: ${result.processType || "Standard"}`,
              "",
              "Required documents:",
              ...(result.requiredDocuments || []).map(
                (document) => `- ${document}`,
              ),
              "",
              `Application portal: ${result.applicationUrl || "Check the official government portal."}`,
              ...(result.notes ? ["", `Note: ${result.notes}`] : []),
            ].join("\n");

        onChunk({ type: "content", content });
        console.log(`[Stream-Query] 🏁 STREAM COMPLETED.\n`);
        return;
      }

      console.log(
        `[Stream-Query] 📡 Sending tool results back to OpenRouter for final response generation...`,
      );

      const finalResponse = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "HTTP-Referer": process.env.FRONTEND_URL || "http://localhost:3001",
            "X-OpenRouter-Title": "Welfare Scheme Management System",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: modelName,
            messages: [
              {
                role: "system",
                content:
                  "You are a welfare scheme assistant preparing a user-facing answer from backend results. Answer the user's request using only the supplied results. If a result says the scheme was not found or the user's profile is incomplete, explain that clearly and do not infer eligibility. Do not call tools or output tool-call syntax or markup.",
              },
              {
                role: "user",
                content: `Original request:\n${query}\n\nBackend tool results:\n${JSON.stringify(toolResults)}`,
              },
            ],
          }),
        },
      );

      if (!finalResponse.ok) {
        throw new AppError(
          `AI API Error: ${await finalResponse.text()}`,
          finalResponse.status as any,
        );
      }

      const finalData = await finalResponse.json();
      const finalContent = finalData.choices?.[0]?.message?.content;

      console.log(`[Stream-Query] 📥 Received final response from AI.`);
      if (finalContent) {
        if (containsToolCallMarkup(finalContent)) {
          console.error(
            "[Stream-Query] ❌ Final response contained tool-call markup; suppressing it.",
          );
          onChunk({
            type: "error",
            message:
              "I found relevant information but could not format the response. Please try again.",
          });
        } else {
          emitStructuredCards(finalContent, onChunk);
        }
      } else {
        throw new AppError(
          "AI did not return a final response after tool execution",
          500,
        );
      }
    } else if (message.content) {
      console.log(
        `[Stream-Query] 💬 AI responded directly without calling tools.`,
      );
      emitStructuredCards(message.content, onChunk);
    } else {
      console.log(`[Stream-Query] ⚠️ Unhandled AI response format.`);
      onChunk({
        type: "error",
        message: "Could not identify how to help with your query.",
      });
    }

    console.log(`[Stream-Query] 🏁 STREAM COMPLETED.\n`);
  } catch (error: any) {
    console.error("[Stream-Query] ❌ Stream AI Service Error:", error);
    throw error;
  }
};
