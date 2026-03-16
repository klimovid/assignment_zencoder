# C4 Model — Level 3: Component Diagram — Dashboard UI

Decomposition of the **Dashboard UI** container from the [Container Diagram](c4-container.md) (container 14) into internal components.

> **Level**: C4 Component (Level 3) — zoom into Dashboard UI
> **Parent**: [C4 Container Diagram](c4-container.md)
> **PRD**: [dashboard-prd.md](../prd/dashboard-prd.md)

---

## Component Diagram

```mermaid
C4Component
    title Component Diagram — Dashboard UI

    Container_Ext(analyticsApi, "Analytics API", "Go, REST", "Dashboard queries, privacy enforcement, export")
    Container_Ext(identityService, "Identity & Access Service", "WorkOS/Auth0 + OPA/Cedar", "SSO, RBAC/ABAC, JWT")

    Container_Boundary(dashboardUI, "Dashboard UI (React / Next.js App Router)") {

        Component_Boundary(infra, "Infrastructure / Providers") {
            Component(middleware, "Auth Middleware", "Next.js Middleware", "Edge: JWT validation, role-based route protection")
            Component(posthog, "PostHogProvider", "React Context", "Product analytics: page views, interactions, funnels")
            Component(sentry, "SentryProvider", "React Context", "Error tracking, Web Vitals, session replay on error")
            Component(i18n, "I18nProvider", "next-intl", "EN translations, locale loading")
            Component(theme, "ThemeProvider", "React Context", "Dark/light mode, system preference detection")
            Component(queryClient, "QueryClientProvider", "TanStack Query", "Cache config, staleTime, gcTime, retries")
        }

        Component_Boundary(state, "State Management (MobX)") {
            Component(filterStore, "FilterStore", "MobX", "Filters: team[], repo[], model, task_type, date range, comparison toggle")
            Component(uiStore, "UIStore", "MobX", "Sidebar collapsed, mobile breakpoint")
            Component(settingsStore, "UserSettingsStore", "MobX", "Theme, timezone, default view, digest prefs")
            Component(authStore, "AuthStore", "MobX", "User, role, org_id, permissions (from JWT)")
            Component(notifStore, "NotificationStore", "MobX", "Unread count, notification list, mark-read/dismiss")
        }

        Component_Boundary(dataLayer, "Data Layer") {
            Component(apiClient, "API Client", "openapi-typescript", "Auto-generated types, fetch wrapper, JWT injection")
            Component(zodSchemas, "Zod Schemas", "Zod", "Runtime response validation, contract drift detection")
            Component(queryHooks, "Query Hooks", "TanStack Query", "useOverview, useAdoption, useDelivery, useCost, useQuality, useOperations (60s poll), useSession, useNotifications (60s poll)")
            Component(queryKeys, "Query Key Factory", "TypeScript", "Centralized key generation: queryKeys.{view}(filters)")
            Component(urlSync, "URLSyncProvider", "React Context + MobX", "Two-way sync: FilterStore <-> URL query params")
            Component(msw, "MSW Handlers", "MSW", "Mock API for testing, generated from OpenAPI + JSON fixtures")
        }

        Component_Boundary(designSystem, "Design System (shared @platform/ui)") {
            Component(dsButton, "Button", "React", "Primary, secondary, ghost, icon variants")
            Component(dsCard, "Card", "React", "Container with header, body, footer")
            Component(dsTable, "Table", "React", "Sortable, row selection")
            Component(dsSkeleton, "Skeleton", "React", "Loading placeholders: line, rect, circle")
            Component(dsFormControls, "Input / Select / DatePicker", "React", "Form controls with Tailwind styling")
            Component(dsModal, "Modal / Dialog", "React", "Confirmation, detail panels")
            Component(dsTooltip, "Tooltip / Badge / Icon", "React", "Hover tooltips, status badges, Lucide icons")
        }

        Component_Boundary(dashComponents, "Dashboard Components") {
            Component(appShell, "AppShell", "React", "Root layout: sidebar + header + content area")
            Component(sidebarNav, "SidebarNav", "React", "7 views + Settings; active route; collapsible on mobile")
            Component(breadcrumbs, "Breadcrumbs", "React", "Auto from route: Dashboard > View > Team > Session")
            Component(dateRangePicker, "DateRangePicker", "React", "Presets 7d/30d/90d/custom, dual calendar, per-view defaults")
            Component(filterBar, "FilterBar", "React", "Global filters as chips; synced with FilterStore")
            Component(periodToggle, "PeriodComparisonToggle", "React", "Compare to previous period; delta overlays")
            Component(kpiCard, "KPICard", "React", "Value + sparkline + delta, skeleton state")
            Component(chartContainer, "ChartContainer", "React + Recharts", "Wrapper: loading/error/empty states, ARIA, data table fallback")
            Component(dataTable, "DataTable", "React", "Cursor pagination, sortable, row click drill-down")
            Component(exportBtn, "ExportButton", "React", "CSV/NDJSON, respects filters + date range")
            Component(notifCenter, "NotificationCenter", "React", "Bell + badge + dropdown; mark read / dismiss")
            Component(emptyState, "EmptyState", "React", "Onboarding guide or no-data-for-filters")
            Component(userMenu, "UserMenu", "React", "Avatar dropdown: profile info, settings link, IdP link, logout")
            Component(authGuard, "AuthGuard", "React", "Client-side RBAC: hide/show per role")
        }

        Component_Boundary(sessionComponents, "Session Deep-Dive Components") {
            Component(timeline, "SessionTimeline", "React", "Vertical Think/Act/Observe steps; duration, cost, status")
            Component(stepPanel, "StepDetailPanel", "React", "LLM prompt/response, tool call args/result, file diffs")
            Component(diffViewer, "DiffViewer", "React", "Side-by-side diff, syntax highlighting, file tree")
            Component(costBreakdown, "CostBreakdown", "React + Recharts", "Per-step bar chart (LLM + compute), total KPI")
        }

        Component_Boundary(pages, "Pages (Next.js App Router)") {
            Component(execPage, "Executive Overview", "page.tsx", "/dashboard — KPIs, trends, risk posture")
            Component(adoptPage, "Adoption & Usage", "page.tsx", "/dashboard/adoption — DAU/WAU/MAU, funnel, types")
            Component(delivPage, "Delivery Impact", "page.tsx", "/dashboard/delivery — PRs, TTM, agent vs non-agent")
            Component(costPage, "Cost & Budgets", "page.tsx", "/dashboard/cost — spend, forecast, budget alerts")
            Component(qualPage, "Quality & Security", "page.tsx", "/dashboard/quality — CI, reviews, violations")
            Component(opsPage, "Operations", "page.tsx", "/dashboard/operations — queue, failures, SLA (60s poll)")
            Component(sessionPage, "Session Deep-Dive", "page.tsx", "/dashboard/sessions/[id] — sub-page via drill-down")
            Component(settingsPage, "Settings", "page.tsx", "/dashboard/settings — theme, timezone, digests")
            Component(teamDrilldown, "Team Drill-Down", "page.tsx", "/dashboard/{view}/[teamId] — team-level metrics")
        }
    }

    Rel(middleware, identityService, "Validates JWT, extracts role", "HTTPS")
    Rel(queryHooks, apiClient, "Calls API via typed client")
    Rel(apiClient, analyticsApi, "Dashboard queries + notifications", "HTTPS / REST")
    Rel(queryHooks, zodSchemas, "Validates responses at runtime")
    Rel(queryHooks, queryKeys, "Generates cache keys from filters")
    Rel(filterBar, filterStore, "Reads/writes active filters")
    Rel(urlSync, filterStore, "Two-way sync: URL <-> filters")
    Rel(authGuard, authStore, "Reads role + permissions")
    Rel(notifCenter, notifStore, "Reads notifications, dispatches actions")
    Rel(notifStore, queryHooks, "useNotifications (60s polling)")

    Rel(execPage, queryHooks, "useOverview(filters)")
    Rel(adoptPage, queryHooks, "useAdoption(filters)")
    Rel(delivPage, queryHooks, "useDelivery(filters)")
    Rel(costPage, queryHooks, "useCost(filters)")
    Rel(qualPage, queryHooks, "useQuality(filters)")
    Rel(opsPage, queryHooks, "useOperations(filters) — 60s poll")
    Rel(sessionPage, queryHooks, "useSession(sessionId)")

    Rel(execPage, kpiCard, "Composes KPI cards")
    Rel(execPage, chartContainer, "Composes charts")
    Rel(sessionPage, timeline, "Composes SessionTimeline")
    Rel(sessionPage, stepPanel, "Composes StepDetailPanel")
    Rel(sessionPage, diffViewer, "Composes DiffViewer")
    Rel(sessionPage, costBreakdown, "Composes CostBreakdown")

    Rel(kpiCard, dsCard, "Extends")
    Rel(dataTable, dsTable, "Extends")
    Rel(dateRangePicker, dsFormControls, "Uses DatePicker")

    Rel(appShell, sidebarNav, "Contains sidebar")
    Rel(appShell, notifCenter, "Contains in header")
    Rel(appShell, userMenu, "Contains in header")
    Rel(appShell, breadcrumbs, "Contains in content area")
    Rel(userMenu, authStore, "Reads user profile + role")
```

