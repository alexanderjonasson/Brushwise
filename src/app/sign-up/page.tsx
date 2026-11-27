import type { Metadata } from "next";
import { Suspense } from "react";
import { SignUpForm } from "@/components/SignUpForm";
import { RedirectIfSignedIn } from "@/components/RedirectIfSignedIn";
import { card, mutedText } from "@/lib/ui";

export const metadata: Metadata = { title: "Create account – Brushwise" };

export default function SignUpPage() {
  return (
    <main className="mx-auto w-full max-w-sm px-4 py-12">
      <Suspense fallback={null}>
        <RedirectIfSignedIn />
      </Suspense>
      <div className={card}>
        <h1 className="text-2xl font-bold tracking-tight">Create account</h1>
        <p className={`mt-1 mb-6 text-sm ${mutedText}`}>
          Start tracking your miniatures and get feedback on your painting.
        </p>
        <SignUpForm />
      </div>
    </main>
  );
}
