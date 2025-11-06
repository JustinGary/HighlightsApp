import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosError } from 'axios';
import env from '@/config/env';
import logger from '@/utils/logger';

// Create axios instance with default config
const apiClient: AxiosInstance = axios.create({
  baseURL: env.apiUrl,
  timeout: env.apiTimeout,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
apiClient.interceptors.request.use(
  (config) => {
    // Get auth token from localStorage
    const token = localStorage.getItem('authToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    logger.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling and retry logic
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config as AxiosRequestConfig & { _retry?: number };

    // Initialize retry counter
    if (!config._retry) {
      config._retry = 0;
    }

    // Retry logic for 5xx errors
    if (error.response?.status && error.response.status >= 500 && config._retry < 3) {
      config._retry += 1;
      const delay = 1000 * config._retry; // Exponential backoff

      logger.warn(`Retrying request (attempt ${config._retry}/3) after ${delay}ms`);

      await new Promise((resolve) => setTimeout(resolve, delay));
      return apiClient(config);
    }

    // Handle 401 Unauthorized - redirect to login
    if (error.response?.status === 401) {
      logger.warn('Unauthorized request - clearing auth token');
      localStorage.removeItem('authToken');
      // TODO: Redirect to login page or trigger auth modal
    }

    // Log the error
    logger.error('API Error:', {
      url: config.url,
      method: config.method,
      status: error.response?.status,
      data: error.response?.data,
    });

    return Promise.reject(error);
  }
);

export default apiClient;

// Helper function to handle API errors consistently
export function handleApiError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message || error.message;
    return message;
  }
  return 'An unexpected error occurred';
}
