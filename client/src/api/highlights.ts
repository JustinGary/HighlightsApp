import apiClient from './client';
import type { Highlight, ApiResponse, PaginatedResponse, HighlightFilters } from '@/types';

export const highlightsApi = {
  // Get all highlights with optional filters
  getHighlights: async (
    page = 1,
    pageSize = 20,
    filters?: HighlightFilters
  ): Promise<PaginatedResponse<Highlight>> => {
    const response = await apiClient.get('/highlights', {
      params: { page, pageSize, ...filters },
    });
    return response.data;
  },

  // Get a single highlight by ID
  getHighlight: async (id: string): Promise<ApiResponse<Highlight>> => {
    const response = await apiClient.get(`/highlights/${id}`);
    return response.data;
  },

  // Create a new highlight
  createHighlight: async (
    highlight: Omit<Highlight, 'id' | 'capturedAt' | 'reviewCount'>
  ): Promise<ApiResponse<Highlight>> => {
    const response = await apiClient.post('/highlights', highlight);
    return response.data;
  },

  // Update a highlight
  updateHighlight: async (
    id: string,
    updates: Partial<Highlight>
  ): Promise<ApiResponse<Highlight>> => {
    const response = await apiClient.patch(`/highlights/${id}`, updates);
    return response.data;
  },

  // Delete a highlight
  deleteHighlight: async (id: string): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete(`/highlights/${id}`);
    return response.data;
  },

  // Search highlights
  searchHighlights: async (query: string): Promise<PaginatedResponse<Highlight>> => {
    const response = await apiClient.get('/highlights/search', {
      params: { q: query },
    });
    return response.data;
  },

  // Get highlights due for review
  getDueHighlights: async (): Promise<ApiResponse<Highlight[]>> => {
    const response = await apiClient.get('/highlights/due');
    return response.data;
  },
};
