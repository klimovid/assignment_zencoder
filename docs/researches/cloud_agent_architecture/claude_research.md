# Deep Research: Cloud Agent Execution Platform — System Landscape & Architecture

> **Author**: Claude Code (Opus 4.6)
> **Date**: 2026-03-16
> **Research brief**: [research_prompt.md](research_prompt.md)
> **Companion reports**: [gemini-cloud-agent-architecture-research.md](gemini-cloud-agent-architecture-research.md), [openai-deep-research-report.md](openai-deep-research-report.md)
> **Methodology**: Web research (March 2026), cross-referencing official documentation, vendor announcements, and architectural reference materials. All sources verified via direct URL fetch.

---

## Executive Summary

Cloud agent execution platforms — управляемые SaaS-среды, в которых AI-агенты автономно выполняют задачи software engineering (от тикета до pull request) — формируют новую категорию инфраструктурного ПО. Исследование охватывает 8 платформ (Devin, Claude Code Web, GitHub Copilot Coding Agent, Cursor, Replit Agent, Factory AI, Poolside, Ona/ex-Gitpod) и синтезирует архитектурные паттерны, подтверждённые production-практикой.

**Ключевые архитектурные выводы:**

1. **Bridge-модель tenancy** — единственный жизнеспособный подход: pool для control plane, silo для data plane (sandbox per session).
2. **Firecracker microVM** — индустриальный стандарт sandboxing'а для untrusted code, валидированный E2B (500M+ sandboxes, <200ms startup) и AWS Lambda/Fargate.
3. **Temporal** — де-факто стандарт оркестрации durable workflows для агентов (используется Replit, OpenAI, Netflix).
4. **GitHub App model** — рекомендуемая модель Git-интеграции (fine-grained permissions, short-lived tokens, webhooks).
5. **MCP (Model Context Protocol)** — формирующийся стандарт интеграции инструментов (JSON-RPC 2.0, поддержка Claude/ChatGPT/VS Code/Cursor).
6. **LLM Gateway** — обязательный компонент: tenant-aware rate limiting, circuit breakers, multi-provider fallback (LiteLLM как reference).
7. **Все платформы сходятся на PR как основном артефакте** доставки результата в SDLC.

**Главные риски**: sandbox escape, Denial of Wallet (неконтролируемый расход), LLM provider outages (OpenAI: 99.76% API uptime = ~1.75ч downtime/мес), indirect prompt injection, data sovereignty.

---

## Table of Contents

