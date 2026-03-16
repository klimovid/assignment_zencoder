# Customer-Facing Analytics Dashboard — Research Summary

> **FPF Patterns applied**: B.5 (Canonical Reasoning Cycle), A.10 (Evidence Graph), B.3 (Trust Calculus F-G-R), B.1 (Γ_epist Aggregation), A.3 (Transformer Quartet), A.7 (Strict Distinction)

---

## 0. Methodology (A.3 MethodDescription)

**Synthesis method**: Cross-source epistemic aggregation (Γ_epist) of three independent research reports on the same research brief, supplemented by targeted web research for gap-filling and temporal freshness.

**Reasoning cycle (B.5)**: For each domain area, the synthesis follows:
1. **Abduction** — hypothesis generated from cross-source pattern matching
2. **Deduction** — logical consequences derived, testable predictions identified
3. **Induction** — hypotheses validated against evidence from all sources + web research

**Confidence model (B.3)**: Each major claim is scored on:
- **F** (Formality): F0=informal opinion → F1=structured narrative → F2=reproducible schema → F3=formally verified
- **G** (Scope): coverage breadth in the domain
- **R** (Reliability): evidential support strength [0..1]
- **CL** (Congruence): cross-source terminology alignment; penalty Φ(CL) applied to R

**Aggregation rule (B.1 WLNK)**: Synthesis confidence never exceeds weakest source on any dimension. Where sources diverge, divergence is flagged explicitly.

**Limitations**: No direct access to Cursor internal analytics docs (limited public documentation). Factory AI analytics details inferred from OTEL patterns and marketing. Devin enterprise dashboard limited to API docs. Some features may have changed since research date (March 2026).

---

## 1. Symbol Carrier Register (A.10 SCR)

All materially used sources for this synthesis:

