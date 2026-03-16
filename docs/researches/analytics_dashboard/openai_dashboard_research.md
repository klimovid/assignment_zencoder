# Customer-Facing Analytics Dashboard for a Cloud Agent Execution Platform

## Dashboard users and decision contexts

**Key findings (who uses org-level analytics in developer tooling, and why)**  
Engineering-tool analytics dashboards are consistently targeted at *organizational decision-makers* (not individual developers) with explicit emphasis on adoption, value, and governance. GitHub Copilot’s metrics are accessible to enterprise owners, org admins, and billing managers (plus custom roles with explicit “view metrics” permissions), reflecting the “engineering leadership + admin/billing” stakeholder set. citeturn3view1turn7search23turn11search22 Claude Code similarly scopes analytics access to organizational “Owners/Admins” (and billing roles in Console), and explicitly positions the analytics as monitoring “productivity metrics and adoption patterns across teams.” citeturn13view5turn13view6turn13view7 Flow (Pluralsight/Appfire) frames its setup and insights for roles like CTOs, engineering managers, and team leads—again emphasizing leadership visibility rather than personal productivity scoring. citeturn15view4turn15view2

For a cloud agent execution platform (ticket → PR in isolated microVMs), the natural primary dashboard personas cluster into:

- **Engineering Manager / Team Lead (weekly operational cadence):** needs to understand whether agents are unblockers or bottlenecks, what failure modes exist (CI failures, flaky tests, missing context, permissions), and which workflows need enablement. Copilot’s docs explicitly position metrics for monitoring adoption evolution over time and for identifying areas where additional enablement/communication may drive value. citeturn7search23turn8search15  
- **VP Engineering / CTO (monthly/quarterly executive cadence):** wants portfolio-level adoption and productivity signals without noisy per-user detail. Copilot explicitly warns about scope/attribution differences and recommends using multiple signals (e.g., steady DAU + rising acceptance) rather than a single number. citeturn18view0turn7search32  
- **Platform Engineering / DevEx leader:** focuses on throughput/flow, reliability, and developer experience; typically uses DORA/SPACE/DevEx-aligned rollups rather than “output” proxies. citeturn21view0turn5search0turn5search2  
- **Finance / Procurement / FinOps (monthly close + renewal planning):** needs spend allocation, cost drivers, and forecasting. Devin’s admin/billing documentation is explicit about tracking consumption and enforcing organization limits that stop usage once budgets are reached—this is the archetype of the “cost guardrails” expectation. citeturn13view2  
- **Security / Compliance:** wants policy enforcement signals, auditability, and evidence of data handling controls; AWS’s Q Developer monitoring model is instructive: CloudTrail for API calls, CloudWatch for metrics/dashboards/alarms, plus optional prompt logs. citeturn19view3turn19view4  

**Decisions each user type actually makes from dashboard data**  
A useful design heuristic: every dashboard module should map to a decision and an action.

- **Eng Manager / Team Lead decisions:**  
  - “Should we expand agent usage to more repos/teams, or fix enablement first?” (look for adoption + completion rate + failure reasons) citeturn18view0turn7search23  
  - “Which task types are safe to automate vs require more review?” (compare success/merge rates and CI pass rates by task category; analogous to how Copilot separates adoption/engagement/acceptance and PR lifecycle outcomes). citeturn18view0turn7search1  
  - “Where are PR bottlenecks?” (Flow’s “time to merge” and Copilot’s “median time to merge” framing demonstrate how PR lifecycle metrics are used as flow health signals). citeturn15view1turn18view0  

- **VP Eng / CTO decisions:**  
  - “Are we getting enterprise-level ROI and should we renew/expand?” GitHub frames usage metrics as helping stakeholders assess how AI-assisted workflows influence PR throughput and time to merge, and offers NDJSON exports for BI/long-term storage—strongly implying executive reporting/board metrics. citeturn18view0  
  - “Are speed and stability moving together?” DORA explicitly says top performers do well across throughput and stability, and warns against competing across teams or setting metrics as goals (Goodhart’s law). citeturn21view0  

- **FinOps / Procurement decisions:**  
  - “Where is spend concentrated (team/repo/workflow) and what levers reduce cost?” Factory’s enterprise analytics highlights cost estimates for LLM usage and “top workflows/droids by frequency,” and ties hosted dashboards to OTEL signals (enabling cost accountability plus instrumentation reuse). citeturn13view3turn13view4  
  - “Do we need budget caps / stop-loss / auto-reload?” Devin supports explicit org limits that halt usage at the cap, and describes “auto-reload” patterns on credit-based plans (very relevant if your platform uses credits or metered compute/token billing). citeturn13view2  

- **Security / Compliance decisions:**  
  - “Do we have audit evidence of agent actions and prompts?” AWS Q Developer provides prompt logs and user activity telemetry reports stored in customer-controlled S3, plus CloudTrail capture of API calls, reflecting a standard control-plane audit requirement. citeturn19view3turn19view4  

