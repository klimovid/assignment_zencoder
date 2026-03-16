# Cloud AI Agent Execution Platform for Software Development: System Landscape and Architectural Conclusions for C4

## Product Category and Value

**Key findings (summary):**
- A "cloud agent execution platform" is not merely a chat assistant — it is a managed environment where the agent can **act**: clone repositories, modify code, build/test, create PR/MR, and return artifacts/diffs for review. This is directly evidenced by products oriented toward an "agent‑native" process: Factory describes the flow "ticket → context → solution → PR" with traceability, and Copilot Workspace provides a "brainstorm/plan/build/test/run" chain within a task-centric experience. citeturn2search0turn2search6turn2search14
- **The core value for engineering teams** is to shorten the "idea/ticket → ready change-set" cycle and reduce context-switching cost through automation of routine work (initial implementation, refactoring, migrations, triage) and standardization of environments/policies. This is reflected in the concept of "Agents … inside short‑lived isolated environments" at Gitpod/Ona and in Cursor's "Automations" for maintenance/triage/vulnerability review tasks. citeturn1search6turn8search20
- Compared to local execution, the cloud model provides **parallelism and independence from the developer's machine**: Cursor emphasizes that cloud agents can run in parallel and do not require the local machine to be connected to the internet; additionally, the agent gets "its own virtual machine" for build/test. citeturn8search7
- An important class of "problems that the cloud solves better than a local agent": execution isolation (especially for untrusted code/scripts), environment uniformity (devcontainer/image), manageability and audit (enterprise requirements). Evidence includes the presence of audit logs, SSO/SCIM, and enterprise panels in Cursor/Devin/Claude/Replit. citeturn5search13turn5search15turn6search3turn5search0
- The typical user journey in "cloud agents" is increasingly formalized as **human-in-the-loop**: the agent proposes a plan/changes, the user edits and confirms, then a PR/MR is created. Copilot Workspace emphasizes that everything (plan → code) is editable, and you can run build/test in a Codespaces environment before PR. citeturn2search14turn2search6
- **Org‑orientation** is mandatory: Devin directly builds integrations with team tools (Slack, Linear, GitLab) and provides enterprise perimeters (SSO, audit). citeturn8search0turn8search12turn8search18turn5search15

**Key differentiators across players (architecturally significant):**
- **Where the agent executes and the "compute envelope"**:
  - Cursor Cloud Agents — isolated cloud environment with access to its own VM and artifacts available via API. citeturn8search7turn8search3
  - Copilot Workspace — compute environment of GitHub Codespaces (dev container on VM) for build/run/test within the Workspace. citeturn2search14turn9search3
  - Claude Code on the web — web sessions that can be launched remotely and "teleported" between web and terminal; a separate mode is described where the web interface manages execution "on your machine instead of cloud infrastructure" (i.e., both approaches are supported). citeturn1search0
  - Replit Agent — an agent on top of Replit's browser-based IDE/hosting that "takes action": project setup, application creation, validation and fixes. citeturn0search2turn0search18
