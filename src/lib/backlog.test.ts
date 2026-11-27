import { describe, expect, it } from "vitest";
import { afterStartingOne, boxScanSchema, mockBoxScan, parseBacklogItem } from "./backlog";

describe("boxScanSchema", () => {
  it("accepts the example answer used without an API key", () => {
    expect(boxScanSchema.safeParse(mockBoxScan).success).toBe(true);
  });

  it("rejects an impossible number of models", () => {
    expect(boxScanSchema.safeParse({ ...mockBoxScan, quantity: 0 }).success).toBe(false);
    expect(boxScanSchema.safeParse({ ...mockBoxScan, quantity: 500 }).success).toBe(false);
  });
});

describe("parseBacklogItem", () => {
  it("trims the values and turns the quantity into a number", () => {
    expect(parseBacklogItem({ name: " Combat Patrol ", faction: " Orks ", quantity: "12" })).toEqual({
      success: true,
      data: { name: "Combat Patrol", faction: "Orks", quantity: 12 },
    });
  });

  it("saves an empty faction as null", () => {
    const result = parseBacklogItem({ name: "Box", faction: " ", quantity: "1" });
    expect(result.success && result.data.faction).toBeNull();
  });

  it("rejects a missing name and bad quantities", () => {
    expect(parseBacklogItem({ name: " ", faction: "", quantity: "1" })).toEqual({
      success: false,
      error: "Give the box a name",
    });
    expect(parseBacklogItem({ name: "Box", faction: "", quantity: "0" }).success).toBe(false);
    expect(parseBacklogItem({ name: "Box", faction: "", quantity: "2.5" }).success).toBe(false);
    expect(parseBacklogItem({ name: "Box", faction: "", quantity: "lots" }).success).toBe(false);
  });
});

describe("afterStartingOne", () => {
  it("takes one model out of the box", () => {
    expect(afterStartingOne(5)).toEqual({ remaining: 4, removeBox: false });
  });

  it("removes the box when the last model is started", () => {
    expect(afterStartingOne(1)).toEqual({ remaining: 0, removeBox: true });
  });
});
