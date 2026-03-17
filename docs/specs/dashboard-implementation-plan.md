# Implementation Plan: Dashboard UI

## Context

Cloud Agent Execution Platform — analytics dashboard for monitoring AI agents.
All documentation is complete (PRD, C4 architecture, Technical Spec), no code exists — greenfield project.
Design created in Stitch (project `8562584486654646230`) — 16 screens (8 desktop + 8 mobile).
Goal: from zero to a deployed Vercel app with mock API and a full set of views.

## TDD Approach

The project follows **strict TDD** — tests are written BEFORE implementation at every level:

1. **Phase 2** — build the complete test infrastructure: Zod schemas, Faker factories, MSW handlers, acceptance test matrix. This is the "Testing Spec" (step 10 from the README workflow).
2. **Phases 3-7** — every slice is implemented via the **Red → Green → Refactor** cycle:
   - Step A: write the `.test.ts` file (using infrastructure from Phase 2) → test is **RED**
   - Step B: write the implementation → test is **GREEN**
   - Step C: refactor, test stays GREEN
3. **Phase 8** — Integration & E2E tests: cross-cutting scenarios, visual regression, a11y audit

---

## Stitch Screen Reference

| View | Desktop Screen ID | Mobile Screen ID |
|------|-------------------|-----------------|
| Executive Overview | `eff8012bb5fc43daa7fa8adbbbdae0bf` | `63d0d85d791c4f6ab6c5e853b86fec27` |
| Adoption & Usage | `b5f9b4218e5e437082d6932d82ad91ab` | `025c71e2f4cb4d1eba8a8c3c39e63e0e` |
| Delivery Impact | `1a18f2968c5a4182aa3669678ca4bcc2` | `bfe54cfb52964d73a6a0b7a640016927` |
| Quality & Security | `aef58f74ecaf44159622070cfc315b77` | `9a8233813db34173a272653ffadc8e11` |
| Cost & Budgets | `41320a2a33a341daa062b0e7ebaabaa9` | — |
| Session Deep-Dive | `152d008a920c456b89142b2eccafe343` | `5e880ad201d64583a25488757ba22353` |
| Operations | `4c90c2605b894f4d9cd89eb2e1343d28` | `375935d3b6024582b38dc27d66be779d` |
| Authorization | `25bc3ad49f6c468f91a97d98288f070f` | `149b12dfb9aa4d7694250dec945ea694` |
| Settings | — | `5b6da764cefa4dc3bfdc4536e1967f3b` |

---

## Phase 0: Project Bootstrap (~45 files)

**Goal**: Next.js 14 project compiles, lints, FSD directory structure is created, test runners work.

### Steps
1. `npx create-next-app@14 . --typescript --tailwind --eslint --app --src-dir`
2. `npx shadcn@latest init` (style: default, baseColor: slate, cssVariables: yes)
3. `npx shadcn@latest add button card table skeleton input select badge tooltip dialog`
4. Install production dependencies: `mobx`, `mobx-react-lite`, `@tanstack/react-query`, `recharts`, `zod`, `next-intl`, `jose`, `lucide-react`, `react-diff-view`, `shiki`, `class-variance-authority`, `clsx`, `tailwind-merge`
5. Install dev dependencies: `@storybook/nextjs`, `jest`, `@testing-library/react`, `@testing-library/jest-dom`, `playwright`, `@playwright/test`, `msw`, `@faker-js/faker`, `jest-axe`, `eslint-plugin-boundaries`, `openapi-typescript`, `@next/bundle-analyzer`, `ts-jest`, `jest-environment-jsdom`
6. Create FSD directory structure (`src/{shared,entities,features,widgets,pages,app}` with slices and segments)
7. Configure `tsconfig.json` — path aliases (`@shared/*`, `@entities/*`, `@features/*`, `@widgets/*`, `@pages/*`, `@app/*`)
8. Configure `.eslintrc.json` — `eslint-plugin-boundaries` with FSD rules (spec 1.4)
9. Configure `tailwind.config.ts` — `darkMode: 'class'`, content paths
10. Configure `jest.config.ts` — moduleNameMapper for path aliases, setupFilesAfterSetup
11. Configure `playwright.config.ts` — baseURL, projects (chromium, firefox, webkit)
12. Create `.env.development`, `.env.example`, `.env.test`

