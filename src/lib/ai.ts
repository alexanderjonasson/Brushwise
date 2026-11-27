// Talks to Claude. Server only: the API key must never reach the browser.
import "server-only";

import Anthropic from "@anthropic-ai/sdk";
import { betaZodOutputFormat } from "@anthropic-ai/sdk/helpers/beta/zod";
import { feedbackSchema, mockFeedback, type PaintingFeedback } from "./feedback";

// AI_MODE=live calls Claude. Anything else (or no API key) uses the example
// answer, so development and tests never cost money.
export function isLiveAi() {
  return process.env.AI_MODE === "live" && Boolean(process.env.ANTHROPIC_API_KEY);
}

const model = process.env.AI_MODEL ?? "claude-opus-5-5";

const systemPrompt = `You are an experienced, encouraging miniature painting coach.
You look at a photo of a painted miniature and give honest, practical feedback that helps the painter improve.

- Judge only what you can see in the photo. If an area isn't visible or isn't painted yet, leave it out.
- Score fairly for a hobby painter: 5 is a neat tabletop standard, 8 is very good display work, 10 is competition level.
- Every tip should be something the painter can try at their next session, with a named technique where it helps.
- Be kind but specific. Name what works before what to improve.
- If the photo doesn't show a painted miniature, set isPaintedMiniature to false, explain briefly in the summary, give overallScore 1, and leave areas and nextSteps empty.`;

export type FeedbackResult =
  | { status: "ok"; feedback: PaintingFeedback; model: string }
  | { status: "error"; error: string };

export async function getPaintingFeedback(imageUrl: string): Promise<FeedbackResult> {
  if (!isLiveAi()) {
    return { status: "ok", feedback: mockFeedback, model: "mock" };
  }

  const client = new Anthropic();

  try {
    const response = await client.beta.messages.parse({
      model,
      max_tokens: 16000,
      output_config: {
        effort: "medium",
        format: betaZodOutputFormat(feedbackSchema),
      },
      // If a safety classifier wrongly declines the request, retry it on the
      // model Anthropic recommends instead of failing.
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: [
            { type: "image", source: { type: "url", url: imageUrl } },
            { type: "text", text: "Give feedback on the paint job in this photo." },
          ],
        },
      ],
    });

    if (response.stop_reason === "refusal") {
      return { status: "error", error: "The AI couldn't give feedback on this photo." };
    }
    if (response.stop_reason === "max_tokens" || !response.parsed_output) {
      return { status: "error", error: "The AI's answer was incomplete. Please try again." };
    }

    return { status: "ok", feedback: response.parsed_output, model: response.model };
  } catch (error) {
    if (error instanceof Anthropic.RateLimitError) {
      return { status: "error", error: "The AI is busy right now. Please try again in a minute." };
    }
    if (error instanceof Anthropic.APIError) {
      console.error(`Claude API error ${error.status}`, error.message);
      return { status: "error", error: "Something went wrong with the AI. Please try again." };
    }
    throw error;
  }
}
