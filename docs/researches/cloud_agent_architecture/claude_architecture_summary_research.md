# Deep Research: Cloud Agent Execution Platform — System Landscape & Architecture

> **Author**: Claude Code (Opus 4.6)
> **Date**: 2026-03-16
> **Research brief**: [research_prompt.md](research_prompt.md)
> **Companion reports**: [gemini-cloud-agent-architecture-research.md](gemini-cloud-agent-architecture-research.md), [openai-deep-research-report.md](openai-deep-research-report.md)
> **FPF Patterns applied**: B.5 (Canonical Reasoning Cycle), A.10 (Evidence Graph + SCR), B.3 (Trust Calculus F-G-R), B.1 (Γ_sys Aggregation), A.3 (Transformer Quartet), A.7 (Strict Distinction)

---

## 0. Methodology (A.3 MethodDescription)

**Synthesis method**: Web research (March 2026) cross-referencing official documentation, vendor announcements, and architectural reference materials. All sources verified via direct URL fetch where possible.

**Reasoning cycle (B.5)**: For each architectural domain, the research follows:
1. **Abduction** — hypothesis generated from cross-platform pattern matching
2. **Deduction** — logical consequences derived, architectural implications identified
3. **Induction** — hypotheses validated against vendor documentation, production evidence, and reference architectures

**Confidence model (B.3)**:
- **F** (Formality): F0=informal/marketing → F1=structured narrative → F2=reproducible/verifiable → F3=formally specified
- **G** (Scope): coverage breadth across the domain
- **R** (Reliability): evidential support [0..1]
- **CL** (Congruence): cross-source terminology alignment

**Aggregation rule (B.1 WLNK)**: Architectural recommendations never exceed the weakest supporting evidence on any dimension. Where sources diverge, divergence is flagged.

**Limitations**: Compute models for Devin, Cursor, and Ona are inferred from indirect evidence (full desktop → VM, product descriptions). Factory AI and Poolside have limited public technical documentation. Pricing and rate limits are accurate as of March 2026 but change frequently.

---

## 1. Symbol Carrier Register (A.10 SCR)

| ID | Carrier | Type | F | G | R | Notes |
|----|---------|------|---|---|---|-------|
| SC-01 | Claude Code docs (code.claude.com) | Vendor docs | F2 | Narrow | 0.95 | Primary source, directly verifiable |
| SC-02 | Devin blog/docs (cognition.ai, docs.devin.ai) | Vendor docs | F1 | Narrow | 0.8 | Some architecture details inferred |
| SC-03 | GitHub Copilot Coding Agent (github.blog) | Vendor docs | F2 | Narrow | 0.95 | Public preview documented |
| SC-04 | Cursor blog/changelog (cursor.com) | Vendor docs | F1 | Narrow | 0.8 | Limited architecture disclosure |
| SC-05 | Replit Agent docs | Vendor docs | F1 | Narrow | 0.85 | Container-based, well documented |
| SC-06 | Factory AI (factory.ai) | Marketing + security page | F0 | Narrow | 0.5 | Limited technical depth |
| SC-07 | Poolside (poolside.ai) | Marketing + blog | F0 | Narrow | 0.5 | Unique on-prem positioning |
| SC-08 | Ona/ex-Gitpod (ona.com) | Blog + stories | F1 | Narrow | 0.7 | CDE heritage, inferred architecture |
| SC-09 | AWS SaaS Lens (docs.aws.amazon.com) | Reference architecture | F2 | High | 0.95 | Industry standard multi-tenancy guidance |
| SC-10 | Firecracker (firecracker-microvm.github.io) | Open-source project docs | F2 | Narrow | 0.95 | AWS Lambda/Fargate validated |
| SC-11 | E2B (e2b.dev) | Vendor docs + public claims | F1 | Narrow | 0.85 | 500M+ sandboxes claim, 2M+ monthly SDK downloads |
| SC-12 | Temporal (temporal.io) | Open-source project docs | F2 | High | 0.95 | Used by Replit, OpenAI, Netflix |
| SC-13 | MCP Specification (modelcontextprotocol.io) | Open standard | F2 | Medium | 0.9 | Evolving protocol (v2025-06-18) |
| SC-14 | LiteLLM (docs.litellm.ai) | Open-source project docs | F2 | Medium | 0.9 | 100+ LLM providers supported |
| SC-15 | Anthropic Rate Limits/Pricing | Vendor docs | F2 | Narrow | 0.95 | Subject to change |
| SC-16 | GitHub API Rate Limits | Vendor docs | F2 | Narrow | 0.95 | Stable |
| SC-17 | OTel GenAI Conventions | Open standard (development) | F2 | Medium | 0.7 | Not yet stable specification |
| SC-18 | OpenAI Status (status.openai.com) | Operational data | F2 | Narrow | 0.95 | Dec 2025 – Mar 2026 window |
| SC-19 | OWASP LLM Top 10 | Industry standard | F2 | High | 0.9 | LLM01: Prompt Injection |
| SC-20 | Nydus (nydus.dev) | Open-source project | F2 | Narrow | 0.85 | Alibaba production validated |

---

## Executive Summary

Cloud agent execution platforms — managed SaaS environments where AI agents autonomously execute software engineering tasks (from ticket to pull request) — are forming a new infrastructure software category. This research covers 8 platforms and synthesizes architectural patterns confirmed by production practice.

### Key Architectural Claims (B.5 — validated)

| # | Claim | Support | R | Sources |
|---|-------|---------|---|---------|
| 1 | **Bridge tenancy model** is the only viable approach: pool for control plane, silo for data plane | **Strong** — AWS SaaS Lens canonical models; all platforms exhibit this pattern | 0.9 | SC-09 |
| 2 | **Firecracker microVM** is the industry standard for sandboxing untrusted code | **Strong** — E2B (500M+ sandboxes, <200ms startup), AWS Lambda/Fargate (billions of VMs) | 0.9 | SC-10, SC-11 |
| 3 | **Temporal** is the de facto standard for durable workflow orchestration | **Strong** — used by Replit, OpenAI, Netflix, Coinbase, DoorDash; 200M+ exec/sec | 0.85 | SC-12 |
| 4 | **GitHub App model** is the recommended Git integration model | **Strong** — fine-grained permissions, short-lived tokens, webhooks; GitHub recommends over OAuth Apps | 0.95 | SC-03, SC-16 |
| 5 | **MCP** is the emerging tool integration standard | **Moderate** — broad adoption (Claude, ChatGPT, VS Code, Cursor) but protocol still evolving | 0.75 | SC-13 |
| 6 | **LLM Gateway** is a mandatory component | **Strong** — tenant-aware rate limiting, circuit breakers, multi-provider fallback required at scale | 0.85 | SC-14, SC-15 |
| 7 | **All platforms converge on PR as the primary delivery artifact** | **Strong** — every platform examined delivers results via PR/MR | 0.95 | SC-01 through SC-08 |

### Top 5 Architecture Risks

