// Core data types based on PRD

export interface User {
  id: string;
  email: string;
  name: string;
  preferences: UserPreferences;
  createdAt: string;
  updatedAt: string;
}

export interface UserPreferences {
  digestFrequency: 'weekly' | 'biweekly' | 'monthly';
  digestDayOfWeek: number; // 0-6 (Sunday-Saturday)
  digestTime: string; // HH:mm format
  notificationsEnabled: boolean;
  theme: 'light' | 'dark' | 'system';
}

export interface Source {
  id: string;
  title: string;
  author?: string;
  type: 'book' | 'article' | 'note' | 'web';
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export interface Highlight {
  id: string;
  sourceId: string;
  text: string;
  location?: string;
  page?: number;
  tags: string[];
  capturedAt: string;
  lastReviewedAt?: string;
  masteryScore: number;
  nextReviewDate?: string;
  reviewCount: number;
  notes?: string;
}

export interface ReviewEvent {
  id: string;
  highlightId: string;
  rating: ReviewRating;
  timestamp: string;
  device?: string;
  notes?: string;
}

export enum ReviewRating {
  FORGOT = 'forgot',
  NEEDS_REVIEW = 'needs_review',
  STILL_FRESH = 'still_fresh',
  MASTERED = 'mastered',
}

export interface Digest {
  id: string;
  userId: string;
  generatedAt: string;
  sentAt?: string;
  deliveryStatus: 'pending' | 'sent' | 'failed';
  highlightIds: string[];
  metrics?: DigestMetrics;
}

export interface DigestMetrics {
  opened: boolean;
  openedAt?: string;
  clickedHighlights: string[];
  reviewsCompleted: number;
}

export interface IntegrationJob {
  id: string;
  userId: string;
  type: 'kindle_import' | 'manual_upload' | 'api_sync';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  failureReason?: string;
  createdAt: string;
  completedAt?: string;
  metadata?: Record<string, unknown>;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// Filter and search types
export interface HighlightFilters {
  sourceId?: string;
  tags?: string[];
  searchQuery?: string;
  dateRange?: {
    start: string;
    end: string;
  };
  masteryScore?: {
    min: number;
    max: number;
  };
}

// Spaced repetition types
export interface SpacedRepetitionState {
  interval: number; // days until next review
  easeFactor: number; // SM-2 ease factor
  repetitions: number;
  lastReviewDate: string;
  nextReviewDate: string;
}
