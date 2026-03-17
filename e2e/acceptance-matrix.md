# Acceptance Test Matrix

Maps acceptance criteria to specific test files.

## Executive Overview (OV)

| ID | Criteria | Test Type | Test File | Priority |
|----|----------|-----------|-----------|----------|
| OV-1 | KPI cards display 5 metrics | Slice | `views/executive-overview/ui/ExecutiveOverviewPage.test.tsx` | P0 |
| OV-2 | Delta indicators show ↑↓% | Unit | `entities/metric/ui/DeltaIndicator.test.tsx` | P0 |
| OV-3 | Date range picker changes time_range | Integration | `features/filter-management/ui/DateRangePicker.test.tsx` | P0 |
| OV-4 | Sparklines render for each KPI | Slice | `views/executive-overview/ui/ExecutiveOverviewPage.test.tsx` | P1 |
| OV-5 | 7d/30d/90d switching updates data | E2E | `e2e/executive-overview.spec.ts` | P0 |
| OV-6 | No breakdown by individual developers | Slice | `views/executive-overview/ui/ExecutiveOverviewPage.test.tsx` | P1 |

## Adoption & Usage (AD)

| ID | Criteria | Test Type | Test File | Priority |
|----|----------|-----------|-----------|----------|
| AD-1 | Task funnel with conversion rates | Slice | `views/adoption/ui/AdoptionPage.test.tsx` | P0 |
| AD-2 | Filtering by team, repo, language, task_type, model | Integration | `features/filter-management/ui/FilterBar.test.tsx` | P0 |
| AD-3 | Drill-down → Session Deep-Dive | E2E | `e2e/adoption.spec.ts` | P0 |
| AD-4 | Sessions grouped by team bar chart | Slice | `views/adoption/ui/AdoptionPage.test.tsx` | P1 |
| AD-5 | DAU/WAU/MAU line charts | Slice | `views/adoption/ui/AdoptionPage.test.tsx` | P0 |
| AD-6 | Empty state for new org | Slice | `views/adoption/ui/AdoptionPage.test.tsx` | P0 |

## Delivery Impact (DL)

| ID | Criteria | Test Type | Test File | Priority |
|----|----------|-----------|-----------|----------|
| DL-1 | Agent vs non-agent PR comparison | Slice | `views/delivery/ui/DeliveryPage.test.tsx` | P0 |
| DL-2 | TTM trend line with moving average | Slice | `views/delivery/ui/DeliveryPage.test.tsx` | P0 |
| DL-3 | Period comparison dashed overlay | Integration | `features/filter-management/ui/PeriodComparisonToggle.test.tsx` | P1 |
| DL-4 | Drill-down from PR row → Session | E2E | `e2e/delivery.spec.ts` | P0 |
| DL-5 | Throughput by day/week with trend | Slice | `views/delivery/ui/DeliveryPage.test.tsx` | P1 |

## Cost & Budgets (CO)

| ID | Criteria | Test Type | Test File | Priority |
|----|----------|-----------|-----------|----------|
| CO-1 | Current spend vs budget limit KPI | Slice | `views/cost/ui/CostPage.test.tsx` | P0 |
| CO-2 | Spend breakdown stacked bar | Slice | `views/cost/ui/CostPage.test.tsx` | P0 |
| CO-3 | Cost forecast with confidence bounds | Slice | `views/cost/ui/CostPage.test.tsx` | P1 |
| CO-4 | Budget threshold alerts | Integration | `views/cost/ui/CostPage.test.tsx` | P0 |
| CO-5 | Cost per task and cost per PR | Slice | `views/cost/ui/CostPage.test.tsx` | P0 |

## Quality & Security (QA)

| ID | Criteria | Test Type | Test File | Priority |
|----|----------|-----------|-----------|----------|
| QA-1 | CI pass rate as primary metric | Slice | `views/quality/ui/QualityPage.test.tsx` | P0 |
| QA-2 | Review outcome distribution | Slice | `views/quality/ui/QualityPage.test.tsx` | P0 |
| QA-3 | Policy violations table | Slice | `views/quality/ui/QualityPage.test.tsx` | P0 |
| QA-4 | Filtering by violation type | Integration | `e2e/quality.spec.ts` | P1 |

