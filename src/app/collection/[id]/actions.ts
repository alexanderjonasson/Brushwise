"use server";

import { del, put } from "@vercel/blob";
import { refresh } from "next/cache";
import { requireUser } from "@/lib/dal";
import { checkPhoto, photoPathname } from "@/lib/photos";
import { prisma } from "@/lib/prisma";

export type PhotoFormState = { status: "error"; error: string } | { status: "success" } | null;

export async function uploadPhoto(
  _prevState: PhotoFormState,
  formData: FormData,
): Promise<PhotoFormState> {
  const session = await requireUser();

  const miniatureId = String(formData.get("miniatureId") ?? "");
  const file = formData.get("photo");

  // 1. The miniature must exist and belong to the signed-in user
  const miniature = await prisma.miniature.findFirst({
    where: { id: miniatureId, userId: session.user.id },
    select: { id: true },
  });
  if (!miniature) {
    return { status: "error", error: "That miniature doesn't exist" };
  }

  if (!(file instanceof File)) {
    return { status: "error", error: "Choose a photo to upload" };
  }

  // 2. Check the size and what the file really is, from its first bytes
  const buffer = await file.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  const check = checkPhoto({ size: file.size, bytes });
  if (!check.success) {
    return { status: "error", error: check.error };
  }

  // 3. Store the file in Vercel Blob. The content type is the one we detected,
  //    not the one the browser claimed.
  const blob = await put(photoPathname(miniature.id, check.type), buffer, {
    access: "public",
    addRandomSuffix: true,
    contentType: check.type,
  });

  // 4. Save its address. If that fails, remove the file again so no orphan is left.
  try {
    await prisma.photo.create({
      data: {
        url: blob.url,
        pathname: blob.pathname,
        contentType: check.type,
        size: bytes.byteLength,
        miniatureId: miniature.id,
      },
    });
  } catch (error) {
    await del(blob.url).catch(() => {});
    throw error;
  }

  refresh();
  return { status: "success" };
}

export async function deletePhoto(formData: FormData) {
  const session = await requireUser();
  const id = String(formData.get("id") ?? "");

  // Only find the photo if its miniature belongs to the signed-in user
  const photo = await prisma.photo.findFirst({
    where: { id, miniature: { userId: session.user.id } },
    select: { id: true, url: true },
  });
  if (!photo) {
    return;
  }

  // The file first: if that fails, the row is still there and the user can try again
  await del(photo.url);
  await prisma.photo.delete({ where: { id: photo.id } });

  refresh();
}
