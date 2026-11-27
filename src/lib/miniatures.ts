// The rules for miniatures, kept free from the database so they can be unit tested.
import { z } from "zod";

// Same values as the PaintStatus enum in prisma/schema.prisma.
// Listed here in the order a miniature moves through them.
export const paintStatuses = ["UNPAINTED", "IN_PROGRESS", "DONE"] as const;

export type PaintStatus = (typeof paintStatuses)[number];

export const statusLabels: Record<PaintStatus, string> = {
  UNPAINTED: "Unpainted",
  IN_PROGRESS: "In progress",
  DONE: "Done",
};

export function isPaintStatus(value: unknown): value is PaintStatus {
  return typeof value === "string" && (paintStatuses as readonly string[]).includes(value);
}

export type MiniatureValues = {
  name: string;
  faction: string;
  notes: string;
};

type ParseResult =
  | {
      success: true;
      data: { name: string; faction: string | null; notes: string | null };
    }
  | { success: false; error: string };

// An empty optional field is saved as null, not as an empty string
const optionalText = (max: number, message: string) =>
  z
    .string()
    .trim()
    .max(max, { error: message })
    .transform((value) => (value === "" ? null : value));

const miniatureSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { error: "Give the miniature a name" })
    .max(80, { error: "The name can be at most 80 characters" }),
  faction: optionalText(60, "The faction can be at most 60 characters"),
  notes: optionalText(500, "The notes can be at most 500 characters"),
});

export function parseMiniature(values: MiniatureValues): ParseResult {
  const result = miniatureSchema.safeParse(values);

  if (!result.success) {
    return { success: false, error: result.error.issues[0].message };
  }

  return { success: true, data: result.data };
}

// How many miniatures have each status, with every status present (0 if none)
export function countByStatus(miniatures: { status: PaintStatus }[]): Record<PaintStatus, number> {
  const counts: Record<PaintStatus, number> = { UNPAINTED: 0, IN_PROGRESS: 0, DONE: 0 };

  for (const miniature of miniatures) {
    counts[miniature.status] += 1;
  }

  return counts;
}
