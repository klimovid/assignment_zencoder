import type { IErrorTracker, IAnalytics, ILogger } from "./interfaces";
import type { AnalyticsEvent } from "./events";

export class ConsoleErrorTracker implements IErrorTracker {
  captureError(error: Error, context?: Record<string, unknown>) {
    console.error("[ErrorTracker]", error.message, context);
  }
  setUser(user: { id: string; email: string; role: string }) {
    console.debug("[ErrorTracker] setUser", user.id);
  }
  addBreadcrumb(crumb: {
    category: string;
    message: string;
    data?: Record<string, unknown>;
  }) {
    console.debug("[ErrorTracker] breadcrumb", crumb.category, crumb.message);
  }
}

export class ConsoleAnalytics implements IAnalytics {
  trackEvent(event: AnalyticsEvent) {
    if (process.env.NODE_ENV === "development") {
      console.log("[Analytics]", event.type, event);
    }
  }
  identify(userId: string, traits: Record<string, unknown>) {
    if (process.env.NODE_ENV === "development") {
      console.log("[Analytics] identify", userId, traits);
    }
  }
  page(name: string, properties?: Record<string, unknown>) {
    if (process.env.NODE_ENV === "development") {
      console.log("[Analytics] page", name, properties);
    }
  }
}

export class ConsoleLogger implements ILogger {
  debug(msg: string, ctx?: Record<string, unknown>) {
    console.debug(msg, ctx);
  }
  info(msg: string, ctx?: Record<string, unknown>) {
    console.info(msg, ctx);
  }
  warn(msg: string, ctx?: Record<string, unknown>) {
    console.warn(msg, ctx);
  }
  error(msg: string, ctx?: Record<string, unknown>) {
    console.error(msg, ctx);
  }
}
