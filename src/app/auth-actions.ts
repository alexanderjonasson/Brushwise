"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { APIError } from "better-auth/api";
import { z } from "zod";
import { auth } from "@/lib/auth";

// The typed values are sent back on error, so the form can show them again
// (React empties a form after its action has run). The password never is.
export type AuthFormState = { error: string; name?: string; email?: string } | null;

// The browser checks these too, but anyone can send a request without the
// form, so the server always validates again.
const signUpSchema = z.object({
  name: z.string().trim().min(1, "Enter your name").max(100, "The name is too long"),
  email: z.email("Enter a valid email address").trim().toLowerCase(),
  password: z
    .string()
    .min(8, "The password needs at least 8 characters")
    .max(128, "The password is too long"),
});

const signInSchema = z.object({
  email: z.email("Enter a valid email address").trim().toLowerCase(),
  password: z.string().min(1, "Enter your password"),
});

export async function signUp(
  _prevState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const raw = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
  };

  const parsed = signUpSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message, name: raw.name, email: raw.email };
  }

  try {
    await auth.api.signUpEmail({ body: parsed.data, headers: await headers() });
  } catch (error) {
    if (error instanceof APIError) {
      return { error: error.message, name: raw.name, email: raw.email };
    }
    throw error;
  }

  // redirect() works by throwing, so it must be outside the try/catch.
  redirect("/collection");
}

export async function signIn(
  _prevState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const raw = {
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
  };

  const parsed = signInSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message, email: raw.email };
  }

  try {
    await auth.api.signInEmail({ body: parsed.data, headers: await headers() });
  } catch (error) {
    if (error instanceof APIError) {
      // Same message for unknown email and wrong password, so the form
      // doesn't reveal which emails have an account.
      return { error: "Wrong email or password", email: raw.email };
    }
    throw error;
  }

  redirect("/collection");
}

export async function signOut() {
  await auth.api.signOut({ headers: await headers() });
  redirect("/");
}