---

## Group 1: Next.js App Router Structure

### Layout Hierarchy

```
app/dashboard/
├── layout.tsx              → DashboardLayout (Server Component)
│                             Wraps: Providers, AppShell, AuthGuard
├── loading.tsx             → DashboardSkeleton (global fallback)
├── error.tsx               → DashboardErrorBoundary (Sentry-integrated)
├── page.tsx                → Executive Overview (default route)
├── adoption/
│   ├── page.tsx            → Adoption & Usage view
│   └── [teamId]/
│       └── page.tsx        → Team-level drill-down
├── delivery/
│   ├── page.tsx            → Delivery Impact view
│   └── [teamId]/
│       └── page.tsx        → Team-level drill-down
├── cost/
│   ├── page.tsx            → Cost & Budgets view
│   └── [teamId]/
│       └── page.tsx        → Team-level drill-down
├── quality/
│   └── page.tsx            → Quality & Security view
├── operations/
│   └── page.tsx            → Operations view
├── sessions/
│   └── [sessionId]/
│       └── page.tsx        → Session Deep-Dive (sub-page, not in sidebar)
└── settings/
    └── page.tsx            → User Settings (theme, timezone, digests)
```

### Server vs Client Component Boundary

| Layer | Component Type | Rationale |
|-------|---------------|-----------|
| `layout.tsx` | **Server Component** | Static shell, metadata, provider initialization |
| `page.tsx` (each view) | **Server Component** | Route-level metadata, prefetch hints for TanStack Query |
| All interactive UI | **Client Components** (`'use client'`) | Charts, filters, sidebar, stores — require browser APIs and interactivity |
| `middleware.ts` | **Next.js Middleware** | Runs at edge: JWT validation, role-based route protection before render |

