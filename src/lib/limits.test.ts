import { describe, expect, it } from "vitest";
import { DAILY_AI_LIMIT, remainingRequests, startOfUtcDay } from "./limits";

describe("startOfUtcDay", () => {
  it("goes back to midnight UTC on the same day", () => {
    expect(startOfUtcDay(new Date("2026-11-27T17:45:12Z")).toISOString()).toBe(
      "2026-11-27T00:00:00.000Z",
    );
  });
});

describe("remainingRequests", () => {
  it("counts down from the daily limit", () => {
    expect(remainingRequests(0)).toBe(DAILY_AI_LIMIT);
    expect(remainingRequests(3, 10)).toBe(7);
  });

  it("never goes below zero", () => {
    expect(remainingRequests(12, 10)).toBe(0);
  });
});
