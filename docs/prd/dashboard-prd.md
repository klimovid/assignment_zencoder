# PRD: Customer-Facing Analytics Dashboard

> **Product**: Cloud Agent Execution Platform — Analytics Dashboard
> **Version**: 1.0 (P0 Release)
> **Date**: 2026-03-16
> **Sources**: [dashboard_research_summary.md](../researches/analytics_dashboard/dashboard_research_summary.md), [c4-container.md](../architecture/c4-container.md), [c4-system-context.md](../architecture/c4-system-context.md), [gemini_dashboard_research.md](../researches/analytics_dashboard/gemini_dashboard_research.md), [openai_dashboard_research.md](../researches/analytics_dashboard/openai_dashboard_research.md)

---

## 1. Overview

**Analytics Dashboard** — customer-facing analytics module of the Cloud Agent Execution Platform providing organizational visibility into autonomous AI agent activity, delivery outcomes, cost, and risk.

### Problem

Autonomous AI agents are not AI assistants. Unlike Copilot-style suggestion tools, agents autonomously execute complete software engineering tasks — from ticket to merged PR — consuming compute, LLM tokens, and reviewer attention without human decision at each step. Existing developer analytics tools (designed for assistive AI) measure "suggestions accepted" and LOC — metrics irrelevant for autonomous execution.

DORA 2025 found that AI tooling boosts individual output by +98% PR volume, but organizational delivery remains flat. This paradox demands analytics anchored on **outcomes** (merged PRs, cost per accepted result, quality gates), not outputs (LOC, commits, suggestions).

### Product Decisions (accepted from research)

| # | Decision | Choice | Rationale |
|---|----------|--------|-----------|
| 1 | Primary unit of value | Merged PR + ticket lifecycle | Copilot/Claude precedent; ticket lifecycle as differentiator |
| 2 | Attribution policy | Conservative counting | Claude Code model: acknowledged undercounting > overclaiming |
| 3 | Per-user visibility | Admin opt-in, cohort ≥5 | Copilot ≥5 threshold precedent; privacy-by-design |
| 4 | Leaderboards | Disabled by default | DORA/SPACE warn against competitive framing |
| 5 | Mobile scope | Responsive web: alerts + KPI + triage | Datadog mobile precedent: view on mobile, edit on web |
| 6 | HEH (Human-Equivalent Hours) | Deferred to P2 | No industry benchmark methodology; R=0.5 |
| 7 | Enterprise data export | Yes (OTEL + S3 for higher tiers) | Factory/AWS pattern |
| 8 | Data freshness | Three-tier: minutes / hourly / daily | Validated against competitor evidence |

---

## 2. Goals & Non-Goals

### Goals

- **Organizational visibility**: give leadership, managers, and platform teams auditable insight into autonomous agent activity across the org
- **Data-driven decisions**: enable ROI assessment (cost per outcome), adoption tracking, quality monitoring, and risk management
- **API + export**: programmatic access to all analytics data; CSV/NDJSON/OTEL export for BI integration
- **Privacy-by-design**: cohort thresholds, conservative attribution, team-level aggregation by default
- **Responsive web**: desktop-first deep analysis + mobile KPI tiles, alerts, and triage
- **Dark mode**: light and dark themes via Tailwind class strategy

### Non-Goals

- **Real-time platform ops monitoring** — handled by the Observability & Audit Pipeline (separate container)
- **Individual developer performance evaluation** — dashboard is for organizational decision-making, not stack-ranking
- **"Time saved" models at P0** — deferred to P2 due to low industry confidence (R=0.4)
- **Editing/configuration from mobile** — mobile is consume/triage only
- **Replacing existing engineering analytics tools** — dashboard complements, not replaces, tools like DORA dashboards or CI/CD monitors

---

## 3. Authentication Flow

Dashboard uses the platform-wide SSO provided by the Identity & Access Service (WorkOS / Auth0). There is **no custom login page** in the Dashboard UI.

### Flow

```
User visits /dashboard
       │
       ▼
Auth Middleware (edge)
       │
  JWT present & valid?
       │
  ┌────┴────┐
  No        Yes
  │         │
  ▼         ▼
Redirect    Extract role + org_id
to IdP      from JWT claims
(WorkOS /        │
 Okta /          ▼
 Azure AD)  Render dashboard
  │         (view per role)
  ▼
SSO login (SAML / OIDC)
  │
  ▼
Callback: /api/auth/callback
  │
  ▼
Exchange auth code → JWT
Set httpOnly cookie
  │
  ▼
Redirect to /dashboard
```

### Key Details

| Aspect | Implementation |
|--------|---------------|
| **Login UI** | Hosted by IdP (WorkOS AuthKit / Okta / Azure AD hosted login page) |
| **Session** | JWT in `httpOnly` secure cookie; no token in `localStorage` |
| **Token refresh** | Silent rotation via `/api/auth/refresh` before expiry |
| **Logout** | `/api/auth/logout` → clear cookie + IdP session termination |
| **First-time user** | Auto-provisioned via SCIM sync → lands on default view per role |
| **Auth routes** | `/api/auth/callback`, `/api/auth/logout`, `/api/auth/refresh` — Next.js Route Handlers |

