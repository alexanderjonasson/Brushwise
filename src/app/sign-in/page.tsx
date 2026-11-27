import type { Metadata } from "next";
import { Suspense } from "react";
import { SignInForm } from "@/components/SignInForm";
import { RedirectIfSignedIn } from "@/components/RedirectIfSignedIn";
import { card, mutedText } from "@/lib/ui";

export const metadata: Metadata = { title: "Sign in – Brushwise" };

export default function SignInPage() {
  return (
    <main className="mx-auto w-full max-w-sm px-4 py-12">
      <Suspense fallback={null}>
        <RedirectIfSignedIn />
      </Suspense>
      <div className={card}>
        <h1 className="text-2xl font-bold tracking-tight">Sign in</h1>
        <p className={`mt-1 mb-6 text-sm ${mutedText}`}>Welcome back to your painting desk.</p>
        <SignInForm />
      </div>
    </main>
  );
}