**Daily operational use vs monthly executive review: usage pattern implications**  
Daily/weekly use tends to be diagnostic and action-oriented: “what broke,” “why did tasks fail,” “where are we stuck,” “who needs enablement.” Monthly review tends to be trend-based: adoption curves, cost per unit, throughput/flow changes, and risk posture. Copilot’s own product design evidences this split by providing (a) dashboards visualizing 28‑day trends and (b) export/API access for deeper analysis and longer retention. citeturn18view0turn3view4

**Typical access patterns: web, mobile, and push reporting**  
Modern infra/devtools products assume a multi-surface pattern: desktop web for deep analysis, mobile for monitoring/triage, and push for summaries/alerts.

- **Mobile:** Datadog’s mobile app explicitly supports viewing dashboards and triage objects (alerts, incidents) while noting some widget limitations and that editing is web-only—an important precedent for your “mobile = consume/triage” posture. citeturn11search0turn11search24 New Relic similarly supports mobile dashboards (viewing web-created dashboards with variables) and mobile alerting. citeturn11search33turn11search9  
- **Email/Slack digests:** Cost and reporting tools commonly support scheduled report notifications to Slack/Teams/email (example: Vantage automated report notifications, with daily/weekly/monthly scheduling). citeturn11search3 Budget alerting patterns in cloud billing also strongly emphasize threshold-triggered notifications (Azure cost alerts; Google Cloud budget notifications). citeturn11search11turn11search31  

**Recommendations (what this means for your dashboard design)**  
Design the dashboard as a *decision system*, not a “vanity metric wall.”

- Make the homepage a “leadership summary” (adoption + value + cost + risk), but let managers drill into “operational health” (failure modes, queue/SLA, PR outcomes). This mirrors Copilot’s split between adoption/usage dashboards and code-generation/PR lifecycle reporting. citeturn18view0turn7search7  
- Treat mobile as a *triage and monitoring surface*: show KPI deltas, alerts, anomalies, and top issues; leave configuration and deep slicing for desktop web (consistent with Datadog’s “view on mobile, edit on web” model). citeturn11search0turn11search24  
- Provide scheduled digests (email + Slack) for monthly exec review and weekly manager check-ins, and threshold alerts for budget/SLA and security violations (aligned with cloud cost alert norms). citeturn11search3turn11search11turn19view3  

**Data points and concrete patterns to reuse**  
- Copilot dashboard focuses on *28‑day trends*, with NDJSON export for BI/long-term storage. citeturn18view0  
- Copilot data freshness expectation: “within two full UTC days” after the day closes. citeturn18view0  
- AWS Q Developer dashboard updates hourly for most metrics; “Active users” widget updates daily (UTC). citeturn19view0  
- GitHub Copilot team-level aggregates are only available for teams with **≥ 5** Copilot license holders (privacy-preserving cohorting). citeturn8search25  

## Metrics and KPIs for a cloud agent execution platform

Below is a metric model specifically tailored to “ticket → PR” autonomous execution in isolated environments, using proven patterns from AI coding analytics (Copilot, Claude Code, Amazon Q Developer), engineering analytics (Flow), and delivery frameworks (DORA/SPACE/DevEx).

**Key findings (what successful platforms measure)**  
The most transferable pattern across AI coding analytics products is the “Adoption → Engagement → Acceptance/Outcome” funnel:

- **Adoption and engagement** are first-class categories in Copilot usage metrics, along with acceptance rate, LoC measures, and PR lifecycle outcomes. citeturn18view0turn7search1  
- **Outcome/ROI framing** is anchored on PR and shipping impact: Claude Code’s “contribution metrics” quantify PRs with Claude Code, lines shipped with Claude Code, and the percentage of merged PRs with assistance, explicitly cautioning that the metrics are conservative and undercount impact. citeturn13view6  
- **Acceptance metrics** are common: Claude Code tracks suggestion accept rate and lines accepted; Amazon Q Developer tracks accepted lines of code and acceptance rates for several feature categories. citeturn13view5turn19view1  
- **Cost metrics** are increasingly explicit: Factory includes token consumption and estimated costs by model; Claude Code Analytics API includes token usage and estimated costs broken down by Claude model. citeturn13view4turn13view7 Devin uses a credit-like unit (ACU) with budget controls and hard stop on limit. citeturn13view2  
- **Flow/engineering analytics vendors** define PR flow metrics precisely (e.g., Time to merge), emphasizing that context (draft PRs, time zones, review requirements) materially affects interpretation. citeturn15view1  

### Usage and adoption metrics

**Recommendations**  
Measure “real adoption” as *meaningful agent usage that produces accepted outcomes*, not merely “logins” or “tasks created.”

- Use a multi-level adoption model: org → team → repo → workflow/task type, similar to Factory’s “by org, team, repository.” citeturn13view3  
- Track “active users” and “sessions” over time (Claude Code shows active users and sessions daily, and provides org-level trends). citeturn13view5  
- Include “surface” context: IDE/vendor/tooling integrations. Copilot slices by IDE/language/model; Amazon Q filters by language, customization, IDE vendor. citeturn18view0turn19view0  

