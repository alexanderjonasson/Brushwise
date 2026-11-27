import { describe, expect, it } from "vitest";
import { catalog, searchCatalog } from "./catalog";

describe("searchCatalog", () => {
  it("finds a unit by part of its name, with its faction", () => {
    expect(searchCatalog("hive ty")).toContainEqual({ name: "Hive Tyrant", faction: "Tyranids" });
  });

  it("puts names that start with the search first", () => {
    const names = searchCatalog("hive").map((entry) => entry.name);
    expect(names[0]).toBe("Hive Tyrant");
  });

  it("matches words in any order, across name and faction", () => {
    const results = searchCatalog("tyranids carnifex");
    expect(results).toEqual([{ name: "Carnifex", faction: "Tyranids" }]);
  });

  it("ignores case, accents and apostrophes", () => {
    expect(searchCatalog("BELAKOR")[0]).toEqual({ name: "Be'lakor", faction: "Chaos Daemons" });
    expect(searchCatalog("kahl")[0]).toEqual({ name: "Kâhl", faction: "Leagues of Votann" });
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
  it("has no unit listed twice in the same faction", () => {
    const keys = catalog.map((entry) => `${entry.faction}/${entry.name}`);
    expect(new Set(keys).size).toBe(keys.length);
  });
});