---

## 4. Target Users

| Persona | Primary Decision | Cadence | Access Surface | Default View |
|---------|-----------------|---------|----------------|--------------|
| **VP Engineering / CTO** | ROI, renewal/expansion, headcount vs agents | Monthly / Quarterly | Web, email digest | Executive Overview |
| **Engineering Manager / Team Lead** | Enablement, task type safety, review bottlenecks | Daily / Weekly | Web, Slack | Adoption & Usage |
| **Platform Engineering / DevEx** | Flow health, reliability, developer experience | Daily | Web | Operations |
| **Finance / FinOps** | Budget allocation, cost drivers, forecasting | Weekly / Monthly | Web, email | Cost & Budgets |
| **Security / Compliance** | Audit evidence, policy enforcement | Event-driven | Web, alerts | Quality & Security |
| **IC Developer** | Personal efficiency, self-coaching | Real-time | Web | Adoption & Usage (own team) |

**Design heuristic**: each dashboard view maps to a **decision** (not a role). Role determines access level and default view, not content boundaries.

---

## 5. Features — P0

### 5.1 Dashboard Views

| # | View | Key Metrics | Chart Types |
|---|------|-------------|-------------|
| 1 | Executive Overview | Adoption trends, accepted outcome rate, $/task, $/PR, risk posture, 7/30/90d deltas | KPI cards + sparklines, area (trends), delta indicators (↑↓%) |
| 2 | Adoption & Usage | DAU/WAU/MAU, sessions, task funnel, type distribution, integration coverage | Line (DAU/WAU/MAU), funnel, pie/donut (types), bar (by team) |
| 3 | Delivery Impact | PR throughput, TTM, time-to-first-PR, time-to-completion, agent vs non-agent | Bar (throughput), line (TTM trend), grouped bar (comparison) |
| 4 | Cost & Budgets | Spend by team/repo/model, forecasts, budget alerts, $/task, $/PR | Stacked bar (spend), area (forecast), KPI cards |
| 5 | Quality & Security | CI pass rate, review outcomes, policy violations, audit trail | Bar, pie, table (violations), line (trend) |
| 6 | Operations | Queue depth, wait time, failure rate + categories, SLA | Area (queue), bar (failures), KPI (SLA %) |
| 7 | Session Deep-Dive | Reasoning timeline, diffs, step trace, tool calls, cost | See detailed spec (4.2) |

### 5.2 Session Deep-Dive — Detailed Spec

Session Deep-Dive is a key differentiator (Devin "Glass-Box" pattern) — provides full transparency into agent reasoning and actions.

**Vertical timeline**:
- Each step rendered as a card: step type (Think / Act / Observe), duration, cost, status (success / error / skipped)
- Collapsible by default; expand for detail
- Color-coded by step type; error steps highlighted

**Step detail panel** (click to expand):
- **Think step**: LLM prompt summary, model used, tokens in/out, response summary, reasoning chain
- **Act step**: tool call name, arguments, result summary, duration
- **Observe step**: file diffs, test output, CI results

**Diff viewer**:
- Side-by-side diff view with syntax highlighting
- File tree navigation for multi-file changes
- Collapsible hunks

**Cost breakdown**:
- Per-step horizontal bar chart: LLM cost + compute cost
- Total session cost displayed at top as KPI card
- Cost by model (if multiple models used)

**Navigation**:
- Drill-down entry points: session rows in Adoption, Delivery, and Operations views link directly to Session Deep-Dive
- URL: `/dashboard/sessions/:session_id`
- Back navigation via breadcrumbs

### 5.3 Navigation & Information Architecture

**Sidebar navigation**:
- 7 views listed vertically: Executive Overview, Adoption & Usage, Delivery Impact, Cost & Budgets, Quality & Security, Operations, Session Deep-Dive (recent sessions list)
- Settings link at bottom
- Collapsible on mobile (hamburger menu)

**Breadcrumbs**:
- Pattern: `Dashboard > [View] > [Team] > [Session]`
- Each level is a clickable link

**Session Deep-Dive** is rendered as a sub-page (not a modal) to support deep linking and browser back/forward navigation.

### 5.4 Date Range Picker

**Presets**: 7 days, 30 days, 90 days, Custom range

**Defaults per view**:

| View | Default Range |
|------|---------------|
| Executive Overview | 30 days |
| Adoption & Usage | 30 days |
| Delivery Impact | 30 days |
| Cost & Budgets | 30 days |
| Quality & Security | 30 days |
| Operations | 7 days |

**Calendar picker**: dual-calendar for custom range selection. Timezone follows user settings (section 17).

### 5.5 Cross-Cutting Features

**Global filters** (persistent across views):
- Team, repository, language, LLM model, task type, time window
- Filter chips displayed below the date range picker
- Filters are composable (AND logic)

**Period comparison**:
- "Compare to previous period" toggle
- Delta indicators (↑↓%) shown on KPI cards and trend lines
- Previous period rendered as dashed overlay on charts

**Export**:
- CSV and NDJSON export from any view
- Export respects current filters and date range
- Download initiated via button in view header