### Auth Middleware (`middleware.ts`)

Handles both authentication (is the user logged in?) and authorization (can they access this route?).

**Authentication flow** (no custom login page — redirect to IdP):

```
User visits /dashboard/*
       │
       ▼
middleware.ts (runs at edge)
       │
  JWT cookie present & valid?
       │
  ┌────┴────┐
  No        Yes
  │         │
  ▼         ▼
Redirect    Extract role + org_id
to IdP      from JWT claims
(WorkOS /        │
 Okta /          ▼
 Azure AD)  Check route permissions
  │         (authorization, see table below)
  ▼              │
SSO login   ┌────┴────┐
(SAML/OIDC) Allowed   Denied
  │         │         │
  ▼         ▼         ▼
Callback    Render    Redirect to
route       page      default view
```

**Auth API routes** (Next.js Route Handlers):

| Route | Description |
|-------|-------------|
| `/api/auth/callback` | Receives auth code from IdP, exchanges for JWT, sets `httpOnly` secure cookie, redirects to `/dashboard` |
| `/api/auth/logout` | Clears JWT cookie, redirects to IdP logout endpoint for full session termination |
| `/api/auth/refresh` | Silent token rotation — called before JWT expiry to issue a new token without user interaction |
| `/api/auth/me` | Returns current user profile parsed from JWT claims (used by AuthStore on client init) |