## Operations (OP)

| ID | Criteria | Test Type | Test File | Priority |
|----|----------|-----------|-----------|----------|
| OP-1 | Queue depth KPI + trend chart | Slice | `views/operations/ui/OperationsPage.test.tsx` | P0 |
| OP-2 | Failure rate breakdown by category | Slice | `views/operations/ui/OperationsPage.test.tsx` | P0 |
| OP-3 | SLA compliance % KPI | Slice | `views/operations/ui/OperationsPage.test.tsx` | P0 |
| OP-4 | Data polls every 60s | Unit | `views/operations/api/useOperations.test.ts` | P0 |
| OP-5 | Triage actions: retry/cancel | E2E | `e2e/operations.spec.ts` | P1 |

## Session Deep-Dive (SD)

| ID | Criteria | Test Type | Test File | Priority |
|----|----------|-----------|-----------|----------|
| SD-1 | Vertical timeline renders all steps | Widget | `widgets/session-timeline/ui/SessionTimeline.test.tsx` | P0 |
| SD-2 | Step cards with type/duration/cost/status | Widget | `widgets/session-timeline/ui/SessionTimeline.test.tsx` | P0 |
| SD-3 | Expand step → detail panel | Widget | `widgets/session-timeline/ui/StepDetailPanel.test.tsx` | P0 |
| SD-4 | Diff viewer: side-by-side, syntax highlighting | Widget | `widgets/diff-viewer/ui/DiffViewer.test.tsx` | P0 |
| SD-5 | Cost breakdown per-step bar chart | Widget | `widgets/cost-breakdown/ui/CostBreakdown.test.tsx` | P0 |
| SD-6 | Breadcrumbs: Dashboard > View > Team > Session | Widget | `widgets/breadcrumbs/ui/Breadcrumbs.test.tsx` | P1 |
| SD-7 | Deep linking with sessionId | E2E | `e2e/session-deep-dive.spec.ts` | P0 |

## Settings (ST)

| ID | Criteria | Test Type | Test File | Priority |
|----|----------|-----------|-----------|----------|
| ST-1 | Theme toggle persists | E2E | `e2e/settings.spec.ts` | P0 |
| ST-2 | Timezone selection reflects in dates | Integration | `views/settings/ui/SettingsPage.test.tsx` | P1 |
| ST-3 | Default view preference saved | E2E | `e2e/settings.spec.ts` | P1 |
| ST-4 | Profile info displayed read-only | Slice | `views/settings/ui/SettingsPage.test.tsx` | P0 |
| ST-5 | Avatar upload | Integration | `views/settings/ui/SettingsPage.test.tsx` | P1 |

## Cross-Cutting (CC)

| ID | Criteria | Test Type | Test File | Priority |
|----|----------|-----------|-----------|----------|
| CC-1 | Filter state serialized in URL | Unit | `features/filter-management/lib/URLSyncProvider.test.tsx` | P0 |
| CC-2 | Browser back/forward with filters | E2E | `e2e/navigation.spec.ts` | P0 |
| CC-3 | Sidebar navigation: 6 views + settings | Widget | `widgets/sidebar-nav/ui/SidebarNav.test.tsx` | P0 |
| CC-4 | Export CSV with current filters | E2E | `e2e/export.spec.ts` | P0 |
| CC-5 | Notification badge updates on mark read | Integration | `widgets/notification-center/ui/NotificationCenter.test.tsx` | P0 |
| CC-6 | Period comparison dashed overlay | Integration | `features/filter-management/ui/PeriodComparisonToggle.test.tsx` | P1 |
| CC-7 | Sidebar collapse on mobile | E2E | `e2e/responsive.spec.ts` | P1 |
| CC-8 | Unavailable views show "Desktop only" | Widget | `widgets/empty-state/ui/MobileUnavailable.test.tsx` | P1 |

## Summary

| Priority | Count | Coverage |
|----------|-------|----------|
| P0 | 35 | Must pass before deploy |
| P1 | 16 | Should pass, can be deferred |
| **Total** | **51** | |

| Test Type | Count |
|-----------|-------|
| Slice (unit) | 22 |
| Widget | 7 |
| Unit | 4 |
| Integration | 9 |
| E2E | 12 |