| # | Risk | Severity | Mitigation | R |
|---|------|----------|------------|---|
| 1 | **Sandbox escape** — breakout from VM/container running untrusted code | Critical | Firecracker + Jailer + seccomp + network segmentation + defense-in-depth | 0.95 |
| 2 | **Denial of Wallet** — uncontrolled LLM/compute spending | High | Per-session/tenant budget caps, cost estimation pre-call, kill switches, anomaly detection | 0.85 |
| 3 | **LLM provider outage/rate limiting** — agent execution stops | High | LLM Gateway + circuit breakers + multi-provider fallback + queue smoothing | 0.9 |
| 4 | **Indirect prompt injection** — malicious instructions in code/docs/issues | High | Sandbox backstop + input sanitization + behavioral monitoring + HITL | 0.8 |
| 5 | **Data sovereignty / secret leakage** — code/secrets leak through LLM/logs | High | Regional deployment, short-lived credentials, Privacy Mode, audit logs, encryption | 0.85 |

---

## 2. Product Category & Core Value

### Reasoning Cycle (B.5)

**Abduction**: Cloud agent execution platforms solve five problems that local agent execution cannot: parallelism, independence, isolation, standardization, and audit.

**Deduction**: If these are the core differentiators, then the architecture must be a "session capsule orchestrator" + artifact delivery system + SDLC integrations — dictating a control plane / data plane split.

**Induction** — validated across 8 platforms:

| Dimension | Local Agent | Cloud Agent | Evidence |
|-----------|-------------|-------------|----------|
| **Parallelism** | Limited by machine resources | N concurrent agents | SC-01: Claude sub-agents; SC-04: Cursor parallelism |
| **Independence** | Requires connected machine | Runs after laptop closed | SC-01: Claude "teleport"; SC-02: Devin background |
| **Isolation** | Full access to dev's FS/network | Isolated VM/container | SC-10: Firecracker; SC-01: isolated VMs |
| **Standardization** | Different env per developer | Uniform base image | SC-05: Replit cloud containers; SC-08: Ona CDE |
| **Audit & governance** | Minimal trail | Full audit logs, scoped credentials | SC-04: Cursor audit; SC-06: Factory SIEM export |

### Platform Landscape (March 2026)

| Platform | Compute Model | Delivery | Triggers | R |
|----------|--------------|----------|----------|---|
| **Claude Code Web** | Isolated VMs (Anthropic-managed) | Branch + PR | Manual, GH Actions, Slack, cron | 0.95 [SC-01] |
| **Devin** | Cloud workspace (likely VM with full desktop) | PR/MR | Manual, Linear/Jira/Slack | 0.7 [SC-02] |
| **GitHub Copilot Agent** | GitHub Actions runners (Linux VMs) | PR | Issue assignment | 0.95 [SC-03] |
| **Cursor** | Cloud sandboxes / "own VM" | PR (GitHub App) + Artifacts API | Manual, GH/Slack/Linear/PagerDuty, cron | 0.75 [SC-04] |
| **Replit Agent** | Replit cloud containers | Direct code changes + deploy | Manual only | 0.85 [SC-05] |
| **Factory AI** | Cloud-hosted (details undisclosed) | PR with traceability | Manual, issue events, Slack/Teams | 0.5 [SC-06] |
| **Poolside** | On-prem / VPC deployment | IDE-integrated | IDE extensions | 0.7 [SC-07] |
| **Ona (ex-Gitpod)** | Full CDE per agent ("not just containers") | PR | Manual, PRs, webhooks, cron | 0.6 [SC-08] |

**WLNK note (B.1)**: Compute model confidence varies significantly. Claude Code, GitHub Copilot, and Replit are confirmed (R≥0.85). Devin, Cursor, Ona are inferred (R=0.6-0.75). Factory and Poolside have low confidence (R=0.5).

### Typical User Journey

```
1. Task creation (issue/ticket/description/Slack command)
   ↓
2. Environment provisioning (clone repo → isolated VM → install deps)
   ↓
3. Agent execution (Think → Act → Observe loop, parallel agents)
   ↓
4. Result review (diff view, iterative feedback mid-flight)
   ↓
5. PR creation & merge (standard code review + CI)
```

### Emerging Trends (2025-2026)

| Trend | Evidence | R |
|-------|----------|---|
| **Session mobility** — seamless transfer between web and terminal | SC-01: Claude Code "teleport" | 0.85 |
| **Kernel-level governance** — OS-level enforcement | SC-08: Ona "Veto" | 0.6 |
| **Automation-first** — event-driven and scheduled agents | SC-04: Cursor Automations; SC-08: Ona Automations | 0.8 |
| **Code review as new bottleneck** — AI-assisted review | SC-02: Devin Review; SC-04: Cursor Bugbot; SC-01: Claude Code review action | 0.85 |
| **MCP ecosystems** — tool integration standardization | SC-04: Cursor 30+ plugins; SC-01: Claude Code MCP; SC-06: Factory vendor-agnostic | 0.8 |

### Trade-offs

| Decision | Option A | Option B |
|----------|----------|----------|
| Autonomy vs control | Full autonomy (faster, riskier) | Human-in-the-loop (safer, slower) |
| Speed vs isolation | Containers (fast start, shared kernel) | VMs/microVMs (strong isolation, slower boot) |
| Universal vs specialized runtime | One image for all (heavy, simple UX) | Per-stack images (lighter, more maintenance) |
| PR-only vs flexible delivery | PR (standard, audit-friendly) | PR + artifacts + patches (flexible, more engineering) |

---

## 3. Core Functionality Map

### Reasoning Cycle (B.5)

**Abduction**: The must-have core is: task intake → orchestrated execution → PR/MR + artifacts → review.

**Deduction**: If org-level governance (SSO/SCIM/audit) is mandatory from day one, then tenant context must be embedded in every entity and every event from the beginning — adding it later requires a major refactor.

**Induction** — validated:

| Group | Functions | Market Examples | R |
|-------|-----------|-----------------|---|
| **Agent execution** | Sessions/tasks, progress, step logging, stop/resume, parallel runs | SC-04: Cursor parallelism; SC-01: Claude sub-agents | 0.9 |
| **Workspace & runtime** | Environment templates, dependency management, caching, artifacts | SC-04: Cursor artifacts + presigned URL; SC-01: custom setup scripts | 0.85 |
| **SDLC delivery** | Branches, PR/MR, comments, CI status | SC-02: Devin auto-fix review comments; SC-04: Cursor GitHub App PR | 0.95 |
| **Collaboration** | Shared sessions, review workflow, notifications, handoff web↔CLI | SC-01: Claude "teleport"; SC-02: Devin Slack threading | 0.85 |
| **Org governance** | Users/teams, roles, policies, budgets, audit | SC-04: Cursor SSO/SCIM + audit; SC-06: Factory SIEM export | 0.9 |
| **Billing & cost** | Token/compute/storage accounting, per-tenant budgets, alerts | SC-15: Anthropic tier-based limits; SC-04: Cursor per-team budgets | 0.85 |
| **Integrations** | GitHub/GitLab, Jira/Linear, Slack/Teams, MCP tools | SC-04: Cursor Automations triggers; SC-13: MCP standard | 0.9 |
| **Analytics** | Metrics, traces, customer analytics, export | SC-06: Factory audit log → SIEM; SC-04: Cursor admin analytics | 0.8 |