**Authorization** — route-level permission map:

| Route Pattern | Allowed Roles |
|---------------|---------------|
| `/dashboard` (Executive Overview) | VP/CTO, Eng Mgr, FinOps |
| `/dashboard/adoption` | VP/CTO, Eng Mgr, Platform Eng, IC Dev (own team) |
| `/dashboard/delivery` | VP/CTO, Eng Mgr, Platform Eng, IC Dev (own team) |
| `/dashboard/cost` | VP/CTO, Eng Mgr, FinOps |
| `/dashboard/quality` | Eng Mgr, Security |
| `/dashboard/operations` | Eng Mgr, Platform Eng |
| `/dashboard/sessions/*` | Eng Mgr, Platform Eng, Security (audit), IC Dev (own sessions) |
| `/dashboard/settings` | All roles |

- Unauthorized → redirect to user's default allowed view
- Client-side `AuthGuard` provides additional UI-level checks (hide/show elements within a page)

---

## Group 2: Pages

| Component | Route | Description | Key Composed Components |
|-----------|-------|-------------|------------------------|
| **Executive Overview** | `/dashboard` | Adoption trends, accepted outcome rate, $/task, $/PR, risk posture, 7/30/90d deltas | KPICard, ChartContainer (area), DeltaIndicator |
| **Adoption & Usage** | `/dashboard/adoption` | DAU/WAU/MAU, task funnel, type distribution, integration coverage | ChartContainer (line, funnel, pie, bar), DataTable |
| **Delivery Impact** | `/dashboard/delivery` | PR throughput, TTM, time-to-first-PR, agent vs non-agent | ChartContainer (bar, line, grouped bar), DataTable |
| **Cost & Budgets** | `/dashboard/cost` | Spend by team/repo/model, forecasts, budget alerts, $/task, $/PR | ChartContainer (stacked bar, area), KPICard |
| **Quality & Security** | `/dashboard/quality` | CI pass rate, review outcomes, policy violations, audit trail | ChartContainer (bar, pie), DataTable (violations) |
| **Operations** | `/dashboard/operations` | Queue depth, wait time, failure rate + categories, SLA | ChartContainer (area, bar), KPICard; **60s polling** |
| **Session Deep-Dive** | `/dashboard/sessions/[sessionId]` | Reasoning timeline, diffs, step trace, tool calls, cost | SessionTimeline, StepDetailPanel, DiffViewer, CostBreakdown |
| **Settings** | `/dashboard/settings` | Theme, timezone, default view, default date range, digest prefs | Design System form controls |
| **Team Drill-Down** | `/dashboard/{view}/[teamId]` | Same metrics as parent view, filtered to one team; session list for drill-down | Same as parent view + DataTable (sessions) |

### Drill-Down Routing

```
Dashboard > [View] > [Team] > [Session]
   /dashboard     /dashboard/adoption     /dashboard/adoption/team-123     /dashboard/sessions/sess-456
```

- Each level is a separate Next.js route (not a modal)
- Breadcrumbs reflect the full hierarchy with clickable links
- Session Deep-Dive is **not in the sidebar** — reached only via drill-down from session rows in Adoption, Delivery, or Operations views
- Team drill-down routes exist for: Adoption, Delivery, Cost (views that have team-level breakdowns)

---

## Group 3: Shared UI Components

### 3a. Design System (shared with Web App UI)

These components live in a shared package (`@platform/ui` or monorepo `packages/ui`) and are used by both Dashboard UI and Web App UI. This ensures visual consistency across the platform.

| Component | Description |
|-----------|-------------|
| **Button** | Primary, secondary, ghost, icon variants; disabled, loading states |
| **Input** / **Select** | Text input, multi-select with search, consistent Tailwind styling |
| **DatePicker** | Single date + date range calendar; base for dashboard's DateRangePicker |
| **Card** | Container: header, body, optional footer, hover state |
| **Badge** | Status indicators (success/warning/error), count badges |
| **Tooltip** | Hover/focus with accessible markup (`role="tooltip"`, `aria-describedby`) |
| **Modal** / **Dialog** | Confirmation dialogs, detail panels, keyboard trap, focus management |
| **Skeleton** | Loading placeholders: line, rectangle, circle shapes |
| **Table** | Base: sortable columns, row selection, responsive overflow |
| **Icon** | Icon system (Lucide); consistent sizing (16/20/24px) |