- **How the result "lands" in the SDLC**: PR/MR as the primary artifact (Cursor Cloud Agents can auto-create PRs via the GitHub App model; Devin in the GitLab integration targets MR and comments; Factory targets PR and traceability). citeturn8search17turn8search18turn2search0
- **Trigger model (manual vs event-driven/scheduled)**: Cursor directly describes Automations: launching cloud agents in the background on schedule or by events from GitHub/Slack, etc. citeturn8search20
- **Enterprise boundaries and trust**: the presence of SOC 2/ISO programs, audit logs, SSO/SCIM, and a "trust center" becomes a differentiator (e.g., Factory lists SOC 2/ISO 27001/ISO 42001 and integration with monitoring/audit; Cursor publishes access to compliance documents; Replit reports SOC 2 Type II). citeturn6search2turn6search0turn5search12
- **Model/infrastructure strategy**: Poolside positions its models as "designed to run within your infrastructure" (i.e., shifting compute/data inside the customer's perimeter), which drastically affects architecture (on-prem/VPC deploy, telemetry restrictions, orchestration requirements). citeturn2search1

**Typical user journey (practical end-to-end scenario):**
1) **Task creation**: from issue/ticket/free-form description (Copilot Workspace starts from issues/PRs/ideas; Devin from integrations with Linear/Jira/Slack; Factory can be triggered by assignments/mentions). citeturn2search6turn8search12turn2search0
2) **Repository/context + permissions selection**: connecting GitHub/GitLab, choosing branch/PR, configuring permissions and tokens (Cursor Cloud Agents API shows auto-branch/PR options via GitHub App). citeturn8search17
3) **Environment provisioning**: devcontainer/VM/sandbox, code cloning, dependency installation (analogous to Codespaces: dev container on VM; Cursor provides its own agent VM). citeturn9search3turn8search7
4) **Plan → execution**: the agent formulates a plan, applies changes, runs tests/builds (Copilot Workspace emphasizes "plan/build/test/run"; Cursor — build/test on VM). citeturn2search6turn8search7
5) **Result delivery**: PR/MR + report + artifacts (logs, test results, built binaries, artifact links; Cursor Cloud Agents API separately operates with "artifacts"). citeturn8search3turn2search14
6) **Review and merge**: the human edits, accepts/rejects, then merges; Copilot Workspace emphasizes full editability of proposals before PR. citeturn2search14

**Architectural implications:**
- Your product essentially needs to be a **SaaS orchestrator of computable "work capsules"** (sandbox/workspace) + an artifact delivery and SDLC integration system (PR/MR, tickets, chat-ops). This dictates the separation of control plane (tasks/policies/tenants) from data plane (execution/artifacts/logs). The "pool/silo/bridge" approach from the SaaS Lens provides the vocabulary for designing tenancy and isolation. citeturn3search3turn3search7
- The user journey "plan → code → PR" implies that C4 containers must explicitly support a **diff-centric review surface**, not just chat. Therefore, you need: an artifact store, a PR/MR operations service, and an "activity timeline"/event stream per session. citeturn2search14turn8search3

**Known trade-offs:**
- **Autonomy vs controllability**: the more the agent can do independently, the higher the requirements for permission policies, audit logs, and sandboxing. The Copilot Workspace practice ("everything is editable") illustrates the "human control by default" strategy. citeturn2search14turn2search6
- **Speed vs isolation**: containers are faster/cheaper, microVM/VM provide stronger isolation but add overhead (see the sandboxing section). citeturn3search4turn3search5turn3search2

## Required Functionality Map

**Key findings (summary):**
- Must-have core: **task intake → orchestrated execution → PR/MR + artifacts → review** (confirmed by the PR/MR orientation of Cursor/Devin/Factory and the compute loop of Copilot Workspace). citeturn8search17turn8search18turn2search0turn2search14
- "Workspace management" is mandatory: isolated environment, base templates (image/devcontainer), file system access, ability to run commands/tests, artifact return (Cursor: agent VM + artifacts API; Codespaces: dev container on VM). citeturn8search7turn8search3turn9search3
- Integrations are not "nice to have" — they are part of the UX: Devin emphasizes team tools (Slack, Linear, GitLab); Cursor Automations targets GitHub/Slack events and schedules; Factory targets workflow triggers (assignments/mentions). citeturn8search0turn8search12turn8search18turn8search20turn2search0
- For organizations, must-have: **SSO (SAML/OIDC), provisioning (SCIM), audit logs, roles and policies**. This is visible in enterprise documentation for Devin (SSO OIDC/SAML), Replit (SAML SSO for Enterprise), Cursor (SSO/SCIM + audit log), Claude (audit log export). citeturn5search15turn5search0turn5search21turn5search1turn5search13turn6search3
- Broad automation (background/scheduled/event-driven agents) is becoming the standard for mature platforms: Cursor documents Automations (on schedule or by GitHub/Slack events). citeturn8search20

