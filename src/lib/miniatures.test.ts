import { describe, expect, it } from "vitest";
import { countByStatus, isPaintStatus, parseMiniature } from "./miniatures";

describe("parseMiniature", () => {
  it("trims the values and keeps the optional fields", () => {
    const result = parseMiniature({
      name: "  Intercessor Sergeant ",
      faction: " Space Marines ",
      notes: " Blue armour, gold trim ",
    });

    expect(result).toEqual({
      success: true,
      data: { name: "Intercessor Sergeant", faction: "Space Marines", notes: "Blue armour, gold trim" },
    });
  });

  it("saves empty optional fields as null", () => {
    const result = parseMiniature({ name: "Ork Boy", faction: "   ", notes: "" });

    expect(result).toEqual({
      success: true,
      data: { name: "Ork Boy", faction: null, notes: null },
    });
  });

  it("asks for a name when it is empty", () => {
    const result = parseMiniature({ name: "   ", faction: "", notes: "" });

    expect(result).toEqual({ success: false, error: "Give the miniature a name" });
  });

  it("rejects a name that is too long", () => {
    const result = parseMiniature({ name: "a".repeat(81), faction: "", notes: "" });

    expect(result).toEqual({ success: false, error: "The name can be at most 80 characters" });
  });

  it("rejects notes that are too long", () => {
    const result = parseMiniature({ name: "Ork Boy", faction: "", notes: "a".repeat(501) });

    expect(result).toEqual({ success: false, error: "The notes can be at most 500 characters" });
  });
});

describe("isPaintStatus", () => {
  it("accepts the three statuses", () => {
    expect(isPaintStatus("UNPAINTED")).toBe(true);
    expect(isPaintStatus("IN_PROGRESS")).toBe(true);
    expect(isPaintStatus("DONE")).toBe(true);
  });

  it("rejects anything else", () => {
    expect(isPaintStatus("done")).toBe(false);
    expect(isPaintStatus("")).toBe(false);
    expect(isPaintStatus(null)).toBe(false);
  });
});

describe("countByStatus", () => {
  it("counts every status, with 0 for the ones not used", () => {
    const counts = countByStatus([
      { status: "UNPAINTED" },
      { status: "UNPAINTED" },
      { status: "DONE" },
    ]);

    expect(counts).toEqual({ UNPAINTED: 2, IN_PROGRESS: 0, DONE: 1 });
  });

  it("returns all zeros for an empty collection", () => {
    expect(countByStatus([])).toEqual({ UNPAINTED: 0, IN_PROGRESS: 0, DONE: 0 });
  });
});
