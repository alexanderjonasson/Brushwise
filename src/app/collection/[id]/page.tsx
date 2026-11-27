import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { FeedbackView } from "@/components/FeedbackView";
import { RequestFeedbackButton } from "@/components/RequestFeedbackButton";
import { StatusBadge } from "@/components/StatusBadge";
import { UploadPhotoForm } from "@/components/UploadPhotoForm";
import { requireUser } from "@/lib/dal";
import { remainingAiToday } from "@/lib/ai-usage";
import { DAILY_AI_LIMIT } from "@/lib/limits";
import { prisma } from "@/lib/prisma";
import { buttonSecondary, card, link, mutedText } from "@/lib/ui";
import { deletePhoto } from "./actions";

export const metadata: Metadata = { title: "Miniature – Brushwise" };

const dateFormat = new Intl.DateTimeFormat("en-GB", { dateStyle: "medium" });

async function MiniatureContent({ params }: { params: Promise<{ id: string }> }) {
  const [{ id }, session] = await Promise.all([params, requireUser()]);

  // Someone else's miniature gives the same 404 as one that doesn't exist,
  // so the page doesn't reveal which ids are in use.
  const miniature = await prisma.miniature.findFirst({
    where: { id, userId: session.user.id },
    select: {
      id: true,
      name: true,
      faction: true,
      status: true,
      notes: true,
      photos: {
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          url: true,
          createdAt: true,
          feedback: {
            select: { overallScore: true, summary: true, areas: true, nextSteps: true, model: true },
          },
        },
      },
    },
  });

  if (!miniature) {
    notFound();
  }

  const remaining = await remainingAiToday(session.user.id);

  return (
    <>
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-3xl font-bold tracking-tight">{miniature.name}</h1>
        <StatusBadge status={miniature.status} />
      </div>
      {miniature.faction && <p className={`mt-1 ${mutedText}`}>{miniature.faction}</p>}
      {miniature.notes && <p className="mt-4 whitespace-pre-line">{miniature.notes}</p>}

      <Link
        href={`/recipes?miniature=${miniature.id}`}
        className={`${buttonSecondary} mt-4`}>
        Get a painting recipe for this miniature
      </Link>

      <div className="mt-8">
        <UploadPhotoForm miniatureId={miniature.id} />
      </div>

      <div className="mt-10 flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-xl font-semibold">
          Photos <span className={`font-normal ${mutedText}`}>({miniature.photos.length})</span>
        </h2>
        <p className={`text-sm ${mutedText}`}>
          AI requests left today: {remaining} of {DAILY_AI_LIMIT}
        </p>
      </div>

      {miniature.photos.length === 0 ?
        <div className={`${card} mt-4 text-center`}>
          <p className="font-medium">No photos yet</p>
          <p className={`mt-1 text-sm ${mutedText}`}>
            Upload a photo to track your progress and get AI feedback on your painting.
          </p>
        </div>
      : <ul className="mt-4 space-y-6">
          {miniature.photos.map((photo, index) => (
            <li key={photo.id} className={`${card} overflow-hidden p-0`}>
              <div className="grid sm:grid-cols-2">
                <div>
                  <div className="relative aspect-square bg-neutral-100 dark:bg-neutral-800">
                    <Image
                      src={photo.url}
                      alt={`Photo ${miniature.photos.length - index} of ${miniature.name}`}
                      fill
                      sizes="(min-width: 640px) 380px, 100vw"
                      className="object-contain"
                    />
                  </div>
                  <div className="flex items-center justify-between gap-3 p-3">
                    <p className={`text-sm ${mutedText}`}>
                      {dateFormat.format(photo.createdAt)}
                    </p>
                    <form action={deletePhoto}>
                      <input type="hidden" name="id" value={photo.id} />
                      <button
                        type="submit"
                        className={`${buttonSecondary} py-1.5 text-red-700 dark:text-red-400`}>
                        Delete photo
                      </button>
                    </form>
                  </div>
                </div>

                <div className="border-t border-neutral-200 p-4 sm:border-t-0 sm:border-l dark:border-neutral-800">
                  {photo.feedback ?
                    <FeedbackView feedback={photo.feedback} />
                  : <div className="flex h-full flex-col justify-center gap-3">
                      <p className={`text-sm ${mutedText}`}>
                        Let AI look at this photo and score your basecoat, shading, highlights
                        and more, with a tip for each.
                      </p>
                      {remaining > 0 ?
                        <RequestFeedbackButton photoId={photo.id} />
                      : <p className={`text-sm ${mutedText}`}>
                          You&apos;ve used all your AI feedback for today.
                        </p>
                      }
                    </div>
                  }
                </div>
              </div>
            </li>
          ))}
        </ul>
      }
    </>
  );
}

export default function MiniaturePage({ params }: PageProps<"/collection/[id]">) {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-12">
      <Link href="/collection" className={`${link} text-sm`}>
        ← Back to collection
      </Link>
      <div className="mt-4">
        <Suspense fallback={<p className={mutedText}>Loading...</p>}>
          <MiniatureContent params={params} />
        </Suspense>
      </div>
    </main>
  );
}
