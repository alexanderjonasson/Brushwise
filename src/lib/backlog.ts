// The shape of the AI box scan and the backlog rules, kept free from the API
// client so they can be unit tested.
import { z } from "zod";

export const boxScanSchema = z.object({
  isBox: z.boolean().describe("False if the photo doesn't show a miniatures box or kit"),
  name: z.string().describe("The kit or box name as printed, e.g. 'Combat Patrol: Tyranids'"),
  faction: z.string().describe("The faction or army, or an empty string if unclear"),
  quantity: z
    .int()
    .min(1)
    .max(200)
    .describe("Number of miniatures in the box, from the box text if printed, else your best estimate"),
  quantityPrinted: z.boolean().describe("True if the number of miniatures is printed on the box"),
});

export type BoxScan = z.infer<typeof boxScanSchema>;

export const backlogSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { error: "Give the box a name" })
    .max(100, { error: "The name can be at most 100 characters" }),
  faction: z
    .string()
    .trim()
    .max(60, { error: "The faction can be at most 60 characters" })
    .transform((value) => (value === "" ? null : value)),
  quantity: z.coerce
    .number({ error: "Enter how many models are in the box" })
    .int({ error: "Enter a whole number of models" })
    .min(1, { error: "A box needs at least 1 model" })
    .max(200, { error: "That's a lot of models – at most 200 per box" }),
});

export type BacklogValues = { name: string; faction: string; quantity: string };

export function parseBacklogItem(values: BacklogValues) {
  const result = backlogSchema.safeParse(values);
  return result.success
    ? ({ success: true, data: result.data } as const)
    : ({ success: false, error: result.error.issues[0].message } as const);
}

// Starting one model from a box: the box shrinks, and disappears at zero
export function afterStartingOne(quantity: number): { remaining: number; removeBox: boolean } {
  const remaining = Math.max(0, quantity - 1);
  return { remaining, removeBox: remaining === 0 };
}

export const mockBoxScan: BoxScan = {
  isBox: true,
  name: "Combat Patrol: Tyranids",
  faction: "Tyranids",
  quantity: 13,
  quantityPrinted: true,
};