**Practical functional decomposition (feature groups):**
- **Agent execution**: session/task management, progress tracking, step logging, stop/resume, parallel launches (Cursor emphasizes parallelism). citeturn8search7
- **Workspace & runtime**: environment templates (images/devcontainers), dependency management, caching, artifacts and downloads (Cursor artifacts + presigned URL). citeturn8search3
- **SDLC delivery**: branches, PR/MR, comments, check statuses (Devin GitLab handles MR + comment replies; Cursor provides auto-PR options via GitHub App). citeturn8search18turn8search17
- **Collaboration**: shared tasks/sessions, review workflow, notifications (Slack/Teams), "handoff" between web and local IDE/CLI (Claude Code on the web describes "teleport" between web and terminal). citeturn1search0turn8search0turn8search6
- **Org governance**: users/teams, roles, policies, budgets/limits, audit and export (audit logs in Cursor/Devin/Claude/GitHub). citeturn5search13turn2search3turn6search3turn5search14
- **Billing & cost controls**: tracking tokens/minutes/CPU-hours, per-tenant budgets, alerts. Related fact: LLM limits are measured not only by requests but also by tokens (RPM/TPM, etc. at OpenAI). citeturn4search1
- **Analytics & observability**: metrics, traces, logs, customer analytics, event export (see Observability section). citeturn4search3turn10search3

**Architectural implications:**
- Already at the C4 Container level, "integration adapters" (GitHub/GitLab/Linear/Slack) should be separated from the orchestration core: different protocols (webhooks, OAuth apps, SAML/SCIM), different SLAs, and different error/retry models. Example: GitHub separately emphasizes that audit logs can be streamed to an external system, and webhooks can be an alternative for some tasks. citeturn10search3
- "Org perimeters" (SSO/SCIM/audit) cannot be "bolted on later": they affect the data model (tenant context in every entity), access policies, and audit events across almost all containers. citeturn5search21turn5search1turn5search13turn2search3

**Known trade-offs:**
- **Single universal runtime vs specialized runtimes** (languages/stacks): universality increases cost and complexity but reduces friction for teams.
- **PR-oriented delivery vs "patch artifact"**: PR provides built-in audit/review but requires integration and permissions in the VCS; a patch is simpler and safer for some clients but integrates poorly into the SDLC. (Market practice shows a strong bias toward PR/MR). citeturn8search18turn8search17turn2search0

## Architectural Patterns

**Key findings (summary):**
- Multi-tenant SaaS for such platforms is typically built as a combination of **pool/silo/bridge** (shared services + dedicated resources for sensitive clients). The AWS SaaS Lens directly describes these models and their dependence on regulatory/cost/strategy requirements. citeturn3search3turn3search7turn3search19
- In the Kubernetes world, multi-tenancy means "layers of isolation" with trade-offs by trust level/cost: Kubernetes officially emphasizes that there are different approaches and hybrid architectures. citeturn7search0
- Execution sandboxing (key technical choice):
  - **OCI containers** (+ seccomp/AppArmor/Pod Security Standards) — minimal overhead, but a shared kernel increases risk when running untrusted code. Kubernetes Pod Security Standards "Restricted" target strict best practices at the cost of compatibility. citeturn7search1
  - **gVisor** — an "application kernel" in userspace for strong isolation between workload and host OS (not a hypervisor). citeturn3search5turn3search1
  - **microVM (Firecracker)** — lightweight VMs for enhanced isolation with speed/efficiency closer to containers; Firecracker was built for Lambda/Fargate. citeturn3search4turn3search8turn3search0
  - **Kata Containers** — "containers inside VMs," i.e., container UX + hardware virtualization as a second boundary. citeturn3search2turn3search6turn3search14
