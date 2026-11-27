import "server-only";
import { remainingRequests, startOfUtcDay, type AiKind } from "./limits";
import { prisma } from "./prisma";

export async function remainingAiToday(userId: string): Promise<number> {
  const usedToday = await prisma.aiRequest.count({
    where: { userId, createdAt: { gte: startOfUtcDay(new Date()) } },
  });
  return remainingRequests(usedToday);
}

// Recorded before the call, so a slow or failed call still counts and the
// same allowance can't be spent twice by clicking quickly.
export async function recordAiRequest(userId: string, kind: AiKind) {
  await prisma.aiRequest.create({ data: { userId, kind } });
}

export const LIMIT_REACHED = "You've used all your AI requests for today. Try again tomorrow.";
