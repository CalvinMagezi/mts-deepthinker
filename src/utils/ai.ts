import OpenAI from "openai";
import { calculateTokens, calculateCost } from "./tokenCalculator";
import { Thought } from "../types";

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

export async function generateRelatedThought(
  content: string,
  thoughts: Thought[]
): Promise<{ thought: string; tokensUsed: number; cost: number }> {
  try {
    const thoughtsContext = thoughts.map((t) => t.content).join("\n");
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are Praxis, an AI assistant that generates related thoughts based on user input and existing thoughts. Provide a short, concise thought that is related to or expands upon the given thought, considering the context of all existing thoughts.",
        },
        {
          role: "user",
          content: `Existing thoughts:\n${thoughtsContext}\n\nGenerate a related thought for: "${content}"`,
        },
      ],
      max_tokens: 50,
    });

    const generatedThought =
      response.choices[0].message.content ||
      "Unable to generate a related thought.";
    const inputTokens = calculateTokens(content + thoughtsContext);
    const outputTokens = calculateTokens(generatedThought);
    const totalTokens = inputTokens + outputTokens;
    const cost = calculateCost(inputTokens, outputTokens);

    return { thought: generatedThought, tokensUsed: totalTokens, cost };
  } catch (error) {
    console.error("Error generating related thought:", error);
    return {
      thought: "Error generating related thought.",
      tokensUsed: 0,
      cost: 0,
    };
  }
}

export async function chatWithPraxis(
  messages: { role: string; content: string }[],
  thoughts: Thought[]
): Promise<{ message: string; tokensUsed: number; cost: number }> {
  try {
    const thoughtsContext = thoughts.map((t) => t.content).join("\n");
    const systemMessage = {
      role: "system",
      content: `You are Praxis, an AI assistant that helps users explore and develop their thoughts. You have access to the following thoughts on the canvas:\n\n${thoughtsContext}\n\nUse this information to provide insightful responses and help the user develop their ideas further.`,
    };

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemMessage.content },
        ...messages.map((msg) => ({
          role: msg.role as "user" | "assistant",
          content: msg.content,
        })),
      ],
      max_tokens: 150,
    });

    const generatedMessage =
      response.choices[0].message.content ||
      "I'm sorry, I couldn't generate a response.";
    const inputTokens = calculateTokens(
      JSON.stringify(messages) + thoughtsContext
    );
    const outputTokens = calculateTokens(generatedMessage);
    const totalTokens = inputTokens + outputTokens;
    const cost = calculateCost(inputTokens, outputTokens);

    return { message: generatedMessage, tokensUsed: totalTokens, cost };
  } catch (error) {
    console.error("Error chatting with Praxis:", error);
    return {
      message:
        "I'm sorry, I encountered an error while processing your request.",
      tokensUsed: 0,
      cost: 0,
    };
  }
}
