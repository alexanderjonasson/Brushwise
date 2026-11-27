// The shape of AI painting recipes and the paint-shelf scan, kept free from the
// API client so they can be unit tested. Paints are always answered with ids
// from our paint list, so the AI can't invent paints that don't exist.
import { z } from "zod";
import { brands, CLOSE_ENOUGH, getPaint, nearestPaint, paintIds, type Brand, type Paint } from "./paints";

const paintId = z.enum(paintIds);

export const recipeStages = ["basecoat", "shade", "layer", "highlight", "detail", "basing"] as const;

export const recipeSchema = z.object({
  title: z.string().describe("Short name for the scheme, e.g. 'Classic Black Legion'"),
  summary: z.string().describe("Two sentences on the look and the overall approach"),
  steps: z
    .array(
      z.object({
        area: z.string().describe("Part of the model, e.g. 'Armour', 'Skin', 'Base'"),
        stage: z.enum(recipeStages),
        paintId,
        instruction: z.string().describe("How to apply it, one or two sentences"),
      }),
    )
    .describe("Six to fourteen steps in painting order"),
  mixes: z
    .array(
      z.object({
        forPaintId: paintId.describe("A paint in the steps that the painter doesn't own"),
        recipe: z.string().describe("How to get close by mixing paints the painter owns"),
      }),
    )
    .describe("Only for paints the painter doesn't own, and only when owned paints can get close"),
});

export type PaintingRecipe = z.infer<typeof recipeSchema>;

export const paintScanSchema = z.object({
  paints: z
    .array(z.object({ paintId, confidence: z.enum(["high", "low"]) }))
    .describe("Paints from the list you can identify on labels in the photo"),
  unrecognised: z
    .array(z.string())
    .describe("Labels you can read that match no paint in the list"),
});

export type PaintScan = z.infer<typeof paintScanSchema>;

export type RecipeRequest = {
  subject: string;
  style: string;
  brand: Brand | "any";
  ownedPaintIds: string[];
};

export function isBrand(value: unknown): value is Brand {
  return typeof value === "string" && (brands as readonly string[]).includes(value);
}

// For each step: the suggested paint, whether the user owns it, and the
// closest paint from every brand – which is what lets the page switch brand.
export type RecipeStepView = {
  area: string;
  stage: string;
  instruction: string;
  paint: Paint;
  owned: boolean;
  alternatives: Partial<Record<Brand, Paint>>;
  ownedAlternative?: Paint;
};

export function buildRecipeView(
  steps: PaintingRecipe["steps"],
  ownedPaintIds: string[],
  allPaints: Paint[],
): RecipeStepView[] {
  const owned = new Set(ownedPaintIds);
  const ownedPaints = allPaints.filter((paint) => owned.has(paint.id));

  return steps.flatMap((step) => {
    const paint = getPaint(step.paintId);
    if (!paint) return [];

    const alternatives: Partial<Record<Brand, Paint>> = {};
    for (const brand of brands) {
      alternatives[brand] =
        paint.brand === brand ? paint : nearestPaint(paint, allPaints.filter((p) => p.brand === brand));
    }

    return [
      {
        area: step.area,
        stage: step.stage,
        instruction: step.instruction,
        paint,
        owned: owned.has(paint.id),
        alternatives,
        ownedAlternative: owned.has(paint.id) ? undefined : nearestPaint(paint, ownedPaints, CLOSE_ENOUGH),
      },
    ];
  });
}

// Every distinct paint the recipe uses that the user doesn't own
export function missingPaints(steps: RecipeStepView[]): Paint[] {
  const seen = new Map<string, Paint>();
  for (const step of steps) {
    if (!step.owned) seen.set(step.paint.id, step.paint);
  }
  return [...seen.values()];
}

export const mockRecipe: PaintingRecipe = {
  title: "Classic dark armour with gold trim",
  summary:
    "A dark, high-contrast scheme: black armour with cool grey edge highlights and warm gold trim. Simple to start, and it looks striking on the table.",
  steps: [
    { area: "Whole model", stage: "basecoat", paintId: "citadel-abaddon-black", instruction: "Basecoat the whole model in two thin coats." },
    { area: "Armour", stage: "highlight", paintId: "citadel-eshin-grey", instruction: "Paint thick edge highlights on the armour panels." },
    { area: "Armour", stage: "highlight", paintId: "citadel-dawnstone", instruction: "Add finer highlights on the sharpest corners only." },
    { area: "Trim", stage: "basecoat", paintId: "citadel-retributor-armour", instruction: "Paint all trim and icons." },
    { area: "Trim", stage: "shade", paintId: "citadel-agrax-earthshade", instruction: "Shade the gold into the recesses." },
    { area: "Trim", stage: "highlight", paintId: "citadel-liberator-gold", instruction: "Highlight the raised edges of the trim." },
    { area: "Cloth", stage: "basecoat", paintId: "citadel-khorne-red", instruction: "Basecoat cloth and cables." },
    { area: "Cloth", stage: "highlight", paintId: "citadel-evil-sunz-scarlet", instruction: "Highlight the folds of the cloth." },
    { area: "Base", stage: "basing", paintId: "citadel-stirland-mud", instruction: "Cover the base, then drybrush when dry." },
  ],
  mixes: [
    { forPaintId: "citadel-dawnstone", recipe: "Mix Eshin Grey with a little white, about 2:1." },
  ],
};

export const mockPaintScan: PaintScan = {
  paints: [
    { paintId: "citadel-abaddon-black", confidence: "high" },
    { paintId: "citadel-nuln-oil", confidence: "high" },
    { paintId: "citadel-leadbelcher", confidence: "high" },
    { paintId: "citadel-retributor-armour", confidence: "low" },
  ],
  unrecognised: [],
};
