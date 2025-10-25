import { digestRepository, highlightRepository, importJobRepository } from "@/lib/repositories/inMemoryRepositories";
import type { DashboardSnapshot, DigestPreview, Highlight } from "@/lib/types";
import { scheduleDigest } from "@/lib/services/digestService";
import { getReviewQueue } from "@/lib/services/reviewService";

const DEMO_USER_ID = "demo-user";
let seeded = false;

async function seedDemoData() {
  if (seeded) {
    return;
  }

  await highlightRepository.upsertMany(DEMO_USER_ID, [
    {
      text: "Complex ideas deserve repeated exposure—schedule time to revisit notes that mattered most.",
      sourceTitle: "Learning in the Digital Age",
      author: "A. Lerner",
      capturedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6).toISOString(),
      tags: ["learning", "workflow"]
    },
    {
      text: "Knowledge compounds when you resurface highlights just before you forget them.",
      sourceTitle: "Spaced Repetition Playbook",
      author: "N. Ortega",
      capturedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
      tags: ["memory", "focus"]
    },
    {
      text: "Summaries are helpful, but the original words often trigger deeper context and emotion.",
      sourceTitle: "Reading for Remembering",
      author: "L. Chambers",
      capturedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
      tags: ["reading", "mindset"]
    }
  ]);

  const job = await importJobRepository.create({
    userId: DEMO_USER_ID,
    source: "kindle",
    submittedAt: new Date(Date.now() - 1000 * 60 * 10).toISOString()
  });
  await importJobRepository.updateStatus(job.id, "completed");

  await scheduleDigest(DEMO_USER_ID, {
    userId: DEMO_USER_ID,
    scheduledFor: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2).toISOString()
  });

  seeded = true;
}

export async function ensureDemoSeeded() {
  await seedDemoData();
}

function buildMetrics(highlights: Highlight[]): DashboardSnapshot["metrics"] {
  const totalHighlights = highlights.length;
  const oneWeekAgo = Date.now() - 1000 * 60 * 60 * 24 * 7;
  const weeklyReviewsCompleted = highlights.filter((highlight) => {
    const reviewed = highlight.lastReviewedAt ? Date.parse(highlight.lastReviewedAt) : 0;
    return reviewed >= oneWeekAgo;
  }).length;
  const retentionScore = Math.round(
    highlights.reduce((acc, highlight) => acc + highlight.masteryScore, 0) / Math.max(1, totalHighlights) * 100
  );
  const streakWeeks = Math.max(1, Math.round(weeklyReviewsCompleted / 3));

  return {
    totalHighlights,
    weeklyReviewsCompleted,
    retentionScore,
    streakWeeks
  };
}

async function resolveDigest(highlights: Highlight[]): Promise<DigestPreview> {
  const upcoming = await digestRepository.latestForUser(DEMO_USER_ID);
  if (upcoming) {
    return upcoming;
  }

  return scheduleDigest(DEMO_USER_ID, {
    userId: DEMO_USER_ID,
    scheduledFor: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString()
  });
}

export async function getDashboardSnapshot(): Promise<DashboardSnapshot> {
  await seedDemoData();

  const highlights = await highlightRepository.listByUser(DEMO_USER_ID);
  const metrics = buildMetrics(highlights);
  const reviewQueue = await getReviewQueue(DEMO_USER_ID);
  const upcomingDigest = await resolveDigest(highlights);
  const recentHighlights = highlights
    .slice()
    .sort((a, b) => (a.capturedAt < b.capturedAt ? 1 : -1))
    .slice(0, 5);
  const importJobs = await importJobRepository.listByUser(DEMO_USER_ID);

  return {
    metrics,
    reviewQueue,
    upcomingDigest,
    recentHighlights,
    importJobs
  };
}
