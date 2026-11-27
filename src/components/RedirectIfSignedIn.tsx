import { redirectIfSignedIn } from "@/lib/dal";

// Renders nothing. Placed inside <Suspense> on the sign-in and sign-up pages,
// so the form can be prerendered while the session check runs per request.
export async function RedirectIfSignedIn() {
  await redirectIfSignedIn();
  return null;
}
