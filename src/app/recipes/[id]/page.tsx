import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { PaintSwatch } from "@/components/PaintSwatch";
import { RecipeSteps } from "@/components/RecipeSteps";
import { requireUser } from "@/lib/dal";
import { getPaint, paints } from "@/lib/paints";
import { prisma } from "@/lib/prisma";
import { buildRecipeView, missingPaints, recipeSchema } from "@/lib/recipes";
import { buttonSecondary, card, link, mutedText } from "@/lib/ui";
import { deleteRecipe } from "../actions";

export const metadata: Metadata = { title: "Recipe – Brushwise" };

// The JSON columns are checked against the schema that shaped the AI's answer
const storedParts = recipeSchema.pick({ steps: true, mixes: true });

async function RecipeContent({ params }: { params: Promise<{ id: string }> }) {
  const [{ id }, session] = await Promise.all([params, requireUser()]);

  const [recipe, owned] = await Promise.all([
    prisma.recipe.findFirst({
      where: { id, userId: session.user.id },
      include: {
        miniature: {
          select: {
            id: true,
            name: true,
            photos: { orderBy: { createdAt: "desc" }, take: 1, select: { url: true } },
          },
        },
      },
    }),
    prisma.userPaint.findMany({ where: { userId: session.user.id }, select: { paintId: true } }),
  ]);
  if (!recipe) notFound();

  const parts = storedParts.safeParse({ steps: recipe.steps, mixes: recipe.mixes });
  const steps = parts.success ? buildRecipeView(parts.data.steps, owned.map((row) => row.paintId), paints) : [];
  const mixes = parts.success ? parts.data.mixes : [];
  const missing = missingPaints(steps);
  const photo = recipe.miniature?.photos[0];

  return (
    <>
      <div className="flex flex-wrap items-start gap-6">
        {/* The user's own photo of the miniature, if there is one */}
        {photo && (
          <div className="relative size-32 shrink-0 overflow-hidden rounded-xl bg-neutral-100 dark:bg-neutral-800">
            <Image src={photo.url} alt={recipe.subject} fill sizes="128px" className="object-cover" />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className={`text-sm ${mutedText}`}>
            {recipe.miniature ?
              <Link href={`/collection/${recipe.miniature.id}`} className={link}>
                {recipe.subject}
              </Link>
            : recipe.subject}
            {recipe.style && ` · ${recipe.style}`}
          </p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight">{recipe.title}</h1>
          {recipe.model === "mock" && (
            <p className={`mt-1 text-xs ${mutedText}`}>Example answer – no AI was called</p>
          )}
          <p className="mt-3 leading-relaxed">{recipe.summary}</p>
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className={card}>
          <h2 className="font-semibold">
            Paints you need{" "}
            <span className={`font-normal ${mutedText}`}>({missing.length} missing)</span>
          </h2>
          {missing.length === 0 ?
            <p className="mt-2 text-sm text-green-700 dark:text-green-400">
              You own every paint in this recipe.
            </p>
          : <ul className="mt-3 space-y-2">
              {missing.map((paint) => (
                <li key={paint.id} className="flex items-center gap-2 text-sm">
                  <PaintSwatch paint={paint} size="sm" />
                  {paint.name} <span className={mutedText}>· {paint.brand}</span>
                </li>
              ))}
            </ul>
          }
        </div>

        <div className={card}>
          <h2 className="font-semibold">Mix it yourself</h2>
          {mixes.length === 0 ?
            <p className={`mt-2 text-sm ${mutedText}`}>
              No mixes suggested for this recipe.
            </p>
          : <ul className="mt-3 space-y-3">
              {mixes.map((mix) => {
                const paint = getPaint(mix.forPaintId);
                return (
                  <li key={mix.forPaintId} className="text-sm">
                    <p className="flex items-center gap-2 font-medium">
                      {paint && <PaintSwatch paint={paint} size="sm" />}
                      Instead of {paint?.name ?? mix.forPaintId}
                    </p>
                    <p className={`mt-0.5 ${mutedText}`}>{mix.recipe}</p>
                  </li>
                );
              })}
            </ul>
          }
          <p className={`mt-3 text-xs ${mutedText}`}>
            Mixes are AI suggestions – test on a spare part first.
          </p>
        </div>
      </div>

      <div className="mt-10">
        <RecipeSteps steps={steps} />
      </div>

      <form action={deleteRecipe} className="mt-10">
        <input type="hidden" name="id" value={recipe.id} />
        <button type="submit" className={`${buttonSecondary} text-red-700 dark:text-red-400`}>
          Delete recipe
        </button>
      </form>
    </>
  );
}

export default function RecipePage({ params }: PageProps<"/recipes/[id]">) {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-12">
      <Link href="/recipes" className={`${link} text-sm`}>
        ← All recipes
      </Link>
      <div className="mt-4">
        <Suspense fallback={<p className={mutedText}>Loading...</p>}>
          <RecipeContent params={params} />
        </Suspense>
      </div>
    </main>
  );
}
