import Link from "next/link";
import { signOut } from "@/app/auth-actions";
import { getSession } from "@/lib/dal";
import { buttonPrimary, buttonSecondary, mutedText } from "@/lib/ui";

export async function Header() {
  const session = await getSession();

  return (
    <header className="border-b border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-4 py-4">
        <Link
          href="/"
          className="rounded text-xl font-bold tracking-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500">
          Brushwise
        </Link>

        <nav aria-label="Main" className="flex items-center gap-3">
          {session ?
            <>
              <span className={`hidden text-sm sm:inline ${mutedText}`}>{session.user.name}</span>
              <Link href="/collection" className={buttonSecondary}>
                Collection
              </Link>
              <form action={signOut}>
                <button type="submit" className={buttonSecondary}>
                  Sign out
                </button>
              </form>
            </>
          : <>
              <Link href="/sign-in" className={buttonSecondary}>
                Sign in
              </Link>
              <Link href="/sign-up" className={buttonPrimary}>
                Create account
              </Link>
            </>
          }
        </nav>
      </div>
    </header>
  );
}
