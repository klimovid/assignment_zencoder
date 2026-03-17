import type { AnalyticsEvent } from "./events";

export interface IErrorTracker {
  captureError(error: Error, context?: Record<string, unknown>): void;
  setUser(user: { id: string; email: string; role: string }): void;
  addBreadcrumb(crumb: {
    category: string;
    message: string;
    data?: Record<string, unknown>;
  }): void;
}

export interface IAnalytics {
  trackEvent(event: AnalyticsEvent): void;
  identify(userId: string, traits: Record<string, unknown>): void;
  page(name: string, properties?: Record<string, unknown>): void;
}

export interface ILogger {
  debug(message: string, context?: Record<string, unknown>): void;
  info(message: string, context?: Record<string, unknown>): void;
  warn(message: string, context?: Record<string, unknown>): void;
  error(message: string, context?: Record<string, unknown>): void;
}