- The typical data flow "submission → execution → delivery" requires asynchrony and events: tasks are long-running, depend on external APIs, and often require retries/recovery. Workflow engines are well-suited for durable state and recovery: Temporal directly states that workflow execution is "fully recoverable" after failures and resumes from the last state. citeturn4search6
- Queues/event streaming are not an implementation detail but a way to scale and isolate workloads: KEDA allows "scaling any container in Kubernetes by the number of events," and AWS shows a reference pattern "SQS queue → KEDA → HPA." citeturn7search3turn7search11

**Reference data flow schema (in C4 container terms):**
```text
User/UI/Integrations  ->  Task API (Control Plane)  ->  Queue/Workflow Engine  ->  Agent Orchestrator
                                                            |                        |
                                                            v                        v
                                                     Sandbox Provisioner  ->  Runtime (container/microVM/VM)
                                                            |                        |
                                                            v                        v
                                                     Artifact Store / Logs   ->   PR/MR Service (GitHub/GitLab)
                                                            |
                                                            v
                                                     Notifications / Analytics
```

**How agent execution is typically sandboxed (and what it means for the platform):**
- If you bet on a **VM/microVM model similar to Cursor Cloud Agents** ("own virtual machine"), you architecturally get a separate "VM fleet manager" layer (or integration with a provider), plus egress/ingress control and snapshots/images. citeturn8search7turn3search4
- If you bet on **containers in an orchestrator** (Kubernetes), strengthen sandboxing through gVisor/Kata/Pod Security Standards (Restricted) and network policies, understanding the trade-offs in compatibility and performance. citeturn3search5turn3search2turn7search1

**External service integration patterns:**
- **Git provider integrations**: the "GitHub App" model (as with Cursor Cloud Agents API, where PR is opened on behalf of the application) is better than user PATs because it simplifies permission management and auditing. citeturn8search17
- **Compute provider**: Copilot Workspace shows the pattern "embed compute via Codespaces," where the environment is a dev container on a VM. For your architecture, this is a "third-party runtime provider" option instead of your own cluster. citeturn2search14turn9search3
- **ChatOps**: Devin and Factory document Slack integrations as part of the workflow. This means webhooks, interactive messages, idempotency, limits, and processing queues. citeturn8search0turn8search6

**The role of queues, event streaming, and async processing:**
- A queue/stream separates the **external task acceptance perimeter** (SLA/UI) from unpredictable execution (build/test/LLM). KEDA and the reference "SQS → KEDA → HPA" demonstrate how queue length becomes an autoscaling signal. citeturn7search11turn7search3
- Durable workflow (Temporal approach) addresses classes of problems: "worker failure," "partial progress," "repeatable steps," "compensations." Temporal describes workflow state recovery after failures and resumption from the last state. citeturn4search6

**Architectural implications:**
- At the C4 Container level, separate containers are almost inevitable: **Orchestrator**, **Sandbox Provisioner**, **LLM Gateway**, **Integrations Hub**, **Artifact/Log storage**, **Policy/Audit** — otherwise you "merge" reliability and security perimeters. Compromise multi-tenant models (pool/silo/bridge) are best established from the start; otherwise, enterprise clients will "push" you into a major refactoring. citeturn3search3turn7search0

**Known trade-offs:**
- **Queue-based async** reduces coupling and increases resilience but complicates debugging (requires correlation IDs, traces, idempotency). citeturn4search3turn9search1
- **Workflow engine (Temporal/analogues)** provides recovery and orchestration but adds operational cost (cluster, history storage, workflow version migrations). citeturn4search6

## Scaling Challenges

**Key findings (summary):**
- Horizontal scaling to thousands of concurrent agent sessions typically breaks not at the "API server" but at:
  - environment provisioning (VM/container creation, image pulls, repo clone),
  - external limits (LLM rate limits, Git hosting throttling),
  - "noisy neighbor" effects in shared infrastructure. citeturn4search1turn9search6turn7search0