### Verification
- `pnpm dev` starts without errors
- `pnpm lint` passes
- `pnpm build` succeeds
- `pnpm test` — runs (0 tests, pass)
- `pnpm exec playwright test` — runs (0 tests, pass)
- FSD boundary rules work (import entities → features = ESLint error)

---

## Phase 1: Shared Layer — `src/shared/` (~55 files)

**Goal**: Infrastructure that all upper layers depend on. TDD for every module.

### 1.1 Design System (`shared/ui/theme/`)
- `tokens.css` — CSS custom properties (HSL), light/dark
- `tailwind-preset.ts` — design tokens
- Move Shadcn components to `src/shared/ui/`

### 1.2 Utilities (`shared/lib/`) — TDD
| Step | File | Description |
|------|------|-------------|
| RED | `utils.test.ts` | Tests for `cn()`: merge conflicting classes, conditional classes |
| GREEN | `utils.ts` | Implementation of `cn()` (clsx + tailwind-merge) |
| RED | `formatters.test.ts` | Tests: 0, negative, large numbers, sub-second, multi-minute, currency formatting |
| GREEN | `formatters.ts` | `formatNumber`, `formatCurrency`, `formatDuration`, `formatCompactNumber` |
| — | `hooks/useMediaQuery.ts` | Hook with no business logic |
| — | `i18n.ts` | next-intl setup (EN) |

### 1.3 Observability (`shared/lib/analytics/`)
- `interfaces.ts` — `IErrorTracker`, `IAnalytics`, `ILogger`
- `stubs.ts` — console implementations
- `provider.tsx` — React context (DI)
- `events.ts` — `AnalyticsEvent` taxonomy

### 1.4 Config (`shared/config/`) — TDD
| Step | File | Description |
|------|------|-------------|
| RED | `env.test.ts` | Tests: missing vars → throw, invalid URL → throw, valid → parse |
| GREEN | `env.ts` | Zod-validated env vars (spec 1.5) |
| — | `routes.ts` | Route constants (no logic) |
| — | `permissions.ts` | RBAC map (no logic) |

### 1.5 API Client (`shared/api/`) — TDD
| Step | File | Description |
|------|------|-------------|
| RED | `client.test.ts` | 5 tests: happy path, 401 redirect, 4xx error, 5xx error, Zod validation fail. Uses MSW. |
| GREEN | `client.ts` | `apiFetch` + `ApiError` (spec 3.2) |
| RED | `query-keys.test.ts` | Tests: key determinism, filter serialization order |
| GREEN | `query-keys.ts` | Query key factory (spec 3.3) |
| — | `query-client.ts` | TanStack QueryClient defaults |

### 1.6 UI Store (`shared/model/`) — TDD
| Step | File | Description |
|------|------|-------------|
| RED | `UIStore.test.ts` | Tests: toggleSidebar, mobile sync, localStorage persistence |
| GREEN | `UIStore.ts` | MobX store (spec 4.4) |

### Verification — Coverage Gate
- `pnpm test -- --coverage --collectCoverageFrom='src/shared/**'`
- **Target: 80% coverage** shared layer
- All tests GREEN
- ESLint: shared/ imports nothing from upper layers

---

## Phase 2: Test Infrastructure — "Testing Spec" (~50 files)

**Goal**: Complete test infrastructure BEFORE any business code. This is the "Testing Spec" (step 10 from workflow). After this phase we have everything for TDD: schemas, factories, handlers, acceptance matrix.

### 2.1 Zod Schemas for ALL API Responses (~10 files)

All schemas are written upfront — they define the contract between mock API and UI:

| File | Schemas | Test File |
|------|---------|-----------|
| `entities/session/model/types.ts` | Session, SessionStep, ThinkStep, ActStep, ObserveStep, DiffFile | `types.test.ts` |
| `entities/metric/model/types.ts` | KPIValue, ChartDataPoint, DeltaValue | `types.test.ts` |
| `entities/notification/model/types.ts` | Notification, NotificationType | `types.test.ts` |
| `entities/team/model/types.ts` | Team | `types.test.ts` |
| `entities/user/model/types.ts` | UserProfile, UserSettings | `types.test.ts` |
| `pages/executive-overview/api/schemas.ts` | OverviewResponse | `schemas.test.ts` |
| `pages/adoption/api/schemas.ts` | AdoptionResponse | `schemas.test.ts` |
| `pages/delivery/api/schemas.ts` | DeliveryResponse | `schemas.test.ts` |
| `pages/cost/api/schemas.ts` | CostResponse | `schemas.test.ts` |
| `pages/quality/api/schemas.ts` | QualityResponse | `schemas.test.ts` |
| `pages/operations/api/schemas.ts` | OperationsResponse | `schemas.test.ts` |

