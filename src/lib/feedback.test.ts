import { describe, expect, it } from "vitest";
import { feedbackSchema, mockFeedback } from "./feedback";

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

