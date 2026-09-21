import { userRepository } from '../../../database/repository/user.repository';
import { UserId } from '../../../entity/user/userId';
import { AppError } from '../../../Error/appError';
import { aiAgentSystemPrompt } from '../ai-agent-system-prompt';
import { aiTools, aiToolFunctions } from '../tools';

// Helper function to extract structured JSON UI cards from AI response
const emitStructuredCards = (content: string, onChunk: (chunk: any) => void) => {
  let finalContent = content;
  const jsonMatch = finalContent.match(/```json\s*([\s\S]*?)\s*```/);
  
  if (jsonMatch && jsonMatch[1]) {
    console.log(`[Stream-Query] 🧩 Found JSON block in AI response. Extracting UI cards...`);
    try {
      const parsedJson = JSON.parse(jsonMatch[1]);
      // Remove JSON block from markdown text
      finalContent = finalContent.replace(/```json\s*[\s\S]*?\s*```/, '').trim();
      
      if (parsedJson.recommendations) {
        console.log(`[Stream-Query] ➡️ Emitting 'recommendations' chunk to frontend.`);
        onChunk({ type: "recommendations", data: parsedJson.recommendations });
      }
      if (parsedJson.schemeDetails) {
        console.log(`[Stream-Query] ➡️ Emitting 'scheme_details' chunk to frontend.`);
        onChunk({ type: "scheme_details", data: parsedJson.schemeDetails });
      }
      if (parsedJson.followUps) {
        console.log(`[Stream-Query] ➡️ Emitting 'metadata' (followUps) chunk to frontend.`);
        onChunk({ type: "metadata", data: { followUps: parsedJson.followUps } });
      }
    } catch (e) {
      console.error("[Stream-Query] ❌ Failed to parse JSON from AI response", e);
    }
  }
  
  console.log(`[Stream-Query] ➡️ Emitting text content chunk to frontend.`);
  onChunk({ type: "content", content: finalContent });
};

export const streamQueryService = async (
  query: string,
  userId: UserId,
  onChunk: (chunk: any) => void
): Promise<void> => {
  try {
    console.log(`\n======================================================`);
    console.log(`[Stream-Query] 🟢 NEW QUERY RECEIVED`);
    console.log(`[Stream-Query] User ID: ${userId.toString()}`);
    console.log(`[Stream-Query] Query: "${query}"`);
    console.log(`======================================================\n`);

    const user = await userRepository.findUserById(userId.toString());
    if (!user) {
      throw new AppError('User not found', 404);
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      throw new AppError('OpenRouter API key not found', 500);
    }

    onChunk({ type: "status", message: "Understanding your request..." });

    const messages: any[] = [
      { role: 'system', content: aiAgentSystemPrompt },
      { role: 'user', content: query },
    ];

    console.log(`[Stream-Query] 📡 Sending request to OpenRouter to detect tool intent...`);
    
    // Call AI to detect intent
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
        stream: false, 
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[Stream-Query] ❌ AI API Error: ${errorText}`);
      throw new AppError(`AI API Error: ${errorText}`, response.status as any);
    }

    const data = await response.json();
    const message = data.choices?.[0]?.message;

    if (!message) {
      console.error(`[Stream-Query] ❌ Failed to get response from AI`);
      throw new AppError('Failed to get response', 500);
    }

    if (message.tool_calls && message.tool_calls.length > 0) {
      console.log(`[Stream-Query] 🛠️ AI requested ${message.tool_calls.length} tool(s).`);
      
      onChunk({ type: "status", message: "Processing with AI Agent..." });
      
      // Execute the first tool requested
      const firstToolCall = message.tool_calls[0];
      const toolName = firstToolCall.function.name as keyof typeof aiToolFunctions;
      const toolArgs = JSON.parse(firstToolCall.function.arguments || "{}");
      
      console.log(`[Stream-Query] 🔍 Tool detected: ${toolName}`);
      console.log(`[Stream-Query] 📄 Arguments:`, toolArgs);
      
      onChunk({ type: "intent", message: `Executing tool: ${toolName}` });
      
      const func = aiToolFunctions[toolName];
      if (func) {
        // Determine if tool needs userId (simplified)
        const needsUserId = ["getEligibleSchemes", "checkEligibilityForScheme", "getApplicationStatus", "recommendSchemes", "getAllApplicationStatuses"].includes(toolName);
        
        console.log(`[Stream-Query] ⚙️ Executing ${toolName} function... (needsUserId: ${needsUserId})`);
        const toolResult = needsUserId 
          ? await (func as any)(userId.toString(), toolArgs)
          : await (func as any)(toolArgs);

        console.log(`[Stream-Query] ✅ Function executed successfully.`);
        
        onChunk({ type: "status", message: "Finalizing response..." });
        
        // Pass back to AI to summarize
        messages.push(message);
        messages.push({
           role: "tool",
           tool_call_id: firstToolCall.id,
           name: toolName,
           content: JSON.stringify(toolResult)
        });

        console.log(`[Stream-Query] 📡 Sending tool results back to OpenRouter for final markdown/JSON generation...`);

        const finalResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": 'application/json',
          },
          body: JSON.stringify({
            model: "openai/gpt-4o-mini", // Summarization model
            messages
          }),
        });
        
        const finalData = await finalResponse.json();
        const finalContent = finalData.choices?.[0]?.message?.content;
        
        console.log(`[Stream-Query] 📥 Received final response from AI.`);
        
        if (finalContent) {
          // Process JSON cards and stream output using our helper
          emitStructuredCards(finalContent, onChunk);
        }
      } else {
        console.warn(`[Stream-Query] ⚠️ Tool function ${toolName} not found in aiToolFunctions registry!`);
        onChunk({ type: "error", message: `I don't know how to use the tool: ${toolName}` });
      }
    } else if (message.content) {
       // No tool call, just direct conversational text
       console.log(`[Stream-Query] 💬 AI responded directly without calling tools.`);
       
       // Process JSON cards and stream output using our helper
       emitStructuredCards(message.content, onChunk);
    } else {
       console.log(`[Stream-Query] ⚠️ Unhandled AI response format.`);
       onChunk({ type: "error", message: "Could not identify how to help with your query." });
    }

    console.log(`[Stream-Query] 🏁 STREAM COMPLETED.\n`);

  } catch (error: any) {
    console.error("[Stream-Query] ❌ Stream AI Service Error:", error);
    throw error;
  }
};