**Data points / concrete metric examples**  
- Copilot adoption example: DAU and WAU are explicit adoption indicators. citeturn18view0  
- Claude Code “activity trends”: daily active users and sessions, plus lines accepted over time. citeturn13view5  

**Cloud agent platform P0 candidates (definition-ready)**  
- Active users (DAU/WAU/MAU) by org/team/repo  
- Active agent sessions per day (interactive vs autonomous)  
- Tasks created / tasks started / tasks completed  
- Task type distribution (bugfix/feature/refactor/test/ops)  
- Integration coverage: repos connected, CI providers connected, ticketing providers connected  

### Productivity and ROI metrics

**Key findings**  
Developer productivity measurement is contested; the best practice is *multi-dimensional measurement* (SPACE), with delivery/flow outcomes (DORA) plus qualitative signals (DevEx, self-reported). citeturn5search0turn21view0turn5search2turn5search15

AI coding ROI evidence exists but must be contextualized:
- A controlled study of GitHub Copilot found the treatment group completed a coding task **55.8% faster** than control. citeturn6search5turn6search24  
- GitHub’s own materials similarly highlight “55% faster” task completion and explicitly note the harder question: how time saved translates into collaborative processes like code review. citeturn6search13turn6search1  

**Recommendations**  
For an autonomous agent platform, ROI must be framed as *throughput and flow improvement* plus *cost per accepted outcome*, with guardrails against “output theater.”

- Anchor productivity reporting on **delivery outcomes** (PR merged, ticket moved to Done, lead time reductions) rather than LOC, story points, or commit counts alone. DORA explicitly warns against “one metric to rule them all,” metric gaming, and competing across teams. citeturn21view0  
- Provide **PR lifecycle metrics** (time to merge, PR counts) because they map to organizational flow health; Copilot uses PR lifecycle metrics including PR creation and merge counts and “median time to merge.” citeturn18view0  
- If you include “lines of code changed,” label it as directional/diagnostic, not performance scoring—mirroring GitHub’s explicit framing that LoC is directional. citeturn7search1  

**Data points / concrete metric examples**  
- Copilot PR lifecycle metrics include PR creation/merge counts, median time to merge, and review suggestion activity, used to evaluate influence on throughput/cycle time. citeturn18view0  
- Flow defines “Time to merge” as average hours between PR creation and merge, includes time in draft status, and highlights context factors (time zones, cross-team reviews). citeturn15view1  
- Claude Code contribution metrics: “PRs with CC,” “Lines of code with CC,” and “% of merged PRs with CC,” with conservative attribution rules. citeturn13view6  

**Cloud agent platform ROI metrics (strong P0/P1 set)**  
- PRs opened / PRs merged where *agent is primary author* (with transparent attribution rules)  
- Median time from task start → PR opened (agent runtime + queue)  
- Median time from PR opened → merged (flow; integrates review/CI)  
- “Accepted outcome rate”: tasks that end in merged PR / closed ticket / adopted patch  
- “Cost per accepted PR” and “cost per completed task” (compute + LLM)  
- Developer satisfaction / confidence signals (lightweight in-product survey prompts) aligned with DevEx’s emphasis on feedback loops and flow. citeturn5search2turn5search15  

### Quality and risk metrics

**Key findings**  
AI tooling dashboards are expanding from “usage” to “risk controls and compliance.” Anthropic explicitly advertises integrating Claude data into compliance dashboards and managing retention via selective deletion. citeturn12search6 AWS Q Developer’s monitoring stack includes CloudTrail, CloudWatch metrics/alarms, user telemetry reports, and prompt logs, reflecting a mature compliance posture. citeturn19view3turn19view4

**Recommendations**  
Treat quality/risk as first-class, not an afterthought: agents change the social/technical flow (more code faster can overwhelm review).

- Track *downstream quality gates*: CI pass rate, test coverage deltas, rework/revert indicators, post-merge incident flags.  
- Provide “review friction” signals: PR reopened, changes requested, review cycles—because PR review is where AI-created throughput often bottlenecks. citeturn15view1turn18view0  
- Secure-by-design analytics: report policy violations and data handling controls; provide auditability (who executed what, where, with what permissions).

**Data points / concrete metric examples**  
- Amazon Q tracks code review events and findings reports, and distinguishes manual vs auto-generated code reviews. citeturn19view1  
- Amazon Q user activity reports enumerate fine-grained acceptance/rejection/dismissal metrics per feature surface (inline, chat, doc/test commands), illustrating the level of detail enterprises may request. citeturn19view2  

**Cloud agent platform quality/risk metric candidates**  
- PR CI pass rate on first run; retries; flaky test rate  
- Review outcome rate: approved vs changes requested vs closed/unmerged  
- Revert rate within N days; hotfix linkage rate  
- Security policy violations in sandbox (network egress blocked, forbidden domains, privilege escalation attempts)  
- Secrets detection events (attempted secret exposure, secret scanning hits)  
- Prompt/data governance events (sensitive file access attempts, PII detectors triggered)  

### Cost and resource consumption metrics

**Key findings**  
AI devtool vendors and observability/cost platforms converge on a few patterns:

