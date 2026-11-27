import { describe, expect, it } from "vitest";
import {
  brands,
  colourDistance,
  getPaint,
  nearestPaint,
  paints,
  paintsByBrand,
  searchPaints,
} from "./paints";

describe("paints", () => {
  it("gives every paint a unique id", () => {
    const ids = paints.map((paint) => paint.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("uses valid hex colours", () => {
    for (const paint of paints) {
      expect(paint.hex).toMatch(/^#[0-9a-f]{6}$/);
    }
  });

  it("has paints from every brand", () => {
    for (const brand of brands) {
      expect(paintsByBrand(brand).length).toBeGreaterThan(20);
    }
  });

  it("builds readable ids from brand and name", () => {
    expect(getPaint("citadel-abaddon-black")?.name).toBe("Abaddon Black");
    expect(getPaint("citadel-waaagh-flesh")?.name).toBe("Waaagh! Flesh");
    expect(getPaint("the-army-painter-greedy-gold")?.brand).toBe("The Army Painter");
  });
});

describe("searchPaints", () => {
  it("finds paints by name, brand or type", () => {
    expect(searchPaints("nuln")[0].name).toBe("Nuln Oil");
    expect(searchPaints("vallejo silver")[0]).toMatchObject({ brand: "Vallejo", name: "Silver" });
    expect(searchPaints("shade", "The Army Painter").every((paint) => paint.type === "shade")).toBe(true);
  });

  it("can be limited to one brand", () => {
    const results = searchPaints("blue", "Vallejo");
    expect(results.length).toBeGreaterThan(0);
    expect(results.every((paint) => paint.brand === "Vallejo")).toBe(true);
  });

  it("returns nothing for an empty search", () => {
    expect(searchPaints("  ")).toEqual([]);
  });
});

describe("colourDistance", () => {
  it("is zero for the same colour and grows with the difference", () => {
    expect(colourDistance("#ff0000", "#ff0000")).toBe(0);
    expect(colourDistance("#000000", "#ffffff")).toBeGreaterThan(colourDistance("#000000", "#333333"));
  });
});

describe("nearestPaint", () => {
  it("finds a black in another brand for Abaddon Black", () => {
    const abaddon = getPaint("citadel-abaddon-black")!;
    expect(nearestPaint(abaddon, paintsByBrand("Vallejo"))?.name).toBe("Black");
    expect(nearestPaint(abaddon, paintsByBrand("The Army Painter"))?.name).toBe("Matt Black");
  });

  it("only swaps a shade for a shade, and a metal for a metal", () => {
    const nulnOil = getPaint("citadel-nuln-oil")!;
    expect(nearestPaint(nulnOil, paintsByBrand("The Army Painter"))?.type).toBe("shade");

    const gold = getPaint("citadel-retributor-armour")!;
    expect(nearestPaint(gold, paintsByBrand("Vallejo"))?.type).toBe("metallic");
  });

  it("returns nothing when no paint of a fitting type exists", () => {
    const lahmian = getPaint("citadel-lahmian-medium")!;
    expect(nearestPaint(lahmian, paintsByBrand("Vallejo"))).toBeUndefined();
  });
});