Each `schemas.test.ts` tests: valid data passes, missing required fields fail, edge cases (empty arrays, null values, boundary numbers).

### 2.2 Faker.js Factories (~12 files)

| Factory | File | Test |
|---------|------|------|
| Overview | `shared/__mocks__/factories/overview.factory.ts` | `overview.factory.test.ts` |
| Adoption | `shared/__mocks__/factories/adoption.factory.ts` | `adoption.factory.test.ts` |
| Delivery | `shared/__mocks__/factories/delivery.factory.ts` | `delivery.factory.test.ts` |
| Cost | `shared/__mocks__/factories/cost.factory.ts` | `cost.factory.test.ts` |
| Quality | `shared/__mocks__/factories/quality.factory.ts` | `quality.factory.test.ts` |
| Operations | `shared/__mocks__/factories/operations.factory.ts` | `operations.factory.test.ts` |
| Session | `shared/__mocks__/factories/session.factory.ts` | `session.factory.test.ts` |
| Notification | `shared/__mocks__/factories/notification.factory.ts` | `notification.factory.test.ts` |
| User | `shared/__mocks__/factories/user.factory.ts` | `user.factory.test.ts` |
| Index | `shared/__mocks__/factories/index.ts` | — |

**Critical test**: each `factory.test.ts` generates data and runs it through the corresponding Zod schema from 2.1. This guarantees that factories and schemas stay in sync.

### 2.3 MSW Handlers (~3 files)

- `shared/__mocks__/handlers.ts` — MSW request handlers for all 13 endpoints
- `shared/__mocks__/setup.ts` — Jest MSW server setup (`setupServer`, `beforeAll`, `afterEach`, `afterAll`)
- `shared/__mocks__/handlers.test.ts` — test: each handler is called and returns a Zod-valid response

### 2.4 Mock API Route Handlers (~15 files)

Next.js Route Handlers (`app/api/mock/v1/`):
| Route Handler | Method(s) | Test |
|---------------|-----------|------|
| `analytics/overview/route.ts` | GET | `overview.route.test.ts` |
| `analytics/adoption/route.ts` | GET | `adoption.route.test.ts` |
| `analytics/delivery/route.ts` | GET | — (pattern identical) |
| `analytics/cost/route.ts` | GET | — |
| `analytics/quality/route.ts` | GET | — |
| `analytics/operations/route.ts` | GET | — |
| `analytics/sessions/[id]/route.ts` | GET | `session.route.test.ts` |
| `analytics/notifications/route.ts` | GET | — |
| `analytics/notifications/[id]/route.ts` | PATCH | `notification-patch.route.test.ts` |
| `user/profile/route.ts` | GET, PATCH | `profile.route.test.ts` |
| `user/settings/route.ts` | GET, PATCH | `settings.route.test.ts` |

Tests cover patterns (not every endpoint): `_delay` param, `_error` param, query param parsing, PATCH state persistence.

### 2.5 Auth Mock Routes (~4 files)

| Route | File | Behavior |
|-------|------|----------|
| Callback | `app/api/auth/callback/route.ts` | Set fake JWT cookie → redirect `/dashboard` |
| Logout | `app/api/auth/logout/route.ts` | Clear cookie → redirect `/` |
| Refresh | `app/api/auth/refresh/route.ts` | Renew JWT |
| Me | `app/api/auth/me/route.ts` | Return mock user (configurable role) |

### 2.6 Acceptance Test Matrix (~1 file)

Create `e2e/acceptance-matrix.md` — mapping of 50+ acceptance criteria (from technical spec section 11) to specific test files:

