// Data Access Layer: every check of who is signed in goes through here,
// so the rules live in one place and always run on the server.
import "server-only";

import { cache } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "./auth";

// cache() makes sure the session is only looked up once per request,
// even if the header and the page both ask for it.
export const getSession = cache(async () => {
  return auth.api.getSession({ headers: await headers() });
});

// Use at the top of every page or Server Action that needs a signed-in user.
export async function requireUser() {
  const session = await getSession();

  if (!session) {
    redirect("/sign-in");
  }

  return session;
}

// Use on the sign-in and sign-up pages: there is no reason to show them
// to someone who is already signed in.
export async function redirectIfSignedIn() {
  const session = await getSession();

  if (session) {
    redirect("/collection");
  }
}
