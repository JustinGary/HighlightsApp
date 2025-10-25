import { randomUUID } from "crypto";
import type {
  DigestPreview,
  Highlight,
  HighlightImportPayload,
  ImportJob,
  ReviewFeedbackPayload
} from "@/lib/types";
import { calculateNextReview } from "@/lib/services/reviewScheduler";

interface HighlightRepository {
  upsertMany(userId: string, highlights: HighlightImportPayload["entries"]): Promise<Highlight[]>;
  listByUser(userId: string): Promise<Highlight[]>;
  updateReviewState(payload: ReviewFeedbackPayload): Promise<Highlight | undefined>;
}

interface ImportJobRepository {
  create(job: { userId: string; source: ImportJob["source"]; submittedAt: string }): Promise<ImportJob>;
  updateStatus(id: string, status: ImportJob["status"], failureReason?: string): Promise<void>;
  listByUser(userId: string): Promise<ImportJob[]>;
}

interface DigestRepository {
  schedule(digest: Omit<DigestPreview, "id" | "actions"> & { userId: string }): Promise<DigestPreview>;
  latestForUser(userId: string): Promise<DigestPreview | undefined>;
}

const highlights = new Map<string, Highlight>();
const importJobs = new Map<string, ImportJob>();
const digests = new Map<string, DigestPreview & { userId: string }>();

export const highlightRepository: HighlightRepository = {
  async upsertMany(userId, entries) {
    const imported: Highlight[] = entries.map((entry) => {
      const id = randomUUID();
      const ageMs = Date.now() - Date.parse(entry.capturedAt);
      const ageInDays = ageMs > 0 ? ageMs / (1000 * 60 * 60 * 24) : 0;
      const rating: ReviewFeedbackPayload["rating"] =
        ageInDays > 14 ? "again" : ageInDays > 5 ? "hard" : "good";
      const baselineMastery = rating === "again" ? 0.3 : rating === "hard" ? 0.35 : 0.45;
      const nextReview = calculateNextReview({
        rating,
        lastReviewedAt: entry.capturedAt,
        masteryScore: baselineMastery
      });
      const highlight: Highlight = {
        id,
        userId,
        sourceId: randomUUID(),
        sourceTitle: entry.sourceTitle,
        author: entry.author,
        text: entry.text,
        location: entry.location,
        capturedAt: entry.capturedAt,
        tags: entry.tags ?? [],
        lastReviewedAt: entry.capturedAt,
        masteryScore: nextReview.masteryScore,
        nextReviewAt: nextReview.nextReviewAt
      };
      highlights.set(id, highlight);
      return highlight;
    });
    return imported;
  },
  async listByUser(userId) {
    return Array.from(highlights.values()).filter((highlight) => highlight.userId === userId);
  },
  async updateReviewState({ highlightId, rating }) {
    const existing = highlights.get(highlightId);
    if (!existing) {
      return undefined;
    }
    const next = calculateNextReview({
      rating,
      lastReviewedAt: existing.lastReviewedAt ?? existing.capturedAt,
      masteryScore: existing.masteryScore
    });
    const updated: Highlight = {
      ...existing,
      masteryScore: next.masteryScore,
      lastReviewedAt: next.lastReviewedAt,
      nextReviewAt: next.nextReviewAt
    };
    highlights.set(highlightId, updated);
    return updated;
  }
};

export const importJobRepository: ImportJobRepository = {
  async create(job) {
    const id = randomUUID();
    const record: ImportJob = {
      id,
      userId: job.userId,
      source: job.source,
      status: "processing",
      submittedAt: job.submittedAt,
      processedAt: undefined,
      failureReason: undefined
    };
    importJobs.set(id, record);
    return record;
  },
  async updateStatus(id, status, failureReason) {
    const existing = importJobs.get(id);
    if (!existing) {
      return;
    }
    importJobs.set(id, {
      ...existing,
      status,
      processedAt: new Date().toISOString(),
      failureReason
    });
  },
  async listByUser(userId) {
    return Array.from(importJobs.values()).filter((job) => job.userId === userId);
  }
};

export const digestRepository: DigestRepository = {
  async schedule(digest) {
    const id = randomUUID();
    const preview: DigestPreview = {
      id,
      scheduledFor: digest.scheduledFor,
      highlightCount: digest.highlightCount,
      recentlyAddedCount: digest.recentlyAddedCount,
      actions: [
        { label: "View Digest", href: `/digests/${id}` },
        { label: "Reschedule", href: `/digests/${id}/schedule` }
      ]
    };
    digests.set(id, { ...preview, userId: digest.userId });
    return preview;
  },
  async latestForUser(userId) {
    const candidates = Array.from(digests.values()).filter((digest) => digest.userId === userId);
    return candidates.sort((a, b) => (a.scheduledFor < b.scheduledFor ? 1 : -1))[0];
  }
};