**URL state & deep linking**:
- All filters, date range, and view state serialized to URL query params
- URLs are shareable and bookmarkable
- Browser back/forward navigation works correctly

---

## 6. RBAC / Permissions Matrix

| Capability | VP/CTO | Eng Mgr | Platform Eng | FinOps | Security | IC Dev |
|---|---|---|---|---|---|---|
| Executive Overview | ✓ | ✓ | — | ✓ | — | — |
| Adoption & Usage | ✓ | ✓ | ✓ | — | — | own team |
| Delivery Impact | ✓ | ✓ | ✓ | — | — | own team |
| Cost & Budgets | ✓ | ✓ | — | ✓ | — | — |
| Quality & Security | — | ✓ | — | — | ✓ | — |
| Operations | — | ✓ | ✓ | — | — | — |
| Session Deep-Dive | — | ✓ | ✓ | — | ✓ (audit only) | own sessions |
| Configure alerts | — | ✓ | ✓ | ✓ (budget) | ✓ (security) | — |
| Export (CSV/API) | ✓ | ✓ | ✓ | ✓ | ✓ | — |
| Per-user views | admin opt-in only | | | | | |
| Manage digests | own | own | own | own | own | own |

**Org Admin** = full access to all capabilities.

Roles are managed by the Identity & Access Service (RBAC/ABAC via OPA/Cedar). Dashboard reads role claims from JWT and renders views/actions accordingly.

---

## 7. Notifications & Alerts (P0)

### Budget Threshold Alerts
- Configurable thresholds: 50%, 75%, 90%, 100% of budget
- Delivery channels: email + in-app notification
- Configurable by Eng Manager, Platform Eng, FinOps (per RBAC)
- Trigger: Tenant & Org Management emits `platform.billing.threshold_reached` via Event Bus

### Scheduled Email Digests
- Weekly summary email: adoption trends, cost summary, key alerts
- Configurable per user: frequency (weekly), scope (org / team)
- Opt-in/opt-out in user settings

### In-App Notification Center
- Bell icon in dashboard header with unread count badge
- Notification types: budget alerts, security policy violations, SLA breaches
- Each notification links to the relevant dashboard view
- Mark as read / dismiss actions

---

## 8. Features — P1

### Metrics
- **Acceptance rate**: % of agent-generated diffs accepted without major human rewrite
- **Rework signals**: reverted PRs within N days, hotfix linkage rate
- **Cycle Time Delta**: reduction vs pre-agent baseline
- **Developer experience surveys**: SPACE-aligned qualitative feedback pulses

### Export & Reporting
- **Print / PDF export**: formatted executive reports from Executive Overview

### Advanced Notifications
- **Cost anomaly detection**: automatic spike detection (>2σ from rolling baseline)
- **SLA / failure spike alerts**: threshold-based, configurable
- **Alert history UI**: acknowledged / resolved / dismissed states, audit trail
- **Slack integration**: alerts + digest delivery to Slack channels
- **Outbound webhooks**: POST to customer-configured endpoints on alert trigger

---

## 9. Features — P2

- **HEH (Human-Equivalent Hours)**: directional estimate only, with confidence bounds displayed in UI. Requires longitudinal calibration study.
- **Cross-tool DORA correlation**: agent usage ↔ DORA delivery metrics (requires integration maturity)
- **Agent loop detection**: identify recursive tool-call loops without progress (operationally verifiable)
- **Estimated "time saved" models**: with explicit confidence bounds; GitHub acknowledges difficulty of this measurement

---

## 10. Metrics Definitions

### Autonomous Agent Funnel

```
Task Created → Session Started → Completed → PR Opened → PR Reviewed → PR Merged
     ↓              ↓                ↓            ↓            ↓              ↓
  Adoption      Engagement      Completion    Delivery     Quality         Outcome
```

Validated across competitors: Copilot (adoption → engagement → acceptance → PR lifecycle), Claude Code (sessions → PRs → lines → % merged), Devin (sessions → PRs opened/merged).

### P0 Metrics — Definitions & Data Sources

#### Usage & Adoption

| Metric | Definition | Formula | Kafka Topic | ClickHouse Table/MV |
|--------|------------|---------|-------------|---------------------|
| Active Users (DAU/WAU/MAU) | Users who ran ≥1 agent session within the period | `COUNT(DISTINCT user_id) WHERE session_start IN period` | `platform.tasks.session_started` | `mv_daily_adoption` |
| Agent Sessions/Day | Count of interactive + autonomous sessions | `COUNT(session_id) GROUP BY date` | `platform.tasks.session_started` | `fact_sessions` |
| Task Funnel | Created → Started → Completed, with conversion rates | Conversion: `completed / created * 100` | `platform.tasks.*` | `fact_sessions` |
| Task Type Distribution | Breakdown by bugfix / feature / refactor / test / ops | `COUNT(*) GROUP BY task_type` | `platform.tasks.task_created` | `fact_sessions` |
| Integration Coverage | Repos, CI providers, ticketing providers connected | `COUNT(DISTINCT integration_id) GROUP BY type` | `platform.integrations.*` | `dim_repos`, custom query |

#### Productivity & Outcomes

