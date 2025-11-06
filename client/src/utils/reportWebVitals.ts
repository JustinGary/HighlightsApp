import { onCLS, onFID, onFCP, onLCP, onTTFB, type Metric } from 'web-vitals';
import env from '@/config/env';
import logger from './logger';

function sendToAnalytics(metric: Metric): void {
  // Log metrics in development
  if (env.isDevelopment) {
    logger.info('Web Vital:', {
      name: metric.name,
      value: metric.value,
      rating: metric.rating,
      delta: metric.delta,
    });
  }

  // Send to analytics endpoint in production
  if (env.isProduction && env.enableAnalytics) {
    const body = JSON.stringify({
      name: metric.name,
      value: metric.value,
      rating: metric.rating,
      delta: metric.delta,
      id: metric.id,
      navigationType: metric.navigationType,
    });

    // Use `navigator.sendBeacon()` if available, falling back to `fetch()`
    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/analytics/vitals', body);
    } else {
      fetch('/api/analytics/vitals', {
        body,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        keepalive: true,
      }).catch((error) => {
        logger.error('Failed to send web vitals:', error);
      });
    }
  }
}

export function reportWebVitals(): void {
  onCLS(sendToAnalytics);
  onFID(sendToAnalytics);
  onFCP(sendToAnalytics);
  onLCP(sendToAnalytics);
  onTTFB(sendToAnalytics);
}