| ID | Criteria | Test Type | Test File |
|----|----------|-----------|-----------|
| OV-1 | KPI cards display 5 metrics | Unit | `executive-overview/ui/ExecutiveOverviewPage.test.tsx` |
| OV-2 | Delta indicators show % | Unit | `metric/ui/DeltaIndicator.test.tsx` |
| OV-5 | 7d/30d/90d switching | E2E | `e2e/executive-overview.spec.ts` |
| AD-1 | Task funnel with rates | Unit | `adoption/ui/AdoptionPage.test.tsx` |
| AD-3 | Session drill-down | E2E | `e2e/adoption.spec.ts` |
| CC-2 | Back/forward with filters | E2E | `e2e/navigation.spec.ts` |
| CC-7 | Mobile sidebar collapse | E2E | `e2e/responsive.spec.ts` |
| ... | ... | ... | ... |

### Verification — Test Infrastructure Gate
- `pnpm test` — ALL schema tests GREEN, ALL factory tests GREEN, ALL MSW handler tests GREEN
- `curl /api/mock/v1/analytics/overview` → valid JSON
- `?_delay=2000` → 2s delay, `?_error=500` → HTTP 500
- Acceptance matrix covers all acceptance criteria from spec
- **Infrastructure is now ready — all subsequent phases write tests FIRST, using this infrastructure**

---

## Phase 3: Entities Layer — `src/entities/` (~30 files)

**Goal**: Business entities — stores, hooks, UI. Strict TDD: test → implementation.

> Zod schemas are already written in Phase 2.1. This phase covers only stores, hooks, and UI components.

### 3.1 MobX Stores — TDD

**NotificationStore:**
| Step | File | Description |
|------|------|-------------|
| RED | `notification/model/NotificationStore.test.ts` | Tests: `unreadCount`, `setNotifications`, `markRead`, `dismiss` |
| GREEN | `notification/model/NotificationStore.ts` | Implementation (spec 4.6) |

**UserSettingsStore:**
| Step | File | Description |
|------|------|-------------|
| RED | `user/model/UserSettingsStore.test.ts` | Tests: theme, timezone, defaults, persistence |
| GREEN | `user/model/UserSettingsStore.ts` | Implementation (spec 4.6) |

### 3.2 API Hooks — TDD (with MSW from Phase 2)

For each hook: test FIRST, using MSW handlers from Phase 2.

| Step | File | What is tested |
|------|------|----------------|
| RED | `session/api/useSession.test.ts` | Fetch, Zod parse, staleTime: 10min, error handling |
| GREEN | `session/api/useSession.ts` | Implementation |
| RED | `notification/api/useNotifications.test.ts` | Fetch, refetchInterval: 60s, Zod parse |
| GREEN | `notification/api/useNotifications.ts` | Implementation |
| RED | `notification/api/useMarkNotification.test.ts` | PATCH mutation, optimistic update |
| GREEN | `notification/api/useMarkNotification.ts` | Implementation |
| RED | `user/api/useProfile.test.ts` | Fetch, Zod parse |
| GREEN | `user/api/useProfile.ts` | Implementation |
| RED | `user/api/useSettings.test.ts` | Fetch + PATCH mutation |
| GREEN | `user/api/useSettings.ts` + `useUpdateSettings.ts` | Implementation |

### 3.3 Entity UI Components — TDD + jest-axe

| Step | File | What is tested |
|------|------|----------------|
| RED | `metric/ui/KPICard.test.tsx` | Render label/value/delta, loading skeleton, jest-axe pass, `role="status"` |
| GREEN | `metric/ui/KPICard.tsx` | Implementation (spec 7.3) |
| RED | `metric/ui/DeltaIndicator.test.tsx` | Up/down arrows, color, `aria-label` |
| GREEN | `metric/ui/DeltaIndicator.tsx` | Implementation |
| RED | `metric/ui/ChartContainer.test.tsx` | Loading/error/empty states, hidden `<table>` for a11y |
| GREEN | `metric/ui/ChartContainer.tsx` | Implementation |
| RED | `notification/ui/NotificationItem.test.tsx` | Type icon, message, timestamp |
| GREEN | `notification/ui/NotificationItem.tsx` | Implementation |

### Verification — Coverage Gate
- `pnpm test -- --coverage --collectCoverageFrom='src/entities/**'`
- **Target: 80% coverage** entities
- All entity Zod schemas validate factory outputs
- All jest-axe checks pass

---

## Phase 4: Features Layer — `src/features/` (~30 files)

**Goal**: User-facing capabilities. Strict TDD.

