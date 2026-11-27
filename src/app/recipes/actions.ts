"use server";

import { redirect } from "next/navigation";
import { refresh } from "next/cache";
import { z } from "zod";
import { getRecipe } from "@/lib/ai";
import { LIMIT_REACHED, recordAiRequest, remainingAiToday } from "@/lib/ai-usage";
import { requireUser } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import { isBrand } from "@/lib/recipes";

const requestSchema = z.object({
  subject: z
    .string()
    .trim()
    .min(1, { error: "Name the miniature you want to paint" })
    .max(100, { error: "The name can be at most 100 characters" }),
  style: z.string().trim().max(200, { error: "Describe the look in at most 200 characters" }),
});

export type RecipeFormState =
  | { status: "error"; error: string; values: { subject: string; style: string } }
  | null;

export async function createRecipe(_prev: RecipeFormState, formData: FormData): Promise<RecipeFormState> {
  const session = await requireUser();

  const values = {
    subject: String(formData.get("subject") ?? ""),
    style: String(formData.get("style") ?? ""),
  };
  const brandValue = formData.get("brand");
  const brand = isBrand(brandValue) ? brandValue : "any";
  const miniatureIdValue = String(formData.get("miniatureId") ?? "");

  const parsed = requestSchema.safeParse(values);
  if (!parsed.success) {
    return { status: "error", error: parsed.error.issues[0].message, values };
  }

  // A linked miniature must belong to the signed-in user
  const miniature =
    miniatureIdValue ?
      await prisma.miniature.findFirst({
        where: { id: miniatureIdValue, userId: session.user.id },
        select: { id: true },
      })
    : null;

  if ((await remainingAiToday(session.user.id)) === 0) {
    return { status: "error", error: LIMIT_REACHED, values };
  }
  await recordAiRequest(session.user.id, "recipe");

  const owned = await prisma.userPaint.findMany({
    where: { userId: session.user.id },
    select: { paintId: true },
  });

  const result = await getRecipe({
    subject: parsed.data.subject,
    style: parsed.data.style,
    brand,
    ownedPaintIds: owned.map((row) => row.paintId),
  });
  if (result.status === "error") {
    return { status: "error", error: result.error, values };
  }

  const recipe = await prisma.recipe.create({
    data: {
      subject: parsed.data.subject,
      style: parsed.data.style || null,
      title: result.data.title,
      summary: result.data.summary,
      steps: result.data.steps,
      mixes: result.data.mixes,
      model: result.model,
      userId: session.user.id,
      miniatureId: miniature?.id ?? null,
    },
    select: { id: true },
  });

  redirect(`/recipes/${recipe.id}`);
}

export async function deleteRecipe(formData: FormData) {
  const session = await requireUser();
  const id = String(formData.get("id") ?? "");
  await prisma.recipe.deleteMany({ where: { id, userId: session.user.id } });
  refresh();
  redirect("/recipes");
}