- "Noisy neighbor" is a well-known anti-pattern of multi-tenant systems: one tenant's activity degrades performance for others. Microsoft/Azure Architecture Center identifies this as a typical multitenant problem. citeturn9search6
- Vertically "expensive" components: LLM calls (tokens/sec), builds/tests (CPU/RAM/IO), file operations (Git checkout, install deps), network dependencies (package downloads). Practical confirmation of the importance of tokens — OpenAI rate limits are measured in RPM/TPM, etc., meaning "tokens" are the primary scaling unit, not just requests. citeturn4search1
- Multi-tenancy requires resource isolation and fairness: Kubernetes multi-tenancy officially discusses trade-offs by isolation level/cost; in practice, this means quotas/limits, network policies, pod security, separate nodes/clusters for important clients. citeturn7search0turn7search1
- Session state management: long-running tasks need checkpoints/recovery (durable execution). Temporal emphasizes that workflow execution is "fully recoverable" and resumes from the last state. citeturn4search6
- Cost at scale typically grows along three axes: **LLM tokens**, **compute time (build/test)**, **storage (artifacts/logs)**. The platform needs budgets/limits and a predictable billing model (organizational limits + rate limiting). citeturn4search1turn4search4

**Architectural implications:**
- Horizontal scale almost always leads to the need for a **two-level scheduler**:
  1) task scheduler (queue/workflow) and
  2) runtime resource scheduler (K8s/VM fleet).
  KEDA as an event-driven autoscaling layer shows how to connect the queue and HPA. citeturn7search3turn7search11
- At the infrastructure level, protection against noisy neighbors requires: tenant quotas, concurrency limits, queue prioritization, separate worker/node pools for enterprise clients and/or a "silo" model for particularly sensitive ones. citeturn9search6turn3search19
- For large sessions, you will need a "state externalization" strategy: artifacts/logs/context in stores, while the executor is as "disposable" as possible. Durable workflows help "glue" execution on top of disposable workers. citeturn4search6

**Known trade-offs:**
- **Stateful sessions (long-lived workers with local disk)** simplify work with repos/cache but complicate recovery and load balancing; **stateless workers + external state** scale better but require a well-designed artifact/cache model.
- **Single shared cluster (pool)** is cheaper but harder to prove isolation; **silo per tenant** is more expensive but simpler for compliance and enterprise sales. citeturn3search3turn7search0

## External Service Dependencies and Risks

**Key findings (summary):**
- Critical external dependencies almost always include:
  - LLM providers (Anthropic/OpenAI/Bedrock/etc.),
  - Git hosting (GitHub/GitLab),
  - Identity provider (Okta/Azure AD, etc.),
  - Communications (Slack/Teams),
  - Cloud infrastructure (compute/storage/network). This follows from products documenting SSO (Devin, Replit, Cursor), Git integrations (Devin GitLab), Slack integrations (Devin/Factory), and LLM errors/limits (Anthropic API errors, OpenAI rate limits). citeturn5search15turn5search0turn5search21turn8search18turn8search0turn8search6turn4search4turn4search1
- Typical failure modes:
  - **Rate limiting (429)** from LLMs: Anthropic directly warns about 429 due to "acceleration limits" during sudden load spikes; OpenAI describes multi-dimensional limits (RPM/TPM, etc.). citeturn4search4turn4search1
  - **Partial failures in streaming**: Anthropic notes that in SSE streaming, an error can occur "after 200 OK," meaning the client must handle "successful status + late failure." citeturn4search4
  - **LLM UI/product outage**: example — a publicly covered incident where Claude.ai and Claude Code experienced disruptions (illustration: even if the API is "alive," the product layer can go down, and vice versa). citeturn1news47
  - Git provider degradation (webhooks delayed, API limits), Slack/Teams degradation (notifications/commands).
- For mature platforms, resilience must be built systematically: circuit breakers, retries/backoff/jitter, queues, and graceful degradation.