**Org-level interaction — mandatory from day one** (R=0.9):
- SSO (SAML/OIDC) — confirmed at Devin, Cursor, Replit Enterprise, Claude [SC-01, SC-02, SC-04, SC-05]
- SCIM provisioning — Cursor, GitHub Enterprise [SC-04, SC-03]
- Audit logs — Cursor, Devin, Claude, GitHub (streaming to SIEM) [SC-01, SC-02, SC-03, SC-04]
- Roles & policies — RBAC minimum, ABAC for budgets/scope
- Budget limits — per-org/per-team token and compute limits

### Architecture Implications

- Integration adapters (GitHub/GitLab/Slack/Linear) must be separated from core orchestration at C4 Container level: different protocols, SLAs, error models.
- "Org contours" (SSO/SCIM/audit) cannot be added later: they affect the data model (tenant context in every entity), access policies, and audit events.

---

## 4. Architecture Patterns

### 4.1 Multi-Tenancy: Bridge Model

**Abduction**: A hybrid model is needed — pool for shared control plane, silo for isolated data plane.

**Deduction**: If Bridge model, then: provisioning must route tenant workloads to appropriate isolation level; tenant context must flow through every layer; enterprise tier needs optional full-silo (dedicated cluster/VPC).

**Induction** — validated against AWS SaaS Lens [SC-09] canonical models:

| Model | Description | Pros | Cons | R |
|-------|-------------|------|------|---|
| **Pool** | Shared infrastructure, logical isolation | Cost-efficient, simpler management | Noisy neighbor, compliance concerns | 0.95 |
| **Silo** | Dedicated stack per tenant | Simple isolation, failure containment | Doesn't scale to thousands of tenants | 0.95 |
| **Bridge** | Hybrid: different components, different isolation | Balance of cost and security | Provisioning/routing complexity | 0.95 |

**Recommendation**: Bridge. Pool for control plane (API gateway, auth, billing, task queue). Silo for data plane (sandbox per session). Full silo (dedicated cluster/VPC) as enterprise add-on.

### 4.2 Sandboxing: Firecracker as Primary Choice

**Abduction**: Firecracker provides the optimal trade-off between isolation strength and resource efficiency for untrusted code execution.

**Deduction**: If Firecracker is primary, then: no native GPU support (limitation); warm pools required to mitigate cold start; Nydus for image optimization; Jailer for defense-in-depth.

**Induction**:

| Technology | Isolation Level | Startup | Memory Overhead | K8s Native | GPU | R |
|-----------|----------------|---------|-----------------|------------|-----|---|
| **OCI containers (runc)** | Process (shared kernel) | ~50ms | ~1-5 MB | Yes | Yes | 0.95 |
| **gVisor (runsc)** | Application kernel | ~100ms | ~15-30 MB | Yes (RuntimeClass) | Limited | 0.9 |
| **Kata Containers** | VM (dedicated kernel) | ~150-500ms | ~20-40 MB | Yes (RuntimeClass) | Possible | 0.85 |
| **Firecracker** | VM (dedicated kernel) | ~125ms | <5 MB | No | No | 0.95 |

**Key validation points:**
- E2B: 500M+ Firecracker sandboxes, <200ms startup with warm pools, up to 24h sessions, 2M+ monthly SDK downloads, 88% Fortune 100 [SC-11, R=0.85]
- AWS: billions of Firecracker microVMs for Lambda/Fargate, no publicly disclosed escapes [SC-10, R=0.95]
- Nydus: lazy-loading container images, pull time from 20s to 0.8s (Alibaba production) [SC-20, R=0.85]

**Firecracker security model (in depth)** [SC-10, R=0.95]:
- Minimal device model: **5 devices** (vs QEMU: hundreds) → drastically reduced attack surface
- **Jailer**: chroot + seccomp filter + unprivileged user + PID/network namespaces + cgroup limits
- Rust implementation → no buffer overflows, use-after-free
- Escape requires: guest kernel exploit → KVM/VMM exploit → jailer bypass → host security bypass

### 4.3 Orchestration: Temporal + KEDA

**Abduction**: Agent execution requires durable workflow orchestration (crash recovery, long-running sessions) combined with event-driven autoscaling.

**Deduction**: If Temporal for orchestration, then: agent loop = Temporal Workflow (Think/Act/Observe = Activities); Signals for user feedback/cancellation; Queries for progress; Continue-As-New for long sessions (prevents unbounded event history).

**Induction**:

**Temporal** [SC-12, R=0.95]:
- Durable execution — workflow recoverable after any failure
- Production users: **Replit** (coding agents), **OpenAI**, Netflix, Coinbase, DoorDash
- Scale: 200M+ executions/sec (Temporal Cloud)
- Continue-As-New for sessions >100 iterations

**KEDA** [R=0.9]:
- Event-driven autoscaling for Kubernetes
- ScaledJob: one task from queue = one Job (agent session)
- Scale to zero when no tasks
- 70+ scalers (Kafka, SQS, NATS, Redis, Prometheus)

**WLNK note**: Temporal alternatives exist (Inngest, Hatchet, Restate) — research focuses on Temporal as leader. R for "Temporal is the best choice" = 0.75 (strong but not exclusive).

### 4.4 Event Streaming: NATS + Kafka

**Abduction**: Two different communication patterns require two different systems — real-time agent comms vs durable event sourcing.

**Deduction**: If dual-system, then operational complexity increases; for early stage, NATS + JetStream may cover both use cases.

**Induction**:

| Dimension | Kafka | NATS | R |
|-----------|-------|------|---|
| Latency | ~ms | sub-ms | 0.95 |
| Durability | Strong (replicated log) | JetStream (optional) | 0.95 |
| Operational complexity | High | Low (single binary, 20MB RAM) | 0.9 |
| Best for | Audit logs, analytics, event sourcing | Real-time agent comms, control signals | 0.9 |

**Recommendation**: NATS for real-time agent communication. Kafka for durable event sourcing and analytics. For early stage — NATS + JetStream can cover both use cases.

### 4.5 Data Flow: End-to-End

```
Triggers (UI/Slack/GitHub/API/cron)
    ↓
Task API (validates, persists, returns task_id immediately)
    ↓
Task Queue (SQS/NATS/Kafka — buffers, distributes)
    ↓
Temporal Workflow (manages full lifecycle)
    ↓
Sandbox Provisioner (allocates Firecracker VM from warm pool)
    ↓
Agent Runtime (Think→Act→Observe loop in microVM)
    ↓
Artifact Store (S3: diffs, logs, test results, snapshots)
    ↓
Delivery Service (creates PR, posts to Slack, sends webhook)
```

