interface CalculateNextReviewInput {
  rating: "again" | "hard" | "good" | "easy";
  lastReviewedAt: string;
  masteryScore: number;
}

interface CalculateNextReviewResult {
  masteryScore: number;
  nextReviewAt: string;
  lastReviewedAt: string;
}

const ratingModifiers: Record<CalculateNextReviewInput["rating"], { easeDelta: number; intervalMultiplier: number }> = {
  again: { easeDelta: -0.2, intervalMultiplier: 0.5 },
  hard: { easeDelta: -0.05, intervalMultiplier: 0.8 },
  good: { easeDelta: 0, intervalMultiplier: 1.6 },
  easy: { easeDelta: 0.1, intervalMultiplier: 2.2 }
};

export function calculateNextReview(input: CalculateNextReviewInput): CalculateNextReviewResult {
  const previousEase = Math.max(1.3, 2.3 + (input.masteryScore - 0.6));
  const modifier = ratingModifiers[input.rating];
  const newEase = Math.max(1.3, previousEase + modifier.easeDelta);
  const baseIntervalDays = Math.max(1, Math.round((input.masteryScore + 0.2) * 6));
  const intervalDays = Math.ceil(baseIntervalDays * modifier.intervalMultiplier);
  const lastReviewedMs = Date.parse(input.lastReviewedAt);
  const baseTimestamp = Number.isNaN(lastReviewedMs) ? Date.now() : lastReviewedMs;
  const nextReviewAt = new Date(baseTimestamp + intervalDays * 24 * 60 * 60 * 1000).toISOString();
  const newMastery = Math.min(1, Math.max(0, input.masteryScore + modifier.easeDelta / 2));

  return {
    masteryScore: Number(newMastery.toFixed(2)),
    nextReviewAt,
    lastReviewedAt: new Date().toISOString()
  };
}