| Metric | Definition | Formula | Kafka Topic | ClickHouse Table/MV |
|--------|------------|---------|-------------|---------------------|
| Accepted Outcome Rate | Tasks resulting in merged PR / closed ticket | `merged_tasks / completed_tasks * 100` | `platform.integrations.pr_merged` | `fact_pr_lifecycle` |
| PR Throughput | PRs opened and merged by agents per period | `COUNT(pr_id) GROUP BY status, date` | `platform.integrations.pr_*` | `fact_pr_lifecycle`, `mv_daily_delivery` |
| Median Time to Merge (TTM) | Median duration from PR opened to PR merged | `MEDIAN(merged_at - opened_at)` | `platform.integrations.pr_*` | `fact_pr_lifecycle` |
| Time-to-First-PR | Duration from task start to first PR opened | `MEDIAN(first_pr_at - session_start)` | `platform.tasks.*`, `platform.integrations.pr_created` | `fact_sessions` joined `fact_pr_lifecycle` |
| Time-to-Completion | End-to-end task duration including review | `MEDIAN(task_completed_at - task_created_at)` | `platform.tasks.*` | `fact_sessions` |

#### Cost & Unit Economics

| Metric | Definition | Formula | Kafka Topic | ClickHouse Table/MV |
|--------|------------|---------|-------------|---------------------|
| Compute Usage | microVM runtime (vCPU-seconds, memory-GB-seconds) | `SUM(runtime_seconds)`, `SUM(memory_gb_seconds)` | `platform.sandbox.*` | `fact_sessions` |
| LLM Usage | Tokens in/out by model, tool calls, retries | `SUM(tokens_in)`, `SUM(tokens_out) GROUP BY model` | `platform.llm.*` | `fact_llm_requests` |
| Cost per Task | Blended cost (compute + LLM) per completed task | `SUM(total_cost) / COUNT(completed_tasks)` | `platform.llm.*`, `platform.sandbox.*` | `mv_weekly_cost` |
| Cost per Merged PR | Blended cost per merged PR | `SUM(total_cost WHERE pr_merged) / COUNT(merged_prs)` | Cross-topic join | `mv_weekly_cost` |
| Budget Utilization | Current spend vs budget limit | `current_spend / budget_limit * 100` | `platform.billing.*` | Tenant Mgmt query + `mv_weekly_cost` |

#### Quality & Risk

| Metric | Definition | Formula | Kafka Topic | ClickHouse Table/MV |
|--------|------------|---------|-------------|---------------------|
| CI Pass Rate | First-run CI pass rate for agent PRs | `passed_first_run / total_ci_runs * 100` | `platform.integrations.ci_*` | `fact_pr_lifecycle` |
| Review Outcomes | Distribution: approved / changes requested / closed unmerged | `COUNT(*) GROUP BY review_outcome` | `platform.integrations.pr_reviewed` | `fact_pr_lifecycle` |
| Policy Violations | Sandbox, network, permissions, secrets events | `COUNT(*) GROUP BY violation_type` | `platform.audit.*` | Custom audit table |
| Audit Logs | Who executed what, where, with what permissions | Event stream (not aggregated) | `platform.audit.*` | Observability Pipeline (append-only) |

#### Operations

| Metric | Definition | Formula | Kafka Topic | ClickHouse Table/MV |
|--------|------------|---------|-------------|---------------------|
| Queue Depth | Pending tasks waiting for agent execution | `COUNT(*) WHERE status = 'queued'` | `platform.tasks.task_created` | Real-time query via Analytics API |
| Wait Time | Duration from task created to session started | `MEDIAN(session_start - task_created_at)` | `platform.tasks.*` | `fact_sessions` |
| Failure Rate | % tasks that failed, by failure category | `failed / total * 100 GROUP BY failure_reason` | `platform.tasks.task_failed` | `fact_sessions` |
| SLA Compliance | % tasks completed within SLA target | `within_sla / total * 100` | `platform.tasks.*` | `fact_sessions` |

---

## 11. UX Requirements

### Layout Principles
- **Progressive disclosure**: Summary → Team → Repo → Session → Object
- **F-pattern layout**: core KPIs placed top-left
- **Anti-leaderboard**: no individual developer rankings shown by default

### Mobile (Responsive Web)
- Responsive 1-2 column layout for viewports < 768px
- KPI tiles + alerts + triage on mobile; deep analysis on desktop
- 44×44px minimum touch targets (WCAG)
- Mobile scope per view:

| View | Mobile Scope |
|------|-------------|
| Executive Overview | KPI tiles + sparklines |
| Adoption & Usage | Partial (DAU/WAU/MAU trends) |
| Cost & Budgets | Alerts only |
| Quality & Security | Alerts only |
| Operations | Triage view (queue + failures) |
| Delivery Impact | Not available on mobile |
| Session Deep-Dive | Not available on mobile |

### Empty / Loading / Error States

**Empty state (new org)**:
- Onboarding guide: "Connect your first repository → Run your first agent task → View your analytics"
- Sample data preview (synthetic) to demonstrate dashboard capabilities
- CTA buttons linking to integration setup

