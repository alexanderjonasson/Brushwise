"use server";

import { del, put } from "@vercel/blob";
import { refresh } from "next/cache";
import { scanBox } from "@/lib/ai";
import { LIMIT_REACHED, recordAiRequest, remainingAiToday } from "@/lib/ai-usage";
import { afterStartingOne, parseBacklogItem, type BacklogValues } from "@/lib/backlog";
import { requireUser } from "@/lib/dal";
import { checkPhoto, photoPathname } from "@/lib/photos";
import { prisma } from "@/lib/prisma";

export type BoxScanState =
  | { status: "error"; error: string }
  | {
      status: "ok";
      isBox: boolean;
      values: BacklogValues;
      quantityPrinted: boolean;
      photoUrl: string;
      photoPath: string;
      model: string;
      scannedAt: number;
    }
  | null;

// Uploads a photo of a box and lets AI read it. The result only pre-fills the
// form: nothing is added to the backlog until the user checks it and saves.
export async function scanBoxPhoto(_prev: BoxScanState, formData: FormData): Promise<BoxScanState> {
  const session = await requireUser();
  const file = formData.get("photo");
  if (!(file instanceof File)) return { status: "error", error: "Choose a photo of the box" };

  const buffer = await file.arrayBuffer();
  const check = checkPhoto({ size: file.size, bytes: new Uint8Array(buffer) });
  if (!check.success) return { status: "error", error: check.error };

  if ((await remainingAiToday(session.user.id)) === 0) {
    return { status: "error", error: LIMIT_REACHED };
  }
  await recordAiRequest(session.user.id, "box-scan");

  // Stored under the user's id, so saving can check the photo is theirs
  const blob = await put(photoPathname(`backlog-${session.user.id}`, check.type), buffer, {
    access: "public",
    addRandomSuffix: true,
    contentType: check.type,
  });

  const result = await scanBox(blob.url);
  if (result.status === "error") {
    await del(blob.url).catch(() => {});
    return result;
  }

  return {
    status: "ok",
    isBox: result.data.isBox,
    values: {
      name: result.data.name,
      faction: result.data.faction,
      quantity: String(result.data.quantity),
    },
    quantityPrinted: result.data.quantityPrinted,
    photoUrl: blob.url,
    photoPath: blob.pathname,
    model: result.model,
    scannedAt: Date.now(),
  };
}

export type BacklogFormState =
  | { status: "error"; error: string; values: BacklogValues }
  | { status: "success"; savedAt: number }
  | null;

export async function addBacklogItem(_prev: BacklogFormState, formData: FormData): Promise<BacklogFormState> {
  const session = await requireUser();

  const values: BacklogValues = {
    name: String(formData.get("name") ?? ""),
    faction: String(formData.get("faction") ?? ""),
    quantity: String(formData.get("quantity") ?? ""),
  };
  const parsed = parseBacklogItem(values);
  if (!parsed.success) return { status: "error", error: parsed.error, values };

  // A photo from a scan is only accepted if it was stored under this user
  const photoUrl = String(formData.get("photoUrl") ?? "");
  const photoPath = String(formData.get("photoPath") ?? "");
  const photoIsTheirs =
    photoPath.startsWith(`miniatures/backlog-${session.user.id}/`) &&
    /^https:\/\/[a-z0-9]+\.public\.blob\.vercel-storage\.com\//.test(photoUrl) &&
    photoUrl.endsWith(`/${photoPath}`);

  await prisma.backlogItem.create({
    data: {
      ...parsed.data,
      photoUrl: photoIsTheirs ? photoUrl : null,
      photoPath: photoIsTheirs ? photoPath : null,
      userId: session.user.id,
    },
  });

  refresh();
  return { status: "success", savedAt: Date.now() };
}

// Takes one model out of the box and puts it in the collection as in progress
export async function startPainting(formData: FormData) {
  const session = await requireUser();
  const id = String(formData.get("id") ?? "");

  const item = await prisma.backlogItem.findFirst({
    where: { id, userId: session.user.id },
  });
  if (!item) return;

  const { remaining, removeBox } = afterStartingOne(item.quantity);

  // Both changes or neither
  await prisma.$transaction([
    prisma.miniature.create({
      data: {
        name: item.name,
        faction: item.faction,
        status: "IN_PROGRESS",
        userId: session.user.id,
      },
    }),
    removeBox ?
      prisma.backlogItem.delete({ where: { id: item.id } })
    : prisma.backlogItem.update({ where: { id: item.id }, data: { quantity: remaining } }),
  ]);

  if (removeBox && item.photoUrl) {
    await del(item.photoUrl).catch(() => {});
  }
  refresh();
}

export async function deleteBacklogItem(formData: FormData) {
  const session = await requireUser();
  const id = String(formData.get("id") ?? "");

  const item = await prisma.backlogItem.findFirst({
    where: { id, userId: session.user.id },
    select: { id: true, photoUrl: true },
  });
  if (!item) return;

  await prisma.backlogItem.delete({ where: { id: item.id } });
  if (item.photoUrl) {
    await del(item.photoUrl).catch(() => {});
  }
  refresh();
}