**Task lifecycle state machine:**
```
SUBMITTED → QUEUED → PROVISIONING → RUNNING → [PAUSED] → COMPLETING → COMPLETED
                                       |                        |
                                       ├→ FAILED                ├→ FAILED
                                       └→ CANCELLED
```

**State storage decisions** (A.7 — Strict Distinction: separating transient from durable state):

| State Type | Storage | Rationale | R |
|-----------|---------|-----------|---|
| Workflow execution | Temporal event history | Durable, replayable | 0.95 [SC-12] |
| Conversation history | S3 + Redis cache | Too large for Temporal | 0.85 |
| Sandbox filesystem | Firecracker local disk | Ephemeral; snapshot to S3 | 0.9 [SC-10] |
| Task metadata | PostgreSQL | Queryable, transactional | 0.95 |
| Real-time events | NATS (in-flight) + Kafka (persisted) | Real-time + audit | 0.9 |
| Token/cost counters | Redis (real-time) + PostgreSQL (flush) | Low-latency + durable | 0.85 |

### 4.6 Integration Patterns

**GitHub App (recommended)** [SC-03, SC-16, R=0.95]:
- Fine-grained permissions, repository-level access control
- Short-lived installation tokens (1 hour)
- Webhook model for event-driven triggers
- Audit trail in GitHub security log
- GitHub recommends Apps over OAuth Apps for new integrations

**MCP (Model Context Protocol)** [SC-13, R=0.75]:
- Open-source (Anthropic), JSON-RPC 2.0
- Primitives: Tools, Resources, Prompts
- Transport: STDIO (local) or Streamable HTTP (remote)
- Clients: Claude, ChatGPT, VS Code, Cursor
- Platform = **MCP Host** connecting agents to user-configured MCP Servers
- **WLNK note**: protocol still evolving (v2025-06-18) → build custom adapter layer, replace with MCP over time

**ChatOps (Slack Events API)** [R=0.9]:
- 30K events/workspace/app/60min
- Slash command → async queue → agent task → threaded progress → result with action buttons
- Idempotency mandatory (Slack retries)
- HTTP 200 within 3 seconds, else business logic to async queue

### Architecture Implications

- At C4 Container level, these are unavoidable: **Orchestrator**, **Sandbox Provisioner**, **LLM Gateway**, **Integrations Hub**, **Artifact Store**, **Policy/Audit** — otherwise reliability and security boundaries merge.
- Bridge tenancy must be established from day one; adding it later → major refactor.

### Trade-offs

| Decision | Option A | Option B | R |
|----------|----------|----------|---|
| Queue-based async | Reduces coupling | Complicates debugging (correlation IDs, idempotency) | 0.9 |
| Temporal | Crash recovery, durable state | Ops cost (cluster, history storage, workflow versioning) | 0.85 |
| Firecracker boot (125ms) vs containers (50ms) | Security gain worth the latency | Mitigate with warm pools + Nydus | 0.9 |
| MCP (evolving protocol) | Standard integration | Build custom adapter layer, replace over time | 0.75 |

---

## 5. Scaling Challenges

### Reasoning Cycle (B.5)

**Abduction**: Scaling to thousands of concurrent agent sessions breaks at three points: environment provisioning, LLM API rate limits, and noisy-neighbor effects.

**Deduction**: If these are the bottlenecks, then: warm pools for provisioning; LLM Gateway with queue-based smoothing for rate limits; tenant quotas and priority queues for noisy-neighbor.

**Induction**:

### 5.1 Horizontal Scaling Bottlenecks

| Bottleneck | Root Cause | Mitigation | R |
|-----------|-----------|-----------|---|
| **Environment provisioning** | VM creation, image pull, repo clone → 2-5 min cold start | Warm pools (AWS EC2 Auto Scaling pattern) | 0.9 [SC-09] |
| **LLM API rate limits** | External constraint, not platform-controlled | LLM Gateway + queue-based smoothing + multi-provider | 0.9 [SC-15] |
| **Noisy neighbor** | One tenant's activity degrades others | Tenant quotas, concurrency limits, priority queues, dedicated node pools | 0.85 [SC-09] |

**Warm pools** (AWS EC2 Auto Scaling pattern) [SC-09, R=0.9]:
- Pre-initialized instances taken from pool at scale-out, not created from scratch
- States: Stopped (cheapest), Hibernated (fast restart), Running (costly)
- Instance reuse: returned to pool at scale-in, not destroyed
- Lifecycle hooks mandatory, otherwise initialization doesn't complete

### 5.2 LLM Rate Limits — Hard External Constraint

**Anthropic (current limits)** [SC-15, R=0.95]:

| Tier | RPM | Input TPM | Output TPM | Deposit |
|------|-----|-----------|------------|---------|
| Tier 1 | 50 | 30,000 | 8,000 | $5 |
| Tier 2 | 1,000 | 450,000 | 90,000 | $40 |
| Tier 3 | 2,000 | 800,000 | 160,000 | $200 |
| Tier 4 | 4,000 | 2,000,000 | 400,000 | $400 |

Key operational facts:
- Token bucket algorithm (continuous replenishment)
- **Cache-aware**: cached tokens not counted → at 80% cache hit rate, effective throughput ×5
- **Acceleration limits**: sudden load spikes → 429 even below stated limits
- Rate limits per-organization, shared across workspaces

**Capacity calculation**: Tier 4 (4,000 RPM) ≈ 60-70 concurrent agent sessions at 1 req/sec each. For 1,000+ sessions — multi-provider strategy and queue-based smoothing are mandatory.

**GitHub API** [SC-16, R=0.95]: 5,000 req/hr (PAT), 12,500 req/hr (GitHub App), secondary limits 100 concurrent + 900 points/min.

**GitLab API** [R=0.9]: 2,000 req/min (authenticated), pipeline creation 25 req/min, webhooks 500-13,000 calls/min.

### 5.3 Cost Scaling — Three Axes

**Anthropic Pricing (current)** [SC-15, R=0.95]:

| Model | Input/MTok | Output/MTok | Cache Hit/MTok |
|-------|-----------|-------------|----------------|
| Opus 4.6/4.5 | $5 | $25 | $0.50 |
| Sonnet 4.x | $3 | $15 | $0.30 |
| Haiku 4.5 | $1 | $5 | $0.10 |
| Haiku 3.5 | $0.80 | $4 | $0.08 |

- Batch API: -50%. Fast mode (Opus): ×6.
- Complex coding task with Opus: $0.25-$12.50+ per task (50K-500K+ tokens)
- 10,000 tasks/day with Opus: $10K-$150K/day in LLM costs alone

**Cost reduction strategies** (R=0.85):
- Route simple tasks to Haiku (5-25× cheaper than Opus)
- Aggressive prompt caching (90% reduction on hits)
- Batch API for non-interactive tasks (-50%)
- Context window optimization
- Per-session/per-tenant budget caps

**WLNK warning**: pricing changes frequently; these numbers are accurate as of March 2026 but should be treated as directional.

