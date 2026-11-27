import { describe, expect, it } from "vitest";
import { catalog, gameNames, searchCatalog } from "./catalog";

describe("searchCatalog", () => {
  it("finds a unit by part of its name, with its faction and game", () => {
    expect(searchCatalog("hive ty")).toContainEqual({
      name: "Hive Tyrant",
      faction: "Tyranids",
      game: "Warhammer 40,000",
    });
  });

  it("puts names that start with the search first", () => {
    const names = searchCatalog("hive").map((entry) => entry.name);
    expect(names[0]).toBe("Hive Tyrant");
  });

  it("matches words in any order, across name, faction and game", () => {
    expect(searchCatalog("tyranids carnifex")).toEqual([
      { name: "Carnifex", faction: "Tyranids", game: "Warhammer 40,000" },
    ]);
    expect(searchCatalog("dragons red")[0]).toEqual({
      name: "Red Dragon",
      faction: "Dragons",
      game: "Dungeons & Dragons",
    });
  });

  it("lists name matches before miniatures that only match the game", () => {
    // "dragon" is also in "Dungeons & Dragons", which every D&D monster belongs to
    const names = searchCatalog("dragon").map((entry) => entry.name);
    expect(names.every((name) => name.toLowerCase().includes("dragon"))).toBe(true);
  });

  it("finds miniatures from every game", () => {
    expect(searchCatalog("horus")[0].game).toBe("Horus Heresy");
    expect(searchCatalog("liberators")[0].game).toBe("Age of Sigmar");
    expect(searchCatalog("balrog")[0].game).toBe("Middle-earth");
    expect(searchCatalog("darth vader")[0].game).toBe("Star Wars");
    expect(searchCatalog("owlbear")[0].game).toBe("Dungeons & Dragons");
  });

  it("ignores case, accents and apostrophes", () => {
    expect(searchCatalog("BELAKOR")[0].name).toBe("Be'lakor");
    expect(searchCatalog("kahl")[0].name).toBe("Kâhl");
    expect(searchCatalog("theoden")[0].name).toBe("Théoden");
  });

  it("returns nothing for an empty search or no match", () => {
    expect(searchCatalog("   ")).toEqual([]);
    expect(searchCatalog("definitely not a unit")).toEqual([]);
  });

  it("returns at most the limit", () => {
    expect(searchCatalog("squad", 5)).toHaveLength(5);
  });
});

describe("catalog", () => {
  it("has no miniature listed twice in the same faction of the same game", () => {
    const keys = catalog.map((entry) => `${entry.game}/${entry.faction}/${entry.name}`);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it("has miniatures for every game", () => {
    for (const game of gameNames) {
      expect(catalog.some((entry) => entry.game === game)).toBe(true);
    }
  });
});
