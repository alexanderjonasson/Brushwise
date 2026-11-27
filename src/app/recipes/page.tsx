import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { RecipeForm } from "@/components/RecipeForm";
import { remainingAiToday } from "@/lib/ai-usage";
import { requireUser } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import { card, link, mutedText } from "@/lib/ui";

export const metadata: Metadata = { title: "Recipes – Brushwise" };

const dateFormat = new Intl.DateTimeFormat("en-GB", { dateStyle: "medium" });

async function RecipesContent({ searchParams }: { searchParams: PageProps<"/recipes">["searchParams"] }) {
  const [session, params] = await Promise.all([requireUser(), searchParams]);
  const miniatureId = typeof params.miniature === "string" ? params.miniature : undefined;

  const [recipes, ownedCount, aiLeft, miniature] = await Promise.all([
    prisma.recipe.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      select: { id: true, title: true, subject: true, createdAt: true },
    }),
    prisma.userPaint.count({ where: { userId: session.user.id } }),
    remainingAiToday(session.user.id),
    // Coming from a miniature's page: only accept the user's own miniature
    miniatureId ?
      prisma.miniature.findFirst({
        where: { id: miniatureId, userId: session.user.id },
        select: { id: true, name: true },
      })
    : null,
  ]);

  return (
    <>
      <div className="mt-8">
        <RecipeForm aiLeft={aiLeft} ownedCount={ownedCount} miniature={miniature ?? undefined} />
      </div>

      <h2 className="mt-10 text-xl font-semibold">
        Your recipes <span className={`font-normal ${mutedText}`}>({recipes.length})</span>
      </h2>

      {recipes.length === 0 ?
        <div className={`${card} mt-4 text-center`}>
          <p className="font-medium">No recipes yet</p>
          <p className={`mt-1 text-sm ${mutedText}`}>
            Name a miniature above and get a step-by-step scheme.
          </p>
        </div>
      : <ul className="mt-4 space-y-3">
          {recipes.map((recipe) => (
            <li key={recipe.id} className={`${card} p-4`}>
              <Link href={`/recipes/${recipe.id}`} className={`${link} font-semibold`}>
                {recipe.title}
              </Link>
              <p className={`text-sm ${mutedText}`}>
                {recipe.subject} · {dateFormat.format(recipe.createdAt)}
              </p>
            </li>
          ))}
        </ul>
      }
    </>
  );
}

export default function RecipesPage({ searchParams }: PageProps<"/recipes">) {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold tracking-tight">Painting recipes</h1>
      <p className={`mt-2 ${mutedText}`}>
        Step-by-step schemes built from the paints you own, with what you&apos;re missing and what
        you can mix instead.
      </p>
      <Suspense fallback={<p className={`mt-6 ${mutedText}`}>Loading...</p>}>
        <RecipesContent searchParams={searchParams} />
      </Suspense>
    </main>
  );
}