**Risk mitigation patterns (and sources):**
- **Circuit breaker**: Fowler describes that a circuit breaker prevents cascading failures, "fails fast" when a provider is unavailable, and protects critical resources. citeturn9search0
- **Exponential backoff + jitter + retry limit**: AWS Well-Architected recommends controlling retries, adding backoff and jitter, and limiting the number of attempts. citeturn9search1
- **Queue as a buffer** between task acceptance and provider calls: smooths peaks and helps maintain limits (conceptually supported by the fact that KEDA often scales handlers by queue size). citeturn7search3turn7search11

**Architectural implications:**
- You practically need an **LLM Gateway container**: a single point for (a) tenant-aware rate limiting, (b) token metrics aggregation, (c) retries with jitter, (d) circuit breakers, (e) routing across multiple providers/models. The presence of multi-dimensional limits (TPM/RPM) makes "simple retries" dangerous. citeturn4search1turn9search1turn9search0
- For external integrations (Git, Slack, Jira/Linear), you need an **integration worker tier** with queues and idempotency keys: external webhooks can be duplicated/arrive out of order. (GitHub even notes that webhooks can be an alternative to audit log/API polling — a hint at different event delivery models). citeturn10search3

**Known trade-offs:**
- **Multi-provider LLM strategy** increases fault tolerance and provides price leverage but complicates compatibility (different tool/function calling/streaming formats, different limits, different data policies). Anthropic separately emphasizes streaming error specifics and 429, which complicates unification. citeturn4search4
- **Fail fast vs "delay and retry later"**: fail fast is useful for interactive UX, but for background tasks "queue + retry" is better, otherwise you lose jobs. citeturn9search0turn4search6

## Security and Compliance

**Key findings (summary):**
- Typical authN/authZ architecture in the enterprise perimeter:
  - **SAML SSO** (Replit Enterprise, Cursor Teams SSO, Devin SAML SSO),
  - **OIDC** (Devin recommends OIDC and supports Okta/Azure AD),
  - **SCIM provisioning** (Cursor shows role mapping limitations; GitHub describes SCIM for membership management with SAML SSO). citeturn5search0turn5search21turn5search15turn5search3turn5search1turn5search6
- Audit logging as first-class: Cursor describes auditing of actions/security events; Devin has an enterprise audit logs API; Claude provides audit log export for 180 days; GitHub provides enterprise audit logs and even streaming to external systems. citeturn5search13turn2search3turn6search3turn5search14turn10search3
- The execution sandbox is the primary security boundary. Realistic options: containers + policy hardening (Pod Security Standards Restricted), gVisor as a userspace kernel sandbox, Kata (containers inside lightweight VMs), Firecracker microVM. citeturn7search1turn3search5turn3search2turn3search4
- Compliance frameworks that procurement actually asks about: SOC 2 (Trust Services Criteria), plus industry-specific (ISO 27001, etc.) and government-oriented frameworks (e.g., NIST 800-171 for CUI). AICPA establishes that the SOC 2 report covers controls for security/availability/processing integrity/confidentiality/privacy; Anthropic reports NIST 800-171 assessment for Claude.ai/Claude Enterprise/Claude API; Factory and Cursor publish compliance materials; Replit confirms SOC 2 Type II. citeturn10search0turn6search11turn6search2turn6search0turn5search12
- Data residency/transfer: GDPR imposes strict requirements on personal data processing and applies to organizations working with EU individuals' data; in practice, enterprise users often require regional storage/processing perimeters and cross-border transfer controls. citeturn10search2turn10search14

**Key security boundaries that should be explicitly embedded in C4:**
- **Tenant boundary**: organizational data isolation (metadata, logs, artifacts, integration keys), plus "noisy neighbor" protection. citeturn9search6turn3search3
- **Execution boundary**: the sandbox runtime must minimize the possibility of escaping to host/neighbors (gVisor/Kata/microVM) and restrict privileges (Pod Security Standards Restricted). citeturn3search5turn3search2turn7search1
- **Integration secrets boundary**: GitHub/GitLab tokens, cloud keys, artifact store access — all must be in a vault/secret manager and issued per session on a least-privilege basis (practical hint: Cursor Cloud Agents creates PRs via GitHub App — a more manageable model than "user tokens"). citeturn8search17