- **Track usage by model and cost driver:** Factory exposes token consumption by model/user and estimated costs. citeturn13view4 Claude Code Analytics API includes token usage and estimated costs broken down by model, plus tool-level acceptance/rejection and productivity activity (commits/PRs). citeturn13view7  
- **Budget caps and hard stops are expected:** Devin supports org-level ACU limits that stop work when reached, and documents “auto-reload” behavior in credit systems. citeturn13view2  
- **Cost allocation and budgets are core UX in infra platforms:** Datadog supports budgets and budget summary widgets in Cloud Cost Management. citeturn2search29 Azure cost management supports budget alerts and anomaly alerts. citeturn11search11  

**Recommendations**  
For a cloud agent execution platform, cost must be explained as *unit economics*:

- Always present **cost per unit of value** (per completed task, per merged PR, per successful run), not just raw spend.  
- Provide **cost allocation dimensions**: team, repo, task type, environment tier, model, and “agent autonomy level” (more autonomy often means longer runs / higher token usage).  
- Provide **forecasting and alerting**: budget thresholds, anomaly detection, and projected month-end spend.

**Data points / concrete examples**  
- Devin pricing example: “Each ACU costs $2.25” (credit-based unit economics). citeturn13view2  
- Claude Code Analytics API: daily aggregation; includes cost analysis and token usage by Claude model; data freshness “up to 1-hour delay.” citeturn13view7  
- AWS Firecracker performance/overhead reference points that affect per-task compute economics: AWS described microVM launch “as little as 125 ms” and ~“5 MiB” memory per microVM (historical but still useful directional guidance). citeturn20search12  

**Cloud agent platform cost/resource metrics (P0/P1)**  
- Compute: microVM runtime seconds, vCPU-seconds, memory‑GB‑seconds, storage I/O, network egress  
- LLM: tokens in/out by model, tool calls, retries, context size  
- Unit economics: $/task, $/merged PR, $/successful CI pass, $/agent-hour  
- Budget & governance: spend caps per org/team, alert thresholds, forecasted month-end  

### Operational and reliability metrics

**Key findings**  
The AI-agent execution platform is also a distributed system; operational health strongly shapes perceived product quality.

- Copilot sets expectations that dashboard data is not real-time (up to ~2 days), while AWS Q Developer shows a more “ops-like” near-real-time approach (hourly updates for most metrics). This demonstrates that “freshness” is a product choice tied to operational needs. citeturn18view0turn19view0  
- CQRS/materialized views are commonly recommended patterns for read-heavy dashboards, with eventual consistency as the tradeoff. citeturn9search39turn9search3  

**Recommendations**  
Define operational SLOs for agent execution and reflect them directly:

- Queue depth and wait time (by region / environment tier)  
- Task success rate and top failure reasons (dependency install, tests fail, permissions, flaky CI, repo access)  
- Time-to-first-signal (first plan, first commit, first PR) to reassure users and debug stuck sessions  
- SLA compliance (if you sell “priority execution”)  

**Data points**  
- GitHub Copilot usage metrics data freshness: “within two full UTC days.” citeturn18view0  
- AWS Q Developer: most metrics update hourly; Active users widget is daily; user telemetry CSV report generated daily at midnight UTC and saved into S3 with a deterministic path. citeturn19view0turn19view4  

## Competitor analytics and reporting capabilities

This section focuses on the products you listed, plus a small number of highly relevant adjacent references (Amazon Q Developer, Claude Code) because they publish unusually concrete analytics specifications.

**Key findings (cross-competitor patterns)**  
Across competitors, the most consistent patterns are:

- **Org-level dashboards + programmatic export/API** are becoming standard (Copilot, Claude Code, Factory, Devin, Linear). citeturn18view0turn13view7turn13view4turn13view1turn17view0  
- **Near-real-time is rare for “productivity dashboards”;** daily/hourly aggregation is common (Copilot up to ~2 days; Claude Code API ~1-hour delay; Amazon Q mostly hourly). citeturn18view0turn13view7turn19view0  
- **Privacy thresholds and conservative attribution** are explicit in leading products: Copilot’s team aggregates require ≥5 license holders; Claude Code describes conservative attribution and notes contribution metrics are unavailable under “Zero Data Retention.” citeturn8search25turn13view6  
- **Cost controls and budgeting** are moving from “billing page” into analytics UX. Devin’s consumption caps and stop behavior are explicit. citeturn13view2  

### GitHub Copilot Business/Enterprise

- **Dashboards/reports:** Copilot usage metrics dashboard (28‑day trends) + code generation dashboard; also NDJSON export and APIs. citeturn18view0turn7search7turn7search1  
- **Metrics exposed:** adoption (DAU/WAU), engagement, acceptance rate, LoC suggested/added/deleted, PR lifecycle metrics (PR creation/merge counts, median time to merge, review suggestion activity). citeturn18view0turn7search1  
- **Granularity/freshness:** updated on a schedule; expectation data available within two full UTC days after the day closes. citeturn18view0  
- **Export/integration:** NDJSON export for BI/long-term storage; REST API endpoints provide download links for daily and 28‑day reports with signed URLs. citeturn18view0turn3view4  
- **Privacy:** team-level aggregates only for teams with **≥ 5** Copilot license holders. citeturn8search25  

