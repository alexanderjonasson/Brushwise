"use server";

import { refresh } from "next/cache";
import { requireUser } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import { isPaintStatus, parseMiniature, type MiniatureValues } from "@/lib/miniatures";

// What the add form gets back. On error the typed values are returned, so the
// form can show them again (React empties a form after its action has run).
export type MiniatureFormState =
  | { status: "error"; error: string; values: MiniatureValues }
  | { status: "success"; addedName: string }
  | null;

export async function createMiniature(
  _prevState: MiniatureFormState,
  formData: FormData,
): Promise<MiniatureFormState> {
  const session = await requireUser();

  const values: MiniatureValues = {
    name: String(formData.get("name") ?? ""),
    faction: String(formData.get("faction") ?? ""),
    notes: String(formData.get("notes") ?? ""),
  };

  const parsed = parseMiniature(values);
  if (!parsed.success) {
    return { status: "error", error: parsed.error, values };
  }

  // The owner always comes from the session, never from the form
  await prisma.miniature.create({
    data: { ...parsed.data, userId: session.user.id },
  });

  refresh();
  return { status: "success", addedName: parsed.data.name };
}

export async function updateMiniatureStatus(formData: FormData) {
  const session = await requireUser();

  const id = String(formData.get("id") ?? "");
  const status = formData.get("status");

  if (!id || !isPaintStatus(status)) {
    return;
  }

  // updateMany with userId in the filter: if the id belongs to someone else,
  // nothing matches and nothing changes. update() would only check the id.
  await prisma.miniature.updateMany({
    where: { id, userId: session.user.id },
    data: { status },
  });

  refresh();
}

export async function deleteMiniature(formData: FormData) {
  const session = await requireUser();

  const id = String(formData.get("id") ?? "");
  if (!id) {
    return;
  }

  // Same ownership check as above
  await prisma.miniature.deleteMany({
    where: { id, userId: session.user.id },
  });

  refresh();
}