**Architectural implications:**
- You need a "Security & Governance layer" as a separate set of containers/modules:
  - Identity (SSO/OIDC) + SCIM provisioning,
  - Policy engine (RBAC/ABAC; action prohibitions, command allowlists, limits),
  - Audit log pipeline + export (to SIEM/log storage). The practical focus on audit is confirmed in GitHub (audit log streaming), Cursor/Devin/Claude (audit logs). citeturn10search3turn5search13turn2search3turn6search3
- The sandboxing model should be chosen based on the level of distrust toward code: if your product is designed to run "untrusted/unverified" code, microVM/gVisor/Kata are more justified than plain containers. Firecracker and Kata are directly positioned as strengthened isolation while maintaining efficiency. citeturn3search4turn3search2turn3search5

**Known trade-offs:**
- **RBAC vs ABAC**: RBAC is simpler for most teams; ABAC is more flexible for resource/context-level policies (repo sensitivity, branch protection, env class) but more complex to implement and debug.
- **Exporting audit logs (customer takes ownership)** increases trust but creates expenses for data volume and requirements for immutability/integrity. GitHub emphasizes the model of streaming audit logs to external systems; Claude limits audit log content and provides separate data export mechanisms. citeturn10search3turn6search3

## Observability and Analytics

**Key findings (summary):**
- For operational health, the platform needs all 3 signals: **traces, metrics, logs** (OpenTelemetry emphasizes that an application should emit these signals to answer "why is this happening?"). citeturn4search3
- Beyond system metrics (CPU/RAM/IO), agent-platform-specific KPIs include:
  - active session concurrency, environment provisioning time, time to "first useful result,"
  - step success/failure (clone/build/test/PR),
  - tokens/min and 429 errors by LLM provider,
  - percentage of tasks completed with PR/MR, and "cycle time" to merge. Basis: LLM limits are measured in tokens (OpenAI RPM/TPM, etc.), Anthropic describes 429 and streaming error specifics. citeturn4search1turn4search4
- Customer-facing analytics for organizations almost always relies on audit/event streams: GitHub provides audit log streaming to external systems; Cursor/Devin/Claude make audit available in the enterprise perimeter. citeturn10search3turn5search13turn2search3turn6search3

**What event streams/pipelines are typically needed:**
- **Operational event stream**: orchestration events (TaskCreated/TaskStarted/StepFailed/PRCreated), runtime events (SandboxProvisioned, ArtifactUploaded), integration events (WebhookReceived, RateLimitHit).
- **Security/audit stream**: authentication, role/policy changes, secret access, admin actions. Cursor directly describes that audit logs cover authentication, membership changes, permission updates, API key actions, etc. citeturn5search13
- **Usage/billing stream**: token/compute/storage counters by tenant/project/session, limits and alerts. Token limits as the primary resource are visible in the OpenAI rate limit model. citeturn4search1

**Architectural implications:**
- At the C4 Container level, separate containers/services should be planned:
  - Telemetry Collector (OTel collector/analogue),
  - Event Bus (Kafka/PubSub/Kinesis/… or queue + CDC),
  - Metrics Store/Tracing Backend/Log Store,
  - Customer Analytics Store (materialized views/aggregations per tenant). The requirement "do not mix tenant data" entails tenant-aware routing and filtering. citeturn4search3turn7search0

**Known trade-offs:**
- **Single shared event stream** is cheaper but requires strict tenant filtering and access control; **per-tenant streams** are simpler for isolation but more expensive and harder to operate.
- **High log granularity** aids investigations and compliance but increases storage costs and the risk of leaking sensitive data — especially if logs contain code/prompt fragments (which is why products sometimes limit audit log content; Claude notes restrictions on title/content in audit logs and separate data exports). citeturn6search3