### 3b. Dashboard-Specific Components

| Component | Description | Dependencies |
|-----------|-------------|-------------|
| **AppShell** | Root layout: sidebar + header (NotificationCenter, ThemeToggle, UserMenu) + scrollable content area | SidebarNav, NotificationCenter, UserMenu, Breadcrumbs |
| **UserMenu** | Avatar dropdown in header: profile info (name, email, role, org), link to Settings, "Manage account in IdP" external link, Logout button | AuthStore, UserSettingsStore |
| **SidebarNav** | 7 view links: Executive, Adoption, Delivery, Cost, Quality, Ops + Settings at bottom; active route highlighted; collapses to hamburger on mobile | UIStore (collapsed state) |
| **Breadcrumbs** | Auto-generated from Next.js route path; each segment clickable | Next.js `usePathname` |
| **DateRangePicker** | Presets (7d / 30d / 90d / Custom), dual calendar for custom range, per-view defaults (Ops = 7d, others = 30d) | Design System DatePicker, FilterStore |
| **FilterBar** | Global filters: team, repo, language, model, task type; renders as removable chips below DateRangePicker; composable AND logic | FilterStore |
| **PeriodComparisonToggle** | "Compare to previous period" switch; enables delta indicators on KPICards + dashed overlay lines on charts | FilterStore (comparison flag) |
| **KPICard** | Metric value + label + sparkline (Recharts Sparkline) + DeltaIndicator; skeleton loading state | Design System Card, DeltaIndicator |
| **DeltaIndicator** | `↑12%` (green) / `↓5%` (red) / `—` (neutral); includes accessible `aria-label` text | — |
| **ChartContainer** | Recharts wrapper providing: skeleton loading, inline error with retry button, empty state message, ARIA labels on chart, data table fallback for screen readers | Design System Skeleton, Recharts |
| **DataTable** | Extends Design System Table: cursor-based pagination (next/prev), sortable columns, row click → navigates to drill-down route | Design System Table |
| **ExportButton** | Dropdown: CSV / NDJSON; triggers download respecting current filters and date range; disabled during export | Design System Button |
| **NotificationCenter** | Bell icon in header + unread count badge + dropdown list; notification types: budget alert, SLA breach, policy violation; each links to relevant view; mark read / dismiss actions | NotificationStore |
| **EmptyState** | Two variants: (1) Onboarding for new orgs — guide: connect repo → run task → view analytics, with sample data preview; (2) No-data-for-filters — message + reset filters button | — |
| **ThemeToggle** | Light/dark switch icon in header; reads/writes UserSettingsStore | UserSettingsStore |

### 3c. Session Deep-Dive Components

| Component | Description | Dependencies |
|-----------|-------------|-------------|
| **SessionTimeline** | Vertical timeline of agent steps. Each step card: type icon (Think 🧠 / Act ⚡ / Observe 👁), duration bar, cost label, status badge (success/error/skipped). Color-coded by type. Error steps highlighted in red. Steps collapsible (expanded by default for errors). | — |
| **StepDetailPanel** | Expanded view on step click. **Think**: LLM prompt summary, model name, tokens in/out, response summary, reasoning chain excerpt. **Act**: tool call name, arguments (JSON), result summary, duration. **Observe**: file diffs (→ DiffViewer), test output, CI results. | DiffViewer |
| **DiffViewer** | Side-by-side diff with syntax highlighting. File tree navigation for multi-file changes. Collapsible hunks. Line numbers. Copy button. | — |
| **CostBreakdown** | Per-step horizontal bar chart: LLM cost (by model) + compute cost. Total session cost as KPICard at top. Cost by model breakdown if multiple models used. | ChartContainer, KPICard |

---

## Group 4: State Management (MobX Stores)