### Devin

- **Dashboards/reports:** docs state Devin has a built-in usage dashboard; also encourages building custom dashboards via API. citeturn13view0  
- **Metrics exposed:** enterprise usage metrics endpoint returns session count, searches count, PR counts opened/closed/merged. citeturn13view1  
- **Data quality caveat:** PR/MR enrichment depends on integrations; GitLab on-prem MR status sync “only once a day,” causing temporarily misrepresented status. citeturn13view1  
- **Cost & controls:** ACU consumption tracked at enterprise and org level; admins can set org ACU limits that stop activity when reached; Core plan ACU price listed as **$2.25 per ACU**. citeturn13view2  

### Cursor

Publicly accessible Cursor team analytics documentation was not fully parseable in this research session; however, Cursor’s documentation search snippets indicate enterprise/team dashboards and APIs that track AI requests, model usage, consumption, spending, and user activity—broadly consistent with the “usage + model + cost + export” pattern. citeturn0search25turn0search33turn0search40turn0search22  
**Recommendation:** treat Cursor as validation that buyers expect “model-level cost/usage analytics + admin APIs,” but rely on directly verifiable requirements from Copilot/Claude/Factory/Devin for PRD-level specificity.

### Replit Teams/Enterprise

- **Dashboards/reports:** Enterprise Analytics Dashboard for admins. citeturn4view3  
- **Metrics exposed:** engagement metrics (active members, contribution patterns, collaboration activity) plus resource usage and costs by member/app; publishing oversight (public/private breakdowns, views, remix activity). citeturn4view3  
- **Export:** explicitly states admins can export usage reports for internal accounting. citeturn4view3  

### Linear as dashboard UX reference

- **Metrics:** issue count, effort, cycle time, triage time, lead time, issue age; plus burn-up/cumulative flow style. citeturn17view0turn3view9  
- **Slicing:** rich segment/filter model with time grouping daily→yearly. citeturn17view0  
- **Export/integration:** CSV, Google Sheets, Fivetran integration, and data warehouse sync via Airbyte. citeturn17view0  
This is a strong reference for *information architecture and drilldown UX* for your agent analytics: “aggregate → slice → drill to underlying objects.”

### Pluralsight Flow / Jellyfish / DX as engineering productivity references

- **Flow:** publishes detailed metric definitions and cautions about context and gaming; “Time to merge” definition and calculation are explicit and designed for team/org views. citeturn15view1turn15view0turn15view4  
- **Jellyfish:** emphasizes resource allocation (“Allocations”) and warns against inconsistent measures like story points, focusing on standardizing work effort across teams. citeturn15view5  
- **DX:** public docs navigation shows dedicated adoption reports for AI tools (GitHub Copilot, Claude Code, Cursor), plus executive reporting and benchmarking positioning from marketing pages. citeturn16view0turn14search23turn14search19  

### Datadog / New Relic as org-level dashboard references

- **Mobile & dashboard consumption:** Datadog supports on-the-go dashboard viewing, incidents, monitors; notes some widget limitations and web-only editing. citeturn11search0turn11search24 New Relic supports viewing dashboards in mobile apps and configuring mobile alert settings. citeturn11search33turn11search9  
- **Cost management patterns:** Datadog Cloud Cost Management includes budgets and allocation concepts; New Relic supports budget thresholds for consumption units (example: thresholds as percent of budget). citeturn2search29turn2search38  

## Data architecture patterns for customer-facing analytics

**Key findings (patterns that fit customer analytics dashboards)**  
Customer analytics for a SaaS platform typically requires a read-optimized analytics stack distinct from the transactional system. The common architectural themes in authoritative references are:

- **CQRS + materialized views**: separate write model (transactional) from read model (analytics projections) to optimize read performance; read model is eventually consistent. citeturn9search39turn9search3  
- **Pre-aggregation/rollups** for time-series dashboard queries: ClickHouse guidance explicitly demonstrates maintaining rollups via materialized views for append-only event streams to deliver sub-second aggregation queries. citeturn9search1turn9search9  
- **Multi-tenant isolation models**: AWS guidance emphasizes selecting tenant isolation models and safeguarding one tenant’s data from another in shared environments. citeturn9search0turn9search20  
- **OTel as telemetry backbone** for optional “bring your own observability/warehouse”: OpenTelemetry positions itself as vendor-neutral instrumentation to export traces/metrics/logs to any backend, enabling customers to integrate with existing tooling. citeturn20search2turn20search18 Factory explicitly builds hosted analytics on OTEL signals and notes airgapped customers rely solely on customer-owned OTEL pipelines. citeturn13view3  

**Recommendations (a pragmatic architecture for your platform)**  
Design for two simultaneous truths: (1) most customers want an in-product dashboard; (2) advanced customers want raw exports and integration.

A reference architecture that matches market expectations:

