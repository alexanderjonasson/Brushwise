import Link from "next/link";
import { signOut } from "@/app/auth-actions";
import { getSession } from "@/lib/dal";
import { buttonPrimary, buttonSecondary, link, mutedText } from "@/lib/ui";

const appLinks = [
  { href: "/collection", label: "Collection" },
  { href: "/backlog", label: "Pile of shame" },
  { href: "/paints", label: "Paints" },
  { href: "/recipes", label: "Recipes" },
];

export async function Header() {
  const session = await getSession();

  return (
    <header className="border-b border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950">
      <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-x-6 gap-y-3 px-4 py-4">
        <Link
          href="/"
          className="rounded text-xl font-bold tracking-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500">
          Brushwise
        </Link>

        {session ?
          <>
            {/* On small screens the app links wrap onto their own row */}
            <nav
              aria-label="Main"
              className="order-last flex w-full gap-5 overflow-x-auto text-sm sm:order-none sm:w-auto">
              {appLinks.map((item) => (
                <Link key={item.href} href={item.href} className={`${link} whitespace-nowrap`}>
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="flex items-center gap-3">
              <span className={`hidden text-sm md:inline ${mutedText}`}>{session.user.name}</span>
              <form action={signOut}>
                <button type="submit" className={buttonSecondary}>
                  Sign out
                </button>
              </form>
            </div>
          </>
        : <nav aria-label="Main" className="flex items-center gap-3">
            <Link href="/sign-in" className={buttonSecondary}>
              Sign in
            </Link>
            <Link href="/sign-up" className={buttonPrimary}>
              Create account
            </Link>
          </nav>
        }
      </div>
    </header>
  );
}