**Loading state**:
- Skeleton screens per component (not full-page spinner)
- Each chart/KPI card shows its own skeleton independently
- Data loads in parallel; components render as data arrives

**Error state**:
- Inline error message within the affected component
- Retry button
- Fallback to cached data where available (TanStack Query stale-while-revalidate)
- Other components on the page remain functional

**No data for current filters**:
- Message: "No data matches the current filters"
- Suggestion to broaden filters or adjust date range
- Quick action to reset filters

---

## 12. API Contract

### Endpoints

Analytics API serves the Dashboard UI with data from ClickHouse (as defined in [c4-container.md](../architecture/c4-container.md), container 13).

| Endpoint | Description |
|----------|-------------|
| `GET /v1/analytics/overview` | Executive KPIs: adoption, outcomes, unit cost, risk posture |
| `GET /v1/analytics/adoption` | DAU/WAU/MAU, sessions by team/repo/type |
| `GET /v1/analytics/delivery` | PRs, TTM, completion rates, agent vs non-agent |
| `GET /v1/analytics/cost` | Spend by team/model, forecasts, budget utilization |
| `GET /v1/analytics/quality` | CI pass rate, review outcomes, policy violations |
| `GET /v1/analytics/operations` | Queue depth, failure categories, SLA compliance |
| `GET /v1/analytics/sessions/:id` | Session deep-dive: reasoning timeline, diffs, step trace, cost |
| `GET /v1/analytics/notifications` | Unread notifications: budget alerts, SLA breaches, policy violations |
| `PATCH /v1/analytics/notifications/:id` | Mark notification as read or dismiss |
| `GET /v1/user/profile` | Current user profile: name, email, avatar, role, org, teams |
| `PATCH /v1/user/profile` | Update editable profile fields (avatar at P0) |
| `GET /v1/user/settings` | User preferences: theme, timezone, defaults, digest config |
| `PATCH /v1/user/settings` | Update user preferences |

### Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `org_id` | string (from JWT) | Tenant isolation — mandatory, extracted from token |
| `team_id[]` | string[] | Filter by team(s) |
| `repo_id[]` | string[] | Filter by repository(s) |
| `time_range` | string | `7d`, `30d`, `90d`, or `start_date..end_date` |
| `granularity` | enum | `hourly` / `daily` / `weekly` / `monthly` |
| `model` | string | Filter by LLM model |
| `task_type` | enum | `bugfix` / `feature` / `refactor` / `test` / `ops` |
| `format` | enum | `json` (default) / `csv` / `ndjson` |

### Pagination & Auth

- **Pagination**: cursor-based (`cursor` + `limit` params, default `limit=50`)
- **Auth**: Platform JWT from API Gateway, scope `analytics:read`
- **Rate limiting**: per-tenant, configurable
- **Versioning**: URL-based (`/v1/`)

### Contract Validation Flow

```
Analytics API (Go) ─── publishes ──→ openapi.yaml (OpenAPI 3.1)
                                        │
                         openapi-typescript (CI codegen)
                                        │
                           ┌────────────┼────────────┐
                           ▼            ▼            ▼
                      types.d.ts   Zod schemas   MSW handlers
                           │            │            │
                      TypeScript    runtime       test mocks
                      compile-time  validation    (Jest / Playwright)
```

---

## 13. Privacy & Compliance

### Privacy-by-Design Requirements

| # | Requirement | Implementation | Precedent |
|---|-------------|----------------|-----------|
| 1 | **Cohort threshold ≥5** | Suppress breakdowns for groups with <5 members | Copilot team aggregates (R=0.95) |
| 2 | **Default team/org aggregation** | Per-user views require explicit admin enablement | Copilot, Claude Code |
| 3 | **Conservative attribution** | Only count PRs/lines where agent contribution confidence is high; acknowledged undercounting | Claude Code attribution model |
| 4 | **Privacy modes** | Enterprises can disable analytics or enforce zero data retention | Claude Code Zero Data Retention |
| 5 | **Published retention tiers** | Clear retention policy; customer-controlled export for longer retention | Copilot NDJSON, AWS S3 reports |
| 6 | **Right to explanation** | Reasoning traces available for automated actions (Session Deep-Dive) | GDPR Article 22 |
| 7 | **Differential privacy** | Noise injection for sensitive small-group aggregates near cohort threshold | Privacy-preserving analytics patterns |
| 8 | **Separate org/vendor telemetry** | Organizational analytics telemetry is separate from platform vendor telemetry | AWS Q Developer model |

### Anti-Patterns (explicitly avoided)

- Individual LOC rankings as default view — incentivizes bloat, ignores quality
- Stack ranking by commit frequency — encourages low-value automation
- "Collect everything forever" — violates GDPR data minimization
- Leaderboards without guardrails — surveillance perception, morale erosion

### GDPR Compliance

| Article | Requirement | Dashboard Implementation |
|---------|-------------|--------------------------|
| Art 5(1)(c) | Data minimization | Only collect metrics needed for defined dashboard views; no "collect everything" |
| Art 5(1)(e) | Storage limitation | Published retention tiers; automatic TTL on ClickHouse tables |
| Art 6 | Lawful basis | Legitimate interest for org-level analytics; consent for per-user views |
| Art 22 | Right to explanation | Session Deep-Dive provides reasoning traces for automated actions |

