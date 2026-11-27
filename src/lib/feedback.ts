// The shape of AI feedback, kept free from the API client so it can be unit tested.
// The same Zod schema is sent to Claude as the required answer format
// (structured outputs) and used to check stored feedback when it is read back.
import { z } from "zod";

export const feedbackAreas = [
  "Basecoat",
  "Shading",
  "Highlights",
  "Edge highlights",
  "Details",
  "Blending",
  "Basing",
] as const;

const score = z.int().min(1).max(10);

export const feedbackSchema = z.object({
  isPaintedMiniature: z
    .boolean()
    .describe("False if the photo doesn't show a miniature with paint on it"),
  overallScore: score.describe("Overall paint job, 1 (just started) to 10 (competition level)"),
  summary: z.string().describe("Two or three sentences on the paint job as a whole"),
  areas: z
    .array(
      z.object({
        area: z.enum(feedbackAreas),
        score,
        comment: z.string().describe("What you see in this area, one or two sentences"),
        tip: z.string().describe("One concrete thing to try next time"),
      }),
    )
    .describe("Three to five areas that are visible and worth commenting on"),
  nextSteps: z
    .array(z.string())
    .describe("The two or three most useful things to practise next, most important first"),
});

export type PaintingFeedback = z.infer<typeof feedbackSchema>;

// What feedback reads like with no API key: realistic enough to build the UI
// against, and clearly marked as an example in the interface.
export const mockFeedback: PaintingFeedback = {
  isPaintedMiniature: true,
  overallScore: 6,
  summary:
    "A clean, tabletop-ready paint job with neat basecoats and a clear colour scheme. The shading has started to give the model depth, and the next big step is adding highlights so the raised areas catch the eye.",
  areas: [
    {
      area: "Basecoat",
      score: 7,
      comment: "Solid, even coverage with no visible brush strokes on the large armour panels.",
      tip: "Keep thinning your paint to a milk-like consistency and use two thin coats instead of one thick.",
    },
    {
      area: "Shading",
      score: 6,
      comment: "The wash has settled into the recesses, but some has pooled on the flat panels.",
      tip: "After washing, use a clean damp brush to lift excess wash off flat areas before it dries.",
    },
    {
      area: "Highlights",
      score: 4,
      comment: "There are few highlights yet, so the model looks a little flat from a distance.",
      tip: "Pick one lighter shade and paint it on the upper edges and the tops of rounded shapes.",
    },
    {
      area: "Basing",
      score: 5,
      comment: "The base is painted, which already makes the model look finished.",
      tip: "Add texture paint or sand, then drybrush it, and finish with a few tufts.",
    },
  ],
  nextSteps: [
    "Practise edge highlighting on the armour",
    "Clean up pooled wash on flat panels",
    "Add texture to the base",
  ],
};
