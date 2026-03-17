"use client";

import { createContext, useContext, type ReactNode } from "react";
import {
  ConsoleErrorTracker,
  ConsoleAnalytics,
  ConsoleLogger,
} from "./stubs";
import type { IErrorTracker, IAnalytics, ILogger } from "./interfaces";

interface ObservabilityContextValue {
  errorTracker: IErrorTracker;
  analytics: IAnalytics;
  logger: ILogger;
}

const defaultValue: ObservabilityContextValue = {
  errorTracker: new ConsoleErrorTracker(),
  analytics: new ConsoleAnalytics(),
  logger: new ConsoleLogger(),
};

const ObservabilityContext =
  createContext<ObservabilityContextValue>(defaultValue);

export const useErrorTracker = () =>
  useContext(ObservabilityContext).errorTracker;
export const useAnalytics = () => useContext(ObservabilityContext).analytics;
export const useLogger = () => useContext(ObservabilityContext).logger;

export function AnalyticsProvider({
  errorTracker,
  analytics,
  logger,
  children,
}: Partial<ObservabilityContextValue> & { children: ReactNode }) {
  return (
    <ObservabilityContext value={{
      errorTracker: errorTracker ?? defaultValue.errorTracker,
      analytics: analytics ?? defaultValue.analytics,
      logger: logger ?? defaultValue.logger,
    }}>
      {children}
    </ObservabilityContext>
  );
}