---

## 14. Accessibility (a11y)

**Target**: WCAG 2.1 Level AA compliance.

| Requirement | Implementation |
|-------------|----------------|
| **Color contrast** | ≥ 4.5:1 ratio for text; ≥ 3:1 for large text and UI components |
| **Never color-only** | Charts use patterns, labels, and tooltips in addition to color |
| **Keyboard navigation** | All interactive elements focusable; logical tab order; Enter/Space to activate |
| **Screen reader support** | ARIA labels on all charts; data tables provided as accessible fallback for every chart |
| **Reduced motion** | `prefers-reduced-motion` media query respected; animations disabled when set |
| **Focus indicators** | Visible focus ring on all interactive elements (not suppressed) |
| **Semantic HTML** | Heading hierarchy (h1–h6), landmarks (`nav`, `main`, `aside`), lists for navigation |

---

## 15. Product Analytics (PostHog)

### Event Taxonomy

| Category | Events |
|----------|--------|
| **Page views** | `view_visited` (view name, role), `time_on_view` |
| **Interactions** | `filter_applied` (filter type, value), `export_triggered` (format, view), `alert_configured` (type, threshold) |
| **Engagement** | `session_duration`, `views_per_session`, `return_frequency` |
| **Feature adoption** | `first_use_{view}`, `first_export`, `first_alert_configured` |
| **Errors** | `data_load_failed` (view, endpoint, status), `slow_query` (view, duration >2s), `empty_result` (view, filters) |

### Funnels

| Funnel | Steps |
|--------|-------|
| **Onboarding** | Open dashboard → Apply first filter → Trigger first export → Return within 7 days |
| **Feature adoption** | Open view → Drill down to detail → Export data |
| **Alert setup** | Visit notifications settings → Configure alert → Alert triggered → Alert acknowledged |

### Configuration

- **Deployment**: self-hosted or EU cloud instance (GDPR compliance)
- **Autocapture**: disabled — all events are explicitly instrumented
- **PII**: no PII captured; `user_id` is hashed before sending to PostHog
- **Session replay**: enabled for internal team only (dogfooding); disabled for customer analytics
- **Data retention**: 12 months in PostHog

---

## 16. Error & Performance Monitoring (Sentry)

### Error Tracking Scope

| Category | What is tracked |
|----------|-----------------|
| **Unhandled exceptions** | React error boundaries, uncaught promise rejections |
| **API errors** | 4xx/5xx responses from Analytics API, with request context |
| **Chart rendering failures** | Recharts component errors, data format mismatches |
| **Source maps** | Uploaded in CI pipeline for readable stack traces in production |

### Web Vitals Targets

| Metric | Target | Threshold |
|--------|--------|-----------|
| LCP (Largest Contentful Paint) | < 2.5s | Alert at > 4s |
| INP (Interaction to Next Paint) | < 200ms | Alert at > 500ms |
| CLS (Cumulative Layout Shift) | < 0.1 | Alert at > 0.25 |
| TTFB (Time to First Byte) | < 800ms | Alert at > 1.8s |

### Performance Budgets

| Budget | Target |
|--------|--------|
| JS bundle size | < 250kb gzip |
| View load time (p95) | < 2s |
| API query response (p95) | < 500ms |

### Alerting

- **Error spike**: alert when error rate exceeds 5× rolling baseline
- **Performance regression**: alert on Web Vitals threshold breach
- **Session replay**: automatically enabled on error for post-mortem debugging

---

## 17. User Profile, Settings & Preferences

### User Profile

Accessible from user avatar/menu in the dashboard header. Profile identity data (name, email) is managed by the IdP (Okta / Azure AD) and synced via SCIM — read-only in the dashboard.

**Profile information displayed**:

| Field | Source | Editable in Dashboard |
|-------|--------|----------------------|
| **Name** | IdP (SCIM sync) | No — edit in IdP |
| **Email** | IdP (SCIM sync) | No — edit in IdP |
| **Avatar** | Gravatar (by email) or uploaded | Yes |
| **Role** | Identity & Access Service (RBAC) | No — managed by Org Admin |
| **Organization** | Tenant & Org Management | No |
| **Team(s)** | Tenant & Org Management | No — managed by Org Admin |

**User menu** (dropdown from avatar in header):
- Profile info (name, email, role, org)
- Link to Settings page (`/dashboard/settings`)
- "Manage account in IdP" link (opens IdP profile page in new tab)
- Logout

### Profile & Settings API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `GET /v1/user/profile` | GET | Current user profile: name, email, avatar, role, org, teams. Composed from JWT claims + Identity & Access Service + Tenant Mgmt. |
| `PATCH /v1/user/profile` | PATCH | Update editable profile fields (avatar only at P0) |
| `GET /v1/user/settings` | GET | User preferences: theme, timezone, default view, date range, digest config |
| `PATCH /v1/user/settings` | PATCH | Update user preferences |

Auth: JWT required. Users can only access/modify their own profile and settings.

### User Settings (Preferences)