### 4.1 Auth (`features/auth/`) — TDD
| Step | File | Description |
|------|------|-------------|
| RED | `model/AuthStore.test.ts` | `setAuth`, `isAuthenticated`, `hasPermission(role, route)`, logout |
| GREEN | `model/AuthStore.ts` | Implementation (spec 4.5) |
| RED | `ui/AuthGuard.test.tsx` | Renders children when authorized, fallback when forbidden, nothing when loading |
| GREEN | `ui/AuthGuard.tsx` | Implementation (spec 5.4) |

### 4.2 Theme Switching (`features/theme-switching/`) — TDD
| Step | File | Description |
|------|------|-------------|
| RED | `ui/ThemeProvider.test.tsx` | System preference detection, localStorage persistence, class toggle |
| GREEN | `ui/ThemeProvider.tsx` | Implementation (spec 7.4) |
| RED | `ui/ThemeToggle.test.tsx` | Click cycles light→dark→system, aria-label |
| GREEN | `ui/ThemeToggle.tsx` | Implementation |

### 4.3 Filter Management (`features/filter-management/`) — TDD
| Step | File | Description |
|------|------|-------------|
| RED | `model/FilterStore.test.ts` | `setFilter`, `resetFilters`, `serialized`, `hasActiveFilters`, immutability |
| GREEN | `model/FilterStore.ts` | Implementation (spec 4.3) |
| RED | `lib/URLSyncProvider.test.tsx` | URL→store on mount, store→URL on change, popstate handling |
| GREEN | `lib/URLSyncProvider.tsx` | Implementation (spec 4.7) |
| RED | `ui/DateRangePicker.test.tsx` | Preset selection (7d/30d/90d), custom range, default per view |
| GREEN | `ui/DateRangePicker.tsx` | Implementation |
| RED | `ui/FilterBar.test.tsx` | Filter chip rendering, removal, AND composition |
| GREEN | `ui/FilterBar.tsx` | Implementation |
| RED | `ui/PeriodComparisonToggle.test.tsx` | Toggle state, UI feedback |
| GREEN | `ui/PeriodComparisonToggle.tsx` | Implementation |

### 4.4 Export (`features/export-data/`) — TDD
| Step | File | Description |
|------|------|-------------|
| RED | `ui/ExportButton.test.tsx` | Dropdown opens, CSV/NDJSON options, disabled during export |
| GREEN | `ui/ExportButton.tsx` | Implementation |

### Verification — Coverage Gate
- **Target: 80% coverage** features
- FilterStore ↔ URL sync bidirectional
- AuthGuard blocks/allows based on roles
- Theme persists across reloads

---

## Phase 5: Widgets Layer — `src/widgets/` (~45 files)

**Goal**: Composite UI blocks. TDD + integration tests with MSW.

### For each widget: test FIRST

| Widget | Test File (RED) | Implementation (GREEN) | What is tested |
|--------|-----------------|----------------------|----------------|
| app-shell | `AppShell.test.tsx` | `AppShell.tsx` | Sidebar + header + content, landmarks (`<nav>`, `<main>`, `<aside>`), mobile collapse |
| sidebar-nav | `SidebarNav.test.tsx` | `SidebarNav.tsx` | 6 links + Settings, active highlight, mobile hamburger, jest-axe |
| breadcrumbs | `Breadcrumbs.test.tsx` | `Breadcrumbs.tsx` | Auto from pathname, clickable links |
| notification-center | `NotificationCenter.test.tsx` | `NotificationCenter.tsx` | Bell, unread badge, dropdown, mark read (MSW) |
| user-menu | `UserMenu.test.tsx` | `UserMenu.tsx` | Avatar dropdown, profile info, logout |
| empty-state | `EmptyState.test.tsx` | `EmptyState.tsx` + `MobileUnavailable.tsx` | Onboarding variant, no-data variant |
| data-table | `DataTable.test.tsx` | `DataTable.tsx` | Cursor pagination, sortable columns, row click navigation |
| session-timeline | `SessionTimeline.test.tsx` | `SessionTimeline.tsx` + `StepDetailPanel.tsx` | Vertical timeline, step cards, collapse/expand, type coloring |
| diff-viewer | `DiffViewer.test.tsx` | `DiffViewer.tsx` | Split/unified diff, syntax highlighting |
| cost-breakdown | `CostBreakdown.test.tsx` | `CostBreakdown.tsx` | Horizontal bar chart, per-step cost, total KPI |