| Store | Responsibility | Persistence | Synced With |
|-------|---------------|-------------|-------------|
| **FilterStore** | Active filters: `team_id[]`, `repo_id[]`, `model`, `task_type`, `time_range`, `granularity`, `comparison` toggle | URL query params (via URLSyncProvider) | FilterBar, DateRangePicker, PeriodComparisonToggle, all Query Hooks |
| **UIStore** | `sidebarCollapsed: boolean`, `isMobile: boolean` (from `matchMedia`) | `localStorage` | AppShell, SidebarNav |
| **UserSettingsStore** | `theme: 'light' | 'dark' | 'system'`, `timezone: string`, `defaultView: string`, `defaultDateRange: Record<view, range>`, `digestFrequency`, `digestScope` | User profile API (PATCH `/v1/user/settings`) + `localStorage` cache | Settings Page, ThemeProvider, DateRangePicker defaults |
| **AuthStore** | `user: { id, email, name }`, `role: Role`, `org_id: string`, `permissions: string[]` — parsed from JWT claims on app init | Session (JWT in `httpOnly` cookie, parsed client-side from `/api/auth/me` endpoint) | AuthGuard, middleware, RBAC-dependent component visibility |
| **NotificationStore** | `unreadCount: number`, `notifications: Notification[]`, `markRead(id)`, `dismiss(id)` | In-memory; synced with Analytics API via `useNotifications()` polling | NotificationCenter |

### Store Interactions

```
                    ┌──────────────┐
                    │ FilterBar    │
                    │ DateRange    │──writes──→┌──────────────┐
                    │ PeriodToggle │           │ FilterStore  │──syncs──→ URL (URLSyncProvider)
                    └──────────────┘           └──────┬───────┘
                                                      │ reads
                                              ┌───────▼───────┐
                                              │ Query Hooks    │──fetches──→ Analytics API
                                              │ (query keys    │
                                              │  include       │
                                              │  filters)      │
                                              └───────┬───────┘
                                                      │ returns data
                                              ┌───────▼───────┐
                                              │ Page Components│──renders──→ Charts, Tables, KPIs
                                              └───────────────┘
```

---

## Group 5: Data Layer

### API Client

- Auto-generated TypeScript types from `openapi.yaml` via `openapi-typescript` (CI step)
- Thin `fetch` wrapper: base URL configuration, JWT header injection (`Authorization: Bearer <token>`), response error handling (throws on 4xx/5xx)
- No business logic — pure HTTP transport

### Zod Schemas

- Generated from OpenAPI spec (or manually maintained with CI validation against spec)
- Every API response parsed through Zod before entering TanStack Query cache
- Catches contract drift at runtime (Zod parse error → Sentry error → alert)

### Query Hooks

Each hook encapsulates one Analytics API endpoint. Reads filters from FilterStore and includes them in the query key for automatic cache invalidation when filters change.

| Hook | Endpoint | Refetch Strategy |
|------|----------|-----------------|
| `useOverview(filters)` | `GET /v1/analytics/overview` | On page load + manual refresh |
| `useAdoption(filters)` | `GET /v1/analytics/adoption` | On page load + manual refresh |
| `useDelivery(filters)` | `GET /v1/analytics/delivery` | On page load + manual refresh |
| `useCost(filters)` | `GET /v1/analytics/cost` | On page load + manual refresh |
| `useQuality(filters)` | `GET /v1/analytics/quality` | On page load + manual refresh |
| `useOperations(filters)` | `GET /v1/analytics/operations` | **Polling: `refetchInterval: 60_000`** (60s) |
| `useSession(sessionId)` | `GET /v1/analytics/sessions/:id` | On page load + manual refresh |
| `useNotifications()` | `GET /v1/analytics/notifications` | **Polling: `refetchInterval: 60_000`** (60s) |
| `useProfile()` | `GET /v1/user/profile` | On app init (once) |
| `useSettings()` | `GET /v1/user/settings` | On app init (once) |
| `useUpdateProfile()` | `PATCH /v1/user/profile` | Mutation (on save) |
| `useUpdateSettings()` | `PATCH /v1/user/settings` | Mutation (on save) |

### Query Key Factory

Centralized query key generation ensures consistent cache keys across the app:

```
queryKeys.overview(filters)     → ['analytics', 'overview', { team: [...], range: '30d', ... }]
queryKeys.adoption(filters)     → ['analytics', 'adoption', { ... }]
queryKeys.notifications()       → ['analytics', 'notifications']
```