| Setting | Options | Default | Storage |
|---------|---------|---------|---------|
| **Theme** | Light / Dark | System preference (`prefers-color-scheme`) | `localStorage` + user profile API (synced) |
| **Timezone** | IANA timezone selector | Browser timezone (`Intl.DateTimeFormat`) | User profile API |
| **Default view** | Any of 7 views | Role-based (Executive Overview for VP, Adoption for Eng Manager) | User profile API |
| **Default date range** | Per view | View defaults (see section 5.4) | User profile API |
| **Email digest** | Frequency (weekly / disabled), scope (org / team) | Disabled | User profile API |
| **Language** | English | English (P0) | User profile API |

**Dark mode implementation**: Tailwind CSS `dark:` variant classes with `class` strategy (not `media`). Theme toggle in user settings + system preference detection on first visit.

**i18n architecture**: All UI strings extracted to translation files via `next-intl`. English only at P0; architecture supports adding languages without code changes.

---

## 18. Technical Constraints

### Frontend Stack

| Category | Technology |
|----------|-----------|
| Framework | React + Next.js (App Router) |
| Styling | Tailwind CSS |
| State management | MobX (UI state) + TanStack Query (server state + cache) |
| Charts | Recharts |
| Unit/integration testing | Jest + React Testing Library |
| E2E testing | Playwright |
| API contracts | OpenAPI 3.1 → `openapi-typescript` → Zod → MSW |
| i18n | `next-intl` |

### Data Fetching Strategy

- **TanStack Query**: manages all Analytics API requests — caching, deduplication, background refetching, stale-while-revalidate
- **MobX**: UI-only state — filters, sidebar collapse, theme, active view
- **Polling**: Operations view polls every 60s; other views load on page load + manual refresh

### Browser Support

Latest 2 versions of: Chrome, Edge, Firefox, Safari.

### Architecture (data pipeline)

```
Stream Processor (Flink/Benthos) → ClickHouse (OLAP) → Analytics API (Go) → Dashboard UI (React/Next.js)
```

### Data Freshness

| Category | Freshness | Rationale |
|----------|-----------|-----------|
| Operational (queue, SLA, failures) | 1–5 minutes | Action-oriented triage |
| Usage analytics (sessions, adoption) | Hourly | Sufficient for daily decisions |
| ROI / executive reporting | Daily | Stability preferred over speed |
| Audit / security events | Near-real-time | Compliance requirement |

### Retention

| Tier | Data | Retention |
|------|------|-----------|
| Hot | Aggregates (rollups) | 12–24 months |
| Warm | Per-session traces/logs | 14–90 days (configurable) |
| Cold | Raw events (S3, immutable) | 12 months |
| Archive | Audit/security logs | SOC 2 minimum 1 year |

---

## 19. Dependencies & Phasing

| Dependency | Required For | Fallback (enables parallel development) |
|------------|-------------|------------------------------------------|
| Analytics API (Go) | All views — data serving | Mock API via MSW + JSON fixtures (generated from OpenAPI spec) |
| ClickHouse + Stream Processor | Real analytics data | Seed/demo dataset with realistic synthetic data |
| Identity & Access Service | Authentication, RBAC | Hardcoded roles in development environment |
| Event Bus (Kafka) | Live event streaming | Historical seed data loaded directly into ClickHouse |

**Parallel development strategy**: Dashboard frontend can be developed fully independently using the mock API layer. The contract validation flow (OpenAPI → `openapi-typescript` → Zod → MSW) ensures that when the real Analytics API becomes available, integration requires zero frontend changes if the contract is honored.

---

## 20. Risks & Mitigations

| # | Risk | Severity × Evidence (R) | Mitigation |
|---|------|-------------------------|------------|
| 1 | **AI Productivity Paradox** — high agent output, flat org delivery → trust erosion | R=0.9 | Anchor on outcome metrics (merged PRs); show DORA delivery trends alongside adoption; never present output-only metrics as "productivity" |
| 2 | **Surveillance Backlash** — developers feel monitored | R=0.85 | Cohort ≥5; team aggregation default; no individual rankings; transparent data policy published in product |
| 3 | **Metric Gaming** — trivial PRs to inflate throughput | R=0.8 | Track accepted outcome rate + rework signals (P1); task complexity classification; highlight agent vs non-agent comparison |
| 4 | **Cloud Bill Shock** — uncontrolled cost acceleration | R=0.8 | Budget caps with hard stops (Devin pattern); threshold alerts (50/75/90/100%); cost forecasting |
| 5 | **Attribution Errors** — mis-attributed PRs/tasks | R=0.75 | Conservative attribution rules; integration health monitoring; data quality indicators in UI; "confidence" labels on attribution metrics |
| 6 | **Reviewer Burnout** — high-volume agent output overwhelms humans | R=0.7 | Review friction signals in Quality view; queue depth alerts in Operations; batching recommendations (P1) |
| 7 | **Trust Gap** — managers can't understand why agent failed | R=0.7 | Session Deep-Dive with full reasoning chain; failure categorization in Operations; clear error messages |

---

## 21. Success Criteria

### Product Metrics (measured via PostHog)

