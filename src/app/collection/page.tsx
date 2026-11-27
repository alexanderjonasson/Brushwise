import type { Metadata } from "next";
import { Suspense } from "react";
import { requireUser } from "@/lib/dal";
import { card, mutedText } from "@/lib/ui";

export const metadata: Metadata = { title: "My collection – Brushwise" };

// Protected content: requireUser() sends anyone who isn't signed in to /sign-in.
// It reads the session cookie, so it runs per request inside <Suspense>,
// while the heading around it can be prerendered.
async function CollectionContent() {
  const session = await requireUser();

  return (
    <>
      <p className={`mt-2 ${mutedText}`}>Signed in as {session.user.name}.</p>

      {/* The collection itself is built in step 2 */}
      <div className={`${card} mt-8 text-center`}>
        <p className="font-medium">No miniatures yet</p>
        <p className={`mt-1 text-sm ${mutedText}`}>
          Adding miniatures to your collection is coming in the next step.
        </p>
      </div>
    </>
  );
}

export default function CollectionPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold tracking-tight">My collection</h1>
      <Suspense fallback={<p className={`mt-2 ${mutedText}`}>Loading...</p>}>
        <CollectionContent />
      </Suspense>
    </main>
  );
}