### Verification — Coverage Gate
- **Target: 60% coverage** widgets
- Integration tests with MSW
- AppShell renders all sub-widgets
- jest-axe pass for all widgets

---

## Phase 6: Application Layer — `src/app/` + `app/` (~20 files)

**Goal**: Providers, middleware, layout. TDD for middleware.

### TDD
| Step | File | Description |
|------|------|-------------|
| RED | `src/app/stores.test.ts` | RootStore creation, context provider, all stores composed |
| GREEN | `src/app/stores.ts` | Compose FilterStore + UIStore + AuthStore + NotificationStore + UserSettingsStore |
| RED | `src/app/middleware.test.ts` | No token → redirect, invalid → logout, valid → check permissions, proactive refresh |
| GREEN | `src/app/middleware.ts` | JWT validation (edge) (spec 5.1) |

### Without TDD (layout/config)
- `src/app/providers.tsx` — Provider nesting: Analytics > Error > I18n > Theme > QueryClient > MobX > URLSync > AuthGuard > AppShell
- `app/middleware.ts` — re-export with matcher `/dashboard/:path*`
- `app/dashboard/layout.tsx` — Server Component, metadata, `<Providers>`
- `app/dashboard/loading.tsx` — Dashboard skeleton
- `app/dashboard/error.tsx` — Error boundary + IErrorTracker

### Verification
- Provider tree mounts without errors
- Middleware tests GREEN
- Middleware blocks unauthorized routes

---

## Phase 7: Pages Layer — View-by-View (~100 files)

**Goal**: All 8 views following strict TDD workflow.

### TDD Workflow for EVERY View (no exceptions)

```
Step 1: Get Stitch screen (desktop + mobile) via get_screen → visual reference
Step 2: Response Zod schema is already ready (Phase 2.1)
Step 3: Factory is already ready (Phase 2.2)
Step 4: MSW handler is already ready (Phase 2.3)

Step 5: RED — Write hook test (pages/{view}/api/use{View}.test.ts)
  - Test: data fetching, filter changes → refetch, error handling, Zod parse
  - Use MSW handlers from Phase 2

Step 6: GREEN — Implement hook (pages/{view}/api/use{View}.ts)
  - useQuery + queryKeys + Zod schema

Step 7: RED — Write page component test (pages/{view}/ui/{View}Page.test.tsx)
  - Test ALL acceptance criteria for this view (from matrix in Phase 2.6)
  - Include jest-axe check
  - Use MSW for data

Step 8: GREEN — Implement page component (pages/{view}/ui/{View}Page.tsx)
  - Reference: Stitch screen HTML

Step 9: Thin route wrapper (app/dashboard/{view}/page.tsx)

Step 10: Refactor — extract reusable parts to lower layers if needed
```

### Parallel Tracks
- **Track A**: Executive Overview → Adoption → Delivery
- **Track B**: Cost → Quality → Operations
- **Track C**: Session Deep-Dive → Settings

### 7.1 Executive Overview (`/dashboard`)
- **Stitch**: `eff8012bb5fc43daa7fa8adbbbdae0bf` (desktop) + `63d0d85d791c4f6ab6c5e853b86fec27` (mobile)
- **RED** tests cover: OV-1 (KPI cards), OV-2 (delta indicators), OV-4 (sparklines), OV-6 (no individual breakdowns)
- **GREEN**: 6 KPICards, AreaChart, FilterBar + DateRangePicker + ExportButton
- Mobile: KPI tiles + sparklines only
- ~12 files (schema, hook test, hook, page test, page, route wrapper)

### 7.2 Adoption & Usage (`/dashboard/adoption` + `/[teamId]`)
- **Stitch**: `b5f9b4218e5e437082d6932d82ad91ab` + `025c71e2f4cb4d1eba8a8c3c39e63e0e`
- **RED** tests cover: AD-1 (task funnel), AD-2 (filters), AD-3 (drill-down), AD-6 (empty state)
- **GREEN**: Line (DAU/WAU/MAU), Funnel, Pie (types), Bar (team), DataTable → Session drill-down
- ~14 files

### 7.3 Delivery Impact (`/dashboard/delivery` + `/[teamId]`)
- **Stitch**: `1a18f2968c5a4182aa3669678ca4bcc2` + `bfe54cfb52964d73a6a0b7a640016927`
- **RED** tests cover: DL-1 through DL-5, mobile shows `MobileUnavailable`
- **GREEN**: Grouped bar (agent vs non-agent), Line (TTM), period comparison
- ~14 files