1. [Product Category & Core Value](#1-product-category--core-value)
2. [Core Functionality Map](#2-core-functionality-map)
3. [Architecture Patterns](#3-architecture-patterns)
4. [Scaling Challenges](#4-scaling-challenges)
5. [Third-Party Dependencies & Risks](#5-third-party-dependencies--risks)
6. [Security & Compliance](#6-security--compliance)
7. [Observability & Analytics](#7-observability--analytics)
8. [C4 Architecture Summary](#8-c4-architecture-summary)
9. [Evidence & Sources](#9-evidence--sources)
10. [Risks & Uncertainties](#10-risks--uncertainties)
11. [Open Questions](#11-open-questions)
12. [Next Steps](#12-next-steps)

---

## 1. Product Category & Core Value

### Key Findings

**Core value proposition — 5 проблем, которые решает cloud execution, но не решает local:**

| Измерение | Local Agent | Cloud Agent |
|-----------|-------------|-------------|
| **Параллелизм** | Ограничен ресурсами машины | N одновременных агентов |
| **Независимость** | Требует подключённую машину | Работает после закрытия ноутбука |
| **Изоляция** | Полный доступ к FS/сети разработчика | Изолированная VM/контейнер |
| **Стандартизация** | Разные окружения у каждого разработчика | Единый базовый образ |
| **Аудит и governance** | Минимальный trail | Полные audit logs, scoped credentials |

**Ландшафт платформ (8 продуктов, март 2026):**

| Платформа | Compute-модель | Доставка результата | Триггеры | Уровень достоверности |
|-----------|---------------|-------------------|----------|----------------------|
| **Claude Code Web** | Isolated VMs (Anthropic-managed) | Branch + PR | Manual, GitHub Actions, Slack, cron | Confirmed (документация) |
| **Devin** | Cloud workspace (вероятно VM с full desktop) | PR/MR | Manual, Linear/Jira/Slack | Inferred (full desktop → VM) |
| **GitHub Copilot Agent** | GitHub Actions runners (Linux VMs) | PR | Issue assignment | Confirmed |
| **Cursor** | Cloud sandboxes / "own VM" | PR (GitHub App) + Artifacts API | Manual, GH/Slack/Linear/PagerDuty, cron | Partially confirmed |
| **Replit Agent** | Replit cloud containers | Direct code changes + deploy | Manual only | Confirmed |
| **Factory AI** | Cloud-hosted (details undisclosed) | PR с traceability | Manual, issue events, Slack/Teams | Marketing-level |
| **Poolside** | On-prem / VPC deployment | IDE-integrated | IDE extensions | Confirmed (unique positioning) |
| **Ona (ex-Gitpod)** | Full CDE per agent ("not just containers") | PR | Manual, PRs, webhooks, cron | Inferred (Gitpod heritage) |

**Typical user journey:**

```
1. Task creation (issue/тикет/описание/Slack команда)
   ↓
2. Environment provisioning (clone repo → isolated VM → install deps)
   ↓
3. Agent execution (Think → Act → Observe loop, параллельные агенты)
   ↓
4. Result review (diff view, итеративный feedback mid-flight)
   ↓
5. PR creation & merge (стандартный code review + CI)
```

**Emerging trends (2025-2026):**
- **Session mobility**: Claude Code "teleport" между web и терминалом
- **Kernel-level governance**: Ona "Veto" — enforcement на уровне ядра ОС
- **Automation-first**: событийные и scheduled агенты (Cursor Automations, Ona Automations)
- **Code review = новое бутылочное горло**: Devin Review, Cursor Bugbot, Claude Code review action
- **MCP-экосистемы**: Cursor (30+ плагинов), Claude Code MCP, Factory vendor-agnostic

### Architecture Implications

- Продукт = **SaaS-оркестратор "рабочих капсул"** + система доставки артефактов + SDLC-интеграции. Диктует разделение на control plane и data plane.
- User journey "plan→код→PR" требует **diff-centric review surface**, artifact storage, PR/MR operations service, activity timeline per session.
- Тренд к VM-уровню изоляции: Claude Code (explicit VMs), Devin (full desktop → VMs), Cursor ("own VM"), Ona ("not just containers").

### Known Trade-offs

| Решение | Вариант A | Вариант B |
|---------|-----------|-----------|
| Автономность vs контроль | Полная автономия (быстрее, рискованнее) | Human-in-the-loop (безопаснее, медленнее) |
| Скорость vs изоляция | Контейнеры (быстрый старт, shared kernel) | VMs/microVMs (сильная изоляция, дольше boot) |
| Универсальный runtime vs специализированный | Один образ для всех (тяжёлый, простой UX) | Per-stack образы (легче, больше поддержки) |
| PR-only vs гибкая доставка | PR (стандарт, audit-friendly) | PR + artifacts + patches (гибко, больше инженерии) |

---

## 2. Core Functionality Map

### Key Findings

**Must-have ядро:** task intake → orchestrated execution → PR/MR + артефакты → review

**Функциональные группы:**

| Группа | Функции | Примеры из рынка |
|--------|---------|-----------------|
| **Agent execution** | Сессии/задачи, прогресс, логирование шагов, stop/resume, параллельные запуски | Cursor: параллелизм; Claude Code: sub-agents |
| **Workspace & runtime** | Шаблоны окружений, управление зависимостями, кэширование, артефакты | Cursor: artifacts + presigned URL; Claude Code: custom setup scripts |
| **SDLC delivery** | Ветки, PR/MR, комментарии, CI статусы | Devin: auto-fix review comments; Cursor: GitHub App PR |
| **Collaboration** | Shared сессии, review workflow, уведомления, handoff web↔CLI | Claude Code: "teleport"; Devin: Slack threading |
| **Org governance** | Пользователи/команды, роли, политики, бюджеты, аудит | Cursor: SSO/SCIM + audit; Factory: SIEM export |
| **Billing & cost** | Учёт токенов/compute/storage, бюджеты по tenant, алерты | Anthropic: tier-based limits; Cursor: per-team budgets |
| **Integrations** | GitHub/GitLab, Jira/Linear, Slack/Teams, MCP tools | Cursor Automations: GH/Slack/Linear/PagerDuty triggers |
| **Analytics** | Метрики, трассировки, customer analytics, экспорт | Factory: audit log → SIEM; Cursor: admin analytics |

**Org-level взаимодействие — обязательно с первого дня:**
- SSO (SAML/OIDC) — подтверждено у Devin, Cursor, Replit Enterprise, Claude
- SCIM provisioning — Cursor, GitHub Enterprise
- Audit logs — Cursor, Devin, Claude, GitHub (streaming в SIEM)
- Roles & policies — RBAC минимум, ABAC для бюджетов/scope
- Budget limits — per-org/per-team token и compute лимиты

### Architecture Implications

- На C4 Container уровне **интеграционные адаптеры** (GitHub/GitLab/Slack/Linear) должны быть отделены от ядра orchestration: разные протоколы, SLA, модели ошибок.
- «Орг-контуры» (SSO/SCIM/audit) нельзя добавить позже: они влияют на модель данных (tenant context в каждой сущности), политику доступов и audit events.

### Known Trade-offs

- **Единый универсальный runtime vs специализированные**: универсальность дороже, но снижает friction.
- **PR-доставка vs patch artifact**: PR даёт встроенный audit/review, но требует интеграции и прав в VCS. Рынок сильно склоняется к PR/MR.

---

## 3. Architecture Patterns

### Key Findings

#### 3.1 Multi-Tenancy: Bridge Model

AWS SaaS Lens определяет три канонические модели:

| Модель | Описание | Pros | Cons |
|--------|----------|------|------|
| **Pool** | Shared инфраструктура, логическая изоляция | Cost-efficient, упрощённое управление | Noisy neighbor, compliance concerns |
| **Silo** | Dedicated стек per tenant | Простая изоляция, failure containment | Не масштабируется на тысячи tenants |
| **Bridge** | Гибрид: разные компоненты — разная изоляция | Баланс стоимости и безопасности | Сложность provisioning и routing |

**Рекомендация: Bridge.** Pool для control plane (API gateway, auth, billing, task queue). Silo для data plane (sandbox per session). Full silo (dedicated cluster/VPC) как enterprise add-on.

#### 3.2 Sandboxing: Firecracker как Primary Choice

| Технология | Уровень изоляции | Startup | Memory overhead | K8s native | GPU |
|-----------|-----------------|---------|----------------|------------|-----|
| **OCI containers (runc)** | Process (shared kernel) | ~50ms | ~1-5 MB | Да | Да |
| **gVisor (runsc)** | Application kernel | ~100ms | ~15-30 MB | Да (RuntimeClass) | Ограничено |
| **Kata Containers** | VM (dedicated kernel) | ~150-500ms | ~20-40 MB | Да (RuntimeClass) | Возможно |
| **Firecracker** | VM (dedicated kernel) | ~125ms | <5 MB | Нет | Нет |

**E2B — ключевой reference**: 500M+ sandboxes на Firecracker, <200ms startup с warm pools, up to 24h sessions. 2M+ monthly SDK downloads, 88% Fortune 100.

**Nydus** для ускорения startup: lazy-loading контейнерных образов, pull time с 20 секунд до 0.8 сек (Alibaba production).

#### 3.3 Orchestration: Temporal + KEDA

**Temporal:**
- Durable execution — workflow recoverable после любого сбоя
- Используется: **Replit** (coding agents), **OpenAI**, Netflix, Coinbase, DoorDash
- Agent loop → Temporal Workflow: каждый Think/Act/Observe = Activity
- Signals для user feedback/cancellation, Queries для прогресса
- Continue-As-New для long sessions (предотвращает unbounded event history)
- Масштаб: 200M+ executions/sec (Temporal Cloud)

**KEDA:**
- Event-driven autoscaling для Kubernetes
- ScaledJob: одна задача из очереди = один Job (agent session)
- Scale to zero когда нет задач
- 70+ scalers (Kafka, SQS, NATS, Redis, Prometheus)

#### 3.4 Event Streaming: NATS + Kafka

| Dimension | Kafka | NATS |
|-----------|-------|------|
| Latency | ~ms | sub-ms |
| Durability | Strong (replicated log) | JetStream (optional) |
| Operational complexity | Высокая | Низкая (single binary, 20MB RAM) |
| Best for | Audit logs, analytics, event sourcing | Real-time agent comms, control signals |

**Рекомендация:** NATS для real-time agent communication. Kafka для durable event sourcing и analytics. Для ранней стадии — NATS + JetStream может покрыть оба use case.

#### 3.5 Data Flow: End-to-End

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
Agent Runtime (Think→Act→Observe loop в microVM)
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

**Где живёт state:**

| Тип state | Storage | Rationale |
|-----------|---------|-----------|
| Workflow execution | Temporal event history | Durable, replayable |
| Conversation history | S3 + Redis cache | Слишком велик для Temporal |
| Sandbox filesystem | Firecracker local disk | Ephemeral; snapshot to S3 |
| Task metadata | PostgreSQL | Queryable, transactional |
| Real-time events | NATS (in-flight) + Kafka (persisted) | Real-time + audit |
| Token/cost counters | Redis (real-time) + PostgreSQL (flush) | Low-latency + durable |

#### 3.6 Integration Patterns

**GitHub App (рекомендация):**
- Fine-grained permissions, repository-level access control
- Short-lived installation tokens (1 час)
- Webhook model для event-driven triggers
- Audit trail в GitHub security log
- GitHub рекомендует Apps вместо OAuth Apps для новых интеграций

**MCP (Model Context Protocol):**
- Open-source (Anthropic), JSON-RPC 2.0
- Primitives: Tools, Resources, Prompts
- Transport: STDIO (local) или Streamable HTTP (remote)
- Клиенты: Claude, ChatGPT, VS Code, Cursor
- Платформа = **MCP Host**, подключающая agents к user-configured MCP Servers

**ChatOps (Slack Events API):**
- 30K events/workspace/app/60min
- Slash command → async queue → agent task → threaded progress → result with action buttons
- Idempotency обязательна (Slack retries)
- HTTP 200 за 3 секунды, иначе business logic в async queue

### Architecture Implications

- На C4 Container уровне неизбежны: **Orchestrator**, **Sandbox Provisioner**, **LLM Gateway**, **Integrations Hub**, **Artifact Store**, **Policy/Audit** — иначе сольются контуры надёжности и безопасности.
- Bridge tenancy закладывать с первого дня, иначе enterprise → большой рефакторинг.

### Known Trade-offs

- **Queue-based async** снижает связность, но усложняет отладку (correlation IDs, idempotency)
- **Temporal** даёт recovery, но добавляет ops cost (кластер, history storage, workflow versioning)
- **Firecracker boot (125ms) vs containers (50ms)**: security gain worth the latency; mitigate с warm pools + Nydus
- **MCP still evolving** (protocol v2025-06-18): build custom adapter layer, replace with MCP over time

---

## 4. Scaling Challenges

### Key Findings

#### 4.1 Horizontal Scaling Bottlenecks

Масштабирование до тысяч concurrent sessions ломается на:
1. **Environment provisioning** (создание VM, image pull, repo clone) — cold start 2-5 мин
2. **LLM API rate limits** — external constraint, не контролируется платформой
3. **Noisy neighbor** — активность одного tenant деградирует остальных

**Warm pools** (AWS EC2 Auto Scaling паттерн):
- Pre-initialized instances при scale-out берутся из pool, не создаются с нуля
- States: Stopped (cheapest), Hibernated (fast restart), Running (costly)
- Instance reuse: при scale-in возвращаются в pool, а не уничтожаются
- Lifecycle hooks: обязательны, иначе initialization не успевает завершиться

#### 4.2 LLM Rate Limits — Hard External Constraint

**Anthropic (текущие лимиты):**

| Tier | RPM | Input TPM | Output TPM | Deposit |
|------|-----|-----------|------------|---------|
| Tier 1 | 50 | 30,000 | 8,000 | $5 |
| Tier 2 | 1,000 | 450,000 | 90,000 | $40 |
| Tier 3 | 2,000 | 800,000 | 160,000 | $200 |
| Tier 4 | 4,000 | 2,000,000 | 400,000 | $400 |

- Token bucket algorithm (continuous replenishment)
- **Cache-aware**: cached tokens не считаются → при 80% cache hit rate, effective throughput ×5
- **Acceleration limits**: резкий рост нагрузки → 429 даже ниже stated limits
- Rate limits per-organization, shared across workspaces

**Расчёт capacity**: Tier 4 (4,000 RPM) ≈ 60-70 concurrent agent sessions при 1 req/sec каждый. Для 1,000+ sessions — обязательна multi-provider стратегия и queue-based smoothing.

**GitHub API**: 5,000 req/hr (PAT), 12,500 req/hr (GitHub App), secondary limits 100 concurrent + 900 points/min.

**GitLab API**: 2,000 req/min (authenticated), pipeline creation 25 req/min, webhooks 500-13,000 calls/min.

#### 4.3 Cost Scaling — Three Axes

**Anthropic Pricing (текущие):**

| Model | Input/MTok | Output/MTok | Cache Hit/MTok |
|-------|-----------|-------------|----------------|
| Opus 4.6/4.5 | $5 | $25 | $0.50 |
| Sonnet 4.x | $3 | $15 | $0.30 |
| Haiku 4.5 | $1 | $5 | $0.10 |
| Haiku 3.5 | $0.80 | $4 | $0.08 |

- Batch API: -50%. Fast mode (Opus): ×6.
- Complex coding task с Opus: $0.25-$12.50+ per task (50K-500K+ tokens)
- 10,000 tasks/day с Opus: $10K-$150K/day в LLM costs alone

**Стратегии снижения cost:**
- Route простые задачи на Haiku (5-25× дешевле Opus)
- Aggressive prompt caching (90% reduction on hits)
- Batch API для non-interactive tasks (-50%)
- Context window optimization
- Per-session/per-tenant budget caps

#### 4.4 State Management

- **Temporal** для durable execution — полное восстановление после сбоя
- **Heartbeats** для long-running activities: если нет heartbeat → automatic retry
- **Continue-As-New** для sessions >100 iterations (предотвращает unbounded event history)
- **Checkpoint data** в heartbeat payloads → при retry, resume с последнего checkpoint

### Architecture Implications

- **Двухуровневый планировщик**: (1) Task scheduler (очередь/workflow), (2) Resource scheduler (K8s/VM fleet). KEDA связывает queue depth → HPA.
- **Noisy neighbor protection**: tenant-квоты, concurrency limits, priority queues, отдельные node pools для enterprise.
- **State externalization**: артефакты/логи/контекст в хранилищах, исполнитель — "одноразовый". Durable workflows склеивают выполнение поверх одноразовых workers.

### Known Trade-offs

- **Stateful sessions** (long-lived workers + local disk) проще для repo/cache, но сложнее recovery/balancing; **stateless + external state** лучше масштабируются, но сложнее артефакт-модель.
- **Shared cluster (pool)** дешевле, но сложнее доказать изоляцию; **silo per tenant** дороже, но проще для compliance.

---

## 5. Third-Party Dependencies & Risks

### Key Findings

#### 5.1 Critical Dependencies

| Dependency | Failure Modes | Impact |
|-----------|--------------|--------|
| **LLM providers** (Anthropic, OpenAI, Google) | 429 rate limiting, streaming failures, full outage | Agent execution stops |
| **Git hosting** (GitHub, GitLab) | API rate limits, webhook delays, outage | No repo clone, no PR creation |
| **Identity providers** (Okta, Azure AD) | SAML/OIDC federation failure | Users cannot authenticate |
| **Cloud infrastructure** (AWS/GCP/Azure) | Registry failures, storage unavailability | No sandbox provisioning |
| **Communications** (Slack, Teams) | Webhook delays, API limits | No trigger delivery, no notifications |

#### 5.2 Real-World LLM Provider Outages (2024-2026)

**OpenAI (Dec 2025 - Mar 2026):**
- Dec 16-18: ChatGPT Login partial outage (~2.5 days)
- Dec 16-17: Responses & Codex degraded (~10 hours)
- Feb 3-4, 2026: Multi-component degradation (13+ services)
- **Overall uptime**: APIs 99.76%, ChatGPT 99.08%
- 99.76% API uptime = **~1.75 hours downtime/month**

**Anthropic**: acceleration limits trigger 429 при резком росте. SSE streaming: ошибка может прийти после 200 OK.

#### 5.3 Resilience Patterns

**Circuit Breaker** (Fowler):
- Closed → Open (при threshold) → Half-Open (trial requests)
- Per-provider breakers (не один на всех)
- Envoy proxy поддерживает circuit breaking как sidecar

**Exponential Backoff + Jitter** (AWS):
- Full jitter: `sleep = random(0, min(cap, base * 2^attempt))`
- Decorrelated jitter: `sleep = min(cap, random(base, sleep * 3))`
- Распределяет нагрузку, предотвращает thundering herd

**LiteLLM** (multi-provider gateway, reference):
- 100+ LLMs через OpenAI-compatible interface
- Fallback types: standard, content policy, context window
- Cooldown mechanism: модель уходит в cooldown после `allowed_fails`
- Per-key rate limiting, pre-call checks
- Geography-aware routing (EU data residency)
- Cost tracking per project/user/tenant

### Architecture Implications

- **LLM Gateway — обязательный контейнер**: (a) tenant-aware rate limiting, (b) token metrics aggregation, (c) retries с jitter, (d) circuit breakers, (e) multi-provider routing. Многомерные лимиты (TPM/RPM) делают "простые ретраи" опасными.
- **Integration worker tier** с очередями и idempotency keys для внешних интеграций (webhooks дублируются/приходят не по порядку).
- **Queue-based smoothing**: вместо прямого forwarding LLM requests — очередь с controlled rate, priority scheduling (interactive > batch), fair queuing across tenants.

### Known Trade-offs

- **Multi-provider LLM** повышает resilience, но усложняет совместимость (разный function calling format, лимиты, data policies)
- **Fail fast vs queue-and-retry**: fail fast для interactive UX, queue для background tasks

---

## 6. Security & Compliance

### Key Findings

#### 6.1 Authentication & Authorization

**AuthN stack (enterprise requirements):**
- **SAML 2.0** — table stakes (Cursor, Devin, Replit Enterprise)
- **OIDC** — для cloud-native организаций (Devin рекомендует OIDC)
- **SCIM** — automated user lifecycle (Cursor, GitHub Enterprise)
- **Workload identity federation** — GitHub Actions OIDC → platform tokens
- **API keys** — hash-and-store, identifiable prefix (`zc_live_`), 90-day TTL, per-key rate limits

**Рекомендуемая authN архитектура:**
Managed identity service (WorkOS, Auth0) для SAML/OIDC/SCIM → platform-specific JWT → все downstream services валидируют platform tokens.

**Authorization — Hybrid RBAC + ABAC:**

| Role | Permissions |
|------|------------|
| Org Owner | Full control, billing, SSO config |
| Org Admin | User/team management, policy configuration |
| Team Lead | Create/manage agents for team, set budgets, view team analytics |
| Developer | Run agents, view own sessions, configure integrations |
| Viewer | Read-only access to results and analytics |
| Billing Admin | Billing management, no execution permissions |

ABAC layer для: budget limits, repository scoping, time restrictions, IP restrictions. Centralized policy engine (OPA/Cedar).

#### 6.2 Security Boundaries

**Defense-in-depth (6 layers, inside → outside):**

1. **Application-level**: Agent runtime limits на tools/commands (bypassable — agents generate code)
2. **Runtime sandbox**: Firecracker/gVisor — primary security boundary
3. **Container/cgroup**: Resource limits (CPU, memory, disk I/O, PIDs)
4. **Network segmentation**: Egress proxy, no inter-sandbox communication, no metadata API access
5. **Host OS hardening**: Seccomp + AppArmor/SELinux + read-only root filesystem
6. **Infrastructure isolation**: Separate VPC for sandbox execution vs control plane

**Firecracker security model (in depth):**
- Minimal device model: **5 devices** (vs QEMU: сотни) → drastically reduced attack surface
- **Jailer**: chroot + seccomp filter + unprivileged user + PID/network namespaces + cgroup limits
- Rust implementation → no buffer overflows, use-after-free
- Escape requires: guest kernel exploit → KVM/VMM exploit → jailer bypass → host security bypass
- AWS: **billions of Firecracker microVMs** для Lambda/Fargate, no publicly disclosed escapes

**Secret management (Vault patterns):**
- Per-session short-lived credentials (GitHub App tokens: 1hr, AWS STS: session-scoped)
- Orchestrator — единственный компонент, общающийся с Vault
- Prefix-based revocation для incident response
- "Secret zero": Vault AppRole with wrapped secret ID или vsock injection

#### 6.3 Prompt Injection & Context Poisoning

**Indirect prompt injection** — главная AI-специфичная угроза (OWASP LLM01:2025):
- Vectors: malicious README, issue descriptions, code comments, dependency docs, error messages, CI output
- "Effective mitigations are currently lacking" (arXiv:2302.12173)

**5-layer defense:**
1. Input sanitization & trust-level tagging
2. Dual LLM pattern (privileged + quarantined LLM) — complex, acknowledged as imperfect
3. **Sandbox as backstop** — non-negotiable
4. Behavioral monitoring (anomalous network, file access, unexpected commands)
5. Human-in-the-loop для sensitive operations

**Приоритет**: Layers 1, 3, 4, 5 сразу. Layer 2 (Dual LLM) — future enhancement для high-security tiers.

#### 6.4 Compliance Frameworks

| Framework | Scope | Priority | Notes |
|-----------|-------|----------|-------|
| **SOC 2 Type II** | Security, Availability, Confidentiality | Year 1 | Table stakes для enterprise sales |
| **GDPR** | Data protection EU | Day 1 | 72-hour breach notification, data residency |
| **ISO 27001** | Information security management | Year 2 | 93 Annex A controls, международно признан |
| **NIST 800-171** | CUI protection (government) | Market entry | 11 control families, Rev 3 (May 2024) |
| **ISO 42001** | AI management system | Differentiator | Factory AI среди первых с сертификацией |

**Competitor compliance landscape:**
- **Factory AI**: SOC 2 Type I, ISO 42001, single-tenant VPC, SIEM export
- **Cursor**: SOC 2 Type II, Privacy Mode (50%+ users), parallel privacy infrastructure
- **Devin**: Bugcrowd VDP, limited public compliance info
- **Replit**: SOC 2 Type II

### Architecture Implications

- **Security & Governance layer** как отдельный набор контейнеров: Identity + SCIM, Policy Engine, Audit Pipeline.
- Sandboxing → от уровня недоверия к коду: если untrusted → Firecracker/gVisor, не plain containers.
- Data residency с первого дня: regional control plane (EU, US, APAC), данные не покидают регион.

### Known Trade-offs

- **RBAC vs ABAC**: RBAC проще, ABAC гибче — hybrid recommended
- **Audit log export** повышает доверие, но создаёт costs и requirements к immutability
- **Row-level security** (дёшево, requires discipline) vs **per-tenant databases** (strongest, expensive)

---

## 7. Observability & Analytics

### Key Findings

#### 7.1 Three Signal Types + AI-Specific

**OpenTelemetry GenAI Semantic Conventions** (Development status):

| Metric | Type | Description |
|--------|------|-------------|
| `gen_ai.client.token.usage` | Histogram | Input/output tokens per operation |
| `gen_ai.client.operation.duration` | Histogram | Duration of GenAI operations |
| `gen_ai.server.time_to_first_token` | Histogram | Queue + prefill latency |
| `gen_ai.server.time_per_output_token` | Histogram | Decode phase performance |

**Agent span structure** (OTel spec): `create_agent` → `invoke_agent` → `execute_tool`
- Typical session: 15-25 agentic steps × (2-3 LLM calls + 2-5 tool calls) = **40-75+ spans**
- Complex sessions: **150+ spans**

#### 7.2 Platform-Specific Metrics

**Session lifecycle:**
- `agent.session.active` (gauge), `agent.session.duration` (histogram), `agent.session.outcome` (counter by success/failure/timeout)

**Sandbox provisioning:**
- `sandbox.provision.duration` (histogram), `sandbox.pool.available` (gauge), `sandbox.pool.utilization` (gauge)

**LLM operations:**
- `llm.request.429_rate` (counter), `llm.cost.per_session` (histogram), `llm.cost.per_tenant` (counter), `llm.provider.health` (gauge)

#### 7.3 Event Pipeline Architecture

**Three event streams:**

1. **Operational**: task lifecycle (created/queued/running/completed/failed), sandbox events, integration events
2. **Security/audit**: authentication, role changes, secret access, policy changes — **never sampled, append-only**
3. **Usage/billing**: tokens consumed, compute minutes, storage bytes, budget warnings

**Data warehouse (star schema):**
- Fact tables: `fact_sessions`, `fact_llm_requests`, `fact_tool_invocations`
- Dimension tables: `dim_tenants`, `dim_users`, `dim_models`

#### 7.4 OTel Collector Architecture

**Two-tier deployment:**
- **Tier 1 (Agent)**: per-node, batching + memory limiting + tenant_id enrichment → forward to gateway
- **Tier 2 (Gateway)**: centralized, tail-based sampling (100% errors, 10% success, threshold-based), `spanmetrics` connector, multi-backend export (Prometheus/Tempo/Loki/Kafka)

**Sampling strategy:**
- 100% для error/failed sessions
- Head-based 10% для successful
- Tail-based для sessions > latency/cost thresholds
- Audit logs: **никогда не сэмплируются**

### Architecture Implications

- Telemetry pipeline ≠ audit pipeline. Audit = separate, durable, never-sampled store (S3 + DynamoDB).
- Customer analytics из dedicated analytics DB (не operational DB). Event streaming → data warehouse.
- `spanmetrics` connector автоматически derives metrics из traces → меньше instrumentation effort.
- Все metrics должны нести `tenant_id` и `session_id` labels.

### Known Trade-offs

- **Единый event stream** (дешевле, строгая tenant-фильтрация) vs **per-tenant streams** (проще изоляция, дороже)
- **High log detail** (помогает расследованиям) vs **cost + data leak risk** (логи могут содержать код/промпты)
- **100% tracing** (полная видимость) vs **tail-based sampling** (экономичнее, potential blind spots)

---

## 8. C4 Architecture Summary

### Recommended External Actors (C4 Context)

| Actor | Роль |
|-------|------|
| **Software Engineer** | Создаёт задачи, даёт уточнения, принимает изменения |
| **Reviewer / Tech Lead** | Ревьюит PR/MR, комментирует, мерджит |
| **Org Admin / IT Admin** | SSO/SCIM, роли, политики, интеграции |
| **Security / Compliance Officer** | Audit logs, SOC 2/ISO compliance checks |
| **Finance / Procurement** | Бюджеты, лимиты, контракты |
| **VCS Provider** (GitHub/GitLab) | Repos, PRs, webhooks, CI |
| **LLM Providers** (Anthropic/OpenAI/Google) | AI inference |
| **Identity Provider** (Okta/Azure AD) | SAML/OIDC federation |
| **SaaS Tools** (Jira/Linear/Slack/Teams) | Task triggers, notifications |
| **MCP Tool Servers** | External tool integrations |

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

### Top 5 Architecture Risks

| # | Риск | Severity | Mitigation |
|---|------|----------|------------|
| 1 | **Sandbox escape** — выход из VM/контейнера при запуске untrusted code | Critical | Firecracker + Jailer + seccomp + network segmentation + defense-in-depth |
| 2 | **Denial of Wallet** — неконтролируемый расход на LLM/compute | High | Per-session/tenant budget caps, cost estimation pre-call, kill switches, anomaly detection |
| 3 | **LLM provider outage/rate limiting** — agent execution stops | High | LLM Gateway + circuit breakers + multi-provider fallback + queue smoothing |
| 4 | **Indirect prompt injection** — malicious instructions в code/docs/issues | High | Sandbox backstop + input sanitization + behavioral monitoring + human-in-the-loop |
| 5 | **Data sovereignty / secret leakage** — код/секреты утекают через LLM/логи | High | Regional deployment, short-lived credentials, Privacy Mode, audit logs, encryption at rest/transit |

---

## 9. Evidence & Sources

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

## 10. Risks & Uncertainties

### Уровни достоверности данных

| Категория | Уровень | Комментарий |
|-----------|---------|-------------|
| Архитектурные паттерны (Temporal, Firecracker, KEDA) | **Confirmed** | Подтверждено документацией + production adoption |
| Rate limits и pricing (Anthropic, GitHub, GitLab) | **Confirmed** | Прямые данные из официальной документации |
| E2B/Firecracker scale (500M+ sandboxes) | **Confirmed** | Публичные заявления E2B |
| Compute-модели Claude Code, GitHub Copilot | **Confirmed** | Явно указано в документации |
| Compute-модели Devin, Cursor, Ona | **Inferred** | Выведено из косвенных признаков (full desktop → VM) |
| Compute-модели Factory AI, Poolside | **Low confidence** | Недостаточно public technical information |
| OpenAI uptime statistics | **Confirmed** | Данные status.openai.com (Dec 2025 - Mar 2026) |
| OTel GenAI Conventions | **Development status** | Спецификация ещё не стабильна |
| MCP adoption trajectory | **Likely** | Широкая поддержка, но protocol evolving |
| ISO 42001 как differentiator | **Emerging** | Очень ранняя стадия, Factory AI среди первых |

### Что может быть неточным

1. **Pricing может измениться** — LLM pricing снижается быстро; данные актуальны на март 2026.
2. **Rate limits динамичны** — провайдеры меняют лимиты; Anthropic использует acceleration limits.
3. **Competitor architectures** — Devin, Cursor, Factory не раскрывают детали sandbox'инга; наши выводы — inference.
4. **Temporal alternatives** — исследование фокусируется на Temporal как лидере, но Inngest, Hatchet, Restate могут быть viable.
5. **Compliance requirements** варьируются по юрисдикции и отрасли — данные обобщены.

---

## 11. Open Questions

### Требуют дополнительного исследования

1. **GPU в sandboxes**: Firecracker не поддерживает GPU passthrough. Как обеспечить GPU compute для агентов, работающих с ML-кодом? (Kata + GPU? Отдельный GPU-tier?)

2. **Context window economics**: При 1M token context window и $5/MTok input (Opus), загрузка полного контекста = $5 per request. Какова оптимальная стратегия context management для agent sessions?

3. **Session mobility архитектура**: Claude Code "teleport" между web и терминалом — как архитектурно обеспечить бесшовную передачу session state между surfaces?

4. **Warm pool sizing**: Какое оптимальное соотношение warm/active VMs? Зависит от паттернов нагрузки — нужен анализ реальных workload profiles.

5. **Multi-region data plane**: Как обеспечить low-latency sandbox provisioning при data residency requirements? Нужны ли regional sandbox fleets?

6. **Agent evaluation metrics**: Как измерять "качество" работы агента? PR acceptance rate? Cycle time? Customer satisfaction? Нет индустриального стандарта.

7. **Billing model**: Token-based vs compute-time-based vs task-based pricing? Какая модель оптимальна для unit economics и customer predictability?

8. **On-premises deployment**: Poolside — единственный vendor с on-prem focus. Насколько велик рынок для self-hosted agent platforms?

9. **Regulatory landscape**: AI-specific regulation (EU AI Act, ISO 42001) — как это повлияет на architectural requirements?

10. **Agent-to-agent communication**: MCP + Teams A2A support — как должна выглядеть архитектура multi-agent collaboration в рамках одной задачи?

---

## 12. Next Steps

### Immediate (для C4 design)

1. **Зафиксировать Architecture Decision Records (ADRs)** для ключевых решений:
   - ADR-001: Bridge tenancy model
   - ADR-002: Firecracker as primary sandbox
   - ADR-003: Temporal as workflow engine
   - ADR-004: GitHub App integration model
   - ADR-005: LLM Gateway architecture (LiteLLM-based or custom)

2. **Детализировать C4 Component diagram** для критичных контейнеров:
   - Sandbox Provisioner (warm pool management, lifecycle)
   - LLM Gateway (routing, rate limiting, circuit breaking)
   - Task Orchestrator (Temporal workflow design)

3. **Прототипировать sandbox lifecycle**:
   - Firecracker boot → warm pool → session allocation → teardown
   - Измерить реальные startup times с target tech stack

### Short-term

4. **Провести threat modeling** (STRIDE) по основным data flows
5. **Определить billing model** и cost structure
6. **Выбрать managed services** vs build: Identity (WorkOS/Auth0), Temporal Cloud vs self-hosted, managed Kafka vs NATS

### Medium-term

7. **SOC 2 Type II readiness** — начать с gap analysis
8. **GDPR compliance** — data mapping, DPA template, retention policies
9. **Pilot с E2B** — валидировать Firecracker sandbox approach vs building own fleet manager
10. **Benchmark LLM costs** — реальные token consumption profiles для типовых agent tasks
