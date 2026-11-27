import type { Metadata } from "next";
import { Suspense } from "react";
import { PaintSearch } from "@/components/PaintSearch";
import { PaintSwatch } from "@/components/PaintSwatch";
import { ScanPaintsForm } from "@/components/ScanPaintsForm";
import { remainingAiToday } from "@/lib/ai-usage";
import { requireUser } from "@/lib/dal";
import { brands, getPaint, type Paint } from "@/lib/paints";
import { prisma } from "@/lib/prisma";
import { buttonSecondary, card, mutedText } from "@/lib/ui";
import { removePaint } from "./actions";

export const metadata: Metadata = { title: "My paints – Brushwise" };

async function PaintsContent() {
  const session = await requireUser();

  const [rows, aiLeft] = await Promise.all([
    prisma.userPaint.findMany({ where: { userId: session.user.id }, select: { paintId: true } }),
    remainingAiToday(session.user.id),
  ]);

  const ownedIds = rows.map((row) => row.paintId);
  const owned = ownedIds.map((id) => getPaint(id)).filter((paint): paint is Paint => Boolean(paint));

  return (
    <>
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <PaintSearch ownedIds={ownedIds} />
        <ScanPaintsForm ownedIds={ownedIds} aiLeft={aiLeft} />
      </div>

      <h2 className="mt-10 text-xl font-semibold">
        Your paints <span className={`font-normal ${mutedText}`}>({owned.length})</span>
      </h2>

      {owned.length === 0 ?
        <div className={`${card} mt-4 text-center`}>
          <p className="font-medium">No paints yet</p>
          <p className={`mt-1 text-sm ${mutedText}`}>
            Add the paints you own, and painting recipes will use them first.
          </p>
        </div>
      : <div className="mt-4 space-y-6">
          {brands.map((brand) => {
            const ofBrand = owned
              .filter((paint) => paint.brand === brand)
              .sort((a, b) => a.name.localeCompare(b.name));
            if (ofBrand.length === 0) return null;

            return (
              <section key={brand}>
                <h3 className={`text-sm font-semibold ${mutedText}`}>
                  {brand} ({ofBrand.length})
                </h3>
                <ul className="mt-2 grid gap-2 sm:grid-cols-2">
                  {ofBrand.map((paint) => (
                    <li key={paint.id} className={`${card} flex items-center gap-3 p-3`}>
                      <PaintSwatch paint={paint} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{paint.name}</p>
                        <p className={`text-xs ${mutedText}`}>{paint.type}</p>
                      </div>
                      <form action={removePaint}>
                        <input type="hidden" name="paintId" value={paint.id} />
                        <button
                          type="submit"
                          aria-label={`Remove ${paint.brand} ${paint.name}`}
                          className={`${buttonSecondary} px-2.5 py-1 text-xs`}>
                          Remove
                        </button>
                      </form>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      }
    </>
  );
}

export default function PaintsPage() {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-12">
      <h1 className="text-3xl font-bold tracking-tight">My paints</h1>
      <p className={`mt-2 ${mutedText}`}>
        The paints you own. Recipes use them first and tell you what&apos;s missing.
      </p>
      <Suspense fallback={<p className={`mt-6 ${mutedText}`}>Loading your paints...</p>}>
        <PaintsContent />
      </Suspense>
    </main>
  );
}