### 7.4 Cost & Budgets (`/dashboard/cost` + `/[teamId]`)
- **Stitch**: `41320a2a33a341daa062b0e7ebaabaa9`
- **RED** tests cover: CO-1 through CO-5 (budget KPI, spend breakdown, forecast)
- **GREEN**: Stacked bar, Area (forecast + confidence), KPI cards
- Mobile: alert cards only
- ~14 files

### 7.5 Quality & Security (`/dashboard/quality`)
- **Stitch**: `aef58f74ecaf44159622070cfc315b77` + `9a8233813db34173a272653ffadc8e11`
- **RED** tests cover: QA-1 through QA-4 (CI pass rate, violations table)
- **GREEN**: Bar, Pie, violations DataTable
- ~10 files

### 7.6 Operations (`/dashboard/operations`)
- **Stitch**: `4c90c2605b894f4d9cd89eb2e1343d28` + `375935d3b6024582b38dc27d66be779d`
- **RED** tests cover: OP-1 through OP-5, **OP-4: refetchInterval: 60_000 explicitly tested**
- **GREEN**: Area (queue depth), Bar (failures), KPI (SLA%)
- ~10 files

### 7.7 Session Deep-Dive (`/dashboard/sessions/[sessionId]`)
- **Stitch**: `152d008a920c456b89142b2eccafe343` + `5e880ad201d64583a25488757ba22353`
- **RED** tests cover: SD-1 through SD-7 (timeline, step detail, diff, cost, deep linking)
- **GREEN**: Compose widgets SessionTimeline + CostBreakdown
- Mobile: `MobileUnavailable`
- ~10 files

### 7.8 Settings (`/dashboard/settings`)
- **Stitch**: `5b6da764cefa4dc3bfdc4536e1967f3b`
- **RED** tests cover: ST-1 through ST-5 (profile read-only, theme, timezone, digest)
- **GREEN**: Single-column form
- ~10 files

### Verification — Coverage Gate per View
- Every view: all acceptance criteria from matrix covered by unit tests
- **Target: 60% coverage** pages layer
- jest-axe pass for every page

---

## Phase 8: Integration & E2E Testing (~25 files)

**Goal**: Cross-cutting E2E tests, visual regression, accessibility audit. This is the final test layer on top of unit/integration tests from previous phases.

### 8.1 E2E Tests (Playwright)

| Test File | Acceptance Criteria | Scenarios |
|-----------|-------------------|-----------|
| `e2e/executive-overview.spec.ts` | OV-5 | Navigate, verify KPIs, switch 7d/30d/90d |
| `e2e/adoption.spec.ts` | AD-2, AD-3 | Filter by team, drill-down to Session |
| `e2e/delivery.spec.ts` | DL-4 | Period comparison, drill-down |
| `e2e/cost.spec.ts` | CO-3 | Budget alerts, forecast display |
| `e2e/quality.spec.ts` | QA-2 | Violations table filter |
| `e2e/operations.spec.ts` | OP-4 | Verify 60s polling |
| `e2e/session-deep-dive.spec.ts` | SD-7 | Deep linking `?step=N` |
| `e2e/settings.spec.ts` | ST-1, ST-3 | Theme persistence, timezone |
| `e2e/navigation.spec.ts` | CC-2 | Sidebar nav, back/forward + filters |
| `e2e/export.spec.ts` | CC-4 | CSV download with current filters |
| `e2e/responsive.spec.ts` | CC-7, CC-8 | Mobile sidebar, unavailable views |
| `e2e/auth.spec.ts` | CC-1 | Unauthorized redirect, RBAC route blocking |

### 8.2 Visual Regression (Playwright)

- `e2e/visual/` — screenshot tests with `faker.seed(42)` for deterministic data
- Matrix: (Executive Overview, Sidebar, Session Deep-Dive, Empty state, Error state) × (light, dark) × (desktop 1280×720, mobile 375×812)
- ~5 spec files

### 8.3 Accessibility Audit (Playwright + jest-axe)

