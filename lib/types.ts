export type HighlightSource = "kindle" | "manual" | "integration";

export interface Highlight {
  id: string;
  userId: string;
  sourceId: string;
  sourceTitle: string;
  author?: string;
  text: string;
  location?: string;
  capturedAt: string;
  tags: string[];
  lastReviewedAt?: string;
  masteryScore: number;
  nextReviewAt: string;
}

export interface ReviewQueueItem {
  highlightId: string;
  text: string;
  sourceTitle: string;
  dueAt: string;
  masteryScore: number;
  recommendedAction: "review" | "snooze" | "graduate";
}

export interface DigestPreview {
  id: string;
  scheduledFor: string;
  highlightCount: number;
  recentlyAddedCount: number;
  actions: Array<{
    label: string;
    href: string;
  }>;
}

export interface ImportJob {
  id: string;
  userId: string;
  source: HighlightSource;
  status: "pending" | "processing" | "completed" | "failed";
  submittedAt: string;
  processedAt?: string;
  failureReason?: string;
}

export interface DashboardMetrics {
  totalHighlights: number;
  weeklyReviewsCompleted: number;
  retentionScore: number;
  streakWeeks: number;
}

export interface DashboardSnapshot {
  metrics: DashboardMetrics;
  reviewQueue: ReviewQueueItem[];
  upcomingDigest: DigestPreview;
  recentHighlights: Highlight[];
  importJobs: ImportJob[];
}

export interface NotePayload {
  text: string;
  sourceTitle: string;
  author?: string;
  tags?: string[];
}

export interface HighlightImportPayload {
  source: HighlightSource;
  entries: Array<{
    text: string;
    sourceTitle: string;
    author?: string;
    location?: string;
    capturedAt: string;
    tags?: string[];
  }>;
}

export interface ReviewFeedbackPayload {
  highlightId: string;
  rating: "again" | "hard" | "good" | "easy";
}

export interface DigestRequestPayload {
  userId: string;
  scheduledFor: string;
}
