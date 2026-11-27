import "server-only";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { prisma } from "./prisma";

// Better Auth reads BETTER_AUTH_SECRET and BETTER_AUTH_URL from the environment.
export const auth = betterAuth({
  // Users, sessions and accounts are stored in our own Postgres database via Prisma.
  database: prismaAdapter(prisma, { provider: "postgresql" }),

  // Sign up and sign in with email and password. Passwords are hashed by Better Auth.
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
  },

  // Don't send anonymous usage data to Better Auth.
  telemetry: { enabled: false },

  // Lets Server Actions set the session cookie when someone signs in or up.
  // Must be the last plugin in the list.
  plugins: [nextCookies()],
});

export type Session = typeof auth.$Infer.Session;
