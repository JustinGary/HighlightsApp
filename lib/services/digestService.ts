import { digestRepository, highlightRepository } from "@/lib/repositories/inMemoryRepositories";
import type { DigestPreview, DigestRequestPayload } from "@/lib/types";

export async function scheduleDigest(userId: string, payload: DigestRequestPayload): Promise<DigestPreview> {
  const highlights = await highlightRepository.listByUser(userId);
  const dueSoon = highlights.filter((highlight) => new Date(highlight.nextReviewAt) <= new Date(payload.scheduledFor));

  return digestRepository.schedule({
    userId,
    scheduledFor: payload.scheduledFor,
    highlightCount: dueSoon.length,
    recentlyAddedCount: Math.max(0, Math.min(5, highlights.length - dueSoon.length))
  });
}

export async function latestDigestForUser(userId: string) {
  return digestRepository.latestForUser(userId);
}