### 5.4 State Management

[SC-12, R=0.95]:
- **Temporal** for durable execution — full recovery after any failure
- **Heartbeats** for long-running activities: no heartbeat → automatic retry
- **Continue-As-New** for sessions >100 iterations (prevents unbounded event history)
- **Checkpoint data** in heartbeat payloads → on retry, resume from last checkpoint

### Architecture Implications

- **Two-level scheduler**: (1) Task scheduler (queue/workflow), (2) Resource scheduler (K8s/VM fleet). KEDA links queue depth → HPA.
- **Noisy neighbor protection**: tenant quotas, concurrency limits, priority queues, separate node pools for enterprise.
- **State externalization**: artifacts/logs/context in stores, executor is "disposable." Durable workflows glue execution over disposable workers.

---

## 6. Third-Party Dependencies & Risks

### Reasoning Cycle (B.5)

**Abduction**: The platform is critically dependent on external services; any dependency failure can halt agent execution entirely.

**Deduction**: If dependencies are unavoidable, then: circuit breakers per provider, exponential backoff with jitter, multi-provider fallback, queue-based smoothing — all are mandatory, not optional.

**Induction**:

### 6.1 Critical Dependencies

| Dependency | Failure Modes | Impact | R |
|-----------|--------------|--------|---|
| **LLM providers** (Anthropic, OpenAI, Google) | 429 rate limiting, streaming failures, full outage | Agent execution stops | 0.95 [SC-15, SC-18] |
| **Git hosting** (GitHub, GitLab) | API rate limits, webhook delays, outage | No repo clone, no PR creation | 0.95 [SC-16] |
| **Identity providers** (Okta, Azure AD) | SAML/OIDC federation failure | Users cannot authenticate | 0.9 |
| **Cloud infrastructure** (AWS/GCP/Azure) | Registry failures, storage unavailability | No sandbox provisioning | 0.9 |
| **Communications** (Slack, Teams) | Webhook delays, API limits | No trigger delivery, no notifications | 0.85 |

### 6.2 Real-World LLM Provider Outages (Dec 2025 – Mar 2026)

**OpenAI** [SC-18, R=0.95]:
- Dec 16-18: ChatGPT Login partial outage (~2.5 days)
- Dec 16-17: Responses & Codex degraded (~10 hours)
- Feb 3-4, 2026: Multi-component degradation (13+ services)
- **Overall uptime**: APIs 99.76%, ChatGPT 99.08%
- 99.76% API uptime = **~1.75 hours downtime/month**

**Anthropic** [SC-15, R=0.85]:
- Acceleration limits trigger 429 on sudden load spikes even below stated limits
- SSE streaming: error can arrive after 200 OK status

### 6.3 Resilience Patterns

**Circuit Breaker** (Fowler) [R=0.95]:
- Closed → Open (at threshold) → Half-Open (trial requests)
- Per-provider breakers (not one for all)
- Envoy proxy supports circuit breaking as sidecar

**Exponential Backoff + Jitter** (AWS) [R=0.95]:
- Full jitter: `sleep = random(0, min(cap, base * 2^attempt))`
- Decorrelated jitter: `sleep = min(cap, random(base, sleep * 3))`
- Distributes load, prevents thundering herd

**LiteLLM** (multi-provider gateway, reference) [SC-14, R=0.9]:
- 100+ LLMs via OpenAI-compatible interface
- Fallback types: standard, content policy, context window
- Cooldown mechanism: model enters cooldown after `allowed_fails`
- Per-key rate limiting, pre-call checks
- Geography-aware routing (EU data residency)
- Cost tracking per project/user/tenant

### Architecture Implications

- **LLM Gateway is a mandatory container**: (a) tenant-aware rate limiting, (b) token metrics aggregation, (c) retries with jitter, (d) circuit breakers, (e) multi-provider routing. Multi-dimensional limits (TPM/RPM) make "simple retries" dangerous.
- **Integration worker tier** with queues and idempotency keys for external integrations (webhooks duplicate/arrive out of order).
- **Queue-based smoothing**: instead of direct forwarding LLM requests — queue with controlled rate, priority scheduling (interactive > batch), fair queuing across tenants.

---

## 7. Security & Compliance

### Reasoning Cycle (B.5)

**Abduction**: An agent execution platform has a uniquely high security surface — it runs untrusted code, accesses source code, and communicates with external services on behalf of users.

**Deduction**: If untrusted code runs in platform-managed environments, then: defense-in-depth is mandatory (not one layer); the sandbox is the primary security boundary; secrets must be short-lived and per-session; audit must be complete and immutable.

**Induction**:

### 7.1 Authentication & Authorization

**AuthN stack** (R=0.9, validated across SC-01, SC-02, SC-04, SC-05):
- **SAML 2.0** — table stakes (Cursor, Devin, Replit Enterprise, Claude)
- **OIDC** — for cloud-native organizations (Devin recommends OIDC)
- **SCIM** — automated user lifecycle (Cursor, GitHub Enterprise)
- **Workload identity federation** — GitHub Actions OIDC → platform tokens
- **API keys** — hash-and-store, identifiable prefix (`zc_live_`), 90-day TTL, per-key rate limits

**Recommended authN architecture**: Managed identity service (WorkOS, Auth0) for SAML/OIDC/SCIM → platform-specific JWT → all downstream services validate platform tokens.

**Authorization — Hybrid RBAC + ABAC** (R=0.85):

| Role | Permissions |
|------|------------|
| Org Owner | Full control, billing, SSO config |
| Org Admin | User/team management, policy configuration |
| Team Lead | Create/manage agents for team, set budgets, view team analytics |
| Developer | Run agents, view own sessions, configure integrations |
| Viewer | Read-only access to results and analytics |
| Billing Admin | Billing management, no execution permissions |

ABAC layer for: budget limits, repository scoping, time restrictions, IP restrictions. Centralized policy engine (OPA/Cedar).

### 7.2 Security Boundaries — Defense-in-Depth (6 layers)

| Layer | Mechanism | R |
|-------|-----------|---|
| 1. Application-level | Agent runtime limits on tools/commands (bypassable — agents generate code) | 0.7 |
| 2. **Runtime sandbox** | **Firecracker/gVisor — primary security boundary** | 0.95 [SC-10] |
| 3. Container/cgroup | Resource limits (CPU, memory, disk I/O, PIDs) | 0.95 |
| 4. Network segmentation | Egress proxy, no inter-sandbox communication, no metadata API access | 0.9 |
| 5. Host OS hardening | Seccomp + AppArmor/SELinux + read-only root filesystem | 0.95 |
| 6. Infrastructure isolation | Separate VPC for sandbox execution vs control plane | 0.9 |

### 7.3 Secret Management (Vault Patterns)

[R=0.9]:
- Per-session short-lived credentials (GitHub App tokens: 1hr, AWS STS: session-scoped)
- Orchestrator — only component communicating with Vault
- Prefix-based revocation for incident response
- "Secret zero": Vault AppRole with wrapped secret ID or vsock injection

