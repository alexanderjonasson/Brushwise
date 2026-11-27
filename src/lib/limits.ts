// The daily AI allowance, kept free from the database so it can be unit tested.
// Each user can make this many AI calls per day (feedback, paint scans,
// recipes and box scans together), so a public demo can't run up the API bill.
export const DAILY_AI_LIMIT = 10;

export type AiKind = "feedback" | "paint-scan" | "recipe" | "box-scan";

// Counted per calendar day in UTC
export function startOfUtcDay(now: Date): Date {
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
}

export function remainingRequests(usedToday: number, limit = DAILY_AI_LIMIT): number {
  return Math.max(0, limit - usedToday);
}