## C4 Summary

**Recommended list of external actors (C4 Context):**
- **Software Engineer (task initiator)** — creates tasks, provides clarifications, accepts changes (UX as "task → plan → code → PR"). citeturn2search6turn2search14
- **Reviewer/Tech Lead** — reviews PR/MR, provides comments, accepts merge (PR/MR as the primary artifact in Devin/Factory/Cursor). citeturn8search18turn2search0turn8search17
- **Org Admin / IT Admin** — configures SSO/SCIM, roles, policies, integrations. citeturn5search15turn5search21turn5search1
- **Security/Compliance Officer** — requires audit logs/export, verifies compliance with SOC 2/ISO/NIST controls. citeturn10search0turn6search2turn6search3turn6search11
- **Finance/Procurement** — manages budgets, limits, contracts (in practice, "token/usage economics" are critical due to LLM limits and costs). citeturn4search1

**Recommended list of top-level containers/services (C4 Container):**
- **Web UI + Public API Gateway** (task creation, progress viewing, diff/artifact review).
- **Identity & Access Service** (OIDC/SAML, session management, RBAC/ABAC) + **SCIM Provisioning Connector**. citeturn5search15turn5search0turn5search1turn5search6
- **Tenant & Org Management** (team spaces, projects/repos, policies, budgets).
- **Integrations Hub**: GitHub/GitLab (Apps/OAuth/webhooks), Jira/Linear, Slack/Teams (ChatOps). citeturn8search18turn8search12turn8search0turn8search6
- **Task/Workflow Orchestrator** (queues + durable workflows; Temporal class) for long-running tasks and recovery. citeturn4search6
- **Queue / Event Bus** (buffering, backpressure, event-driven scalability; KEDA-compatible pattern). citeturn7search3turn7search11
- **Sandbox Provisioner + Runtime Fleet** (Kubernetes/VM/microVM; options: containers+PSS, gVisor, Kata, Firecracker). citeturn7search1turn3search5turn3search2turn3search4
- **LLM Gateway** (provider routing, token-based rate limiting, retries/backoff/jitter, circuit breaker, caching). citeturn4search1turn4search4turn9search0turn9search1
- **Artifact Store + Session State Store** (object storage, metadata, versioning, presigned downloads; similar to Cursor's artifacts approach). citeturn8search3
- **Observability & Audit Pipeline** (OTel collector, log/trace/metrics backends, audit log store + export/streaming to SIEM). citeturn4search3turn10search3turn5search13turn6search3
- **Notification Service** (Slack/Email/Webhooks) and **PR/MR Delivery Service** (PR/MR creation, comments, statuses). citeturn8search17turn8search18turn8search6

**Top architectural risks to address in the design:**
- **Execution isolation and lateral movement prevention** when running untrusted code/dependencies: choice of sandboxing technology (containers vs gVisor vs Kata vs microVM) + security policies (PSS Restricted). citeturn3search5turn3search2turn3search4turn7search1
- **Noisy neighbor and fair resource distribution** in a multi-user environment (quotas, concurrency limits, queue priorities, possibly "silo" for large clients). citeturn9search6turn3search19turn7search0
- **LLM provider failures and limits** (429, streaming instability, partial failures): LLM gateway, circuit breakers, backoff+jitter, buffering/queues are needed. citeturn4search4turn4search1turn9search0turn9search1turn7search3
- **Secret/data leakage through integrations and logs**: strict secret management, least privilege, action auditing, log/artifact retention policies. Basis — enterprise focus on audit logs and export in Cursor/Devin/Claude/GitHub. citeturn5search13turn2search3turn6search3turn10search3
- **Long-running task recovery and state consistency**: without a durable workflow layer, you get "stuck" sessions, double actions, and progress loss; a Temporal-class engine addresses recoverability. citeturn4search6turn7search3turn7search11