### 7.4 Prompt Injection & Context Poisoning

**Indirect prompt injection** — the primary AI-specific threat (OWASP LLM01:2025) [SC-19, R=0.9]:
- Vectors: malicious README, issue descriptions, code comments, dependency docs, error messages, CI output
- "Effective mitigations are currently lacking" (arXiv:2302.12173)

**5-layer defense** (R=0.75 — no perfect solution exists):
1. Input sanitization & trust-level tagging
2. Dual LLM pattern (privileged + quarantined LLM) — complex, acknowledged as imperfect
3. **Sandbox as backstop** — non-negotiable
4. Behavioral monitoring (anomalous network, file access, unexpected commands)
5. Human-in-the-loop for sensitive operations

**Priority**: Layers 1, 3, 4, 5 immediately. Layer 2 (Dual LLM) — future enhancement for high-security tiers.

### 7.5 Compliance Frameworks

| Framework | Scope | Priority | R | Notes |
|-----------|-------|----------|---|-------|
| **SOC 2 Type II** | Security, Availability, Confidentiality | Year 1 | 0.95 | Table stakes for enterprise sales |
| **GDPR** | Data protection EU | Day 1 | 0.95 | 72-hour breach notification, data residency |
| **ISO 27001** | Information security management | Year 2 | 0.9 | 93 Annex A controls |
| **NIST 800-171** | CUI protection (government) | Market entry | 0.85 | 11 control families |
| **ISO 42001** | AI management system | Differentiator | 0.7 | Factory AI among first certified [SC-06] |

**Competitor compliance landscape** (R varies):
- **Factory AI**: SOC 2 Type I, ISO 42001, single-tenant VPC, SIEM export [SC-06, R=0.5]
- **Cursor**: SOC 2 Type II, Privacy Mode (50%+ users), parallel privacy infrastructure [SC-04, R=0.8]
- **Devin**: Bugcrowd VDP, limited public compliance info [SC-02, R=0.6]
- **Replit**: SOC 2 Type II [SC-05, R=0.85]

---

## 8. Observability & Analytics

### Reasoning Cycle (B.5)

**Abduction**: The platform generates three distinct signal types (operational, security/audit, usage/billing) that require different processing pipelines, retention policies, and access patterns.

**Deduction**: If telemetry pipeline ≠ audit pipeline, then: separate stores with different durability guarantees; audit = never-sampled, append-only; customer analytics from dedicated analytics DB, not operational DB.

**Induction**:

### 8.1 Three Signal Types + AI-Specific

**OpenTelemetry GenAI Semantic Conventions** (Development status) [SC-17, R=0.7]:

| Metric | Type | Description |
|--------|------|-------------|
| `gen_ai.client.token.usage` | Histogram | Input/output tokens per operation |
| `gen_ai.client.operation.duration` | Histogram | Duration of GenAI operations |
| `gen_ai.server.time_to_first_token` | Histogram | Queue + prefill latency |
| `gen_ai.server.time_per_output_token` | Histogram | Decode phase performance |

**Agent span structure** (OTel spec): `create_agent` → `invoke_agent` → `execute_tool`
- Typical session: 15-25 agentic steps × (2-3 LLM calls + 2-5 tool calls) = **40-75+ spans**
- Complex sessions: **150+ spans**

**WLNK note**: OTel GenAI conventions are in Development status (not stable). Build to the spec but expect changes.

### 8.2 Platform-Specific Metrics

**Session lifecycle**: `agent.session.active` (gauge), `agent.session.duration` (histogram), `agent.session.outcome` (counter by success/failure/timeout)

**Sandbox provisioning**: `sandbox.provision.duration` (histogram), `sandbox.pool.available` (gauge), `sandbox.pool.utilization` (gauge)

**LLM operations**: `llm.request.429_rate` (counter), `llm.cost.per_session` (histogram), `llm.cost.per_tenant` (counter), `llm.provider.health` (gauge)

### 8.3 Event Pipeline Architecture

**Three event streams** (A.7 — Strict Distinction: separating by durability and access requirements):

| Stream | Content | Sampling | Storage | R |
|--------|---------|----------|---------|---|
| **Operational** | Task lifecycle, sandbox events, integration events | Tail-based (100% errors, 10% success) | Tempo/Jaeger + Prometheus | 0.9 |
| **Security/audit** | Authentication, role changes, secret access, policy changes | **Never sampled, append-only** | S3 + DynamoDB (immutable) | 0.95 |
| **Usage/billing** | Tokens consumed, compute minutes, storage bytes, budget warnings | 100% (billing accuracy) | PostgreSQL + data warehouse | 0.9 |

**Data warehouse (star schema)**:
- Fact tables: `fact_sessions`, `fact_llm_requests`, `fact_tool_invocations`
- Dimension tables: `dim_tenants`, `dim_users`, `dim_models`

### 8.4 OTel Collector Architecture

**Two-tier deployment** [R=0.85]:
- **Tier 1 (Agent)**: per-node, batching + memory limiting + tenant_id enrichment → forward to gateway
- **Tier 2 (Gateway)**: centralized, tail-based sampling, `spanmetrics` connector, multi-backend export (Prometheus/Tempo/Loki/Kafka)

**`spanmetrics` connector** automatically derives metrics from traces → less instrumentation effort.

**All metrics must carry `tenant_id` and `session_id` labels.**

---

## 9. C4 Architecture Summary

### Recommended External Actors (C4 Context)

| Actor | Role | R |
|-------|------|---|
| **Software Engineer** | Creates tasks, provides clarifications, accepts changes | 0.95 |
| **Reviewer / Tech Lead** | Reviews PR/MR, comments, merges | 0.95 |
| **Org Admin / IT Admin** | SSO/SCIM, roles, policies, integrations | 0.9 |
| **Security / Compliance Officer** | Audit logs, SOC 2/ISO compliance checks | 0.85 |
| **Finance / Procurement** | Budgets, limits, contracts | 0.8 |
| **VCS Provider** (GitHub/GitLab) | Repos, PRs, webhooks, CI | 0.95 |
| **LLM Providers** (Anthropic/OpenAI/Google) | AI inference | 0.95 |
| **Identity Provider** (Okta/Azure AD) | SAML/OIDC federation | 0.9 |
| **SaaS Tools** (Jira/Linear/Slack/Teams) | Task triggers, notifications | 0.9 |
| **MCP Tool Servers** | External tool integrations | 0.75 |

