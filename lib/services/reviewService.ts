import { highlightRepository } from "@/lib/repositories/inMemoryRepositories";
import type { Highlight, ReviewFeedbackPayload } from "@/lib/types";

export async function submitReviewFeedback(payload: ReviewFeedbackPayload): Promise<Highlight | undefined> {
  return highlightRepository.updateReviewState(payload);
}

export async function getReviewQueue(userId: string) {
  const highlights = await highlightRepository.listByUser(userId);
  return highlights
    .filter((highlight) => new Date(highlight.nextReviewAt) <= new Date())
    .map((highlight) => ({
      highlightId: highlight.id,
      text: highlight.text,
      sourceTitle: highlight.sourceTitle,
      dueAt: highlight.nextReviewAt,
      masteryScore: highlight.masteryScore,
      recommendedAction: highlight.masteryScore > 0.8 ? "graduate" : "review"
    }));
}
