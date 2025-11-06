import env from '@/config/env';

type LogLevel = 'log' | 'info' | 'warn' | 'error' | 'debug';

class Logger {
  private shouldLog(level: LogLevel): boolean {
    // In production, only log warnings and errors
    if (env.isProduction) {
      return level === 'warn' || level === 'error';
    }
    return true;
  }

  log(...args: unknown[]): void {
    if (this.shouldLog('log')) {
      console.log('[LOG]', ...args);
    }
  }

  info(...args: unknown[]): void {
    if (this.shouldLog('info')) {
      console.info('[INFO]', ...args);
    }
  }

  warn(...args: unknown[]): void {
    if (this.shouldLog('warn')) {
      console.warn('[WARN]', ...args);
    }
  }

  error(...args: unknown[]): void {
    if (this.shouldLog('error')) {
      console.error('[ERROR]', ...args);
    }
    // TODO: Send to error tracking service (Sentry, etc.)
  }

  debug(...args: unknown[]): void {
    if (this.shouldLog('debug') && env.isDevelopment) {
      console.debug('[DEBUG]', ...args);
    }
  }
}

export const logger = new Logger();
export default logger;
