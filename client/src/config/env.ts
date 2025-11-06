// Environment configuration

export const env = {
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:3001',
  apiTimeout: parseInt(import.meta.env.VITE_API_TIMEOUT || '10000', 10),
  environment: import.meta.env.VITE_ENVIRONMENT || 'development',
  enableAnalytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
  enablePWA: import.meta.env.VITE_ENABLE_PWA === 'true',
  gaMeasurementId: import.meta.env.VITE_GA_MEASUREMENT_ID,
  sentryDsn: import.meta.env.VITE_SENTRY_DSN,
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
} as const;

export default env;
