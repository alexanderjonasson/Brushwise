import type { Metadata } from "next";
import Image from "next/image";
import { Suspense } from "react";
import { BacklogForm } from "@/components/BacklogForm";
import { remainingAiToday } from "@/lib/ai-usage";
import { requireUser } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import { buttonPrimary, buttonSecondary, card, mutedText } from "@/lib/ui";
import { deleteBacklogItem, startPainting } from "./actions";

export const metadata: Metadata = { title: "Pile of shame – Brushwise" };

async function BacklogContent() {
  const session = await requireUser();

  const [items, aiLeft] = await Promise.all([
    prisma.backlogItem.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    }),
    remainingAiToday(session.user.id),
  ]);

  const totalModels = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <dl className="mt-6 grid grid-cols-2 gap-3 sm:max-w-md">
        <div className={`${card} p-4`}>
          <dt className={`text-sm ${mutedText}`}>Models waiting</dt>
          <dd className="mt-1 text-2xl font-semibold">{totalModels}</dd>
        </div>
        <div className={`${card} p-4`}>
          <dt className={`text-sm ${mutedText}`}>Boxes</dt>
          <dd className="mt-1 text-2xl font-semibold">{items.length}</dd>
        </div>
      </dl>

      <div className="mt-8">
        <BacklogForm aiLeft={aiLeft} />
      </div>

      <h2 className="mt-10 text-xl font-semibold">
        Waiting to be painted <span className={`font-normal ${mutedText}`}>({items.length})</span>
      </h2>

      {items.length === 0 ?
        <div className={`${card} mt-4 text-center`}>
          <p className="font-medium">Your pile of shame is empty</p>
          <p className={`mt-1 text-sm ${mutedText}`}>Either you&apos;re very disciplined, or you haven&apos;t added it yet.</p>
        </div>
      : <ul className="mt-4 grid gap-4 sm:grid-cols-2">
          {items.map((item) => (
            <li key={item.id} className={`${card} flex gap-4 p-4`}>
              <div className="relative size-20 shrink-0 overflow-hidden rounded-lg bg-neutral-100 dark:bg-neutral-800">
                {item.photoUrl ?
                  <Image src={item.photoUrl} alt={`Box of ${item.name}`} fill sizes="80px" className="object-cover" />
                : <span className={`flex size-full items-center justify-center text-2xl ${mutedText}`} aria-hidden="true">
                    📦
                  </span>
                }
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold">{item.name}</h3>
                <p className={`text-sm ${mutedText}`}>
                  {[item.faction, `${item.quantity} ${item.quantity === 1 ? "model" : "models"}`]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <form action={startPainting}>
                    <input type="hidden" name="id" value={item.id} />
                    <button
                      type="submit"
                      aria-label={`Start painting one model from ${item.name}`}
                      className={`${buttonPrimary} px-3 py-1.5 text-xs`}>
                      Start painting one
                    </button>
                  </form>
                  <form action={deleteBacklogItem}>
                    <input type="hidden" name="id" value={item.id} />
                    <button
                      type="submit"
                      aria-label={`Remove ${item.name}`}
                      className={`${buttonSecondary} px-3 py-1.5 text-xs text-red-700 dark:text-red-400`}>
                      Remove
                    </button>
                  </form>
                </div>
              </div>
            </li>
          ))}
        </ul>
      }
    </>
  );
}

export default function BacklogPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold tracking-tight">Pile of shame</h1>
      <p className={`mt-2 ${mutedText}`}>
        Boxes and kits you haven&apos;t started yet. When you start a model, it moves to your
        collection.
      </p>
      <Suspense fallback={<p className={`mt-6 ${mutedText}`}>Loading...</p>}>
        <BacklogContent />
      </Suspense>
    </main>
  );
}
