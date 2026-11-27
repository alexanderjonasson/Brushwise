import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { StatusBadge } from "@/components/StatusBadge";
import { UploadPhotoForm } from "@/components/UploadPhotoForm";
import { requireUser } from "@/lib/dal";
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
        select: { id: true, url: true, createdAt: true },
      },
    },
  });

  if (!miniature) {
    notFound();
  }

  return (
    <>
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-3xl font-bold tracking-tight">{miniature.name}</h1>
        <StatusBadge status={miniature.status} />
      </div>
      {miniature.faction && <p className={`mt-1 ${mutedText}`}>{miniature.faction}</p>}
      {miniature.notes && <p className="mt-4 whitespace-pre-line">{miniature.notes}</p>}

      <div className="mt-8">
        <UploadPhotoForm miniatureId={miniature.id} />
      </div>

      <h2 className="mt-10 text-xl font-semibold">
        Photos <span className={`font-normal ${mutedText}`}>({miniature.photos.length})</span>
      </h2>

      {miniature.photos.length === 0 ?
        <div className={`${card} mt-4 text-center`}>
          <p className="font-medium">No photos yet</p>
          <p className={`mt-1 text-sm ${mutedText}`}>
            Upload a photo to keep track of your progress. AI feedback on photos is coming next.
          </p>
        </div>
      : <ul className="mt-4 grid gap-4 sm:grid-cols-2">
          {miniature.photos.map((photo, index) => (
            <li key={photo.id} className={`${card} overflow-hidden p-0`}>
              <div className="relative aspect-square bg-neutral-100 dark:bg-neutral-800">
                <Image
                  src={photo.url}
                  alt={`Photo ${miniature.photos.length - index} of ${miniature.name}`}
                  fill
                  sizes="(min-width: 640px) 360px, 100vw"
                  className="object-contain"
                />
              </div>
              <div className="flex items-center justify-between gap-3 p-3">
                <p className={`text-sm ${mutedText}`}>{dateFormat.format(photo.createdAt)}</p>
                <form action={deletePhoto}>
                  <input type="hidden" name="id" value={photo.id} />
                  <button
                    type="submit"
                    className={`${buttonSecondary} py-1.5 text-red-700 dark:text-red-400`}>
                    Delete photo
                  </button>
                </form>
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