Filter changes → new query key → TanStack Query auto-refetches.

### URLSyncProvider

React context + MobX reaction providing two-way synchronization:

- **On mount**: reads `URLSearchParams` → initializes FilterStore
- **On filter change**: MobX `reaction` on FilterStore → updates URL via `router.replace(url, { scroll: false })` (shallow, no page reload)
- **On browser back/forward**: `popstate` event → updates FilterStore from URL

### MSW Handlers

- Mock API handlers generated from OpenAPI spec + JSON fixture files
- Used in Jest (unit/integration) and Playwright (E2E) tests
- Fixture data: realistic synthetic dataset matching ClickHouse schema

### Data Flow

```
User clicks filter ──→ FilterBar ──→ FilterStore.setFilter()
                                          │
                    ┌─────────────────────┤
                    ▼                     ▼
            URLSyncProvider        Query key changes
            (FilterStore → URL)         │
                                        ▼
                                TanStack Query refetch
                                        │
                                        ▼
                                API Client (fetch)
                                        │
                                        ▼
                                Zod validation
                                        │
                                   ┌────┴────┐
                                   ▼         ▼
                              Cache update   Error → Sentry
                                   │
                                   ▼
                          Component re-render
                          (MobX observer + useQuery data)
```

---

## Group 6: Infrastructure / Providers

### Provider Nesting Order

Defined in `app/dashboard/layout.tsx` (Server Component that renders Client Component providers):

```
<PostHogProvider>
  <SentryProvider>
    <I18nProvider locale="en" messages={messages}>
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <MobXStoresProvider>
            <URLSyncProvider>
              <AuthGuard>
                <AppShell>
                  {children}    ← page content
                </AppShell>
              </AuthGuard>
            </URLSyncProvider>
          </MobXStoresProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </I18nProvider>
  </SentryProvider>
</PostHogProvider>
```

### Provider Details

| Provider | Responsibility |
|----------|---------------|
| **PostHogProvider** | Initializes PostHog SDK (self-hosted or EU cloud). Hashed `user_id` (no PII). Autocapture disabled. Route change tracking via `usePathname()`. Custom events: `view_visited`, `filter_applied`, `export_triggered`. |
| **SentryProvider** | Initializes Sentry SDK. Global React error boundary. Web Vitals reporting (LCP, INP, CLS, TTFB). Source maps uploaded in CI. Session replay enabled on error. |
| **I18nProvider** | `next-intl` setup. Loads EN translation messages from `/messages/en.json`. All UI strings accessed via `useTranslations()` hook. i18n-ready: adding a language = adding a translation file. |
| **ThemeProvider** | Reads preference chain: `UserSettingsStore.theme` → `localStorage('theme')` → `prefers-color-scheme` media query. Applies `dark` class to `<html>` element (Tailwind `class` strategy). |
| **QueryClientProvider** | TanStack Query client. Defaults: `staleTime: 5 * 60 * 1000` (5 min), `gcTime: 30 * 60 * 1000` (30 min), `retry: 2`, `refetchOnWindowFocus: true`. |
| **MobXStoresProvider** | React context providing all MobX store instances (FilterStore, UIStore, UserSettingsStore, AuthStore, NotificationStore). |
| **URLSyncProvider** | Two-way FilterStore ↔ URL sync (see Data Layer section). |
| **AuthGuard** | Client-side RBAC: reads `AuthStore.role` and `AuthStore.permissions`, conditionally renders children or restricted-access fallback. Complements server-side middleware (which handles route-level blocking). |

---

## Relationships

### Component → External Container

| From | To | Protocol | Data |
|------|----|----------|------|
| Auth Middleware | Identity & Access Service | HTTPS | JWT validation, role extraction |
| API Client | Analytics API | HTTPS (REST) | All dashboard queries (`/v1/analytics/*`), notifications |
| API Client | Analytics API | HTTPS (PATCH) | Mark notification read, dismiss |
| API Client | Analytics API | HTTPS (GET/PATCH) | User profile (`/v1/user/profile`) and settings (`/v1/user/settings`) |

### Component → Component (key interactions)

