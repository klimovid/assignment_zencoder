# Technical Implementation Spec: Dashboard UI

> **Version**: 1.0 | **Date**: 2026-03-16
> **Prerequisites**: [PRD](../prd/dashboard-prd.md), [C4 Component](../architecture/c4-component-dashboard-ui.md), [C4 Container](../architecture/c4-container.md)
> **Principle**: third-party services (Sentry, PostHog, etc.) — **stub implementations only** behind own abstractions. Real SDKs are a separate phase.

---

## Table of Contents

1. [Project Bootstrap](#1-project-bootstrap)
2. [Directory Structure / FSD](#2-directory-structure--fsd)
3. [API Integration](#3-api-integration)
4. [State Management](#4-state-management)
5. [Auth Implementation](#5-auth-implementation)
6. [Routing & Navigation](#6-routing--navigation)
7. [Component Specs (per FSD Layer)](#7-component-specs-per-fsd-layer)
8. [Session Deep-Dive](#8-session-deep-dive)
9. [Responsive & Mobile](#9-responsive--mobile)
10. [Performance](#10-performance)
11. [Testing Strategy](#11-testing-strategy)
12. [Observability — Abstractions & Stubs](#12-observability--abstractions--stubs)
13. [Accessibility (WCAG 2.1 AA)](#13-accessibility-wcag-21-aa)
14. [Storybook](#14-storybook)
15. [Build & Deploy](#15-build--deploy)
16. [Mock Layer](#16-mock-layer)

---

## 1. Project Bootstrap

### 1.1 Initialization

```bash
npx create-next-app@14 dashboard-ui --typescript --tailwind --eslint --app --src-dir
cd dashboard-ui
npx shadcn@latest init       # style: default, baseColor: slate, css variables: yes
npx shadcn@latest add button card table skeleton input select badge tooltip dialog
```

### 1.2 Key Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `next` | ^14.2 | App Router, SSR, middleware |
| `react` / `react-dom` | ^18.3 | UI framework |
| `tailwindcss` | ^3.4 | Utility-first styling |
| `shadcn` (CLI) | latest | Scaffolds accessible UI components (Radix UI + Tailwind) into `src/shared/ui/` |
| `@radix-ui/*` | latest | Headless accessible primitives (installed per-component by Shadcn CLI) |
| `class-variance-authority` | ^0.7 | Component variant API (`cva`) used by Shadcn components |
| `clsx` + `tailwind-merge` | latest | Conditional class merging utility (`cn()`) |
| `mobx` / `mobx-react-lite` | ^6 / ^4 | Observable UI state |
| `@tanstack/react-query` | ^5 | Server state, caching |
| `recharts` | ^2.12 | Charts |
| `zod` | ^3.23 | Runtime validation |
| `openapi-typescript` | ^7 | OpenAPI → TypeScript codegen |
| `next-intl` | ^3 | i18n |
| `jose` | ^5 | JWT validation (edge) |
| `lucide-react` | latest | Icons |
| `react-diff-view` | ^3 | Diff viewer |
| `shiki` | ^1 | Syntax highlighting |

**Dev dependencies**:

| Package | Purpose |
|---------|---------|
| `@storybook/nextjs` | Component playground |
| `jest` / `@testing-library/react` | Unit/integration tests |
| `playwright` | E2E tests |
| `msw` | API mocking (tests) |
| `@faker-js/faker` | Realistic test data generation |
| `jest-axe` | Accessibility assertions (WCAG) |
| `eslint-plugin-boundaries` | FSD layer enforcement |

### 1.3 TypeScript Configuration

```jsonc
// tsconfig.json (key fields)
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "paths": {
      "@shared/*": ["./src/shared/*"],
      "@entities/*": ["./src/entities/*"],
      "@features/*": ["./src/features/*"],
      "@widgets/*": ["./src/widgets/*"],
      "@pages/*": ["./src/pages/*"],
      "@app/*": ["./src/app/*"]
    }
  }
}
```

### 1.4 ESLint — FSD Boundary Enforcement

```jsonc
// eslint-plugin-boundaries config
{
  "rules": {
    "boundaries/element-types": ["error", {
      "default": "disallow",
      "rules": [
        { "from": "shared",   "allow": [] },
        { "from": "entities", "allow": ["shared"] },
        { "from": "features", "allow": ["shared", "entities"] },
        { "from": "widgets",  "allow": ["shared", "entities", "features"] },
        { "from": "pages",    "allow": ["shared", "entities", "features", "widgets"] },
        { "from": "app",      "allow": ["shared", "entities", "features", "widgets", "pages"] }
      ]
    }]
  }
}
```

### 1.5 Environment Variables

```typescript
// src/shared/config/env.ts
import { z } from 'zod';

const serverEnvSchema = z.object({
  JWT_SECRET: z.string().min(32),
  IDP_CLIENT_ID: z.string(),
  IDP_CLIENT_SECRET: z.string(),
  IDP_ISSUER_URL: z.string().url(),
});

const clientEnvSchema = z.object({
  NEXT_PUBLIC_ANALYTICS_API_URL: z.string().url(),
  NEXT_PUBLIC_API_GATEWAY_URL: z.string().url(),
  NEXT_PUBLIC_APP_URL: z.string().url(),
});

export const serverEnv = serverEnvSchema.parse(process.env);
export const clientEnv = clientEnvSchema.parse({
  NEXT_PUBLIC_ANALYTICS_API_URL: process.env.NEXT_PUBLIC_ANALYTICS_API_URL,
  NEXT_PUBLIC_API_GATEWAY_URL: process.env.NEXT_PUBLIC_API_GATEWAY_URL,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
});
```

| Variable | Required | Default | Used By |
|----------|----------|---------|---------|
| `JWT_SECRET` | Yes | — | Auth middleware |
| `IDP_CLIENT_ID` | Yes | — | Auth route handlers |
| `IDP_CLIENT_SECRET` | Yes | — | Auth route handlers |
| `IDP_ISSUER_URL` | Yes | — | Auth middleware, route handlers |
| `NEXT_PUBLIC_ANALYTICS_API_URL` | Yes | — | API client (analytics) |
| `NEXT_PUBLIC_API_GATEWAY_URL` | Yes | — | API client (user profile) |
| `NEXT_PUBLIC_APP_URL` | Yes | — | Auth callbacks |

### 1.6 Tailwind Configuration

```typescript
// tailwind.config.ts (key parts)
export default {
  darkMode: 'class',
  content: ['./app/**/*.{ts,tsx}', './src/**/*.{ts,tsx}'],
  presets: [require('./src/shared/ui/theme/tailwind-preset')],
};
```

---

## 2. Directory Structure / FSD

### 2.1 Full File Tree

```
project-root/
├── app/                                    ← Next.js App Router (routing only)
│   ├── middleware.ts
│   ├── dashboard/
│   │   ├── layout.tsx                      ← Server Component → Providers
│   │   ├── loading.tsx                     ← DashboardSkeleton
│   │   ├── error.tsx                       ← ErrorBoundary → IErrorTracker
│   │   ├── page.tsx                        ← → pages/executive-overview
│   │   ├── adoption/
│   │   │   ├── page.tsx
│   │   │   └── [teamId]/page.tsx
│   │   ├── delivery/
│   │   │   ├── page.tsx
│   │   │   └── [teamId]/page.tsx
│   │   ├── cost/
│   │   │   ├── page.tsx
│   │   │   └── [teamId]/page.tsx
│   │   ├── quality/page.tsx
│   │   ├── operations/page.tsx
│   │   ├── sessions/[sessionId]/page.tsx
│   │   └── settings/page.tsx
│   ├── api/auth/
│   │   ├── callback/route.ts
│   │   ├── logout/route.ts
│   │   ├── refresh/route.ts
│   │   └── me/route.ts
│   └── api/mock/                              ← Mock API (Route Handlers)
│       └── v1/
│           ├── analytics/
│           │   ├── overview/route.ts
│           │   ├── adoption/route.ts
│           │   ├── delivery/route.ts
│           │   ├── cost/route.ts
│           │   ├── quality/route.ts
│           │   ├── operations/route.ts
│           │   ├── sessions/[id]/route.ts
│           │   └── notifications/
│           │       ├── route.ts               ← GET list
│           │       └── [id]/route.ts          ← PATCH mark read
│           └── user/
│               ├── profile/route.ts           ← GET + PATCH
│               └── settings/route.ts          ← GET + PATCH
│
├── src/
│   ├── app/                                ← Layer 6: Application
│   │   ├── providers.tsx                   ← Provider composition
│   │   └── middleware.ts                   ← Auth logic (imported by app/middleware.ts)
│   │
│   ├── pages/                              ← Layer 5: Page compositions
│   │   ├── executive-overview/
│   │   │   ├── ui/ExecutiveOverviewPage.tsx
│   │   │   ├── api/useOverview.ts
│   │   │   └── index.ts
│   │   ├── adoption/
│   │   ├── delivery/
│   │   ├── cost/
│   │   ├── quality/
│   │   ├── operations/                     ← useOperations has refetchInterval: 60_000
│   │   ├── session-deep-dive/
│   │   ├── settings/
│   │   └── index.ts
│   │
│   ├── widgets/                            ← Layer 4: Composite UI blocks
│   │   ├── app-shell/
│   │   ├── sidebar-nav/
│   │   ├── breadcrumbs/
│   │   ├── notification-center/
│   │   ├── user-menu/
│   │   ├── empty-state/
│   │   ├── data-table/
│   │   ├── session-timeline/
│   │   └── cost-breakdown/
│   │
│   ├── features/                           ← Layer 3: User-facing capabilities
│   │   ├── filter-management/
│   │   │   ├── ui/
│   │   │   │   ├── FilterBar.tsx
│   │   │   │   ├── DateRangePicker.tsx
│   │   │   │   └── PeriodComparisonToggle.tsx
│   │   │   ├── model/FilterStore.ts
│   │   │   ├── lib/URLSyncProvider.tsx
│   │   │   └── index.ts                    ← public API
│   │   ├── export-data/
│   │   ├── theme-switching/
│   │   │   ├── ui/
│   │   │   │   ├── ThemeToggle.tsx
│   │   │   │   └── ThemeProvider.tsx
│   │   │   └── index.ts
│   │   └── auth/
│   │       ├── ui/AuthGuard.tsx
│   │       ├── model/AuthStore.ts
│   │       └── index.ts
│   │
│   ├── entities/                           ← Layer 2: Business entities
│   │   ├── session/
│   │   │   ├── model/types.ts
│   │   │   ├── api/useSession.ts
│   │   │   └── index.ts
│   │   ├── metric/
│   │   │   ├── ui/
│   │   │   │   ├── KPICard.tsx
│   │   │   │   ├── DeltaIndicator.tsx
│   │   │   │   └── ChartContainer.tsx
│   │   │   ├── model/types.ts
│   │   │   └── index.ts
│   │   ├── notification/
│   │   │   ├── ui/NotificationItem.tsx
│   │   │   ├── model/NotificationStore.ts
│   │   │   ├── api/useNotifications.ts
│   │   │   └── index.ts
│   │   ├── team/
│   │   │   ├── model/types.ts
│   │   │   └── index.ts
│   │   └── user/
│   │       ├── model/UserSettingsStore.ts
│   │       ├── api/useProfile.ts
│   │       ├── api/useSettings.ts
│   │       └── index.ts
│   │
│   └── shared/                             ← Layer 1: Shared infrastructure
│       ├── ui/
│       │   ├── button.tsx                  ← Shadcn UI components (Radix + Tailwind)
│       │   ├── card.tsx
│       │   ├── table.tsx
│       │   ├── skeleton.tsx
│       │   ├── input.tsx
│       │   ├── select.tsx
│       │   ├── date-picker.tsx
│       │   ├── badge.tsx
│       │   ├── tooltip.tsx
│       │   ├── modal.tsx
│       │   ├── dialog.tsx
│       │   └── theme/
│       │       ├── tokens.css              ← CSS custom properties (light/dark)
│       │       └── tailwind-preset.ts      ← Design tokens as Tailwind preset
│       ├── api/
│       │   ├── client.ts                   ← apiFetch wrapper
│       │   ├── query-keys.ts               ← QueryKeyFactory
│       │   ├── query-client.ts             ← TanStack Query config
│       │   └── types.generated.d.ts        ← openapi-typescript output
│       ├── config/
│       │   ├── routes.ts                   ← Route constants
│       │   ├── permissions.ts              ← RBAC map
│       │   └── env.ts                      ← Zod-validated env
│       ├── lib/
│       │   ├── utils.ts                    ← cn() helper (clsx + tailwind-merge)
│       │   ├── formatters.ts               ← Date, number, currency formatters
│       │   ├── i18n.ts                     ← next-intl setup
│       │   ├── hooks/
│       │   │   └── useMediaQuery.ts
│       │   └── analytics/                  ← Observability abstractions + stubs
│       │       ├── interfaces.ts           ← IErrorTracker, IAnalytics, ILogger
│       │       ├── stubs.ts                ← Console/noop implementations
│       │       ├── provider.tsx            ← React context for DI
│       │       └── events.ts               ← AnalyticsEvent taxonomy
│       ├── model/
│       │   └── UIStore.ts                  ← sidebarCollapsed, isMobile
│       └── __mocks__/
│           ├── handlers.ts                 ← MSW handlers from OpenAPI
│           ├── factories/                  ← Faker.js data factories
│           │   ├── index.ts
│           │   ├── overview.factory.ts
│           │   ├── adoption.factory.ts
│           │   ├── delivery.factory.ts
│           │   ├── cost.factory.ts
│           │   ├── quality.factory.ts
│           │   ├── operations.factory.ts
│           │   ├── session.factory.ts
│           │   ├── notification.factory.ts
│           │   └── user.factory.ts
│           └── fixtures/                   ← Static JSON snapshots (generated from factories)
│               ├── overview.json
│               ├── adoption.json
│               ├── session.json
│               └── ...
```

### 2.2 Naming Conventions

| Element | Convention | Example |
|---------|-----------|---------|
| Slice directory | kebab-case | `filter-management/` |
| Component file | PascalCase | `FilterBar.tsx` |
| Hook file | camelCase | `useOverview.ts` |
| Store file | PascalCase | `FilterStore.ts` |
| Type file | camelCase | `types.ts` |
| Barrel export | `index.ts` | Public API of each slice |

### 2.3 Barrel Export Rules

Each slice exposes only its public API via `index.ts`. Deep imports across slices are **forbidden** (enforced by `eslint-plugin-boundaries`).

```typescript
// src/features/filter-management/index.ts
export { FilterBar } from './ui/FilterBar';
export { DateRangePicker } from './ui/DateRangePicker';
export { PeriodComparisonToggle } from './ui/PeriodComparisonToggle';
export { FilterStore } from './model/FilterStore';
export { URLSyncProvider } from './lib/URLSyncProvider';
```

### 2.4 Segments

| Segment | Purpose | Example Contents |
|---------|---------|-----------------|
| `ui/` | React components | `FilterBar.tsx`, `KPICard.tsx` |
| `model/` | Types, MobX stores | `FilterStore.ts`, `types.ts` |
| `api/` | TanStack Query hooks | `useOverview.ts`, `useSession.ts` |
| `lib/` | Non-UI logic, providers | `URLSyncProvider.tsx`, `formatters.ts` |
| `config/` | Constants, maps | `routes.ts`, `permissions.ts` |

---

## 3. API Integration

### 3.1 OpenAPI Codegen Pipeline

```
openapi.yaml (source of truth, published by Analytics API)
       │
       ▼
openapi-typescript (CI step)
       │
       ├── types.generated.d.ts   ← compile-time types
       │
       ▼
Manual Zod schemas              ← runtime validation (CI validates against OpenAPI)
       │
       ├── Used by apiFetch()   ← parse every response
       └── Used by MSW          ← generate test handlers
```

CI step: `npx openapi-typescript openapi.yaml -o src/shared/api/types.generated.d.ts`

### 3.2 API Client (`apiFetch`)

```typescript
// src/shared/api/client.ts
import { z } from 'zod';
import { clientEnv } from '@shared/config/env';

interface FetchOptions extends RequestInit {
  baseUrl?: 'analytics' | 'gateway';
}

export async function apiFetch<T>(
  path: string,
  schema: z.ZodType<T>,
  options: FetchOptions = {},
): Promise<T> {
  const { baseUrl = 'analytics', ...fetchOptions } = options;
  const base = baseUrl === 'analytics'
    ? clientEnv.NEXT_PUBLIC_ANALYTICS_API_URL
    : clientEnv.NEXT_PUBLIC_API_GATEWAY_URL;

  const response = await fetch(`${base}${path}`, {
    ...fetchOptions,
    credentials: 'include', // httpOnly cookie
    headers: {
      'Content-Type': 'application/json',
      ...fetchOptions.headers,
    },
  });

  if (response.status === 401) {
    window.location.href = '/api/auth/refresh?redirect=' + encodeURIComponent(window.location.pathname);
    throw new ApiError('UNAUTHORIZED', 'Session expired', 401);
  }

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new ApiError(
      body.error?.code ?? 'UNKNOWN',
      body.error?.message ?? response.statusText,
      response.status,
    );
  }

  const data = await response.json();
  return schema.parse(data); // Zod runtime validation
}

export class ApiError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly status: number,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}
```

### 3.3 Query Key Factory

```typescript
// src/shared/api/query-keys.ts
import type { FilterState } from '@features/filter-management';

function serializeFilters(filters: FilterState) {
  return JSON.stringify(filters, Object.keys(filters).sort());
}

export const queryKeys = {
  analytics: {
    overview: (f: FilterState) => ['analytics', 'overview', serializeFilters(f)] as const,
    adoption: (f: FilterState) => ['analytics', 'adoption', serializeFilters(f)] as const,
    delivery: (f: FilterState) => ['analytics', 'delivery', serializeFilters(f)] as const,
    cost:     (f: FilterState) => ['analytics', 'cost', serializeFilters(f)] as const,
    quality:  (f: FilterState) => ['analytics', 'quality', serializeFilters(f)] as const,
    operations: (f: FilterState) => ['analytics', 'operations', serializeFilters(f)] as const,
    session:  (id: string) => ['analytics', 'session', id] as const,
  },
  notifications: {
    list: () => ['notifications'] as const,
  },
  user: {
    profile:  () => ['user', 'profile'] as const,
    settings: () => ['user', 'settings'] as const,
  },
} as const;
```

### 3.4 Data Freshness & Cache Configuration

| Endpoint | staleTime | gcTime | refetchInterval | Notes |
|----------|-----------|--------|-----------------|-------|
| `/v1/analytics/overview` | 5 min | 30 min | — | Executive data, daily freshness |
| `/v1/analytics/adoption` | 5 min | 30 min | — | Hourly freshness sufficient |
| `/v1/analytics/delivery` | 5 min | 30 min | — | Hourly freshness sufficient |
| `/v1/analytics/cost` | 5 min | 30 min | — | Daily freshness |
| `/v1/analytics/quality` | 5 min | 30 min | — | Daily freshness |
| `/v1/analytics/operations` | 30 sec | 5 min | **60s** | Action-oriented, minutes freshness |
| `/v1/analytics/sessions/:id` | 10 min | 60 min | — | On-demand, immutable after complete |
| `/v1/analytics/notifications` | 30 sec | 5 min | **60s** | Alert timeliness |
| `/v1/user/profile` | 30 min | 60 min | — | Rarely changes |
| `/v1/user/settings` | 30 min | 60 min | — | Rarely changes |

### 3.5 Error Handling Taxonomy

| HTTP Status | Code | Category | Recovery | UI Behavior |
|-------------|------|----------|----------|-------------|
| 401 | `UNAUTHORIZED` | Auth | Redirect to `/api/auth/refresh` | Transparent to user |
| 403 | `FORBIDDEN` | Auth | None | Show restricted access message |
| 404 | `NOT_FOUND` | Data | None | Show empty state |
| 422 | `VALIDATION_ERROR` | Client | Fix input | Show validation error inline |
| 429 | `RATE_LIMITED` | Throttle | Retry after `Retry-After` header | Show "too many requests" toast |
| 500+ | `INTERNAL_ERROR` | Server | Retry (2 attempts, exponential backoff) | Show inline error + retry button |

---

## 4. State Management

### 4.1 Architecture

```
MobX Stores (UI state)                TanStack Query (server state)
─────────────────────                  ──────────────────────────────
FilterStore  ──→ query key changes ──→ auto-refetch
UIStore      ──→ sidebar, mobile       cache, deduplication, background
AuthStore    ──→ user, role, org       stale-while-revalidate
NotificationStore ──→ in-memory        polling for notifications
UserSettingsStore ──→ theme, tz        polling disabled (manual refresh)
```

**Rule**: MobX is never used for server data. TanStack Query is never used for UI state.

### 4.2 RootStore

```typescript
// src/app/stores.ts
import { FilterStore } from '@features/filter-management';
import { AuthStore } from '@features/auth';
import { NotificationStore } from '@entities/notification';
import { UserSettingsStore } from '@entities/user';
import { UIStore } from '@shared/model/UIStore';

export class RootStore {
  filter = new FilterStore();
  ui = new UIStore();
  auth = new AuthStore();
  notification = new NotificationStore();
  userSettings = new UserSettingsStore();
}

// React context
const StoreContext = createContext<RootStore | null>(null);
export const useStore = () => {
  const store = useContext(StoreContext);
  if (!store) throw new Error('useStore must be used within MobXStoresProvider');
  return store;
};
```

### 4.3 FilterStore

```typescript
// src/features/filter-management/model/FilterStore.ts
import { makeAutoObservable } from 'mobx';

export interface FilterState {
  teamIds: string[];
  repoIds: string[];
  model: string | null;
  taskType: TaskType | null;
  language: string | null;
  timeRange: string;       // '7d' | '30d' | '90d' | 'start..end'
  granularity: Granularity;
  comparison: boolean;
}

export type TaskType = 'bugfix' | 'feature' | 'refactor' | 'test' | 'ops';
export type Granularity = 'hourly' | 'daily' | 'weekly' | 'monthly';

export class FilterStore {
  teamIds: string[] = [];
  repoIds: string[] = [];
  model: string | null = null;
  taskType: TaskType | null = null;
  language: string | null = null;
  timeRange = '30d';
  granularity: Granularity = 'daily';
  comparison = false;

  constructor() {
    makeAutoObservable(this);
  }

  setFilter<K extends keyof FilterState>(key: K, value: FilterState[K]) {
    (this as any)[key] = value;
  }

  resetFilters() {
    this.teamIds = [];
    this.repoIds = [];
    this.model = null;
    this.taskType = null;
    this.language = null;
    this.timeRange = '30d';
    this.granularity = 'daily';
    this.comparison = false;
  }

  get serialized(): FilterState {
    return {
      teamIds: this.teamIds,
      repoIds: this.repoIds,
      model: this.model,
      taskType: this.taskType,
      language: this.language,
      timeRange: this.timeRange,
      granularity: this.granularity,
      comparison: this.comparison,
    };
  }

  get hasActiveFilters(): boolean {
    return this.teamIds.length > 0 || this.repoIds.length > 0
      || this.model !== null || this.taskType !== null || this.language !== null;
  }
}
```

### 4.4 UIStore

```typescript
// src/shared/model/UIStore.ts
import { makeAutoObservable } from 'mobx';

export class UIStore {
  sidebarCollapsed = false;
  isMobile = false;

  constructor() {
    makeAutoObservable(this);
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sidebarCollapsed');
      if (saved) this.sidebarCollapsed = JSON.parse(saved);
    }
  }

  toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
    localStorage.setItem('sidebarCollapsed', JSON.stringify(this.sidebarCollapsed));
  }

  setMobile(isMobile: boolean) {
    this.isMobile = isMobile;
  }
}
```

### 4.5 AuthStore

```typescript
// src/features/auth/model/AuthStore.ts
import { makeAutoObservable } from 'mobx';

export enum Role {
  VP_CTO = 'vp_cto',
  ENG_MANAGER = 'eng_manager',
  PLATFORM_ENG = 'platform_eng',
  FINOPS = 'finops',
  SECURITY = 'security',
  IC_DEV = 'ic_dev',
  ORG_ADMIN = 'org_admin',
}

export class AuthStore {
  user: { id: string; email: string; name: string } | null = null;
  role: Role | null = null;
  orgId: string | null = null;
  teams: string[] = [];
  permissions: string[] = [];
  initialized = false;

  constructor() {
    makeAutoObservable(this);
  }

  setAuth(data: { user: typeof this.user; role: Role; orgId: string; teams: string[]; permissions: string[] }) {
    this.user = data.user;
    this.role = data.role;
    this.orgId = data.orgId;
    this.teams = data.teams;
    this.permissions = data.permissions;
    this.initialized = true;
  }

  get isAuthenticated() { return this.user !== null; }

  hasPermission(permission: string) {
    return this.role === Role.ORG_ADMIN || this.permissions.includes(permission);
  }
}
```

### 4.6 NotificationStore & UserSettingsStore

```typescript
// src/entities/notification/model/NotificationStore.ts
export class NotificationStore {
  notifications: Notification[] = [];
  constructor() { makeAutoObservable(this); }

  get unreadCount() { return this.notifications.filter(n => !n.read).length; }
  setNotifications(items: Notification[]) { this.notifications = items; }
  markRead(id: string) { /* optimistic update */ }
  dismiss(id: string) { /* optimistic update */ }
}

// src/entities/user/model/UserSettingsStore.ts
export class UserSettingsStore {
  theme: 'light' | 'dark' | 'system' = 'system';
  timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  defaultView = 'executive-overview';
  digestFrequency: 'weekly' | 'disabled' = 'disabled';
  language = 'en';
  constructor() { makeAutoObservable(this); }
}
```

### 4.7 URL Sync

```typescript
// src/features/filter-management/lib/URLSyncProvider.tsx
'use client';
import { reaction } from 'mobx';
import { useRouter, useSearchParams } from 'next/navigation';
import { useStore } from '@app/stores';
import { useEffect, useRef } from 'react';

export function URLSyncProvider({ children }: { children: React.ReactNode }) {
  const { filter } = useStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const skipSync = useRef(false);

  // URL → FilterStore (on mount + popstate)
  useEffect(() => {
    skipSync.current = true;
    const timeRange = searchParams.get('time_range');
    if (timeRange) filter.setFilter('timeRange', timeRange);
    const teams = searchParams.getAll('team_id');
    if (teams.length) filter.setFilter('teamIds', teams);
    // ... other params
    skipSync.current = false;
  }, [searchParams]);

  // FilterStore → URL (on change)
  useEffect(() => {
    const dispose = reaction(
      () => filter.serialized,
      (filters) => {
        if (skipSync.current) return;
        const params = new URLSearchParams();
        if (filters.timeRange !== '30d') params.set('time_range', filters.timeRange);
        filters.teamIds.forEach(id => params.append('team_id', id));
        // ... other params
        router.replace(`?${params.toString()}`, { scroll: false });
      },
    );
    return dispose;
  }, [filter, router]);

  return <>{children}</>;
}
```

### 4.8 TanStack Query Client

```typescript
// src/shared/api/query-client.ts
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,     // 5 min
      gcTime: 30 * 60 * 1000,       // 30 min
      retry: 2,
      refetchOnWindowFocus: true,
    },
  },
});
```

| Store | FSD Layer | Persistence | Scope |
|-------|-----------|-------------|-------|
| FilterStore | `features/filter-management` | URL query params | Per-session |
| UIStore | `shared/model` | `localStorage` | Cross-session |
| AuthStore | `features/auth` | Memory (from JWT) | Per-session |
| NotificationStore | `entities/notification` | Memory (API polling) | Per-session |
| UserSettingsStore | `entities/user` | API + `localStorage` cache | Cross-session |

---

## 5. Auth Implementation

### 5.1 Edge Middleware

```typescript
// src/app/middleware.ts
import { jwtVerify } from 'jose';
import { NextRequest, NextResponse } from 'next/server';
import { ROUTE_PERMISSIONS } from '@shared/config/permissions';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function dashboardMiddleware(req: NextRequest) {
  const token = req.cookies.get('auth_token')?.value;

  if (!token) {
    return NextResponse.redirect(new URL(
      `${process.env.IDP_ISSUER_URL}/authorize?redirect_uri=${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback`,
      req.url,
    ));
  }

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const role = payload.role as string;
    const pathname = req.nextUrl.pathname;

    // Check route permissions
    const allowed = ROUTE_PERMISSIONS[pathname];
    if (allowed && !allowed.includes(role) && role !== 'org_admin') {
      // Redirect to default view for this role
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    // Proactive refresh: if token expires within 5 minutes
    const exp = (payload.exp ?? 0) * 1000;
    if (exp - Date.now() < 5 * 60 * 1000) {
      const response = NextResponse.next();
      response.headers.set('x-token-refresh', 'true');
      return response;
    }

    return NextResponse.next();
  } catch {
    // Invalid token → re-auth
    const response = NextResponse.redirect(new URL('/api/auth/logout', req.url));
    return response;
  }
}

// app/middleware.ts
export { dashboardMiddleware as middleware } from '@app/middleware';
export const config = { matcher: '/dashboard/:path*' };
```

### 5.2 Route Permission Map

```typescript
// src/shared/config/permissions.ts
import { Role } from '@features/auth';

export const ROUTE_PERMISSIONS: Record<string, Role[]> = {
  '/dashboard':           [Role.VP_CTO, Role.ENG_MANAGER, Role.FINOPS],
  '/dashboard/adoption':  [Role.VP_CTO, Role.ENG_MANAGER, Role.PLATFORM_ENG, Role.IC_DEV],
  '/dashboard/delivery':  [Role.VP_CTO, Role.ENG_MANAGER, Role.PLATFORM_ENG, Role.IC_DEV],
  '/dashboard/cost':      [Role.VP_CTO, Role.ENG_MANAGER, Role.FINOPS],
  '/dashboard/quality':   [Role.ENG_MANAGER, Role.SECURITY],
  '/dashboard/operations':[Role.ENG_MANAGER, Role.PLATFORM_ENG],
  '/dashboard/settings':  Object.values(Role), // all roles
};
// Note: /dashboard/sessions/* uses data-level filtering (own sessions for IC_DEV)
```

### 5.3 Auth Route Handlers

| Route | Method | Request | Response | Side Effects |
|-------|--------|---------|----------|-------------|
| `/api/auth/callback` | GET | `?code=...&state=...` | 302 → `/dashboard` | Exchange code → JWT, set `httpOnly` cookie |
| `/api/auth/logout` | GET/POST | — | 302 → IdP logout | Clear cookie, terminate IdP session |
| `/api/auth/refresh` | GET | Cookie | 200 + new cookie | Silent JWT rotation |
| `/api/auth/me` | GET | Cookie | `{ user, role, orgId, teams, permissions }` | None |

### 5.4 AuthGuard (Client-Side RBAC)

```typescript
// src/features/auth/ui/AuthGuard.tsx
'use client';
import { observer } from 'mobx-react-lite';
import { useStore } from '@app/stores';

interface AuthGuardProps {
  roles?: Role[];
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export const AuthGuard = observer(function AuthGuard({ roles, fallback, children }: AuthGuardProps) {
  const { auth } = useStore();

  if (!auth.initialized) return null; // loading
  if (!auth.isAuthenticated) return null; // should not happen (middleware handles)

  if (roles && auth.role && !roles.includes(auth.role) && auth.role !== Role.ORG_ADMIN) {
    return fallback ?? <RestrictedAccessMessage />;
  }

  return <>{children}</>;
});
```

### 5.5 JWT Payload

```typescript
interface JWTPayload {
  sub: string;          // user ID
  email: string;
  name: string;
  role: Role;
  org_id: string;
  teams: string[];
  permissions: string[];
  exp: number;
  iat: number;
}
```

---

## 6. Routing & Navigation

### 6.1 Layout Tree

```
app/dashboard/
├── layout.tsx           ← Server Component: metadata + Providers wrapper
│   └── <Providers>      ← Client: Analytics → ErrorTracker → I18n → Theme → Query → MobX → URLSync → AuthGuard → AppShell
│       └── {children}   ← page content
├── loading.tsx          ← Global skeleton fallback
├── error.tsx            ← Error boundary → IErrorTracker.captureError()
├── page.tsx             ← Executive Overview (default)
├── adoption/
│   ├── page.tsx         ← Adoption view
│   └── [teamId]/
│       └── page.tsx     ← Team drill-down
├── delivery/
│   ├── page.tsx
│   └── [teamId]/page.tsx
├── cost/
│   ├── page.tsx
│   └── [teamId]/page.tsx
├── quality/page.tsx
├── operations/page.tsx
├── sessions/
│   └── [sessionId]/page.tsx  ← Session Deep-Dive
└── settings/page.tsx
```

### 6.2 Thin Page Wrapper Pattern

```typescript
// app/dashboard/adoption/page.tsx
import { AdoptionPage } from '@pages/adoption';

export const metadata = { title: 'Adoption & Usage — Dashboard' };

export default function Page() {
  return <AdoptionPage />;
}
```

### 6.3 Provider Nesting Order

```
<AnalyticsProvider>           ← shared/lib/analytics (IAnalytics, IErrorTracker, ILogger stubs)
  <ErrorBoundaryProvider>     ← error tracking wrapper
    <I18nProvider>             ← next-intl
      <ThemeProvider>          ← features/theme-switching
        <QueryClientProvider>  ← shared/api
          <MobXStoresProvider> ← RootStore context
            <URLSyncProvider>  ← features/filter-management
              <AuthGuard>      ← features/auth
                <AppShell>     ← widgets/app-shell
                  {children}
                </AppShell>
              </AuthGuard>
            </URLSyncProvider>
          </MobXStoresProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </I18nProvider>
  </ErrorBoundaryProvider>
</AnalyticsProvider>
```

### 6.4 Breadcrumbs

```typescript
// src/widgets/breadcrumbs/ui/Breadcrumbs.tsx
const DISPLAY_NAMES: Record<string, string> = {
  dashboard: 'Dashboard',
  adoption: 'Adoption & Usage',
  delivery: 'Delivery Impact',
  cost: 'Cost & Budgets',
  quality: 'Quality & Security',
  operations: 'Operations',
  sessions: 'Session',
  settings: 'Settings',
};
// Dynamic segments ([teamId], [sessionId]) → fetched from API or store
```

### 6.5 Drill-Down Routing

```
/dashboard                                    ← Executive Overview
/dashboard/adoption                           ← Adoption view
/dashboard/adoption/team-abc123               ← Team drill-down
/dashboard/sessions/sess-xyz789               ← Session Deep-Dive
/dashboard/sessions/sess-xyz789?step=5        ← Deep link to step
```

Session Deep-Dive is **not in sidebar** — reached only via row click in Adoption, Delivery, or Operations tables.

---

## 7. Component Specs (per FSD Layer)

### 7.1 `shared/ui/theme/` — Design Tokens (Shadcn CSS Variables)

Design tokens follow the Shadcn UI convention: CSS custom properties with HSL values consumed via `hsl(var(--token))` in Tailwind config. This enables theme switching (light/dark) and ensures all Shadcn components inherit the design system automatically.

```css
/* src/shared/ui/theme/tokens.css */
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --card: 0 0% 100%;
  --card-foreground: 222.2 84% 4.9%;
  --primary: 221.2 83.2% 53.3%;
  --primary-foreground: 210 40% 98%;
  --muted: 210 40% 96.1%;
  --muted-foreground: 215.4 16.3% 46.9%;
  --destructive: 0 84.2% 60.2%;
  --border: 214.3 31.8% 91.4%;
  --ring: 221.2 83.2% 53.3%;
  --radius: 0.5rem;
  /* Chart palette — distinguishable for color-blind users */
  --chart-1: 221 83% 53%;
  --chart-2: 142 76% 36%;
  --chart-3: 38 92% 50%;
  --chart-4: 0 84% 60%;
  --chart-5: 262 83% 58%;
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  --card: 222.2 84% 4.9%;
  --card-foreground: 210 40% 98%;
  --primary: 217.2 91.2% 59.8%;
  --primary-foreground: 222.2 47.4% 11.2%;
  --muted: 217.2 32.6% 17.5%;
  --muted-foreground: 215 20.2% 65.1%;
  --destructive: 0 62.8% 30.6%;
  --border: 217.2 32.6% 17.5%;
  --ring: 224.3 76.3% 48%;
  --chart-1: 217 91% 60%;
  --chart-2: 142 71% 45%;
  --chart-3: 38 92% 50%;
  --chart-4: 0 63% 31%;
  --chart-5: 262 83% 68%;
}
```

```typescript
// src/shared/ui/theme/tailwind-preset.ts
import type { Config } from 'tailwindcss';

export default {
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: { DEFAULT: 'hsl(var(--primary))', foreground: 'hsl(var(--primary-foreground))' },
        muted: { DEFAULT: 'hsl(var(--muted))', foreground: 'hsl(var(--muted-foreground))' },
        destructive: { DEFAULT: 'hsl(var(--destructive))' },
        border: 'hsl(var(--border))',
        ring: 'hsl(var(--ring))',
        chart: {
          1: 'hsl(var(--chart-1))',
          2: 'hsl(var(--chart-2))',
          3: 'hsl(var(--chart-3))',
          4: 'hsl(var(--chart-4))',
          5: 'hsl(var(--chart-5))',
        },
      },
      borderRadius: { DEFAULT: 'var(--radius)' },
    },
  },
} satisfies Partial<Config>;
```

### 7.2 `shared/lib/` — Utilities

```typescript
// src/shared/lib/utils.ts — Shadcn cn() helper
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

```typescript
// src/shared/lib/formatters.ts
export function formatNumber(value: number, opts?: Intl.NumberFormatOptions): string {
  return new Intl.NumberFormat('en-US', opts).format(value);
}

export function formatCurrency(value: number): string {
  return formatNumber(value, { style: 'currency', currency: 'USD', maximumFractionDigits: 2 });
}

export function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60_000) return `${(ms / 1000).toFixed(1)}s`;
  return `${Math.floor(ms / 60_000)}m ${Math.round((ms % 60_000) / 1000)}s`;
}

export function formatCompactNumber(value: number): string {
  return formatNumber(value, { notation: 'compact', maximumFractionDigits: 1 });
}
```

```typescript
// src/shared/lib/hooks/useMediaQuery.ts
'use client';
import { useEffect } from 'react';
import { useStore } from '@app/stores';

export function useMediaQuerySync() {
  const { ui } = useStore();
  useEffect(() => {
    const mql = window.matchMedia('(max-width: 767px)');
    const handler = (e: MediaQueryListEvent) => ui.setMobile(e.matches);
    ui.setMobile(mql.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, [ui]);
}
```

### 7.3 `entities/metric/ui/` — KPICard & ChartContainer

```typescript
// KPICard props
interface KPICardProps {
  label: string;
  value: string | number;
  format?: 'number' | 'currency' | 'percent' | 'duration';
  delta?: { value: number; direction: 'up' | 'down' | 'neutral' };
  sparklineData?: number[];
  loading?: boolean;
}

// DeltaIndicator props
interface DeltaIndicatorProps {
  value: number;
  direction: 'up' | 'down' | 'neutral';
  invertColor?: boolean; // true for metrics where "down" is good (e.g., cost)
}

// ChartContainer props
interface ChartContainerProps {
  title: string;
  loading?: boolean;
  error?: Error | null;
  onRetry?: () => void;
  isEmpty?: boolean;
  children: React.ReactNode;
  /** Hidden data table for screen readers — required for a11y */
  accessibilityData?: { headers: string[]; rows: (string | number)[][] };
}
```

`ChartContainer` renders: skeleton when `loading`, inline error + retry when `error`, empty state when `isEmpty`, children otherwise. Always renders hidden `<table>` from `accessibilityData` for screen readers.

### 7.4 `features/` — Key Components

| Component | Props | Behavior |
|-----------|-------|----------|
| **FilterBar** | `store: FilterStore` | Renders active filters as removable chips; shows filter dropdowns |
| **DateRangePicker** | `store: FilterStore, viewDefault: string` | Presets (7d/30d/90d/Custom); dual calendar for custom range |
| **PeriodComparisonToggle** | `store: FilterStore` | Toggle switch; enables delta indicators + dashed overlay on charts |
| **ExportButton** | `filters: FilterState, endpoint: string` | Dropdown: CSV/NDJSON; triggers download respecting current filters |
| **ThemeToggle** | — | Reads/writes `UserSettingsStore.theme`; sun/moon icon |
| **ThemeProvider** | `children` | Reads: UserSettingsStore → localStorage → `prefers-color-scheme`; applies `dark` class to `<html>` |
| **AuthGuard** | `roles?, fallback?, children` | Client-side RBAC; renders children or restricted fallback |

### 7.5 `widgets/` — Key Components

| Widget | Description | Dependencies |
|--------|-------------|-------------|
| **AppShell** | Sidebar + header (NotificationCenter, ThemeToggle, UserMenu) + scrollable content | sidebar-nav, notification-center, user-menu, breadcrumbs, theme-switching |
| **SidebarNav** | 6 view links + Settings; active highlight; hamburger on mobile | UIStore, route constants |
| **Breadcrumbs** | Auto from pathname + display name map | Next.js `usePathname` |
| **NotificationCenter** | Bell + unread badge + dropdown list; mark read/dismiss | entities/notification |
| **UserMenu** | Avatar dropdown: profile info, Settings link, IdP link, Logout | features/auth, entities/user |
| **EmptyState** | (1) Onboarding guide for new orgs, (2) No-data-for-filters + reset button | features/filter-management |
| **DataTable** | Cursor pagination, sortable columns, row click → drill-down route | shared/ui/Table |
| **SessionTimeline** | Vertical timeline of Think/Act/Observe steps (see §8) | — |
| **CostBreakdown** | Horizontal bar chart: LLM + compute cost per step; total KPI | entities/metric |

### 7.6 `pages/` — Composition Table

| Page | Route | Query Hook | Widgets Used | Grid | Mobile |
|------|-------|-----------|-------------|------|--------|
| Executive Overview | `/dashboard` | `useOverview` | KPICard ×6, ChartContainer (area), FilterBar | 3-col KPI + 2-col charts | KPI tiles only |
| Adoption | `/dashboard/adoption` | `useAdoption` | ChartContainer (line, funnel, pie, bar), DataTable, FilterBar | 2-col charts + table | DAU/WAU/MAU partial |
| Delivery | `/dashboard/delivery` | `useDelivery` | ChartContainer (bar, line, grouped bar), DataTable, FilterBar | 2-col charts + table | Not available |
| Cost | `/dashboard/cost` | `useCost` | ChartContainer (stacked bar, area), KPICard, FilterBar | 3-col KPI + 2-col charts | Alerts only |
| Quality | `/dashboard/quality` | `useQuality` | ChartContainer (bar, pie), DataTable (violations), FilterBar | 2-col charts + table | Alerts only |
| Operations | `/dashboard/operations` | `useOperations` (60s poll) | ChartContainer (area, bar), KPICard, FilterBar | 3-col KPI + 2-col charts | Triage view |
| Session Deep-Dive | `/dashboard/sessions/[sessionId]` | `useSession` | SessionTimeline, CostBreakdown | Single-col timeline | Not available |
| Settings | `/dashboard/settings` | `useSettings` | Form controls | Single-col form | Full |

---

## 8. Session Deep-Dive

### 8.1 Data Types

```typescript
// src/entities/session/model/types.ts
export interface Session {
  id: string;
  taskId: string;
  status: 'running' | 'completed' | 'failed';
  startedAt: string;
  completedAt: string | null;
  totalCost: number;
  totalDuration: number;
  steps: SessionStep[];
}

export type SessionStep = ThinkStep | ActStep | ObserveStep;

interface BaseStep {
  id: string;
  index: number;
  status: 'success' | 'error' | 'skipped';
  startedAt: string;
  duration: number;
  cost: number;
}

export interface ThinkStep extends BaseStep {
  type: 'think';
  model: string;
  tokensIn: number;
  tokensOut: number;
  promptSummary: string;
  responseSummary: string;
  reasoningExcerpt?: string;
}

export interface ActStep extends BaseStep {
  type: 'act';
  toolName: string;
  arguments: Record<string, unknown>;
  resultSummary: string;
}

export interface ObserveStep extends BaseStep {
  type: 'observe';
  diffs: DiffFile[];
  testOutput?: string;
  ciResult?: { passed: boolean; summary: string };
}

export interface DiffFile {
  path: string;
  hunks: Array<{
    oldStart: number;
    oldLines: number;
    newStart: number;
    newLines: number;
    content: string;
  }>;
  additions: number;
  deletions: number;
}
```

### 8.2 Step Rendering

```
┌──────────────────────────────────────────────────────────────────┐
│ Session: sess-xyz789          Status: Completed    Cost: $1.24   │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ● Think (Step 1)                           0.8s    $0.12       │
│  │  Model: claude-sonnet-4-5 · 1.2k → 3.4k tokens              │
│  │  > Analyzing repository structure...                          │
│  │  [▼ Expand reasoning]                                         │
│  │                                                               │
│  ● Act (Step 2)                             2.1s    $0.03       │
│  │  Tool: file_edit · src/utils/parser.ts                        │
│  │  > Modified parse function to handle edge case                │
│  │                                                               │
│  ● Observe (Step 3)                         5.4s    $0.08       │
│  │  ✓ 3 files changed (+42 -12)                                  │
│  │  ✓ Tests: 24/24 passed                                        │
│  │  [▼ View diff]                                                │
│  │                                                               │
│  ...                                                             │
│                                                                  │
├──────────────────────────────────────────────────────────────────┤
│ Cost Breakdown            [═══ LLM $0.89 ═══|══ Compute $0.35 ══]│
└──────────────────────────────────────────────────────────────────┘
```

### 8.3 Step Color & Icon Mapping

| Step Type | Icon | Color (light) | Color (dark) | Expanded Content |
|-----------|------|--------------|-------------|-----------------|
| Think | `Brain` | `chart-1` (blue) | `chart-1` | Model, tokens, prompt/response summary, reasoning |
| Act | `Wrench` | `chart-2` (green) | `chart-2` | Tool name, arguments (JSON), result summary |
| Observe | `Eye` | `chart-3` (amber) | `chart-3` | Diffs (→ DiffViewer), test output, CI results |
| Error | `AlertCircle` | `destructive` | `destructive` | Error message, stack trace (if available) |

### 8.4 DiffViewer

- Library: `react-diff-view` (unified/split mode toggle)
- Syntax highlighting: `shiki` (loads grammar lazily per language)
- File tree navigation for multi-file changes
- Collapsible hunks, line numbers, copy button

### 8.5 Cost Breakdown

Recharts horizontal `BarChart`:
- Segment by model for LLM cost (multi-model support)
- Separate bar for compute cost
- Total session cost as KPICard above chart

### 8.6 Performance

- Virtualized timeline for sessions with >50 steps (react-window `VariableSizeList`)
- Deep link support: `?step=5` → auto-scroll + expand

---

## 9. Responsive & Mobile

### 9.1 Breakpoints

| Breakpoint | Tailwind | Width | Layout Change |
|------------|----------|-------|--------------|
| `sm` | `sm:` | ≥640px | Minor adjustments |
| `md` | `md:` | ≥768px | **Mobile threshold**: sidebar visible, 2-col charts |
| `lg` | `lg:` | ≥1024px | 3-col KPI grid |
| `xl` | `xl:` | ≥1280px | Full dashboard layout |
| `2xl` | `2xl:` | ≥1536px | Extra spacing |

### 9.2 Mobile Behavior (< 768px)

| View | Mobile Scope | Behavior |
|------|-------------|----------|
| Executive Overview | KPI tiles + sparklines | 1-col KPI stack |
| Adoption & Usage | DAU/WAU/MAU trends (partial) | Simplified line chart |
| Cost & Budgets | Alerts only | Budget alert cards |
| Quality & Security | Alerts only | Violation alert cards |
| Operations | Triage (queue + failures) | KPI cards + failure list |
| Delivery Impact | **Not available** | "Open on desktop" message |
| Session Deep-Dive | **Not available** | "Open on desktop" message |
| Settings | Full | Single-col form |

### 9.3 Unavailable View Component

```typescript
// src/widgets/empty-state/ui/MobileUnavailable.tsx
export function MobileUnavailable({ viewName }: { viewName: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <Monitor className="h-12 w-12 text-muted-foreground mb-4" />
      <h2 className="text-lg font-semibold">{viewName}</h2>
      <p className="text-muted-foreground mt-2">
        This view requires a wider screen. Open on desktop for the full experience.
      </p>
    </div>
  );
}
```

### 9.4 Sidebar

- `≥ 768px`: full sidebar, collapsible (UIStore.sidebarCollapsed)
- `< 768px`: hidden by default, hamburger menu opens overlay sidebar
- Touch target: 44×44px minimum for all interactive elements

---

## 10. Performance

### 10.1 Budgets

| Metric | Target | Tool |
|--------|--------|------|
| JS bundle (gzip) | < 250KB | `next build` + `@next/bundle-analyzer` |
| LCP | < 2.5s (p95) | Web Vitals API |
| INP | < 200ms (p95) | Web Vitals API |
| CLS | < 0.1 | Web Vitals API |
| TTFB | < 800ms | Web Vitals API |
| View load (p95) | < 2s | Custom measurement |
| API response (p95) | < 500ms | Server-side (Analytics API) |

### 10.2 Code Splitting Strategy

```typescript
// Per-route splitting: automatic via Next.js App Router

// Heavy component lazy loading:
import dynamic from 'next/dynamic';

const SessionTimeline = dynamic(
  () => import('@widgets/session-timeline').then(m => m.SessionTimeline),
  { loading: () => <Skeleton className="h-96" /> },
);

const DiffViewer = dynamic(
  () => import('@widgets/session-timeline').then(m => m.DiffViewer),
  { loading: () => <Skeleton className="h-64" /> },
);

// Recharts lazy loading per chart type (inside ChartContainer)
const AreaChart = dynamic(() => import('recharts').then(m => m.AreaChart));
```

### 10.3 Additional Optimizations

- **Fonts**: `next/font` with `display: 'swap'` (no FOIT)
- **Icons**: tree-shaken Lucide imports (`import { Brain } from 'lucide-react'`)
- **Images**: `next/image` for user avatars
- **Skeleton loading**: every data-dependent component renders its own skeleton independently
- **Prefetching**: `<Link prefetch>` for sidebar navigation links
- **Chart virtualization**: `react-window` for DataTable rows and SessionTimeline steps

---

## 11. Testing Strategy

### 11.1 Testing Pyramid (FSD-Aligned)

| Level | FSD Layer | What to Mock | Coverage Target |
|-------|-----------|-------------|----------------|
| Unit | `shared/`, `entities/model/`, `features/model/` | Nothing or minimal | 80% |
| Slice | `entities/`, `features/` | `shared/api/` via MSW | 80% |
| Widget integration | `widgets/` | `shared/api/` via MSW | 60% |
| Page integration | `pages/` | `shared/api/` via MSW | 60% |
| E2E | `app/` + all layers | MSW-backed API | Critical paths |

### 11.2 MSW Setup

```typescript
// src/shared/__mocks__/handlers.ts
import { http, HttpResponse } from 'msw';
import overviewFixture from './fixtures/overview.json';

export const handlers = [
  http.get('*/v1/analytics/overview', () => {
    return HttpResponse.json(overviewFixture);
  }),
  http.get('*/v1/analytics/adoption', () => {
    return HttpResponse.json(adoptionFixture);
  }),
  // ... one handler per endpoint, generated from OpenAPI
];
```

### 11.3 Jest Test Example

```typescript
// src/pages/executive-overview/api/useOverview.test.ts
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useOverview } from './useOverview';

const wrapper = ({ children }) => (
  <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
    {children}
  </QueryClientProvider>
);

test('fetches overview data', async () => {
  const { result } = renderHook(() => useOverview(defaultFilters), { wrapper });
  await waitFor(() => expect(result.current.isSuccess).toBe(true));
  expect(result.current.data.activeUsers).toBeDefined();
});
```

### 11.4 Contract Testing

CI step validates Zod schemas against `openapi.yaml`:

```bash
# scripts/validate-contracts.ts
# Parses openapi.yaml → generates expected shape → compares with Zod schemas
# Fails build if schemas are out of sync
```

### 11.5 E2E Scenarios

| Scenario | Steps | Priority |
|----------|-------|----------|
| Login → Dashboard → Navigate views | Visit /dashboard → verify KPIs → click sidebar links | P0 |
| Apply filters → verify data refresh | Select team → verify URL update → verify chart data | P0 |
| Drill-down → Session Deep-Dive | Click session row → verify timeline renders → expand step | P0 |
| Export CSV | Apply filters → click export → verify download | P0 |
| Theme toggle | Click toggle → verify dark class → refresh → verify persistence | P1 |
| Notification center | Open dropdown → mark read → verify badge update | P1 |
| Mobile responsive | Resize viewport → verify sidebar collapse → verify unavailable views | P1 |

### 11.6 TDD Workflow

Каждая фича реализуется по циклу **Red → Green → Refactor**:

```
1. RED    — написать тест по acceptance criteria (тест падает)
2. GREEN  — минимальная реализация, чтобы тест прошёл
3. REFACTOR — улучшить код, тесты остаются зелёными
```

**Порядок для нового FSD-slice:**

```
1. Написать Zod-схему ответа API (entities/model/types.ts)
2. Написать unit-тест на схему (edge cases, nullable fields)
3. Написать MSW handler + factory (shared/__mocks__/)
4. Написать hook-тест (entities/api/useXxx.test.ts) → RED
5. Реализовать hook → GREEN
6. Написать компонент-тест (render + assert) → RED
7. Реализовать компонент → GREEN
8. REFACTOR: выделить переиспользуемые части
```

**Порядок для нового widget:**

```
1. Написать integration-тест (рендер widget с MSW) → RED
2. Реализовать widget из готовых entities/features → GREEN
3. Добавить Storybook story
```

**Порядок для page:**

```
1. Написать E2E сценарий в Playwright (или page integration test) → RED
2. Скомпоновать page из widgets → GREEN
3. Проверить accessibility (axe-core)
```

### 11.7 Acceptance Test Matrix

Маппинг PRD acceptance criteria → конкретные тесты. Каждая строка — один testable requirement.

#### Executive Overview

| # | Acceptance Criteria | Test Type | Test Location | Priority |
|---|-------------------|-----------|---------------|----------|
| OV-1 | KPI cards отображают active_users, sessions, outcome_rate, cost_per_task, ci_pass_rate | Slice | `pages/executive-overview/ui/ExecutiveOverviewPage.test.tsx` | P0 |
| OV-2 | Delta indicators показывают ↑↓% относительно предыдущего периода | Unit | `entities/metric/ui/DeltaIndicator.test.tsx` | P0 |
| OV-3 | Date range picker меняет time_range query param | Integration | `features/filter-management/ui/DateRangePicker.test.tsx` | P0 |
| OV-4 | Sparklines рендерятся для каждого KPI | Slice | `pages/executive-overview/ui/ExecutiveOverviewPage.test.tsx` | P1 |
| OV-5 | 7d/30d/90d переключение обновляет данные | E2E | `e2e/executive-overview.spec.ts` | P0 |
| OV-6 | Нет breakdown по individual developers | Slice | assert: response не содержит user-level данных | P1 |

#### Adoption & Usage

| # | Acceptance Criteria | Test Type | Test Location | Priority |
|---|-------------------|-----------|---------------|----------|
| AD-1 | Task funnel: Created → Started → Completed с conversion rates | Slice | `pages/adoption/ui/AdoptionPage.test.tsx` | P0 |
| AD-2 | Фильтрация по team, repo, language, task_type, model | Integration | `features/filter-management/` | P0 |
| AD-3 | Drill-down из session row → Session Deep-Dive | E2E | `e2e/adoption.spec.ts` | P0 |
| AD-4 | Sessions grouped by team в bar chart | Slice | `pages/adoption/ui/AdoptionPage.test.tsx` | P1 |
| AD-5 | DAU/WAU/MAU line charts рендерятся | Slice | `pages/adoption/ui/AdoptionPage.test.tsx` | P0 |
| AD-6 | Empty state для нового org с onboarding guide | Slice | `pages/adoption/ui/AdoptionPage.test.tsx` (empty fixture) | P0 |

#### Delivery Impact

| # | Acceptance Criteria | Test Type | Test Location | Priority |
|---|-------------------|-----------|---------------|----------|
| DL-1 | Agent vs non-agent PR comparison (grouped bar) | Slice | `pages/delivery/ui/DeliveryPage.test.tsx` | P0 |
| DL-2 | TTM trend line с 30-day moving average | Slice | `pages/delivery/ui/DeliveryPage.test.tsx` | P0 |
| DL-3 | Period comparison toggle: dashed overlay для prev period | Integration | `features/filter-management/ui/PeriodComparisonToggle.test.tsx` | P1 |
| DL-4 | Drill-down из PR row → Session Deep-Dive | E2E | `e2e/delivery.spec.ts` | P0 |
| DL-5 | Throughput by day/week с trend overlay | Slice | `pages/delivery/ui/DeliveryPage.test.tsx` | P1 |

#### Cost & Budgets

| # | Acceptance Criteria | Test Type | Test Location | Priority |
|---|-------------------|-----------|---------------|----------|
| CO-1 | Current spend vs budget limit KPI с visual indicator | Slice | `pages/cost/ui/CostPage.test.tsx` | P0 |
| CO-2 | Spend breakdown by team/repo/model (stacked bar) | Slice | `pages/cost/ui/CostPage.test.tsx` | P0 |
| CO-3 | Cost forecast с confidence bounds | Slice | `pages/cost/ui/CostPage.test.tsx` | P1 |
| CO-4 | Budget threshold alerts (50/75/90/100%) отображаются | Integration | `entities/notification/` | P0 |
| CO-5 | Cost per task и cost per PR metrics | Slice | `pages/cost/ui/CostPage.test.tsx` | P0 |

#### Quality & Security

| # | Acceptance Criteria | Test Type | Test Location | Priority |
|---|-------------------|-----------|---------------|----------|
| QA-1 | CI pass rate как primary metric | Slice | `pages/quality/ui/QualityPage.test.tsx` | P0 |
| QA-2 | Review outcome distribution (bar/pie) | Slice | `pages/quality/ui/QualityPage.test.tsx` | P0 |
| QA-3 | Policy violations table: type, severity, timestamp | Slice | `pages/quality/ui/QualityPage.test.tsx` | P0 |
| QA-4 | Фильтрация по violation type | Integration | `pages/quality/ui/QualityPage.test.tsx` | P1 |

#### Operations

| # | Acceptance Criteria | Test Type | Test Location | Priority |
|---|-------------------|-----------|---------------|----------|
| OP-1 | Queue depth KPI с intra-day trend area chart | Slice | `pages/operations/ui/OperationsPage.test.tsx` | P0 |
| OP-2 | Failure rate breakdown by category | Slice | `pages/operations/ui/OperationsPage.test.tsx` | P0 |
| OP-3 | SLA compliance % KPI | Slice | `pages/operations/ui/OperationsPage.test.tsx` | P0 |
| OP-4 | Data polls every 60s (refetchInterval) | Unit | `pages/operations/api/useOperations.test.ts` | P0 |
| OP-5 | Triage actions: retry/cancel на failed tasks | E2E | `e2e/operations.spec.ts` | P1 |

#### Session Deep-Dive

| # | Acceptance Criteria | Test Type | Test Location | Priority |
|---|-------------------|-----------|---------------|----------|
| SD-1 | Vertical timeline рендерит все steps | Widget | `widgets/session-timeline/ui/SessionTimeline.test.tsx` | P0 |
| SD-2 | Step cards: type, duration, cost, status с color-coding | Widget | `widgets/session-timeline/ui/SessionTimeline.test.tsx` | P0 |
| SD-3 | Expand step → detail panel (Think/Act/Observe) | Widget | `widgets/session-timeline/ui/SessionTimeline.test.tsx` | P0 |
| SD-4 | Diff viewer: side-by-side, syntax highlighting | Widget | `widgets/session-timeline/ui/DiffViewer.test.tsx` | P0 |
| SD-5 | Cost breakdown per-step horizontal bar chart | Widget | `widgets/cost-breakdown/ui/CostBreakdown.test.tsx` | P0 |
| SD-6 | Breadcrumbs: Dashboard > [View] > [Team] > [Session] | Widget | `widgets/breadcrumbs/ui/Breadcrumbs.test.tsx` | P1 |
| SD-7 | Deep linking: shareable URL с sessionId | E2E | `e2e/session-deep-dive.spec.ts` | P0 |

#### Settings

| # | Acceptance Criteria | Test Type | Test Location | Priority |
|---|-------------------|-----------|---------------|----------|
| ST-1 | Theme toggle persists (localStorage + API) | E2E | `e2e/settings.spec.ts` | P0 |
| ST-2 | Timezone selection отражается в date displays | Integration | `pages/settings/ui/SettingsPage.test.tsx` | P1 |
| ST-3 | Default view preference сохраняется и применяется | E2E | `e2e/settings.spec.ts` | P1 |
| ST-4 | Profile info (name, email, role) отображается read-only | Slice | `pages/settings/ui/SettingsPage.test.tsx` | P0 |
| ST-5 | Avatar upload | Integration | `pages/settings/ui/SettingsPage.test.tsx` | P1 |

#### Cross-Cutting

| # | Acceptance Criteria | Test Type | Test Location | Priority |
|---|-------------------|-----------|---------------|----------|
| CC-1 | Filter state сериализуется в URL query params | Unit | `features/filter-management/lib/URLSyncProvider.test.tsx` | P0 |
| CC-2 | Browser back/forward навигация работает с filter state | E2E | `e2e/navigation.spec.ts` | P0 |
| CC-3 | Sidebar навигация: 6 views + settings, active state | Widget | `widgets/sidebar-nav/ui/SidebarNav.test.tsx` | P0 |
| CC-4 | Export CSV: скачивается файл с текущими фильтрами | E2E | `e2e/export.spec.ts` | P0 |
| CC-5 | Notification badge обновляется при mark as read | Integration | `entities/notification/` | P0 |
| CC-6 | Period comparison toggle: prev period dashed overlay | Integration | `features/filter-management/ui/PeriodComparisonToggle.test.tsx` | P1 |
| CC-7 | Sidebar collapse на mobile (< 768px) | E2E | `e2e/responsive.spec.ts` | P1 |
| CC-8 | Unavailable views на mobile показывают "Desktop only" | Widget | `widgets/app-shell/ui/AppShell.test.tsx` | P1 |

### 11.8 Edge Cases & Error States

| Scenario | Expected Behavior | Test Type | Priority |
|----------|-------------------|-----------|----------|
| **API returns 500** | Inline error с retry button, остальные компоненты работают | Slice (MSW override) | P0 |
| **API returns 401** | Redirect на `/api/auth/refresh`, transparent to user | Unit (`apiFetch`) | P0 |
| **API returns 429** | Toast "Too many requests", retry after `Retry-After` | Unit (`apiFetch`) | P1 |
| **Network timeout** | Loading state → error после timeout | Slice | P1 |
| **Empty dataset** (new org) | Onboarding guide: "Connect repo → Run task → View analytics" | Slice (empty fixture) | P0 |
| **No data for filters** | "No data matches current filters" + reset filters action | Slice (empty fixture) | P0 |
| **Cohort < 5 members** | Suppressed breakdown, server returns aggregated data | Slice (fixture) | P1 |
| **Session in "running" status** | Timeline shows completed steps + spinner on current step | Widget | P1 |
| **Extremely long session** (50+ steps) | Virtualized list, no DOM bloat | Widget (perf assertion) | P1 |
| **Concurrent filter changes** | Only latest request is used (TanStack Query cancellation) | Integration | P1 |
| **Stale cache + refetch** | Stale data shown immediately, fresh data replaces it | Integration | P1 |
| **JWT expired mid-session** | Silent refresh, no data loss | E2E | P0 |
| **WebSocket disconnect** (Operations) | Fallback to polling, reconnect indicator | Integration | P2 |
| **CSV export large dataset** | Download starts, no browser freeze | E2E | P1 |
| **Invalid URL params** | Ignored, fallback to defaults | Unit (URLSyncProvider) | P1 |

### 11.9 Accessibility Testing

Каждый компонент проверяется на WCAG 2.1 AA compliance:

```typescript
// Пример: axe-core интеграция в Jest
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

test('KPICard has no accessibility violations', async () => {
  const { container } = render(<KPICard title="Active Users" value={142} delta={5.2} />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

| Category | What to Test | Tool | Priority |
|----------|-------------|------|----------|
| **Color contrast** | All text meets 4.5:1 ratio (AA), both light and dark theme | jest-axe + Storybook a11y addon | P0 |
| **Keyboard navigation** | Tab order: sidebar → filters → content; Enter/Space activates | E2E (Playwright) | P0 |
| **Screen reader** | KPI cards: `role="status"`, `aria-label` с value + delta | jest-axe | P0 |
| **Charts** | `aria-label` на ChartContainer, скрытая data table fallback | Slice | P0 |
| **Focus management** | Modal trap, return focus on close, skip-to-content link | E2E | P1 |
| **Reduced motion** | `prefers-reduced-motion` отключает chart animations | Slice (media query mock) | P1 |
| **Focus visible** | Visible focus ring на всех интерактивных элементах | E2E | P0 |
| **Landmarks** | `<nav>`, `<main>`, `<aside>` properly used | jest-axe | P0 |
| **Live regions** | Notification badge updates announced (`aria-live="polite"`) | Slice | P1 |
| **Error announcements** | Form errors linked via `aria-describedby` | Slice | P0 |

### 11.10 Visual Regression Testing

```typescript
// Playwright visual comparison
// e2e/visual/executive-overview.visual.spec.ts
import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';

test.beforeEach(() => {
  faker.seed(42); // Deterministic data for stable screenshots
});

test('executive overview matches snapshot (light)', async ({ page }) => {
  await page.goto('/dashboard');
  await page.waitForSelector('[data-testid="kpi-card"]');
  await expect(page).toHaveScreenshot('overview-light.png', {
    maxDiffPixelRatio: 0.01,
  });
});

test('executive overview matches snapshot (dark)', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto('/dashboard');
  await page.waitForSelector('[data-testid="kpi-card"]');
  await expect(page).toHaveScreenshot('overview-dark.png', {
    maxDiffPixelRatio: 0.01,
  });
});
```

| What | Viewports | Themes | Priority |
|------|-----------|--------|----------|
| Executive Overview (KPI cards + charts) | Desktop 1280×720, Mobile 375×812 | Light, Dark | P0 |
| Sidebar navigation (expanded + collapsed) | Desktop, Mobile | Light, Dark | P0 |
| Session Deep-Dive (timeline + diff) | Desktop 1280×720 | Light, Dark | P1 |
| Empty state (onboarding) | Desktop 1280×720 | Light | P1 |
| Error state (API failure) | Desktop 1280×720 | Light | P1 |
| Filter bar (with active filters) | Desktop 1280×720 | Light | P1 |

### 11.11 CI Test Stages Summary

```
┌─────────────┐    ┌──────────────┐    ┌──────────────┐    ┌───────────┐
│  Unit tests │    │ Slice tests  │    │  E2E tests   │    │  Visual   │
│  (Jest)     │───→│ (Jest + MSW) │───→│ (Playwright) │───→│ Regression│
│  ~80% cov   │    │  ~80% cov    │    │  P0 paths    │    │ (PW)      │
└─────────────┘    └──────────────┘    └──────────────┘    └───────────┘
       │                  │                    │                  │
       ▼                  ▼                    ▼                  ▼
   Blocks merge      Blocks merge        Blocks merge      Warns only
```

---

## 12. Observability — Abstractions & Stubs

### 12.1 Interfaces

```typescript
// src/shared/lib/analytics/interfaces.ts

export interface IErrorTracker {
  captureError(error: Error, context?: Record<string, unknown>): void;
  setUser(user: { id: string; email: string; role: string }): void;
  addBreadcrumb(crumb: { category: string; message: string; data?: Record<string, unknown> }): void;
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
```

### 12.2 Stub Implementations

```typescript
// src/shared/lib/analytics/stubs.ts

export class ConsoleErrorTracker implements IErrorTracker {
  captureError(error: Error, context?: Record<string, unknown>) {
    console.error('[ErrorTracker]', error.message, context);
  }
  setUser(user: { id: string }) {
    console.debug('[ErrorTracker] setUser', user.id);
  }
  addBreadcrumb(crumb: { category: string; message: string }) {
    console.debug('[ErrorTracker] breadcrumb', crumb.category, crumb.message);
  }
}

export class ConsoleAnalytics implements IAnalytics {
  trackEvent(event: AnalyticsEvent) {
    if (process.env.NODE_ENV === 'development') {
      console.log('[Analytics]', event.type, event);
    }
  }
  identify(userId: string, traits: Record<string, unknown>) {
    if (process.env.NODE_ENV === 'development') {
      console.log('[Analytics] identify', userId, traits);
    }
  }
  page(name: string, properties?: Record<string, unknown>) {
    if (process.env.NODE_ENV === 'development') {
      console.log('[Analytics] page', name, properties);
    }
  }
}

export class ConsoleLogger implements ILogger {
  debug(msg: string, ctx?: Record<string, unknown>) { console.debug(msg, ctx); }
  info(msg: string, ctx?: Record<string, unknown>)  { console.info(msg, ctx); }
  warn(msg: string, ctx?: Record<string, unknown>)  { console.warn(msg, ctx); }
  error(msg: string, ctx?: Record<string, unknown>) { console.error(msg, ctx); }
}
```

### 12.3 Provider (Dependency Injection)

```typescript
// src/shared/lib/analytics/provider.tsx
'use client';
import { createContext, useContext } from 'react';
import { ConsoleErrorTracker, ConsoleAnalytics, ConsoleLogger } from './stubs';

interface ObservabilityContextValue {
  errorTracker: IErrorTracker;
  analytics: IAnalytics;
  logger: ILogger;
}

const ObservabilityContext = createContext<ObservabilityContextValue>({
  errorTracker: new ConsoleErrorTracker(),
  analytics: new ConsoleAnalytics(),
  logger: new ConsoleLogger(),
});

export const useErrorTracker = () => useContext(ObservabilityContext).errorTracker;
export const useAnalytics = () => useContext(ObservabilityContext).analytics;
export const useLogger = () => useContext(ObservabilityContext).logger;

export function AnalyticsProvider({
  errorTracker, analytics, logger, children,
}: Partial<ObservabilityContextValue> & { children: React.ReactNode }) {
  return (
    <ObservabilityContext.Provider value={{
      errorTracker: errorTracker ?? new ConsoleErrorTracker(),
      analytics: analytics ?? new ConsoleAnalytics(),
      logger: logger ?? new ConsoleLogger(),
    }}>
      {children}
    </ObservabilityContext.Provider>
  );
}
```

### 12.4 Event Taxonomy

```typescript
// src/shared/lib/analytics/events.ts

export type AnalyticsEvent =
  | { type: 'view_visited'; view: string; role: string }
  | { type: 'filter_applied'; filterType: string; value: string }
  | { type: 'export_triggered'; format: 'csv' | 'ndjson'; view: string }
  | { type: 'session_drilldown'; sessionId: string; fromView: string }
  | { type: 'notification_opened' }
  | { type: 'notification_read'; notificationId: string }
  | { type: 'theme_changed'; theme: 'light' | 'dark' | 'system' }
  | { type: 'alert_configured'; alertType: string; threshold: number }
  | { type: 'data_load_failed'; view: string; endpoint: string; status: number }
  | { type: 'slow_query'; view: string; duration: number }
  | { type: 'empty_result'; view: string; filters: string };
```

| Event | Properties | Trigger Point |
|-------|-----------|--------------|
| `view_visited` | view, role | Page mount (via `usePathname`) |
| `filter_applied` | filterType, value | FilterBar change |
| `export_triggered` | format, view | ExportButton click |
| `session_drilldown` | sessionId, fromView | DataTable row click |
| `notification_opened` | — | Bell icon click |
| `notification_read` | notificationId | Mark-read action |
| `theme_changed` | theme | ThemeToggle click |
| `data_load_failed` | view, endpoint, status | TanStack Query onError |
| `slow_query` | view, duration | Response time > 2s |
| `empty_result` | view, filters | Query returns 0 results |

### 12.5 Error Boundary Integration

```typescript
// app/dashboard/error.tsx
'use client';
import { useErrorTracker } from '@shared/lib/analytics';

export default function DashboardError({ error, reset }: { error: Error; reset: () => void }) {
  const errorTracker = useErrorTracker();

  useEffect(() => {
    errorTracker.captureError(error, { boundary: 'dashboard' });
  }, [error, errorTracker]);

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <h2 className="text-lg font-semibold">Something went wrong</h2>
      <Button onClick={reset} className="mt-4">Try again</Button>
    </div>
  );
}
```

---

## 13. Accessibility (WCAG 2.1 AA)

### 13.1 Requirements

| WCAG Criterion | Implementation | Components |
|---------------|----------------|-----------|
| 1.4.3 Contrast | 4.5:1 text, 3:1 UI (both light and dark themes) | All |
| 1.4.11 Non-text contrast | 3:1 for chart data, borders, icons | Charts, badges |
| 1.3.1 Info & relationships | Charts never color-only: use patterns/shapes + labels | ChartContainer |
| 2.1.1 Keyboard | All interactive elements focusable; Enter/Space activation | All |
| 2.4.7 Focus visible | `focus-visible:ring-2 ring-ring` on all interactive elements | All |
| 2.4.3 Focus order | Logical tab order: sidebar → header → content | AppShell |
| 2.4.6 Headings | h1–h6 hierarchy per page; landmarks (`nav`, `main`, `aside`) | Pages, AppShell |
| 4.1.2 Name/Role/Value | `aria-label` on charts, `aria-sort` on table columns | ChartContainer, DataTable |
| 4.1.3 Status messages | `aria-live="polite"` for notifications, filter changes | NotificationCenter, FilterBar |
| 2.3.1 Reduced motion | `prefers-reduced-motion` → disable transitions/animations | All animated |

### 13.2 Chart Accessibility Pattern

Every chart renders a hidden `<table>` for screen readers:

```typescript
// Inside ChartContainer
<div role="img" aria-label={title}>
  {/* visible chart */}
  <ResponsiveContainer>{children}</ResponsiveContainer>

  {/* screen reader fallback */}
  {accessibilityData && (
    <table className="sr-only">
      <caption>{title}</caption>
      <thead>
        <tr>{accessibilityData.headers.map(h => <th key={h} scope="col">{h}</th>)}</tr>
      </thead>
      <tbody>
        {accessibilityData.rows.map((row, i) => (
          <tr key={i}>{row.map((cell, j) => <td key={j}>{cell}</td>)}</tr>
        ))}
      </tbody>
    </table>
  )}
</div>
```

### 13.3 Focus Management

- **Modals/dropdowns**: focus trap via `Dialog` from Shadcn/Radix
- **Drill-down navigation**: focus moves to breadcrumbs after route change
- **NotificationCenter dropdown**: focus returns to bell icon on close
- **Sidebar collapse**: focus remains on toggle button

### 13.4 Testing

- `@axe-core/react` in development mode (overlay violations)
- `jest-axe` in unit tests: `expect(await axe(container)).toHaveNoViolations()`
- Playwright a11y audit: `page.accessibility.snapshot()` + axe checks

---

## 14. Storybook

### 14.1 Setup

```bash
npx storybook@latest init --type nextjs
```

Configuration: `@storybook/nextjs` framework with Tailwind + Shadcn integration.

**Decorators**:
- `withTheme`: wraps stories in ThemeProvider, adds dark mode toggle to toolbar
- `withI18n`: wraps in I18nProvider
- `withStores`: wraps in MobXStoresProvider with configurable initial state

### 14.2 Coverage by FSD Layer

| FSD Layer | Coverage | Story Type |
|-----------|----------|-----------|
| `shared/ui/*` | **All** components | Visual: variants, sizes, states (disabled, loading) |
| `entities/*/ui/*` | **All** (KPICard, DeltaIndicator, ChartContainer, NotificationItem) | Visual + interaction: loading/error/empty states |
| `widgets/*` | **Key** (AppShell, SessionTimeline, DataTable, EmptyState) | Composition + interaction |
| `features/*/ui/*` | **Selective** (FilterBar, ExportButton) | Interaction: filter add/remove, export flow |
| `pages/*` | **Not covered** | Too many dependencies; tested via E2E |

### 14.3 Story Conventions

- **Format**: CSF3 (Component Story Format 3)
- **File location**: colocated — `Button.stories.tsx` next to `Button.tsx`
- **Controls**: `args` + `argTypes` for all configurable props
- **Interaction tests**: `play` functions for click/type/keyboard flows
- **A11y**: `@storybook/addon-a11y` enabled globally (WCAG AA audit in every story)
- **Viewport**: `@storybook/addon-viewport` for responsive preview

### 14.4 Example Story

```typescript
// src/entities/metric/ui/KPICard.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { KPICard } from './KPICard';

const meta = {
  title: 'entities/metric/KPICard',
  component: KPICard,
  args: {
    label: 'Active Users',
    value: 1234,
    format: 'number',
    delta: { value: 12.5, direction: 'up' },
    sparklineData: [100, 120, 115, 130, 145, 160, 155],
  },
} satisfies Meta<typeof KPICard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Loading: Story = {
  args: { loading: true },
};

export const NegativeDelta: Story = {
  args: { delta: { value: -5.2, direction: 'down' } },
};

export const Currency: Story = {
  args: { label: 'Cost per PR', value: 2.34, format: 'currency' },
};
```

### 14.5 Addons

| Addon | Purpose |
|-------|---------|
| `@storybook/addon-a11y` | WCAG audit in every story |
| `@storybook/addon-viewport` | Responsive preview (mobile/tablet/desktop) |
| `@storybook/addon-interactions` | Visual interaction testing |
| `@storybook/addon-themes` | Dark/light mode toggle |

---

## 15. Build & Deploy

### 15.1 CI/CD Pipeline (GitHub Actions)

```yaml
# .github/workflows/ci.yml (abbreviated)
name: CI
on: [push, pull_request]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - run: pnpm install --frozen-lockfile
      - run: pnpm lint                     # ESLint + boundaries
      - run: pnpm typecheck                # tsc --noEmit

  test:
    runs-on: ubuntu-latest
    needs: lint
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - run: pnpm install --frozen-lockfile
      - run: pnpm test -- --coverage        # Jest
      - run: pnpm validate-contracts        # Zod vs OpenAPI

  build:
    runs-on: ubuntu-latest
    needs: test
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - run: pnpm install --frozen-lockfile
      - run: pnpm codegen                   # openapi-typescript
      - run: pnpm build
      - run: pnpm dlx @next/bundle-analyzer  # verify < 250KB

  e2e:
    runs-on: ubuntu-latest
    needs: build
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - run: pnpm install --frozen-lockfile
      - run: pnpm exec playwright install --with-deps
      - run: pnpm e2e

  deploy:
    runs-on: ubuntu-latest
    needs: e2e
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: --prod
```

### 15.2 CI Stages

| Stage | Tool | Failure Behavior |
|-------|------|-----------------|
| Lint | ESLint + `eslint-plugin-boundaries` | Block merge |
| Typecheck | `tsc --noEmit` | Block merge |
| Unit tests | Jest + coverage | Block merge if coverage < threshold |
| Contract validation | Custom script (Zod vs OpenAPI) | Block merge |
| Build | `next build` | Block merge |
| Bundle analysis | `@next/bundle-analyzer` | Warn if > 250KB |
| E2E | Playwright | Block merge |
| Deploy | Vercel | Auto on `main` |

### 15.3 Vercel Configuration

- **Preview deployments**: auto for every PR
- **Production**: deploy on merge to `main`
- **Environment variables**: set in Vercel dashboard (not in repo)
- **Edge middleware**: supported natively by Vercel
- **Regions**: auto (edge for middleware, serverless for route handlers)

### 15.4 Source Maps

- Generated during build
- **Not deployed to production** (security)
- Upload to error tracker when real implementation replaces stubs

### 15.5 OpenAPI Codegen

CI step before build:
```bash
npx openapi-typescript specs/openapi.yaml -o src/shared/api/types.generated.d.ts
```
Committed to repo for IDE support. CI validates freshness.

---

## 16. Mock Layer

> Mock API реализован как Next.js Route Handlers внутри того же проекта. Деплоится на Vercel вместе с дашбордом — отдельный сервер не нужен. Для тестов используется MSW (см. [§11.2](#112-msw-setup)).

### 16.1 Architecture Decision

| Approach | Pros | Cons | Verdict |
|----------|------|------|---------|
| **Next.js Route Handlers** (`app/api/mock/`) | Один деплой, Vercel serverless, тот же репозиторий | Slightly coupled with frontend project | **Chosen** — simplest for single-team demo |
| MSW only (browser/node intercept) | No server needed, great for tests | No real HTTP, can't share with external consumers | **Used for tests only** |
| Separate mock server | Independent, multi-consumer | Extra repo, extra deploy, extra infra | **Rejected** — overkill for this phase |

### 16.2 Request Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                        Vercel (single deploy)                   │
│                                                                 │
│  Browser ──→ apiFetch("/v1/analytics/overview")                 │
│                  │                                              │
│                  ▼                                              │
│  ┌──── NEXT_PUBLIC_ANALYTICS_API_URL ────┐                     │
│  │                                        │                     │
│  │  Production:  https://api.platform.io  │ ← real Analytics API│
│  │  Demo/Dev:    /api/mock                │ ← Route Handlers    │
│  └────────────────────────────────────────┘                     │
│                  │                                              │
│                  ▼ (when mock)                                  │
│  app/api/mock/v1/analytics/overview/route.ts                    │
│       │                                                         │
│       └──→ factory.overview() ──→ JSON response                 │
└─────────────────────────────────────────────────────────────────┘
```

### 16.3 Environment Switching

Переключение между mock и real API — через environment variables. Никаких условий в коде `apiFetch` не нужно.

```bash
# .env.development (mock — default for local dev)
NEXT_PUBLIC_ANALYTICS_API_URL=/api/mock
NEXT_PUBLIC_API_GATEWAY_URL=/api/mock

# .env.production (real backend)
NEXT_PUBLIC_ANALYTICS_API_URL=https://analytics-api.platform.io
NEXT_PUBLIC_API_GATEWAY_URL=https://api.platform.io

# Vercel Preview (demo mode with mock)
# Set in Vercel Dashboard → Environment Variables → Preview
NEXT_PUBLIC_ANALYTICS_API_URL=/api/mock
NEXT_PUBLIC_API_GATEWAY_URL=/api/mock
```

Код `apiFetch` (§3.2) не меняется — он использует `clientEnv.NEXT_PUBLIC_ANALYTICS_API_URL` как base URL. Когда значение `/api/mock`, запросы идут в Route Handlers.

### 16.4 Data Factories

Factories генерируют реалистичные данные с `@faker-js/faker`. Каждая фабрика соответствует одному API-эндпоинту и экспортирует функцию, возвращающую типизированный ответ.

```typescript
// src/shared/__mocks__/factories/overview.factory.ts
import { faker } from '@faker-js/faker';
import type { OverviewResponse } from '@shared/api/types.generated';

export function createOverviewResponse(
  overrides?: Partial<OverviewResponse>,
): OverviewResponse {
  const activeUsers = faker.number.int({ min: 80, max: 500 });
  const prevActiveUsers = faker.number.int({ min: 60, max: 480 });

  return {
    data: {
      active_users: {
        current: activeUsers,
        previous: prevActiveUsers,
        delta_percent: Number(
          (((activeUsers - prevActiveUsers) / prevActiveUsers) * 100).toFixed(1),
        ),
      },
      sessions_total: {
        current: faker.number.int({ min: 500, max: 5000 }),
        previous: faker.number.int({ min: 400, max: 4800 }),
        delta_percent: faker.number.float({ min: -15, max: 30, fractionDigits: 1 }),
      },
      accepted_outcome_rate: {
        current: faker.number.float({ min: 60, max: 95, fractionDigits: 1 }),
        previous: faker.number.float({ min: 55, max: 90, fractionDigits: 1 }),
        delta_percent: faker.number.float({ min: -5, max: 10, fractionDigits: 1 }),
      },
      cost_per_task: {
        current: faker.number.float({ min: 0.5, max: 5.0, fractionDigits: 2 }),
        previous: faker.number.float({ min: 0.6, max: 5.5, fractionDigits: 2 }),
        delta_percent: faker.number.float({ min: -20, max: 5, fractionDigits: 1 }),
      },
      ci_pass_rate: {
        current: faker.number.float({ min: 75, max: 99, fractionDigits: 1 }),
        previous: faker.number.float({ min: 70, max: 98, fractionDigits: 1 }),
        delta_percent: faker.number.float({ min: -3, max: 8, fractionDigits: 1 }),
      },
    },
    meta: {
      time_range: '30d',
      org_id: faker.string.uuid(),
      generated_at: new Date().toISOString(),
    },
    ...overrides,
  };
}
```

```typescript
// src/shared/__mocks__/factories/session.factory.ts
import { faker } from '@faker-js/faker';

export function createSessionDetail(sessionId?: string) {
  const stepsCount = faker.number.int({ min: 3, max: 12 });

  return {
    data: {
      id: sessionId ?? faker.string.uuid(),
      status: faker.helpers.arrayElement(['completed', 'failed', 'running']),
      task_type: faker.helpers.arrayElement(['bugfix', 'feature', 'refactor', 'test', 'ops']),
      repo: `${faker.internet.username()}/${faker.word.noun()}-${faker.word.adjective()}`,
      branch: `agent/${faker.git.branch()}`,
      started_at: faker.date.recent({ days: 7 }).toISOString(),
      completed_at: faker.date.recent({ days: 1 }).toISOString(),
      model: faker.helpers.arrayElement(['claude-sonnet-4-20250514', 'gpt-4o', 'claude-opus-4-20250514']),
      total_cost_usd: faker.number.float({ min: 0.05, max: 8.0, fractionDigits: 4 }),
      tokens: {
        input: faker.number.int({ min: 10000, max: 500000 }),
        output: faker.number.int({ min: 2000, max: 100000 }),
      },
      steps: Array.from({ length: stepsCount }, (_, i) => ({
        index: i,
        type: faker.helpers.arrayElement(['reasoning', 'tool_call', 'code_edit', 'terminal', 'review']),
        summary: faker.lorem.sentence(),
        duration_ms: faker.number.int({ min: 200, max: 30000 }),
        timestamp: faker.date.recent({ days: 1 }).toISOString(),
      })),
      pr: {
        number: faker.number.int({ min: 1, max: 9999 }),
        url: `https://github.com/org/repo/pull/${faker.number.int({ min: 1, max: 9999 })}`,
        status: faker.helpers.arrayElement(['open', 'merged', 'closed']),
        ci_status: faker.helpers.arrayElement(['passed', 'failed', 'pending']),
      },
    },
  };
}
```

```typescript
// src/shared/__mocks__/factories/index.ts
export { createOverviewResponse } from './overview.factory';
export { createAdoptionResponse } from './adoption.factory';
export { createDeliveryResponse } from './delivery.factory';
export { createCostResponse } from './cost.factory';
export { createQualityResponse } from './quality.factory';
export { createOperationsResponse } from './operations.factory';
export { createSessionDetail } from './session.factory';
export { createNotificationList, createNotification } from './notification.factory';
export { createUserProfile, createUserSettings } from './user.factory';
```

### 16.5 Route Handlers

Каждый Route Handler: парсит query params, вызывает соответствующую фабрику, возвращает JSON с корректными заголовками.

```typescript
// app/api/mock/v1/analytics/overview/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createOverviewResponse } from '@shared/__mocks__/factories';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const timeRange = searchParams.get('time_range') ?? '30d';

  // Simulate network latency (configurable for UX testing)
  const delay = parseInt(searchParams.get('_delay') ?? '0', 10);
  if (delay > 0) {
    await new Promise((resolve) => setTimeout(resolve, Math.min(delay, 5000)));
  }

  return NextResponse.json(createOverviewResponse({ meta: { time_range: timeRange } }), {
    headers: {
      'X-Mock': 'true',
      'Cache-Control': 'no-store',
    },
  });
}
```

```typescript
// app/api/mock/v1/analytics/sessions/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createSessionDetail } from '@shared/__mocks__/factories';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  return NextResponse.json(createSessionDetail(params.id), {
    headers: { 'X-Mock': 'true', 'Cache-Control': 'no-store' },
  });
}
```

```typescript
// app/api/mock/v1/analytics/notifications/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createNotificationList } from '@shared/__mocks__/factories';

export async function GET() {
  return NextResponse.json(createNotificationList(), {
    headers: { 'X-Mock': 'true', 'Cache-Control': 'no-store' },
  });
}
```

```typescript
// app/api/mock/v1/analytics/notifications/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const body = await request.json();

  return NextResponse.json(
    { data: { id: params.id, ...body, updated_at: new Date().toISOString() } },
    { headers: { 'X-Mock': 'true' } },
  );
}
```

```typescript
// app/api/mock/v1/user/profile/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createUserProfile } from '@shared/__mocks__/factories';

// In-memory state for PATCH persistence within session
let profileState = createUserProfile();

export async function GET() {
  return NextResponse.json({ data: profileState }, {
    headers: { 'X-Mock': 'true', 'Cache-Control': 'no-store' },
  });
}

export async function PATCH(request: NextRequest) {
  const body = await request.json();
  profileState = { ...profileState, ...body };
  return NextResponse.json({ data: profileState }, {
    headers: { 'X-Mock': 'true' },
  });
}
```

### 16.6 Endpoint Coverage Map

| Endpoint | Method | Route Handler | Factory | MSW Handler |
|----------|--------|--------------|---------|-------------|
| `/v1/analytics/overview` | GET | `app/api/mock/v1/analytics/overview/route.ts` | `createOverviewResponse` | `handlers.ts` |
| `/v1/analytics/adoption` | GET | `app/api/mock/v1/analytics/adoption/route.ts` | `createAdoptionResponse` | `handlers.ts` |
| `/v1/analytics/delivery` | GET | `app/api/mock/v1/analytics/delivery/route.ts` | `createDeliveryResponse` | `handlers.ts` |
| `/v1/analytics/cost` | GET | `app/api/mock/v1/analytics/cost/route.ts` | `createCostResponse` | `handlers.ts` |
| `/v1/analytics/quality` | GET | `app/api/mock/v1/analytics/quality/route.ts` | `createQualityResponse` | `handlers.ts` |
| `/v1/analytics/operations` | GET | `app/api/mock/v1/analytics/operations/route.ts` | `createOperationsResponse` | `handlers.ts` |
| `/v1/analytics/sessions/:id` | GET | `app/api/mock/v1/analytics/sessions/[id]/route.ts` | `createSessionDetail` | `handlers.ts` |
| `/v1/analytics/notifications` | GET | `app/api/mock/v1/analytics/notifications/route.ts` | `createNotificationList` | `handlers.ts` |
| `/v1/analytics/notifications/:id` | PATCH | `app/api/mock/v1/analytics/notifications/[id]/route.ts` | — (inline) | `handlers.ts` |
| `/v1/user/profile` | GET | `app/api/mock/v1/user/profile/route.ts` | `createUserProfile` | `handlers.ts` |
| `/v1/user/profile` | PATCH | `app/api/mock/v1/user/profile/route.ts` | — (stateful) | `handlers.ts` |
| `/v1/user/settings` | GET | `app/api/mock/v1/user/settings/route.ts` | `createUserSettings` | `handlers.ts` |
| `/v1/user/settings` | PATCH | `app/api/mock/v1/user/settings/route.ts` | — (stateful) | `handlers.ts` |

### 16.7 Seeded Randomization

Для стабильных screenshots и visual regression тестов, фабрики поддерживают seed:

```typescript
// Deterministic data for Storybook / Playwright visual tests
import { faker } from '@faker-js/faker';

faker.seed(42); // Same data every time
const overview = createOverviewResponse();
```

Для dev-режима seed не фиксируется — данные меняются при каждом запросе, что помогает находить баги с edge cases.

### 16.8 Query Parameter Support

Route Handlers поддерживают те же query params, что и реальный API (§3 PRD):

| Parameter | Mock Behavior |
|-----------|--------------|
| `time_range` | Передаётся в `meta.time_range`. Данные генерируются без реальной привязки к периоду |
| `team_id[]` | Парсится, фильтрация имитируется (уменьшается количество записей) |
| `granularity` | Влияет на количество точек в time series (`hourly` → 24, `daily` → 30, `weekly` → 12) |
| `cursor` / `limit` | Cursor-based пагинация: генерируется `next_cursor` если `limit < total` |
| `format=csv` | Возвращает CSV с заголовком `Content-Type: text/csv` |
| `_delay` | **Mock-only**: искусственная задержка в ms для тестирования loading states |
| `_error` | **Mock-only**: возвращает указанный HTTP status code для тестирования error states |

```typescript
// Пример: error simulation
// GET /api/mock/v1/analytics/overview?_error=500
const errorCode = searchParams.get('_error');
if (errorCode) {
  return NextResponse.json(
    { error: { code: 'SIMULATED_ERROR', message: `Mock error ${errorCode}` } },
    { status: parseInt(errorCode, 10) },
  );
}
```

### 16.9 MSW ↔ Factory Integration

MSW handlers (§11.2) переиспользуют те же фабрики, обеспечивая единый источник данных для dev и тестов:

```typescript
// src/shared/__mocks__/handlers.ts
import { http, HttpResponse } from 'msw';
import {
  createOverviewResponse,
  createAdoptionResponse,
  createDeliveryResponse,
  createCostResponse,
  createQualityResponse,
  createOperationsResponse,
  createSessionDetail,
  createNotificationList,
  createUserProfile,
  createUserSettings,
} from './factories';

export const handlers = [
  http.get('*/v1/analytics/overview', () =>
    HttpResponse.json(createOverviewResponse()),
  ),
  http.get('*/v1/analytics/adoption', () =>
    HttpResponse.json(createAdoptionResponse()),
  ),
  http.get('*/v1/analytics/delivery', () =>
    HttpResponse.json(createDeliveryResponse()),
  ),
  http.get('*/v1/analytics/cost', () =>
    HttpResponse.json(createCostResponse()),
  ),
  http.get('*/v1/analytics/quality', () =>
    HttpResponse.json(createQualityResponse()),
  ),
  http.get('*/v1/analytics/operations', () =>
    HttpResponse.json(createOperationsResponse()),
  ),
  http.get('*/v1/analytics/sessions/:id', ({ params }) =>
    HttpResponse.json(createSessionDetail(params.id as string)),
  ),
  http.get('*/v1/analytics/notifications', () =>
    HttpResponse.json(createNotificationList()),
  ),
  http.patch('*/v1/analytics/notifications/:id', async ({ params, request }) => {
    const body = await request.json();
    return HttpResponse.json({ data: { id: params.id, ...body } });
  }),
  http.get('*/v1/user/profile', () =>
    HttpResponse.json({ data: createUserProfile() }),
  ),
  http.get('*/v1/user/settings', () =>
    HttpResponse.json({ data: createUserSettings() }),
  ),
];
```

### 16.10 Deployment

Mock API деплоится на Vercel автоматически как часть Next.js проекта:

- **Vercel Serverless Functions**: каждый Route Handler → отдельная serverless function
- **Cold start**: ~100-200ms (acceptable для mock)
- **Не нужен**: отдельный репозиторий, отдельный хостинг, отдельная CI/CD
- **Preview deployments**: mock API доступен на каждом PR preview

```
Production (Vercel):
  ├── Dashboard UI        → Edge/Serverless
  ├── app/api/auth/*      → Serverless Functions
  └── app/api/mock/v1/*   → Serverless Functions (mock API)
```

> **Note**: В production с реальным бэкендом, mock routes остаются задеплоенными, но не используются — `NEXT_PUBLIC_ANALYTICS_API_URL` указывает на реальный API. Для полного исключения mock кода из production build можно использовать `next.config.js` rewrites с условием по env variable.
