import { describe, expect, it } from "vitest";
import {
  DAILY_FEEDBACK_LIMIT,
  feedbackSchema,
  mockFeedback,
  remainingFeedback,
  startOfUtcDay,
} from "./feedback";

describe("feedbackSchema", () => {
  it("accepts the example answer used without an API key", () => {
    expect(feedbackSchema.safeParse(mockFeedback).success).toBe(true);
  });

  it("rejects scores outside 1–10", () => {
    expect(feedbackSchema.safeParse({ ...mockFeedback, overallScore: 11 }).success).toBe(false);
    expect(feedbackSchema.safeParse({ ...mockFeedback, overallScore: 0 }).success).toBe(false);
  });

  it("rejects an area that isn't on the list", () => {
    const areas = [{ area: "Glitter", score: 5, comment: "Sparkly", tip: "Less glitter" }];
    expect(feedbackSchema.safeParse({ ...mockFeedback, areas }).success).toBe(false);
  });

  it("accepts an answer for a photo that isn't a miniature", () => {
    const notAMiniature = {
      isPaintedMiniature: false,
      overallScore: 1,
      summary: "This looks like a photo of a cat.",
      areas: [],
      nextSteps: [],
    };
    expect(feedbackSchema.safeParse(notAMiniature).success).toBe(true);
  });
});

describe("startOfUtcDay", () => {
  it("goes back to midnight UTC on the same day", () => {
    expect(startOfUtcDay(new Date("2026-11-27T17:45:12Z")).toISOString()).toBe(
      "2026-11-27T00:00:00.000Z",
    );
  });
});

describe("remainingFeedback", () => {
  it("counts down from the daily limit", () => {
    expect(remainingFeedback(0)).toBe(DAILY_FEEDBACK_LIMIT);
    expect(remainingFeedback(3, 10)).toBe(7);
  });

  it("never goes below zero", () => {
    expect(remainingFeedback(12, 10)).toBe(0);
  });
});