- **Event layer (canonical analytics events):** emit immutable events for task lifecycle, agent actions, tool invocations, policy violations, compute usage, and PR outcomes. Use consistent schemas and versioning. (This mirrors Copilot’s explicit “consistent set of fields” across dashboards/APIs/exports and Factory’s OTEL-signal reuse.) citeturn3view1turn13view3turn13view4  
- **Ingestion:** stream ingestion (Kafka/PubSub/Kinesis) + batch backfill; optionally ingest from CDC of transactional DB for certain entities (tasks, billing). CQRS/materialized view references justify the “events → projections” approach. citeturn9search39turn9search3  
- **Storage tiers:**  
  - **Hot OLAP store** (ClickHouse/BigQuery/Snowflake/Pinot/Druid class) for aggregated queries and slicing; keep “dashboard-grade” rollups (hour/day/team/repo/model). Pre-aggregation patterns are well documented for ClickHouse materialized view rollups. citeturn9search1turn9search9  
  - **Cold raw event store** (object storage) for audit and reprocessing; vendor examples: Copilot NDJSON export for long-term storage and AWS Q Developer per-user telemetry into S3. citeturn18view0turn19view4  
- **Serving layer:** a dedicated “Analytics API” that enforces tenant context and permissions and serves both UI and customer exports. This mirrors Copilot/Claude/Factory patterns of API-backed analytics (daily aggregated endpoints; user-level records with pagination). citeturn3view4turn13view7turn13view4  
- **Customer integration surface:**  
  - **Exports:** CSV + NDJSON (Copilot) + scheduled exports to customer storage (AWS Q telemetry to S3; Linear exports to Fivetran/Airbyte). citeturn18view0turn19view4turn17view0  
  - **OTel export option:** for customers who want to stream agent telemetry into their observability stack (Factory explicitly supports this mode). citeturn13view3turn20search2  

**Data freshness guidance (what org dashboards actually need)**  
Freshness is a product/infra tradeoff; competitor evidence suggests three tiers:

- **Operational monitoring** (queue depth, SLA, outages): near-real-time (minutes) is valuable.  
- **Usage analytics**: hourly to daily is common (AWS Q hourly; Copilot ~2 days; Claude API up to 1 hour). citeturn19view0turn18view0turn13view7  
- **ROI/exec reporting**: daily/weekly is sufficient and often preferred for stability and trust.

**Retention policies (practical tiering)**  
Vendors provide signals that tiered retention is acceptable:

- Copilot retains “activity and authentication data” for a rolling **90 days** (activity report telemetry). citeturn3view0  
- Copilot metrics endpoints describe historical availability “up to 1 year” for certain user reports (API documentation). citeturn3view4  
- Claude Code Analytics API states historical data is retained and accessible, with “no specified deletion period” (which implies policy choice and potential enterprise negotiation). citeturn13view7  

**Recommendation:** publish a clear retention tier policy (example template): raw events 30–90 days; detailed per-run traces/logs 14–30 days; aggregates 12–24 months; audit/security logs configurable; customer-controlled export for longer retention (Snowplow-style “permanent event history” is an optional enterprise-tier offering). citeturn3view0turn10search1turn19view4  

## Dashboard UX patterns for developer/engineering tools

**Key findings (what works, what fails)**  
Effective engineering dashboards share several UX principles:

- **Progressive disclosure:** summary → drilldown into teams/repos/task types → inspect underlying objects (sessions/tasks/PRs). Linear’s Insights explicitly supports drilldown to underlying issues and modular dashboards; Copilot supports enterprise/org scopes and has separate dashboards for usage vs code generation. citeturn17view0turn18view0turn7search7  
- **Slicing is essential:** by team, repo, language, IDE, model, time window. Copilot and Amazon Q both expose these slice dimensions; Linear highlights rich “Slice/Segment” and time grouping. citeturn18view0turn19view0turn17view0  
- **Visualization types:** time series trends, stacked breakdowns, distributions, and “top drivers” tables are standard; avoid simplistic leaderboards that incentivize gaming. Flow and DORA both explicitly warn about gaming/competition and emphasize contextual interpretation. citeturn15view0turn21view0  

**Recommendations (web IA and mobile layout)**  
A strong information architecture for your platform:

- **Web:**  
  - “Executive overview” (adoption, outcomes, cost, risk)  
  - “Usage & adoption” (cohorts, rollout tracking)  
  - “Productivity & delivery impact” (PR lifecycle, acceptance outcomes)  
  - “Cost & budgets” (allocation, forecasts, caps)  
  - “Quality & security” (CI, policy violations, audit exports)  
  - “Operations” (queue/SLA/failure reasons)  
- **Mobile:**  
  - KPI tiles with deltas (7/30 days)  
  - Alerts/anomalies (budget threshold, SLA breach, spike in failures)  
  - Top issues list (“largest cost driver,” “highest failure reason,” “stuck runs”)  
  - Deep links back to web for configuration/actions  
This is consistent with Datadog’s mobile posture: view dashboards/alerts/incidents on mobile, create/edit on web. citeturn11search0turn11search24  

**Notification/alerting patterns to complement dashboards**  
Treat alerts as “action routing,” not spam:

