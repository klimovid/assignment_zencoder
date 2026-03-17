/**
 * next-intl setup — English only.
 * Configured in next.config.ts and app/layout.tsx.
 * This file will hold the request config when next-intl is wired up.
 */
export const defaultLocale = "en" as const;
export const locales = [defaultLocale] as const;