| From | To | Interaction |
|------|----|-------------|
| Pages (all) | Query Hooks | Call `useOverview()`, `useAdoption()`, etc. with filters |
| Pages (all) | Dashboard Components | Compose: KPICard, ChartContainer, DataTable, FilterBar |
| Dashboard Components | Design System | Extend: KPICard → Card, DataTable → Table, DateRangePicker → DatePicker |
| FilterBar | FilterStore | Read/write active filters |
| DateRangePicker | FilterStore | Read/write date range |
| PeriodComparisonToggle | FilterStore | Read/write comparison flag |
| URLSyncProvider | FilterStore | Two-way sync (MobX reaction ↔ URLSearchParams) |
| Query Hooks | FilterStore | Read filter values → include in query keys |
| Query Hooks | API Client | Delegate HTTP requests |
| Query Hooks | Zod Schemas | Validate API responses |
| Query Hooks | Query Key Factory | Generate cache keys |
| NotificationCenter | NotificationStore | Read notifications, dispatch mark-read/dismiss |
| NotificationStore | Query Hooks | `useNotifications()` — 60s polling |
| AuthGuard | AuthStore | Read role + permissions for UI-level RBAC |
| Auth Middleware | AuthStore | Server-side: route-level RBAC |
| Session Deep-Dive Page | SessionTimeline | Compose: step timeline |
| Session Deep-Dive Page | StepDetailPanel | Compose: expanded step view |
| Session Deep-Dive Page | DiffViewer | Compose: code diffs |
| Session Deep-Dive Page | CostBreakdown | Compose: cost charts |
| AppShell | SidebarNav | Contains sidebar |
| AppShell | NotificationCenter | Contains in header |
| AppShell | UserMenu | Contains in header (avatar dropdown) |
| AppShell | Breadcrumbs | Contains in content area |
| UserMenu | AuthStore | Reads user profile (name, email, role, org) for display |
| UserMenu | Query Hooks | `useProfile()` for full profile data |
| Settings Page | Query Hooks | `useSettings()` / `useUpdateSettings()` for preferences CRUD |
| Settings Page | Query Hooks | `useProfile()` / `useUpdateProfile()` for avatar upload |
| ThemeProvider | UserSettingsStore | Reads theme preference |
| Operations Page | `useOperations()` | 60s polling via `refetchInterval` |

---

## Architectural Decisions

| # | Decision | Rationale | Trade-off |
|---|----------|-----------|-----------|
| 1 | **Server Components for layout/pages, Client for interactive UI** | Maximizes SSR benefits (metadata, initial load) while allowing full interactivity for charts and filters | Clear `'use client'` boundary needed; can't use MobX stores in Server Components |
| 2 | **Dual RBAC: middleware + AuthGuard** | Middleware blocks routes at edge (security); AuthGuard hides UI elements client-side (UX) | Two places to maintain permission map; must stay in sync |
| 3 | **MobX for UI state + TanStack Query for server state** | MobX excels at observable UI state (filters, theme); TanStack Query excels at server cache (deduplication, background refetch, stale-while-revalidate) | Two state management paradigms; team must understand both |
| 4 | **URLSyncProvider as two-way bridge** | Shareable/bookmarkable URLs; browser back/forward works naturally; filters persist across navigation | Complexity of keeping FilterStore and URL in sync; edge cases with initial load vs SSR |
| 5 | **Design System as shared package** | Visual consistency between Dashboard UI and Web App UI; single source of truth for primitives | Package versioning overhead; breaking changes affect both apps |
| 6 | **Session Deep-Dive as sub-page, not sidebar view** | Deep-dive is a drill-down destination, not a primary navigation target; keeps sidebar clean (7 items) | Less discoverable; users must know to click a session row to get there |
| 7 | **60s polling for Operations and Notifications** | Simple, predictable; no WebSocket infrastructure needed for MVP | Not truly real-time; 60s lag acceptable for operational triage but not for live monitoring |
| 8 | **Notifications via polling, not WebSocket** | Simpler infrastructure; notifications are not latency-critical (budget alerts, SLA) | May upgrade to WebSocket/SSE in P1 if real-time alerting becomes a requirement |