- `e2e/a11y.spec.ts` — Playwright axe audit on every route
- Verify keyboard navigation: Tab order sidebar → header → content
- Verify focus management: modals trap focus
- Verify `prefers-reduced-motion` disables animations
- Verify charts have hidden `<table>` fallback
- Verify `aria-live="polite"` on notification badge

### 8.4 Responsive Verification (against Stitch mobile screens)

| View | Mobile Stitch | Expected |
|------|--------------|----------|
| Executive Overview | `63d0d85d791c4f6ab6c5e853b86fec27` | KPI tiles 1-col |
| Adoption | `025c71e2f4cb4d1eba8a8c3c39e63e0e` | DAU/WAU/MAU partial |
| Delivery | `bfe54cfb52964d73a6a0b7a640016927` | "Open on desktop" |
| Quality | `9a8233813db34173a272653ffadc8e11` | Alerts only |
| Operations | `375935d3b6024582b38dc27d66be779d` | Triage view |
| Session Deep-Dive | `5e880ad201d64583a25488757ba22353` | "Open on desktop" |
| Settings | `5b6da764cefa4dc3bfdc4536e1967f3b` | Full form |

### Verification — E2E Gate
- `pnpm exec playwright test` — all E2E GREEN
- Visual regression baselines captured
- a11y audit: 0 violations
- Responsive: all mobile views match Stitch design

---

## Phase 9: Performance Optimization (~5 files)

- `dynamic()` imports for SessionTimeline, DiffViewer, Recharts
- `next/font` with `display: 'swap'`, `next/image` for avatars
- Tree-shaken Lucide imports
- `react-window` for DataTable > 50 rows
- Bundle analysis: **target < 250KB gzip**
- Lighthouse: LCP < 2.5s, INP < 200ms, CLS < 0.1

---

## Phase 10: Build & Deploy (~10 files)

- Vercel project setup + environment variables
- CI pipeline (`.github/workflows/ci.yml`):
  ```
  lint → typecheck → test (coverage gate) → build (bundle gate) → E2E → deploy
  ```
- Coverage gates: 80% shared/entities, 60% widgets/pages
- Bundle gate: warn if > 250KB
- `.env.production` with mock API URLs
- Preview deploys on PR branches

---

## Dependency Graph

```
Phase 0 (Bootstrap)
    ↓
Phase 1 (Shared Layer — TDD per module)
    ↓
Phase 2 (Test Infrastructure — schemas, factories, MSW, acceptance matrix)
    ↓
Phase 3 (Entities — TDD: test → implement per slice)
    ↓
Phase 4 (Features — TDD: test → implement per slice)
    ↓
Phase 5 (Widgets — TDD: test → implement per widget)
    ↓
Phase 6 (App Layer — TDD for middleware)
    ↓
Phase 7 (Pages — TDD per view, 3 parallel tracks)
    ↓
Phase 8 (Integration & E2E Testing — cross-cutting, visual, a11y)
    ↓
Phase 9 (Performance) + Phase 10 (Deploy) — parallel
```

## Summary

| Phase | Description | ~Files | Test Files |
|-------|-------------|--------|------------|
| 0 | Project Bootstrap | 45 | 0 |
| 1 | Shared Layer (TDD) | 55 | ~12 |
| 2 | **Test Infrastructure** | 50 | ~30 |
| 3 | Entities (TDD) | 30 | ~14 |
| 4 | Features (TDD) | 30 | ~12 |
| 5 | Widgets (TDD) | 45 | ~10 |
| 6 | App Layer (TDD) | 20 | ~4 |
| 7 | Pages (TDD per view) | 100 | ~16 |
| 8 | **Integration & E2E** | 25 | ~25 |
| 9 | Performance | 5 | 0 |
| 10 | Deploy | 10 | 0 |
| **Total** | | **~415** | **~123** |

**~30% of all files are tests.** Test infrastructure is created in Phase 2 BEFORE any business code. Every subsequent layer follows strict TDD (RED → GREEN → REFACTOR).

## Critical Files
- `docs/specs/dashboard-technical-spec.md` — primary source: code, stores, hooks, types (section 11 = testing strategy)
- `docs/architecture/c4-component-dashboard-ui.md` — FSD layer structure, data flow
- `docs/prd/dashboard-prd.md` — API contract, RBAC matrix, acceptance criteria
- `docs/architecture/c4-container.md` — system-level context
- Stitch project `8562584486654646230` — design for all screens (HTML + screenshots)