### Recommended Containers (C4 Container)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        Cloud Agent Execution Platform                       │
│                                                                             │
│  ┌─────────────────────┐  ┌─────────────────────┐  ┌────────────────────┐  │
│  │   Web UI + Public   │  │  Identity & Access   │  │  Tenant & Org      │  │
│  │   API Gateway       │  │  Service             │  │  Management        │  │
│  │   (React/Next.js +  │  │  (SAML/OIDC + SCIM  │  │  (teams, projects, │  │
│  │    REST/GraphQL)    │  │   + RBAC/ABAC)       │  │   policies, budgets│  │
│  └─────────┬───────────┘  └──────────┬───────────┘  └────────┬───────────┘  │
│            │                         │                        │              │
│  ┌─────────▼─────────────────────────▼────────────────────────▼───────────┐  │
│  │                     Task / Workflow Orchestrator                        │  │
│  │                     (Temporal-class durable workflows)                  │  │
│  └─────────┬──────────────────────────────────────────────────────────────┘  │
│            │                                                                 │
│  ┌─────────▼───────────┐  ┌─────────────────────┐  ┌────────────────────┐  │
│  │  Queue / Event Bus  │  │  Sandbox Provisioner │  │  LLM Gateway       │  │
│  │  (Kafka + NATS)     │  │  + Runtime Fleet     │  │  (multi-provider   │  │
│  │                     │  │  (Firecracker/gVisor │  │   routing, rate    │  │
│  │                     │  │   + warm pools)      │  │   limiting,        │  │
│  │                     │  │                      │  │   circuit breakers) │  │
│  └─────────────────────┘  └──────────────────────┘  └────────────────────┘  │
│                                                                              │
│  ┌─────────────────────┐  ┌─────────────────────┐  ┌────────────────────┐  │
│  │  Integrations Hub   │  │  Artifact Store +    │  │  Observability &   │  │
│  │  (GitHub/GitLab App,│  │  Session State Store │  │  Audit Pipeline    │  │
│  │   Jira/Linear,      │  │  (S3 + Redis +       │  │  (OTel Collector,  │  │
│  │   Slack/Teams,      │  │   PostgreSQL)        │  │   Prometheus/Tempo/│  │
│  │   MCP Servers)      │  │                      │  │   Loki, Kafka →    │  │
│  │                     │  │                      │  │   Data Warehouse)  │  │
│  └─────────────────────┘  └──────────────────────┘  └────────────────────┘  │
│                                                                              │
│  ┌─────────────────────┐  ┌─────────────────────┐                           │
│  │  Notification       │  │  PR/MR Delivery      │                           │
│  │  Service            │  │  Service             │                           │
│  │  (Slack/Email/      │  │  (Git operations,    │                           │
│  │   Webhooks)         │  │   branch mgmt)       │                           │
│  └─────────────────────┘  └─────────────────────┘                           │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 10. Risks & Uncertainties

### Confidence Levels (B.3 F-G-R Assessment)

| Category | F | R | Comment |
|----------|---|---|---------|
| Architecture patterns (Temporal, Firecracker, KEDA) | F2 | 0.95 | Confirmed by documentation + production adoption |
| Rate limits and pricing (Anthropic, GitHub, GitLab) | F2 | 0.95 | Direct data from official docs |
| E2B/Firecracker scale (500M+ sandboxes) | F1 | 0.85 | Public claims by E2B |
| Compute models: Claude Code, GitHub Copilot | F2 | 0.95 | Explicitly stated in documentation |
| Compute models: Devin, Cursor, Ona | F1 | 0.65 | Inferred from indirect evidence |
| Compute models: Factory AI, Poolside | F0 | 0.5 | Insufficient public technical information |
| OpenAI uptime statistics | F2 | 0.95 | Data from status.openai.com (Dec 2025 – Mar 2026) |
| OTel GenAI Conventions | F2 | 0.7 | Specification not yet stable |
| MCP adoption trajectory | F1 | 0.75 | Broad support, but protocol evolving |
| ISO 42001 as differentiator | F0 | 0.5 | Very early stage |

### What May Be Inaccurate (WLNK Flags)

1. **Pricing changes frequently** — LLM pricing drops rapidly; data accurate as of March 2026
2. **Rate limits are dynamic** — providers change limits; Anthropic uses acceleration limits
3. **Competitor architectures** — Devin, Cursor, Factory do not disclose sandbox details; conclusions are inference (R=0.5-0.7)
4. **Temporal alternatives** — research focuses on Temporal as leader, but Inngest, Hatchet, Restate may be viable (R for exclusivity = 0.75)
5. **Compliance requirements** vary by jurisdiction and industry — data is generalized

---

## 11. Open Questions

| # | Question | Impact | F | R |
|---|----------|--------|---|---|
| 1 | **GPU in sandboxes**: Firecracker lacks GPU passthrough. How to provide GPU compute for ML code? (Kata + GPU? Separate GPU tier?) | Architecture | F1 | 0.5 |
| 2 | **Context window economics**: At 1M token context window and $5/MTok input (Opus), full context load = $5/request. Optimal context management strategy? | Cost | F1 | 0.6 |
| 3 | **Session mobility architecture**: Claude Code "teleport" — how to architecturally ensure seamless session state transfer between surfaces? | UX + Architecture | F0 | 0.4 |
| 4 | **Warm pool sizing**: Optimal warm/active VM ratio? Depends on workload patterns — needs real workload profile analysis | Operations | F1 | 0.5 |
| 5 | **Multi-region data plane**: Low-latency sandbox provisioning with data residency requirements — regional sandbox fleets needed? | Compliance + Performance | F1 | 0.6 |
| 6 | **Agent evaluation metrics**: How to measure agent "quality"? PR acceptance rate? Cycle time? Customer satisfaction? No industry standard | Product | F0 | 0.3 |
| 7 | **Billing model**: Token-based vs compute-time-based vs task-based pricing? Optimal for unit economics and customer predictability? | Business | F1 | 0.5 |
| 8 | **On-premises deployment**: Poolside is the only vendor with on-prem focus. How large is the market for self-hosted agent platforms? | Strategy | F0 | 0.3 |
| 9 | **Regulatory landscape**: EU AI Act, ISO 42001 — impact on architectural requirements? | Compliance | F0 | 0.4 |
| 10 | **Agent-to-agent communication**: MCP + Teams A2A support — multi-agent collaboration architecture within a single task? | Architecture | F0 | 0.3 |

---

## 12. Next Steps

### Immediate (for C4 design)

1. **Lock Architecture Decision Records (ADRs)** for key decisions:
   - ADR-001: Bridge tenancy model
   - ADR-002: Firecracker as primary sandbox
   - ADR-003: Temporal as workflow engine
   - ADR-004: GitHub App integration model
   - ADR-005: LLM Gateway architecture (LiteLLM-based or custom)

2. **Detail C4 Component diagram** for critical containers:
   - Sandbox Provisioner (warm pool management, lifecycle)
   - LLM Gateway (routing, rate limiting, circuit breaking)
   - Task Orchestrator (Temporal workflow design)

3. **Prototype sandbox lifecycle**:
   - Firecracker boot → warm pool → session allocation → teardown
   - Measure real startup times with target tech stack

### Short-term

4. **Conduct threat modeling** (STRIDE) on main data flows
5. **Define billing model** and cost structure
6. **Choose managed services** vs build: Identity (WorkOS/Auth0), Temporal Cloud vs self-hosted, managed Kafka vs NATS

### Medium-term

7. **SOC 2 Type II readiness** — start with gap analysis
8. **GDPR compliance** — data mapping, DPA template, retention policies
9. **Pilot with E2B** — validate Firecracker sandbox approach vs building own fleet manager
10. **Benchmark LLM costs** — real token consumption profiles for typical agent tasks

---

## 13. Evidence & Sources (A.10 — Full SCR)

### Platform Documentation (fetched March 2026)

| Source | URL |
|--------|-----|
| Claude Code docs | https://code.claude.com/docs |
| Claude Code on the web | https://code.claude.com/docs/en/claude-code-on-the-web |
| Claude Code GitHub Actions | https://code.claude.com/docs/en/github-actions |
| Devin blog/docs | https://www.cognition.ai/blog, https://docs.devin.ai |
| GitHub Copilot Coding Agent | https://github.blog/changelog/2025-05-19-github-copilot-coding-agent-in-public-preview/ |
| Cursor blog/changelog | https://www.cursor.com/blog, https://www.cursor.com/changelog |
| Factory AI | https://www.factory.ai |
| Poolside | https://poolside.ai, https://poolside.ai/blog |
| Ona (ex-Gitpod) | https://ona.com, https://ona.com/stories/ |

### Architecture References

| Source | URL |
|--------|-----|
| AWS SaaS Lens (tenant isolation) | https://docs.aws.amazon.com/wellarchitected/latest/saas-lens/tenant-isolation.html |
| AWS Warm Pools | https://docs.aws.amazon.com/autoscaling/ec2/userguide/ec2-auto-scaling-warm-pools.html |
| Firecracker | https://firecracker-microvm.github.io/ |
| gVisor security | https://gvisor.dev/docs/architecture_guide/security/ |
| Kata Containers | https://katacontainers.io/ |
| Nydus (lazy-loading) | https://nydus.dev/ |
| E2B sandboxes | https://e2b.dev |
| Temporal | https://temporal.io/how-temporal-works, https://temporal.io/ai |
| KEDA | https://keda.sh/docs/2.16/concepts/ |
| NATS | https://nats.io/about/ |
| MCP specification | https://modelcontextprotocol.io/introduction |
| GitHub Apps | https://docs.github.com/en/apps/overview |
| Slack Events API | https://docs.slack.dev/apis/events-api |
| LiteLLM | https://docs.litellm.ai/docs/, https://docs.litellm.ai/docs/proxy/reliability |

### Security & Compliance

| Source | URL |
|--------|-----|
| Azure Multi-tenant Identity | https://learn.microsoft.com/en-us/azure/architecture/guide/multitenant/considerations/identity |
| Okta SCIM | https://developer.okta.com/docs/concepts/scim/ |
| Vault Leases | https://developer.hashicorp.com/vault/docs/concepts/lease |
| K8s Pod Security Standards | https://kubernetes.io/docs/concepts/security/pod-security-standards/ |
| Docker Seccomp | https://docs.docker.com/engine/security/seccomp/ |
| SLSA v1.0 | https://slsa.dev/spec/v1.0/about |
| SOC 2 (AICPA) | https://www.aicpa-cima.com/topic/audit-assurance/audit-and-assurance-greater-than-soc-2 |
| ISO 27001 | https://www.iso.org/standard/27001 |
| GDPR | https://gdpr.eu/what-is-gdpr/ |
| NIST 800-171 | https://csrc.nist.gov/publications/detail/sp/800-171/rev-2/final |
| Factory AI Security | https://www.factory.ai/security |
| Cursor Security | https://www.cursor.com/security |
| Cognition Security | https://www.cognition.ai/security |

### AI Security & Prompt Injection

| Source | URL |
|--------|-----|
| OWASP LLM01 | https://genai.owasp.org/llmrisk/llm01-prompt-injection/ |
| Indirect Prompt Injection (paper) | https://arxiv.org/abs/2302.12173 |
| Simon Willison (Dual LLM) | https://simonwillison.net/2023/Apr/25/dual-llm-pattern/ |
| Anthropic Sabotage Evaluations | https://www.anthropic.com/research/sabotage-evaluations |

### Observability

| Source | URL |
|--------|-----|
| OTel GenAI Conventions | https://opentelemetry.io/docs/specs/semconv/gen-ai/ |
| OTel GenAI Metrics | https://opentelemetry.io/docs/specs/semconv/gen-ai/gen-ai-metrics/ |
| OTel Agent Spans | https://opentelemetry.io/docs/specs/semconv/gen-ai/gen-ai-agent-spans/ |
| OTel Collector | https://opentelemetry.io/docs/collector/ |
| Langfuse Tracing | https://www.langfuse.com/docs/tracing |

### Rate Limits & Pricing

| Source | URL |
|--------|-----|
| Anthropic Rate Limits | https://platform.claude.com/docs/en/api/rate-limits |
| Anthropic Pricing | https://platform.claude.com/docs/en/about-claude/pricing |
| Google Gemini Rate Limits | https://ai.google.dev/gemini-api/docs/rate-limits |
| OpenAI Status | https://status.openai.com/ |
| GitHub API Rate Limits | https://docs.github.com/en/rest/using-the-rest-api/rate-limits-for-the-rest-api |
| GitLab Rate Limits | https://docs.gitlab.com/ee/user/gitlab_com/index.html |

### Resilience Patterns

| Source | URL |
|--------|-----|
| Martin Fowler Circuit Breaker | https://martinfowler.com/bliki/CircuitBreaker.html |
| Azure Circuit Breaker Pattern | https://learn.microsoft.com/en-us/azure/architecture/patterns/circuit-breaker |
| Azure Throttling Pattern | https://learn.microsoft.com/en-us/azure/architecture/patterns/throttling |
| Envoy Circuit Breaking | https://www.envoyproxy.io/docs/envoy/latest/intro/arch_overview/upstream/circuit_breaking |
| AWS Backoff + Jitter | https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/ |
| K8s Resource Quotas | https://kubernetes.io/docs/concepts/policy/resource-quotas/ |
| K8s NetworkPolicies | https://kubernetes.io/docs/concepts/services-networking/network-policies/ |

---

## Audit Trail (A.3 Work Record)

| Step | Action | Output |
|------|--------|--------|
| 1 | Read research brief (`research_prompt.md`) | Scope: 7 research areas for C4 Context + Container levels |
| 2 | Web research: 8 platforms, architecture references, security standards | 20+ primary sources fetched and verified |
| 3 | Source scoring (B.3 F-G-R) | SCR table with 20 entries (section 1) |
| 4 | Per-section B.5 reasoning cycles | Auditable claim chains with R scores |
| 5 | WLNK assessment (B.1) | Confidence bounds flagged for inferred claims |
| 6 | Cross-platform pattern synthesis (Γ_sys) | 7 validated architectural claims |
| 7 | C4 Actor and Container recommendations | Context + Container level proposals |
| 8 | Risk assessment with severity and R scores | Top 5 risks + 10 open questions with F/R scores |