| ID | Carrier | Type | Date | F | G | R |
|----|---------|------|------|---|---|---|
| SC-01 | `gemini_dashboard_research.md` | Gemini Deep Research report | Mar 2026 | F1 | Medium | 0.7 |
| SC-02 | `openai_dashboard_research.md` | OpenAI Deep Research report | Mar 2026 | F2 | High | 0.85 |
| SC-03 | GitHub Copilot Metrics API docs | [docs.github.com](https://docs.github.com/en/rest/copilot/copilot-metrics) | Feb 2026 (GA) | F2 | Narrow (Copilot) | 0.95 |
| SC-04 | Claude Code Analytics API docs | [docs.claude.com](https://docs.claude.com/en/api/claude-code-analytics-api) | Mar 2026 | F2 | Narrow (Claude) | 0.95 |
| SC-05 | Amazon Q Developer Dashboard docs | [docs.aws.amazon.com](https://docs.aws.amazon.com/amazonq/latest/qdeveloper-ug/dashboard.html) | Mar 2026 | F2 | Narrow (Q Dev) | 0.95 |
| SC-06 | Devin Docs + API | [docs.devin.ai](https://docs.devin.ai/release-notes/2026) | Mar 2026 | F1 | Narrow (Devin) | 0.8 |
| SC-07 | DORA 2025 AI-Assisted Dev Report | [dora.dev](https://dora.dev/research/2025/dora-report/) | 2025 | F2 | High (industry) | 0.9 |
| SC-08 | SPACE Framework (Microsoft Research) | [microsoft.com/research](https://www.microsoft.com/en-us/research/publication/the-space-of-developer-productivity-theres-more-to-it-than-you-think/) | 2021 (foundational) | F2 | High | 0.9 |
| SC-09 | ClickHouse Multi-Tenancy docs | [clickhouse.com](https://clickhouse.com/docs/cloud/bestpractices/multi-tenancy) | 2025 | F2 | Narrow (ClickHouse) | 0.95 |
| SC-10 | Privacy-Preserving Analytics Patterns | [consensuslabs.ch](https://consensuslabs.ch/blog/designing-privacy-preserving-product-analytics) | 2025 | F1 | Medium | 0.7 |

**F-G-R scoring rationale**:
- SC-02 (OpenAI) rated higher than SC-01 (Gemini): OpenAI report contains direct citations to vendor docs, explicit competitor endpoint references, and quantified data points. Gemini report is more concise but less deeply evidenced.
- SC-03/04/05 (vendor docs) rated F2/R=0.95: primary sources, directly verifiable, but narrow scope (each covers only own product).
- SC-07 (DORA) rated F2/R=0.9: peer-reviewed research program, large sample, but 2025 data (pre-GA of several platforms).

---

## Executive Summary

**Abduction (B.5)**: Cloud agent execution platforms represent a new category where AI is not an assistant but an autonomous participant in SDLC. The analytics dashboard must solve a problem that no existing competitor has fully solved: giving organizations auditable visibility into autonomous non-human labor.

**Deduction**: If agents are autonomous actors (not assistants), then:
- Traditional "acceptance rate" metrics (Copilot model) are insufficient — agents produce complete PRs, not suggestions
- The primary unit of value shifts from "suggestions accepted" to "tasks resulting in accepted outcomes"
- Cost accountability becomes critical — agents consume compute + LLM tokens without human decision at each step
- Trust and safety metrics are first-class, not afterthought — agents can fail silently or expensively

**Induction — validated against evidence**:

| Hypothesis | Support | Confidence | Sources |
|------------|---------|------------|---------|
| Outcome metrics > output metrics for ROI | **Strong** — DORA 2025 found AI boosts output +98% PR but org delivery flat | R=0.85, F2 | SC-07, SC-02 |
| All competitors converge on org-level dashboards + API + export | **Strong** — Copilot GA Feb 2026, Claude API, Amazon Q, Devin API all confirmed | R=0.9, F2 | SC-03, SC-04, SC-05, SC-06 |
| Unit economics ($/task, $/PR) is a must-have | **Strong** — Devin ACU ($2.25), Claude token costs by model, Factory OTEL cost | R=0.85, F1 | SC-02, SC-06, SC-04 |
| Privacy-by-design is non-optional | **Strong** — Copilot ≥5 members threshold, Claude Zero Data Retention mode, GDPR Art 5 | R=0.9, F2 | SC-03, SC-04, SC-10 |
| CQRS + OLAP (ClickHouse) is the reference architecture | **Moderate** — pattern validated by ClickHouse docs + OpenAI research, but alternatives exist (StarRocks, BigQuery) | R=0.7, F2 | SC-09, SC-02 |

---

## 2. Dashboard Users & Decision Context

### Reasoning Cycle (B.5)

**Abduction**: Dashboard users are stratified not by job title but by **decision cadence and action type**.

**Deduction**: If cadence drives design, then:
- Daily users need diagnostic, action-oriented views (what broke, what's stuck)
- Weekly users need trend analysis and team comparison
- Monthly/quarterly users need portfolio ROI and cost trajectory
- Event-driven users need alerts and audit trails

**Induction**: Validated across all sources (SC-01, SC-02, SC-03, SC-04, SC-05):

| Role | Decision | Cadence | Surface | Evidence |
|------|----------|---------|---------|----------|
| **VP Engineering / CTO** | ROI, renewal/expansion, headcount vs agents | Monthly/Quarterly | Web, email digest | SC-02: Copilot positions metrics for "assess how AI influences throughput"; SC-01: "strategic ROI, resource allocation" |
| **Engineering Manager / Team Lead** | Enablement, task type safety, review bottlenecks | Daily/Weekly | Web, Slack | SC-02: "what failure modes exist, which workflows need enablement"; SC-03: Copilot DAU/WAU for adoption tracking |
| **Platform Engineering / DevEx** | Flow health, reliability, developer experience | Daily | Web | SC-07: DORA/SPACE-aligned throughput+stability; SC-08: SPACE multi-dimensional measurement |
| **Finance / FinOps** | Budget allocation, cost drivers, forecasting | Weekly/Monthly | Web, email | SC-06: Devin ACU limits with hard stop; SC-02: "cost per unit of value, not just raw spend" |
| **Security / Compliance** | Audit evidence, policy enforcement | Event-driven | Web, alerts | SC-05: AWS Q CloudTrail + prompt logs in customer S3; SC-01: "sandbox isolation integrity" |
| **IC Developer** | Personal efficiency, self-coaching | Real-time | Web, mobile | SC-01: "workflow efficiency, feedback loops"; SC-04: Claude Code personal usage stats |

**Design heuristic (A.7 — Strict Distinction)**: каждый dashboard module маппится на **решение** (not role). Role определяет access level и default view, но не content boundaries.

**Access pattern principle** (cross-validated SC-02, SC-05):
- **Web desktop** = deep analysis, configuration, export
- **Mobile** = consume/triage (Datadog model: view on mobile, edit on web) [SC-02]
- **Push** = scheduled digests + threshold alerts (Azure cost alerts, Vantage report notifications) [SC-02]

---

## 3. Metrics Taxonomy

### Reasoning Cycle (B.5)

**Abduction**: The metric model for autonomous agents differs from AI assistants. The funnel shifts from "suggestion → acceptance" to "task → execution → outcome."

**Deduction**: The adapted funnel:

```
Task Created → Agent Session Started → Execution Completed → PR Opened → PR Reviewed → PR Merged
     ↓              ↓                        ↓                  ↓            ↓              ↓
  Adoption      Engagement             Completion          Delivery     Quality         Outcome
```

**Induction**: funnel validated — Copilot uses "adoption → engagement → acceptance → PR lifecycle" [SC-03]; Claude Code tracks "sessions → PRs → lines of code → % merged PRs" [SC-04]; Devin tracks "sessions → PRs opened/merged" [SC-06].

### P0 — Must-have (первый релиз)

Each metric below has an evidence chain (A.10) back to sources:

#### Usage & Adoption

| Metric | Definition | Evidence Chain |
|--------|------------|----------------|
| Active users (DAU/WAU/MAU) | Users who ran ≥1 agent session, by org/team/repo | SC-03: Copilot DAU/WAU; SC-04: Claude daily active users; SC-05: Amazon Q active users (daily refresh) |
| Agent sessions/day | Interactive vs autonomous sessions | SC-04: Claude "sessions" metric; SC-06: Devin session-level tracking |
| Task funnel | Created → started → completed (conversion rates) | SC-02: "tasks created/started/completed; completion rate" |
| Task type distribution | Bugfix / feature / refactor / test / ops | SC-01: "feature utilization breadth"; SC-06: Devin sessions filterable by origin |
| Integration coverage | Repos, CI providers, ticketing providers connected | SC-02: Copilot slices by IDE/language/model |

#### Productivity & Outcomes

| Metric | Definition | Evidence Chain |
|--------|------------|----------------|
| Accepted outcome rate | Tasks → merged PR / closed ticket / adopted patch | SC-04: Claude "% of merged PRs with CC"; SC-03: Copilot PR lifecycle metrics |
| PR lifecycle | PRs opened/merged, median time to merge, review iterations | SC-03: Copilot GA Feb 2026 — PR creation/merge counts, median TTM; SC-02: Flow "Time to merge" definition |
| Time-to-first-PR | Time from task start to first PR opened | SC-02: derived from "time-to-first-signal" recommendation |
| Time-to-completion | End-to-end task duration including review | SC-01: "cycle time delta" |

#### Cost & Unit Economics

| Metric | Definition | Evidence Chain |
|--------|------------|----------------|
| Compute usage | microVM runtime, vCPU-seconds, memory-GB-seconds | SC-02: "AWS Firecracker launch <125ms, ~5MiB per microVM" |
| LLM usage | Tokens in/out by model, tool calls, retries | SC-04: Claude "token usage and costs by model"; SC-06: Devin ACU |
| Unit economics | $/task, $/merged PR, $/agent-hour | SC-06: Devin ACU @ $2.25; SC-04: Claude cost by model; SC-02: "cost per accepted outcome" |
| Budget governance | Caps per org/team, thresholds, alerts, forecast | SC-06: Devin org limits with hard stop; SC-02: Azure cost alerts model |

#### Quality & Risk

| Metric | Definition | Evidence Chain |
|--------|------------|----------------|
| CI pass rate | First-run CI pass rate for agent PRs | SC-01: "CI/CD Pass Rate"; SC-02: "CI pass rate on first run; retries; flaky test rate" |
| Review outcomes | Approved / changes requested / closed unmerged | SC-02: "review outcome rate" |
| Policy violations | Sandbox, network, permissions, secrets events | SC-01: "sandbox isolation integrity"; SC-05: AWS CloudTrail + CloudWatch alarms |
| Audit logs | Who executed what, where, with what permissions | SC-05: CloudTrail for API calls; SC-02: "100% audit logs, never sampled" |

#### Operations

| Metric | Definition | Evidence Chain |
|--------|------------|----------------|
| Queue depth & wait time | By region / environment tier | SC-02: "queue depth and wait time" recommendation |
| Failure rate & categories | Top failure reasons (deps, tests, permissions, flaky CI) | SC-02: "task success rate and top failure reasons" |
| SLA compliance | If priority execution sold | SC-02: "SLA compliance" |

### P1 — ROI storytelling & governance

| Metric | Confidence | Evidence |
|--------|------------|----------|
| Acceptance rate — % agent diffs accepted without major rewrite | R=0.7 | SC-02: analog from Copilot acceptance rate; adapted for autonomous context |
| Rework signals — reverts within N days, hotfix linkage | R=0.7 | SC-02: "rework signals" |
| Implicit Rejection Rate — undo/revert after agent commits | R=0.6 | SC-01: unique Gemini metric, limited external validation |
| Cycle Time Delta — reduction vs baseline | R=0.65 | SC-01: "AI reduces task size ~16%"; SC-07: DORA shows flat org delivery despite individual gains |
| HEH Saved — Human-Equivalent Hours | R=0.5 | SC-01: proposed metric, no industry standard methodology. **WLNK warning**: lowest confidence metric in taxonomy |
| Developer experience pulses — qualitative surveys | R=0.8 | SC-08: SPACE "Satisfaction and well-being" dimension; SC-07: DevEx emphasis |

### P2 — Advanced / Enterprise

| Metric | Confidence | Evidence |
|--------|------------|----------|
| Estimated "time saved" models | R=0.4 | SC-02: "GitHub emphasizes difficulty translating speed into downstream processes." **Highest uncertainty in taxonomy** |
| Cross-tool correlation (agent ↔ DORA) | R=0.5 | SC-07: DORA framework; requires integration maturity |
| Agent Loop Detection | R=0.7 | SC-01: unique Gemini metric; operationally verifiable |
| 12-month maintainability tracking | R=0.3 | SC-01: open question, no established methodology. **Not recommended for roadmap** |

### WLNK Assessment (B.1)

Per B.1 aggregation rule, synthesis confidence is bounded by weakest input per metric. Key WLNK flags:

- **HEH Saved (R=0.5)**: SC-01 proposes this metric but no industry benchmark exists. SC-07 (DORA) implicitly contradicts it — individual speedup ≠ org productivity gain. **Recommendation**: include as P1 with explicit "directional only" label.
- **Time saved models (R=0.4)**: SC-02 cites GitHub's own admission of difficulty. **Recommendation**: P2 at best; require confidence bounds in UI.
- **12-month maintainability (R=0.3)**: SC-01 flags as open question, no other source addresses. **Recommendation**: defer; requires longitudinal study.

---

## 4. Competitor Analysis

### Cross-Competitor Synthesis (Γ_epist)

**Abduction**: All major platforms converge on the same pattern: org-level dashboard + programmatic API + export to BI.

**Deduction**: If convergence is real, then this pattern is table stakes — differentiation must come from metric depth, UX, and autonomous-agent-specific features that assistive tools lack.

**Induction** — convergence confirmed with high confidence:

| Dimension | GitHub Copilot | Claude Code | Amazon Q | Devin | Evidence |
|-----------|---------------|-------------|----------|-------|----------|
| **Dashboard** | Org-level usage + code gen (GA Feb 2026) | claude.ai/analytics/claude-code | AWS Console dashboard | Built-in + API | SC-03, SC-04, SC-05, SC-06 |
| **API** | REST, NDJSON export, Power BI | REST (`/v1/organizations/usage_report/claude_code`), OTEL | CloudTrail, CloudWatch, S3 | REST (sessions, usage, insights) | SC-03, SC-04, SC-05, SC-06 |
| **Granularity** | Daily; ~2 day freshness | Daily; ~1hr API delay | Hourly (most); daily (users) | Session-level | SC-03, SC-04, SC-05, SC-06 |
| **Cost visibility** | Not directly exposed | Token usage & cost by model | Subscription-level | ACU ($2.25), org limits with hard stop | SC-04, SC-06 |
| **Privacy** | Team aggregates ≥5 members | Zero Data Retention disables contributions | User telemetry opt-in | Enterprise IdP integration | SC-03, SC-04, SC-05, SC-06 |
| **Attribution** | "Agent Contribution" bucket | Conservative counting (acknowledged undercounting) | Feature-level acceptance rates | Session + PR correlation | SC-03, SC-04, SC-05, SC-06 |

**Congruence assessment (B.3 CL):**
- **CL=2 (high alignment)**: Copilot ↔ Claude Code ↔ Amazon Q use similar vocabulary (adoption, acceptance, usage, PRs)
- **CL=1 (moderate)**: Devin uses different unit (ACU vs tokens) and session-level rather than daily aggregation
- **CL=0 (low)**: Factory AI and Cursor have limited public docs; claims about their analytics carry higher uncertainty

**Differentiation opportunity for our platform** (deduced, not validated):
- **Session Deep-Dive with reasoning chain** — only Devin offers "Glass-Box" reasoning; most platforms show only aggregate metrics
- **Autonomous agent-specific operations** — queue depth, failure categorization, sandbox health metrics are unique to execution platforms
- **Cost per outcome** — most platforms show raw cost; few tie it to accepted outcomes ($/merged PR)

---

## 5. Data Architecture

### Reasoning Cycle (B.5)

**Abduction**: Analytics infrastructure must be decoupled from transactional system (CQRS) with event-sourced data, served through an OLAP store optimized for multi-tenant aggregation queries.

**Deduction**: If CQRS + Event Sourcing, then:
- Write model (transactional) is unaffected by analytics query load
- Read model (OLAP) can be rebuilt from event log
- Pre-aggregation (materialized views) enables sub-second dashboard queries
- Multi-tenant isolation must be enforced at OLAP layer (not just API)

**Induction**:

| Claim | Support | R | Sources |
|-------|---------|---|---------|
| CQRS + materialized views for read-heavy dashboards | Strong | 0.85 | SC-02: explicit recommendation; SC-09: ClickHouse materialized view rollups |
| ClickHouse as OLAP store | Moderate | 0.7 | SC-01: recommends ClickHouse/StarRocks; SC-09: multi-tenant best practices documented; alternatives exist (BigQuery, Druid) |
| Kafka/Redpanda for event streaming | Strong | 0.85 | SC-01: "Kafka or Redpanda"; SC-02: "stream ingestion" recommendation; validated by platform architecture (CLAUDE.md) |
| Row-Level Security for tenant isolation | Strong | 0.9 | SC-09: ClickHouse row_policy; SC-01: RLS for shared tables; SC-02: AWS multi-tenant guidance |
| OTEL export for enterprise customers | Strong | 0.85 | SC-04: Claude OTEL telemetry; SC-02: Factory OTEL-first design; industry trend confirmed by web research |

### Reference Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                    Platform (Transactional)                       │
│  Task API → Temporal Workflows → Agent Runtime → PR Delivery     │
└──────┬───────────────────────────────────────────────────────────┘
       │ Canonical Analytics Events (immutable, versioned schema)
       ▼
┌──────────────┐     ┌──────────────────┐     ┌────────────────┐
│ Kafka/Redpanda│────▶│ Stream Processor │────▶│ ClickHouse     │
│ (Event Bus)   │     │ (Flink/Benthos)  │     │ (Hot OLAP)     │
└──────┬───────┘     └──────────────────┘     └──────┬─────────┘
       │                                              │
       │ Raw events                          Rollups/Aggregates
       ▼                                              ▼
┌──────────────┐                             ┌────────────────┐
│ Object Store  │                             │ Analytics API  │
│ (S3/GCS)     │                             │ (REST + GraphQL)│
│ Cold storage  │                             └──────┬─────────┘
└──────────────┘                                     │
                                    ┌────────────────┼────────────────┐
                                    ▼                ▼                ▼
                              Dashboard UI    Customer API     OTEL Export
                              (Web + Mobile)  (CSV/NDJSON)     (Enterprise)
```

### Data Freshness Tiers

| Category | Freshness | Justification | Evidence |
|----------|-----------|---------------|----------|
| Operational (queue, SLA, failures) | Minutes | Action-oriented triage | SC-02: operational monitoring recommendation |
| Usage analytics (sessions, adoption) | Hourly–daily | SC-05: Amazon Q hourly; SC-03: Copilot ~2 days; SC-04: Claude ~1hr | Industry range validated |
| ROI / executive reporting | Daily/weekly | Stability preferred | SC-02: "daily/weekly is sufficient for trust" |
| Audit / security events | Near-real-time | Compliance requirement | SC-05: CloudTrail streaming; SC-02: "100% audit logs, never sampled" |

### Retention Tiers

| Tier | Data | Retention | Precedent |
|------|------|-----------|-----------|
| Hot | Aggregates (rollups) | 12–24 months | Dashboard query performance |
| Warm | Per-run traces/logs | 14–90 days | SC-03: Copilot 90 days activity; configurable |
| Cold | Raw events (immutable) | 12 months | SC-03: Copilot API up to 1 year; SC-04: Claude "no specified deletion" |
| Archive | Audit/security logs | SOC 2 min 1 year | Customer-controlled export for longer |

---

## 6. Dashboard UX — Information Architecture

### Recommended Views

| Page | Target User | Content | Mobile |
|------|-------------|---------|--------|
| **Executive Overview** | VP Eng, CTO | Adoption trends, accepted outcomes, unit cost, risk posture, deltas (7/30/90d) | KPI tiles |
| **Adoption & Usage** | Eng Manager | DAU/WAU/MAU, sessions, tasks by team/repo/type, rollout tracking | Partial |
| **Delivery Impact** | Eng Manager, VP | PR throughput, TTM, completion cycles, agent vs non-agent comparison | No |
| **Cost & Budgets** | FinOps, Admin | Spend by team/repo/model/type, forecasts, budget alerts | Alerts only |
| **Quality & Security** | Security, Admin | CI/review outcomes, policy violations, audit trail | Alerts only |
| **Operations** | Platform Eng | Queue/SLA, failure reasons, runtime distributions | Triage view |
| **Session Deep-Dive** | Eng Manager, Dev | Agent reasoning timeline, diff views, step trace | No |

**Evidence**: IA pattern validated against SC-02 (Copilot split: usage vs code-gen dashboards), SC-01 (Gemini: "Executive Pulse, Team Center, Security Portal, Session Deep-Dive"), Linear Insights drill-down model.

### UX Principles (cross-validated)

- **Progressive disclosure**: Summary → Team → Repo → Session → Object [SC-02, Linear model]
- **F-pattern layout**: core KPIs top-left [SC-01]
- **Slicing essential**: by team, repo, language, model, task type, time window [SC-03, SC-05]
- **Mobile = consume + triage**: view-only, 1-2 column, 44x44px touch targets [SC-01, Datadog model per SC-02]
- **Anti-leaderboard**: avoid individual rankings as default (see Privacy section) [SC-07, SC-08]

---

## 7. Privacy, Ethics & Anti-Patterns

### Reasoning Cycle (B.5)

**Abduction**: Developer analytics inherently tension between organizational visibility and individual privacy. Anti-patterns emerge when metrics designed for org-level decisions are applied to individual evaluation.

**Deduction**: If metrics are perceived as surveillance:
- Developers game the system (Goodhart's law) → metrics lose signal
- Talent retention risk → net negative ROI
- GDPR enforcement risk (EU) → legal liability

**Induction** — strong cross-source validation:

| Anti-Pattern | Why Harmful | Evidence | R |
|--------------|-------------|----------|---|
| Individual LOC rankings as default | Incentivizes bloat, ignores quality | SC-03: GitHub calls LoC "directional"; SC-07: DORA warns; SC-08: SPACE multi-dimensional | 0.9 |
| Stack ranking by commit frequency | Encourages low-value automation | SC-01: explicit anti-pattern; SC-07: DORA warns against competing | 0.85 |
| "Collect everything forever" | GDPR violation, breach risk | GDPR Art 5(1)(c) minimization, Art 5(1)(e) storage limitation | 0.95 |
| Leaderboards without guardrails | Surveillance perception, morale erosion | SC-04: Claude Code has leaderboard — high risk for autonomous platform | 0.8 |

### Privacy-by-Design Requirements

1. **Cohort threshold ≥5**: suppress breakdowns for groups <5 [SC-03: Copilot precedent, R=0.95]
2. **Default team/org aggregation**: per-user views require explicit admin enablement [SC-02, SC-03]
3. **Conservative attribution**: acknowledged undercounting > overclaiming [SC-04: Claude approach]
4. **Privacy modes**: enterprises can disable analytics or enforce zero retention [SC-04: Claude Zero Data Retention]
5. **Separate org telemetry from vendor telemetry**: [SC-05: Amazon Q model — org collection separate from AWS corporate usage]
6. **Published retention tiers**: customer-controlled export for longer retention [SC-03: NDJSON; SC-05: S3 reports]
7. **Right to explanation**: reasoning traces for automated actions (GDPR Article 22) [SC-01]
8. **Differential privacy**: noise injection for sensitive small-group aggregates [SC-10]

---

## 8. Risks & Uncertainties

### Risks (ranked by severity × evidence strength)

| # | Risk | R | Mitigation | Sources |
|---|------|---|------------|---------|
| 1 | **AI Productivity Paradox** — high agent output, flat org delivery → trust erosion | 0.9 | Anchor on outcome metrics (merged PRs), show DORA delivery trends alongside adoption | SC-07 |
| 2 | **Surveillance Backlash** — devs feel monitored | 0.85 | Cohort ≥5, team aggregation default, no individual rankings, transparent data policy | SC-07, SC-08, SC-10 |
| 3 | **Metric Gaming** — trivial PRs to inflate throughput | 0.8 | Track accepted outcome rate + rework signals; task complexity classification | SC-01, SC-07 |
| 4 | **Cloud Bill Shock** — uncontrolled cost acceleration | 0.8 | Budget caps with hard stops (Devin pattern), anomaly detection, forecasting | SC-06 |
| 5 | **Attribution Errors** — mis-attributed PRs/tasks | 0.75 | Conservative rules (Claude approach), integration health monitoring, data quality indicators | SC-04, SC-06 |
| 6 | **Reviewer Burnout** — high-volume agent output overwhelms humans | 0.7 | Review friction signals, queue depth alerts, batching recommendations | SC-01 |
| 7 | **Trust Gap** — managers can't understand why agent failed | 0.7 | Session Deep-Dive with reasoning chain (Devin "Glass-Box" pattern), failure categorization | SC-01, SC-06 |

### Uncertainties (B.3 — low F or low R areas)

| Area | F | R | Issue |
|------|---|---|-------|
| ROI measurement methodology | F1 | 0.4 | No industry consensus. GitHub acknowledges difficulty. DORA shows paradox. |
| Attribution standards | F0 | 0.5 | No standard for "agent-authored" vs "agent-assisted." Each vendor uses own definition. |
| HEH benchmarking | F0 | 0.3 | No methodology for calibrating senior vs junior baseline. Gemini open question. |
| Long-term code quality | F0 | 0.3 | 12-month maintainability tracking has no established methodology. |
| Mobile dashboard scope | F1 | 0.5 | "Full analytics" vs "Alert & Kill Switch" — product decision, not research question. |

---

## 9. Open Questions (Require Product Decisions)

| # | Question | Impact | Recommendation | CL |
|---|----------|--------|----------------|-----|
| 1 | **Primary unit of value**: merged PR, closed ticket, deploy, or hours saved? | Defines ROI narrative | PR-based (Copilot/Claude precedent) + ticket lifecycle as differentiator | CL=2 |
| 2 | **Attribution policy**: agent-authored vs agent-assisted threshold? | Affects all contribution metrics | Conservative counting with transparency (Claude model) | CL=2 |
| 3 | **Per-user visibility**: enable or disable? guardrails? | Privacy risk vs enablement value | Enable with cohort ≥5, admin opt-in, anonymization option | CL=2 |
| 4 | **Data freshness**: hourly ops vs daily usage vs weekly ROI? | Architecture complexity & cost | Three-tier model (minutes / hourly / daily) | CL=3 |
| 5 | **Enterprise export**: stream all telemetry to customer storage? | Enterprise sales requirement | Yes for higher tiers (OTEL + S3, Factory/AWS pattern) | CL=2 |
| 6 | **Leaderboard**: include or exclude? | High risk (DORA/SPACE warn) vs Claude includes it | Exclude from default; optional with admin policy + clear framing | CL=1 |
| 7 | **Mobile scope**: full dashboard or alert+KPI only? | Development effort | Alert + KPI + triage (Datadog mobile precedent) | CL=2 |
| 8 | **HEH methodology**: how to calibrate? | P1 metric feasibility | Defer to P2; requires longitudinal study | CL=0 |

---

## 10. Next Steps

1. **Resolve open questions** (section 9) — product decisions before architecture
2. **C4 Container diagram** — incorporate: Analytics Service, OLAP Store (ClickHouse), Analytics API, Event Bus (Kafka) as containers
3. **PRD for dashboard** — use P0 metric taxonomy, recommended pages, UX principles
4. **C4 Component diagram** — zoom into Analytics Service: Event Processor, Aggregation Engine, Query Service, Export Service
5. **Data model** — canonical event schemas, rollup materialized views
6. **Prototype** — Executive Overview + Cost & Budgets as MVP pages

---

## Audit Trail (A.3 Work Record)

| Step | Action | Output |
|------|--------|--------|
| 1 | Read research brief (`dashboard_research_prompt.md`) | Scope definition |
| 2 | Read SC-01 (Gemini) and SC-02 (OpenAI) research reports | Primary evidence base |
| 3 | Web research: Copilot Metrics API GA, DORA 2025, SPACE, ClickHouse multi-tenant, Claude Analytics API, Amazon Q Dashboard, Devin API, privacy patterns | Gap-filling, freshness validation |
| 4 | Source scoring (B.3 F-G-R) | SCR table (section 1) |
| 5 | Per-section B.5 reasoning cycles (Abduction → Deduction → Induction) | Auditable claim chains |
| 6 | WLNK assessment (B.1) | Confidence bounds on all P1/P2 metrics |
| 7 | Cross-source congruence assessment (B.3 CL) | Terminology alignment scored |
| 8 | Synthesis into final report | This document |
