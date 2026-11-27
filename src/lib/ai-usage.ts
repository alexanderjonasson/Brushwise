import "server-only";
import { remainingRequests, startOfUtcDay, type AiKind } from "./limits";
import { prisma } from "./prisma";

// A cap for the whole app per day, on top of the per-user limit. Anyone can
// create accounts on a public demo, so this keeps the total API cost bounded.
const globalDailyLimit = Number(process.env.AI_GLOBAL_DAILY_LIMIT ?? 50);

export async function remainingAiToday(userId: string): Promise<number> {
  const today = { gte: startOfUtcDay(new Date()) };
  const [usedByUser, usedByEveryone] = await Promise.all([
    prisma.aiRequest.count({ where: { userId, createdAt: today } }),
    prisma.aiRequest.count({ where: { createdAt: today } }),
  ]);
  return Math.min(remainingRequests(usedByUser), remainingRequests(usedByEveryone, globalDailyLimit));
}

// Recorded before the call, so a slow or failed call still counts and the
// same allowance can't be spent twice by clicking quickly.
export async function recordAiRequest(userId: string, kind: AiKind) {
  await prisma.aiRequest.create({ data: { userId, kind } });
}

export const LIMIT_REACHED = "No AI requests are left for today. Try again tomorrow.";