- Budget utilization alerts, cost anomaly alerts (Azure cost alerts model). citeturn11search11  
- Scheduled dashboard/report delivery to Slack/email (Vantage report notifications model). citeturn11search3  
- Ops alerts for SLA/failure spikes (use the same operational telemetry you already need for reliability).

## Privacy, ethics, and anti-patterns

**Key findings (what to avoid, and why)**  
Developer analytics can quickly become surveillance if not governed. The strongest “do not do this” signals come from the developer productivity research community and from product design choices in leading AI tools:

- **Using metrics for individual performance evaluation undermines outcomes.** SPACE emphasizes multi-dimensional measurement and is explicitly oriented toward team/org insights rather than simplifying productivity to a single axis. citeturn5search0turn20search3 DORA explicitly warns against competing and argues metrics must be contextualized at the service/application level. citeturn21view0  
- **Privacy-preserving cohort thresholds are becoming standard.** GitHub Copilot restricts team-level aggregates to teams with ≥5 license holders. citeturn8search25  
- **Data retention choices can gate analytics features.** Claude Code’s contribution metrics are not available when “Zero Data Retention” is enabled—explicitly acknowledging the privacy/analytics tradeoff. citeturn13view6  

**GDPR implications (high-level, product-relevant)**  
For EU users, GDPR imposes principles like purpose limitation, data minimization, and storage limitation in Article 5, and requires lawful basis for processing in Article 6, which directly constrain “collect everything forever” analytics designs. citeturn8search5turn8search1 Eurofound highlights ongoing regulatory concerns with employee monitoring, emphasizing transparency and minimization challenges when technologies collect large volumes of data. citeturn8search27

**Recommendations (guardrails you should build into the dashboard and data model)**  
- Default to **team/org aggregation**; require explicit admin enablement for per-user views, and consider cohort-size thresholds (e.g., suppress breakdowns for groups <5) similar to Copilot. citeturn8search25  
- Provide **transparent attribution rules** and conservative counting (Claude Code’s approach: only count PRs/lines where confidence is high; communicate undercounting). citeturn13view6  
- Provide **privacy modes**: allow enterprises to disable certain analytics or enforce “zero retention,” understanding it may limit advanced ROI reporting (as Claude Code does). citeturn13view6turn13view7  
- Separate **organizational governance telemetry** from **vendor training telemetry** (AWS Q Developer note: enabling user activity reports collects telemetry for the organization regardless of the developer’s setting controlling whether telemetry can be used by AWS corporation). This is an instructive approach to clarify “who can use the data and for what.” citeturn19view4  
- Publish retention tiers and let customers export to their own storage for longer retention or audit (Copilot NDJSON export; AWS S3 telemetry reports). citeturn18view0turn19view4  

**Anti-patterns to explicitly avoid in UI**  
- Individual developer “rankings” as default landing experiences (even if you offer per-user views for enablement). Claude Code includes a leaderboard in analytics; for your product, treat this as *high risk* and gate it behind strict policy and messaging, or avoid entirely. citeturn13view6  
- LOC-based individual productivity judgments (GitHub explicitly calls LoC directional; Flow and industry research warn about gaming and context). citeturn7search1turn15view0turn21view0  

## Synthesis and recommended blueprint

### Recommended metric taxonomy with priority

**P0 (must-have for first release; directly ties to decisions)**  
Usage & adoption  
- DAU/WAU/MAU (users who ran at least one agent session) by team/repo/task type (pattern: Copilot adoption metrics; Claude activity trends). citeturn18view0turn13view5  
- Agent sessions/day; tasks created/started/completed; completion rate  
- Task type distribution (bugfix/feature/refactor/test)  
- Agent autonomy mode breakdown (interactive vs autonomous)

Productivity & outcomes  
- Tasks resulting in accepted outcomes: merged PR, closed ticket, adopted patch (pattern: Copilot PR lifecycle + Claude contribution metrics). citeturn18view0turn13view6  
- PR lifecycle: PRs opened/merged, median time to merge, review iterations (pattern: Copilot + Flow time-to-merge). citeturn18view0turn15view1  
- Time-to-first-PR and time-to-completion per task

Cost & unit economics  
- Compute usage: microVM runtime, vCPU/memory usage hours  
- LLM usage: tokens in/out by model; retries  
- Spend allocation by team/repo/task type; cost per completed task; cost per merged PR (pattern: Claude Code cost by model; Factory token/cost endpoints; Devin caps). citeturn13view7turn13view4turn13view2  
- Budgets: caps, thresholds, and alerts (cloud cost alert norms). citeturn11search11turn2search29  

Quality & risk  
- CI pass rate for agent PRs; failure reasons  
- Review outcomes (approved/changes requested)  
- Policy violations (sandbox/network/permissions/secrets), plus audit logs (AWS monitoring model). citeturn19view3turn19view4  

Operations  
- Queue depth, wait time, execution duration distribution  
- Failure rate and top failure categories  
- SLA compliance (if applicable)

