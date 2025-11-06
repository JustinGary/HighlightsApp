import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { Highlight, HighlightFilters } from '@/types';

interface HighlightState {
  highlights: Highlight[];
  selectedHighlight: Highlight | null;
  filters: HighlightFilters;
  isLoading: boolean;
  error: string | null;

  // Actions
  setHighlights: (highlights: Highlight[]) => void;
  addHighlight: (highlight: Highlight) => void;
  updateHighlight: (id: string, updates: Partial<Highlight>) => void;
  deleteHighlight: (id: string) => void;
  setSelectedHighlight: (highlight: Highlight | null) => void;
  setFilters: (filters: HighlightFilters) => void;
  clearFilters: () => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useHighlightStore = create<HighlightState>()(
  immer((set) => ({
    highlights: [],
    selectedHighlight: null,
    filters: {},
    isLoading: false,
    error: null,

    setHighlights: (highlights) =>
      set((state) => {
        state.highlights = highlights;
      }),

    addHighlight: (highlight) =>
      set((state) => {
        state.highlights.unshift(highlight);
      }),

    updateHighlight: (id, updates) =>
      set((state) => {
        const index = state.highlights.findIndex((h) => h.id === id);
        if (index !== -1) {
          state.highlights[index] = { ...state.highlights[index], ...updates };
        }
        if (state.selectedHighlight?.id === id) {
          state.selectedHighlight = { ...state.selectedHighlight, ...updates };
        }
      }),

    deleteHighlight: (id) =>
      set((state) => {
        state.highlights = state.highlights.filter((h) => h.id !== id);
        if (state.selectedHighlight?.id === id) {
          state.selectedHighlight = null;
        }
      }),

    setSelectedHighlight: (highlight) =>
      set((state) => {
        state.selectedHighlight = highlight;
      }),

    setFilters: (filters) =>
      set((state) => {
        state.filters = filters;
      }),

    clearFilters: () =>
      set((state) => {
        state.filters = {};
      }),

    setLoading: (isLoading) =>
      set((state) => {
        state.isLoading = isLoading;
      }),

    setError: (error) =>
      set((state) => {
        state.error = error;
      }),
  }))
);