| Metric | Target | Measurement |
|--------|--------|-------------|
| Dashboard adoption | >70% org admins enable dashboard within 30 days | `first_use_*` events / total org admins |
| Weekly engagement | WAU / total platform users > 40% | `view_visited` unique users / total users |
| Day-7 retention | > 50% | PostHog retention cohort |
| Day-30 retention | > 30% | PostHog retention cohort |
| Feature coverage | >60% users use ≥3 views/week | `view_visited` distinct views per user per week |
| Enterprise export adoption | >20% enterprise customers use API/export within 90d | `export_triggered` events |

### Technical Metrics (measured via Sentry)

| Metric | Target |
|--------|--------|
| View load time (p95) | < 2s |
| API query response (p95) | < 500ms |
| Error rate | < 0.1% of page loads |
| LCP | < 2.5s |
| INP | < 200ms |
| CLS | < 0.1 |

### Privacy Metrics

| Metric | Target |
|--------|--------|
| Cohort threshold violations | Zero |
| PII leaks in PostHog | Zero |
| Unauthorized per-user data access | Zero |

---

## 22. Open Questions (Resolved)

All 8 open questions from research have been resolved with product decisions:

| # | Question | Decision | Rationale |
|---|----------|----------|-----------|
| 1 | Primary unit of value: merged PR, closed ticket, deploy, or hours saved? | **Merged PR + ticket lifecycle** | Copilot/Claude precedent for PR; ticket lifecycle adds differentiator |
| 2 | Attribution policy: agent-authored vs agent-assisted threshold? | **Conservative counting** | Claude Code model: undercounting > overclaiming; builds trust |
| 3 | Per-user visibility: enable or disable? guardrails? | **Admin opt-in + cohort ≥5** | Copilot ≥5 threshold precedent; balances enablement with privacy |
| 4 | Data freshness: hourly ops vs daily usage vs weekly ROI? | **Three-tier model** | Minutes (ops) / hourly (usage) / daily (executive); validated across competitors |
| 5 | Enterprise export: stream all telemetry to customer storage? | **Yes (OTEL + S3 for higher tiers)** | Factory/AWS pattern; enterprise sales requirement |
| 6 | Leaderboard: include or exclude? | **Disabled by default** | DORA/SPACE warn against competitive framing; optional with admin policy |
| 7 | Mobile scope: full dashboard or alert+KPI only? | **Responsive web: alerts + KPI + triage** | Datadog mobile precedent; edit on web only |
| 8 | HEH methodology: how to calibrate? | **Deferred to P2** | No industry benchmark (R=0.5); requires longitudinal study |

---

## 23. Appendix

### A. Competitor Comparison

| Dimension | GitHub Copilot | Claude Code | Amazon Q Developer | Devin |
|-----------|---------------|-------------|-------------------|-------|
| **Dashboard** | Org-level usage + code gen (GA Feb 2026) | claude.ai/analytics/claude-code | AWS Console dashboard | Built-in + API |
| **API** | REST, NDJSON export, Power BI | REST, OTEL | CloudTrail, CloudWatch, S3 | REST (sessions, usage, insights) |
| **Granularity** | Daily; ~2 day freshness | Daily; ~1hr API delay | Hourly (most); daily (users) | Session-level |
| **Cost visibility** | Not directly exposed | Token usage & cost by model | Subscription-level | ACU ($2.25), org limits with hard stop |
| **Privacy** | Team aggregates ≥5 members | Zero Data Retention option | User telemetry opt-in | Enterprise IdP integration |
| **Attribution** | "Agent Contribution" bucket | Conservative counting | Feature-level acceptance rates | Session + PR correlation |
| **Key differentiator** | PR lifecycle metrics, NDJSON export | Conservative attribution, model cost breakdown | CloudTrail audit integration | Glass-Box reasoning chain, ACU economics |

### B. Our Differentiation

| Capability | Unique to our platform |
|------------|----------------------|
| **Session Deep-Dive with reasoning chain** | Full Think/Act/Observe timeline with diffs, tool calls, and per-step cost — only Devin offers comparable transparency |
| **Autonomous agent operations view** | Queue depth, failure categorization, SLA compliance — unique to execution platforms |
| **Cost per outcome** | $/merged PR, $/completed task — most platforms show raw cost, not unit economics |
| **Privacy-first with cohort enforcement** | Server-side cohort ≥5, differential privacy — goes beyond Copilot's threshold |

### C. Research Sources

| Source | Content | Used For |
|--------|---------|----------|
| `dashboard_research_summary.md` | Cross-source synthesis: metrics taxonomy, personas, privacy, risks, open questions | Primary PRD source |
| `gemini_dashboard_research.md` | HEH methodology, agent loop detection, implicit rejection rate | P1/P2 metric proposals |
| `openai_dashboard_research.md` | Competitor deep-dive, GDPR analysis, mobile UX, data architecture | Competitor analysis, compliance, UX |
| `c4-container.md` | Analytics Plane architecture, API endpoints, tech stack, data freshness, ClickHouse schema | Architecture constraints, API contract |
| `c4-system-context.md` | Actors (Software Engineer, Team Lead, Org Admin) and external systems | Target users, system boundaries |