**P1 (next tier; improves ROI storytelling and governance)**  
- “Acceptance” analogs: % agent-generated diffs accepted without major human rewrite (where measurable)  
- Rework signals: reverted PRs within N days; hotfix linkage; review churn  
- Benchmarking/targets with guardrails (Flow percentile benchmarks concept, but avoid competitive framing). citeturn15view0turn21view0  
- Developer experience pulses (qualitative + workflow friction), aligned with DevEx dimensions. citeturn5search2turn5search15  

**P2 (advanced/enterprise; requires heavier integrations or modeling)**  
- Estimated “time saved” models (with explicit confidence bounds) using calibrated baselines and surveys (GitHub emphasizes difficulty translating time saved into review outcomes). citeturn6search13turn6search1  
- Cross-tool correlation (agent usage ↔ incident rates ↔ DORA outcomes)  
- Customer-customizable metric definitions and “confidence scoring” for attribution (Claude’s conservative attribution suggests this approach). citeturn13view6  

### Recommended dashboard pages and views

A pragmatic IA proposal (web + mobile):

- **Executive overview (web + mobile):** adoption, accepted outcomes, unit cost, risk posture, key deltas (7/30/90 days).  
- **Adoption & usage (web):** DAU/WAU/MAU, sessions, tasks by team/repo/task type; rollout tracking; enablement insights. (Modeled after Copilot “how well are teams using it?” positioning.) citeturn8search22turn18view0  
- **Delivery impact (web):** PR throughput, median time to merge, task completion cycle times; compare “agent-involved” vs “non-agent” work where attribution is defensible (Claude contribution metrics precedent). citeturn13view6turn18view0  
- **Cost & budgets (web + mobile):** spend by team/repo/task type/model; forecasts; budget alerts; export for accounting (Replit export pattern). citeturn4view3turn11search11  
- **Quality & security (web + mobile):** CI/review outcomes; policy violations; audit exports; prompt/data governance. (AWS monitoring model is a good precedent.) citeturn19view3turn19view4  
- **Operations (web + mobile):** queue/SLA, failure reasons, runtime distributions; “top incidents” and “top regressions.”  

### Data architecture recommendations

- **Event-sourced analytics log + read-optimized store** (CQRS + materialized views) to decouple dashboard query load from transactional system. citeturn9search39turn9search3  
- **Pre-aggregations/rollups** for time-window queries (hour/day/week) using materialized views (ClickHouse rollup guidance). citeturn9search1turn9search9  
- **Strict multi-tenant isolation** with explicit tenant context throughout the stack; align to AWS multi-tenant guidance and consider row-level security or tenant-scoped physical partitions for large tenants. citeturn9search0turn9search20  
- **Dual integration strategy:**  
  - Built-in dashboard + exports (CSV/NDJSON) for most customers (Copilot/Linear patterns). citeturn18view0turn17view0  
  - Optional OTEL export pipeline for airgapped or “customer-owned observability” customers (Factory explicitly supports this mode; OpenTelemetry supports exporting to many backends). citeturn13view3turn20search2  

### Top risks

- **Metric gaming and cultural backlash:** If metrics are perceived as surveillance or used for individual evaluation, teams will optimize for the dashboard, not outcomes; DORA explicitly warns about Goodhart’s law and competition. citeturn21view0  
- **Wrong ROI narrative:** Over-weighting LOC or “suggestions accepted” can misrepresent delivered value; GitHub itself notes the challenge of translating faster task completion into downstream processes like code review. citeturn6search13turn6search1turn7search1  
- **Attribution errors:** PRs/tickets may be mis-attributed without strong integration and definitions; Devin notes PR status enrichment depends on GitHub app integration and GitLab sync delays can misrepresent status. citeturn13view1  
- **Privacy and retention non-compliance:** absence of clear retention and purpose limitation can create GDPR risk; EU sources emphasize data protection principles, and employee monitoring remains a regulatory concern. citeturn8search5turn8search27  
- **Performance and noisy-neighbor issues in analytics queries:** multi-tenant dashboards can create heavy query hotspots; CQRS/materialized views and rollups mitigate, but require strong governance. citeturn9search39turn9search1  

### Open questions to validate via user research and product decisions

- **Primary “unit of value”:** is it merged PRs, closed tickets, deploys, or “hours saved”? (Copilot and Claude lean toward PR outcomes; your platform may also own ticket lifecycle.) citeturn18view0turn13view6  
- **Attribution policy:** what counts as “agent-authored” vs “agent-assisted,” and how conservative should counting be? (Claude explicitly chooses conservative counting.) citeturn13view6  
- **Per-user visibility:** do customers want per-user analytics for enablement, and what guardrails (cohort thresholds, opt-in, anonymization) are required? (Copilot’s ≥5 team threshold is a strong template.) citeturn8search25  
- **Freshness expectation:** do customers need hourly operational views for execution health, or is daily sufficient for usage/ROI? (Market evidence spans hourly → two-day latency.) citeturn19view0turn18view0turn13view7  
- **Export and “customer-owned data” posture:** should enterprise customers be able to stream all telemetry to their own storage/warehouse by default? (AWS S3 reports + Factory OTEL-first design suggest “yes” for higher tiers.) citeturn19view4turn13view3turn20search2