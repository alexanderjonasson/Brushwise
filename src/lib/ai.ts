// Talks to Claude. Server only: the API key must never reach the browser.
import "server-only";

import Anthropic from "@anthropic-ai/sdk";
import { betaZodOutputFormat } from "@anthropic-ai/sdk/helpers/beta/zod";
import type { z } from "zod";
import { boxScanSchema, mockBoxScan, type BoxScan } from "./backlog";
import { feedbackSchema, mockFeedback, type PaintingFeedback } from "./feedback";
import { getPaint, paints } from "./paints";
import type { PhotoType } from "./photos";
import {
  mockPaintScan,
  mockRecipe,
  paintScanSchema,
  recipeSchema,
  type PaintScan,
  type PaintingRecipe,
  type RecipeRequest,
} from "./recipes";

// AI_MODE=live calls Claude. Anything else (or no API key) uses example
// answers, so development and tests never cost money.
export function isLiveAi() {
  return process.env.AI_MODE === "live" && Boolean(process.env.ANTHROPIC_API_KEY);
}

const model = process.env.AI_MODEL ?? "claude-opus-5-5";

export type AiResult<T> = { status: "ok"; data: T; model: string } | { status: "error"; error: string };

type Image = { url: string } | { base64: string; mediaType: PhotoType };

// One structured call to Claude: a system prompt, an optional image and a
// text prompt in, an answer validated against the Zod schema out.
async function askClaude<Schema extends z.ZodType>(options: {
  schema: Schema;
  system: string;
  prompt: string;
  image?: Image;
}): Promise<AiResult<z.infer<Schema>>> {
  const client = new Anthropic();
  const { image } = options;

  const imageBlock =
    image === undefined ? []
    : "url" in image ? [{ type: "image" as const, source: { type: "url" as const, url: image.url } }]
    : [
        {
          type: "image" as const,
          source: { type: "base64" as const, media_type: image.mediaType, data: image.base64 },
        },
      ];

  try {
    const response = await client.beta.messages.parse({
      model,
      max_tokens: 16000,
      output_config: { effort: "medium", format: betaZodOutputFormat(options.schema) },
      // If a safety classifier wrongly declines the request, retry it on the
      // model Anthropic recommends instead of failing.
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      system: options.system,
      messages: [{ role: "user", content: [...imageBlock, { type: "text", text: options.prompt }] }],
    });

    if (response.stop_reason === "refusal") {
      return { status: "error", error: "The AI couldn't help with this request." };
    }
    if (response.stop_reason === "max_tokens" || !response.parsed_output) {
      return { status: "error", error: "The AI's answer was incomplete. Please try again." };
    }
    return { status: "ok", data: response.parsed_output, model: response.model };
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

// ---------------------------------------------------------------------------
// Feedback on a painted miniature
// ---------------------------------------------------------------------------

const feedbackPrompt = `You are an experienced, encouraging miniature painting coach.
You look at a photo of a painted miniature and give honest, practical feedback that helps the painter improve.

- Judge only what you can see in the photo. If an area isn't visible or isn't painted yet, leave it out.
- Score fairly for a hobby painter: 5 is a neat tabletop standard, 8 is very good display work, 10 is competition level.
- Every tip should be something the painter can try at their next session, with a named technique where it helps.
- Be kind but specific. Name what works before what to improve.
- If the photo doesn't show a painted miniature, set isPaintedMiniature to false, explain briefly in the summary, give overallScore 1, and leave areas and nextSteps empty.`;

export async function getPaintingFeedback(imageUrl: string): Promise<AiResult<PaintingFeedback>> {
  if (!isLiveAi()) return { status: "ok", data: mockFeedback, model: "mock" };

  return askClaude({
    schema: feedbackSchema,
    system: feedbackPrompt,
    prompt: "Give feedback on the paint job in this photo.",
    image: { url: imageUrl },
  });
}

// ---------------------------------------------------------------------------
// Paint list – shared by the paint scan and the recipes
// ---------------------------------------------------------------------------

// One line per paint, e.g. "citadel-nuln-oil: Nuln Oil (Citadel, shade)".
// Sorted the same way every time, which keeps the prompt cacheable.
const paintList = paints
  .map((paint) => `${paint.id}: ${paint.name} (${paint.brand}, ${paint.type})`)
  .join("\n");

// ---------------------------------------------------------------------------
// Recognising paints on a photo of the user's shelf
// ---------------------------------------------------------------------------

const paintScanPrompt = `You identify hobby paint pots and bottles in a photo by reading their labels.
Answer only with paint ids from this list. Use "high" confidence when you can read the label clearly, "low" when you are guessing from the colour and pot shape.
Labels you can read that match nothing in the list go in "unrecognised". Never invent ids.

Paint list:
${paintList}`;

export async function scanPaints(image: { base64: string; mediaType: PhotoType }): Promise<AiResult<PaintScan>> {
  if (!isLiveAi()) return { status: "ok", data: mockPaintScan, model: "mock" };

  return askClaude({
    schema: paintScanSchema,
    system: paintScanPrompt,
    prompt: "Which paints from the list can you see in this photo?",
    image,
  });
}

// ---------------------------------------------------------------------------
// Painting recipes
// ---------------------------------------------------------------------------

const recipePrompt = `You are an expert miniature painter who writes clear, practical painting recipes.
You plan a scheme for the miniature the painter names, step by step in painting order.

- Use only paint ids from the list below. Never invent ids.
- Prefer paints the painter already owns whenever they fit the look. When a paint they own is a close enough match, use it instead of buying a new one.
- If they ask for a specific brand, pick paints they don't own from that brand.
- For each paint in the recipe they don't own, add a mix only if paints they own can genuinely get close; say roughly how to mix it. Leave mixes empty otherwise.
- Keep it achievable for a hobby painter: six to fourteen steps.

Paint list:
${paintList}`;

export async function getRecipe(request: RecipeRequest): Promise<AiResult<PaintingRecipe>> {
  if (!isLiveAi()) return { status: "ok", data: mockRecipe, model: "mock" };

  const owned = request.ownedPaintIds
    .map((id) => getPaint(id))
    .filter((paint) => paint !== undefined)
    .map((paint) => `- ${paint.id}: ${paint.name} (${paint.brand})`)
    .join("\n");

  const prompt = [
    `Miniature: ${request.subject}`,
    `Look they want: ${request.style || "the classic, best-known scheme for this miniature"}`,
    `Preferred brand for paints they need to buy: ${request.brand === "any" ? "any brand" : request.brand}`,
    "",
    "Paints they own:",
    owned || "(none yet)",
  ].join("\n");

  return askClaude({ schema: recipeSchema, system: recipePrompt, prompt });
}

// ---------------------------------------------------------------------------
// Reading a miniatures box for the pile of shame
// ---------------------------------------------------------------------------

const boxScanPrompt = `You read photos of miniature wargaming boxes and kits (Warhammer, Middle-earth, Star Wars, board games and similar).
Read the box name and faction from the printed text. Most boxes print how many miniatures they contain; use that number when you can read it.
If the photo doesn't show a box or kit, set isBox to false and leave the other fields as your best guess.`;

export async function scanBox(imageUrl: string): Promise<AiResult<BoxScan>> {
  if (!isLiveAi()) return { status: "ok", data: mockBoxScan, model: "mock" };

  return askClaude({
    schema: boxScanSchema,
    system: boxScanPrompt,
    prompt: "What box is this, and how many miniatures does it contain?",
    image: { url: imageUrl },
  });
}
