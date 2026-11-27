import { describe, expect, it } from "vitest";
import { getPaint, paints } from "./paints";
import {
  buildRecipeView,
  isBrand,
  missingPaints,
  mockPaintScan,
  mockRecipe,
  paintScanSchema,
  recipeSchema,
} from "./recipes";

describe("recipe schemas", () => {
  it("accept the example answers used without an API key", () => {
    expect(recipeSchema.safeParse(mockRecipe).success).toBe(true);
    expect(paintScanSchema.safeParse(mockPaintScan).success).toBe(true);
  });

  it("reject paints that aren't in the paint list", () => {
    const steps = [{ area: "Armour", stage: "basecoat", paintId: "made-up-paint", instruction: "Paint it" }];
    expect(recipeSchema.safeParse({ ...mockRecipe, steps }).success).toBe(false);
  });
});

describe("isBrand", () => {
  it("accepts the three brands and nothing else", () => {
    expect(isBrand("Citadel")).toBe(true);
    expect(isBrand("Vallejo")).toBe(true);
    expect(isBrand("any")).toBe(false);
    expect(isBrand(null)).toBe(false);
  });
});

describe("buildRecipeView", () => {
  const steps = [
    { area: "Armour", stage: "basecoat" as const, paintId: "citadel-abaddon-black", instruction: "Basecoat" },
    { area: "Trim", stage: "basecoat" as const, paintId: "citadel-retributor-armour", instruction: "Trim" },
    { area: "Trim", stage: "shade" as const, paintId: "citadel-retributor-armour", instruction: "Again" },
  ];

  it("marks which paints the user owns", () => {
    const view = buildRecipeView(steps, ["citadel-abaddon-black"], paints);
    expect(view.map((step) => step.owned)).toEqual([true, false, false]);
  });

  it("offers the closest paint from every brand", () => {
    const [first] = buildRecipeView(steps, [], paints);
    expect(first.alternatives.Citadel?.name).toBe("Abaddon Black");
    expect(first.alternatives.Vallejo?.name).toBe("Black");
    expect(first.alternatives["The Army Painter"]?.name).toBe("Matt Black");
  });

  it("suggests the closest paint the user owns instead of a missing one", () => {
    const view = buildRecipeView(steps, ["vallejo-polished-gold"], paints);
    expect(view[1].ownedAlternative?.id).toBe("vallejo-polished-gold");
  });

  it("doesn't suggest an owned paint that looks too different", () => {
    // Black is far too dark to stand in for a gold
    const view = buildRecipeView(steps, ["citadel-abaddon-black"], paints);
    expect(view[1].ownedAlternative).toBeUndefined();
  });

  it("lists each missing paint once", () => {
    const missing = missingPaints(buildRecipeView(steps, ["citadel-abaddon-black"], paints));
    expect(missing).toEqual([getPaint("citadel-retributor-armour")]);
  });
});
