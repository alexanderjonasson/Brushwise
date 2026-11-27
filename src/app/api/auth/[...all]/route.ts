import { toNextJsHandler } from "better-auth/next-js";
import { auth } from "@/lib/auth";

// Catch-all route: Better Auth handles every request under /api/auth/*
// (sign-up, sign-in, sign-out, get-session and so on).
export const { GET, POST } = toNextJsHandler(auth);
