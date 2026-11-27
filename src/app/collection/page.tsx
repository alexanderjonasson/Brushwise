import type { Metadata } from "next";
import { Suspense } from "react";
import { AddMiniatureForm } from "@/components/AddMiniatureForm";
import { StatusBadge } from "@/components/StatusBadge";
import { StatusSelect } from "@/components/StatusSelect";
import { requireUser } from "@/lib/dal";
import { countByStatus, paintStatuses, statusLabels } from "@/lib/miniatures";
import { prisma } from "@/lib/prisma";
import { buttonSecondary, card, mutedText } from "@/lib/ui";
import { deleteMiniature } from "./actions";

export const metadata: Metadata = { title: "My collection – Brushwise" };

// Protected content: requireUser() sends anyone who isn't signed in to /sign-in.
// It reads the session cookie, so it runs per request inside <Suspense>,
// while the heading around it can be prerendered.
async function CollectionContent() {
  const session = await requireUser();

  // Only this user's miniatures, newest first
  const miniatures = await prisma.miniature.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, faction: true, status: true, notes: true },
  });

  const counts = countByStatus(miniatures);

  return (
    <>
      <dl className="mt-6 grid grid-cols-3 gap-3">
        {paintStatuses.map((status) => (
          <div key={status} className={`${card} p-4`}>
            <dt className={`text-sm ${mutedText}`}>{statusLabels[status]}</dt>
            <dd className="mt-1 text-2xl font-semibold">{counts[status]}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-8">
        <AddMiniatureForm />
      </div>

      <h2 className="mt-10 text-xl font-semibold">
        Miniatures <span className={`font-normal ${mutedText}`}>({miniatures.length})</span>
      </h2>

      {miniatures.length === 0 ?
        <div className={`${card} mt-4 text-center`}>
          <p className="font-medium">No miniatures yet</p>
          <p className={`mt-1 text-sm ${mutedText}`}>
            Add your first one above – even the ones still on the sprue count.
          </p>
        </div>
      : <ul className="mt-4 space-y-3">
          {miniatures.map((miniature) => (
            <li key={miniature.id} className={`${card} p-4`}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold">{miniature.name}</h3>
                    <StatusBadge status={miniature.status} />
                  </div>
                  {miniature.faction && (
                    <p className={`text-sm ${mutedText}`}>{miniature.faction}</p>
                  )}
                  {miniature.notes && (
                    <p className="mt-2 text-sm whitespace-pre-line">{miniature.notes}</p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <StatusSelect
                    id={miniature.id}
                    name={miniature.name}
                    status={miniature.status}
                  />
                  <form action={deleteMiniature}>
                    <input type="hidden" name="id" value={miniature.id} />
                    <button
                      type="submit"
                      aria-label={`Delete ${miniature.name}`}
                      className={`${buttonSecondary} py-1.5 text-red-700 dark:text-red-400`}>
                      Delete
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

export default function CollectionPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold tracking-tight">My collection</h1>
      <p className={`mt-2 ${mutedText}`}>Everything on your painting desk, from unpainted to done.</p>
      <Suspense fallback={<p className={`mt-6 ${mutedText}`}>Loading your collection...</p>}>
        <CollectionContent />
      </Suspense>
    </main>
  );
}
