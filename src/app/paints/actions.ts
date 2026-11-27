"use server";

import { refresh } from "next/cache";
import { scanPaints } from "@/lib/ai";
import { LIMIT_REACHED, recordAiRequest, remainingAiToday } from "@/lib/ai-usage";
import { requireUser } from "@/lib/dal";
import { getPaint } from "@/lib/paints";
import { checkPhoto } from "@/lib/photos";
import { prisma } from "@/lib/prisma";

// Only ids from our paint list are ever saved
function validIds(values: FormDataEntryValue[]): string[] {
  return [...new Set(values.map(String))].filter((id) => getPaint(id) !== undefined);
}

export async function addPaint(formData: FormData) {
  const session = await requireUser();
  const [paintId] = validIds(formData.getAll("paintId"));
  if (!paintId) return;

  // upsert: adding a paint you already own does nothing instead of failing
  await prisma.userPaint.upsert({
    where: { userId_paintId: { userId: session.user.id, paintId } },
    create: { userId: session.user.id, paintId },
    update: {},
  });
  refresh();
}

export type AddPaintsState = { added: number } | null;

export async function addPaints(_prev: AddPaintsState, formData: FormData): Promise<AddPaintsState> {
  const session = await requireUser();
  const ids = validIds(formData.getAll("paintId"));

  const result = await prisma.userPaint.createMany({
    data: ids.map((paintId) => ({ userId: session.user.id, paintId })),
    skipDuplicates: true,
  });
  refresh();
  return { added: result.count };
}

export async function removePaint(formData: FormData) {
  const session = await requireUser();
  const paintId = String(formData.get("paintId") ?? "");
  await prisma.userPaint.deleteMany({ where: { userId: session.user.id, paintId } });
  refresh();
}

export type PaintScanState =
  | { status: "error"; error: string }
  | {
      status: "ok";
      suggestions: { paintId: string; confidence: "high" | "low" }[];
      unrecognised: string[];
      model: string;
    }
  | null;

// Reads a photo of the user's paints. Nothing is saved here: the user picks
// which suggestions to keep, since the AI can misread a label.
export async function scanPaintPhoto(_prev: PaintScanState, formData: FormData): Promise<PaintScanState> {
  const session = await requireUser();
  const file = formData.get("photo");
  if (!(file instanceof File)) return { status: "error", error: "Choose a photo to scan" };

  const bytes = new Uint8Array(await file.arrayBuffer());
  const check = checkPhoto({ size: file.size, bytes });
  if (!check.success) return { status: "error", error: check.error };

  if ((await remainingAiToday(session.user.id)) === 0) {
    return { status: "error", error: LIMIT_REACHED };
  }
  await recordAiRequest(session.user.id, "paint-scan");

  // The photo goes straight to the AI and is never stored
  const result = await scanPaints({
    base64: Buffer.from(bytes).toString("base64"),
    mediaType: check.type,
  });
  if (result.status === "error") return result;

  const suggestions = result.data.paints.filter((match) => getPaint(match.paintId) !== undefined);
  return {
    status: "ok",
    suggestions,
    unrecognised: result.data.unrecognised,
    model: result.model,
  };
}
