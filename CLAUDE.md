# assignment_zencoder

## About

Research and architecture project: designing a **Cloud Agent Execution Platform for software engineering**.

Analogues: Cursor Cloud Agents, Copilot Workspace, Devin, Factory AI, Ona (ex-Gitpod).

Current phase: architecture and PRD are complete, next step — Technical Implementation Spec.

## Structure

```
docs/
  architecture/
    c4-system-context.md                       — C4 Level 1: System Context
    c4-container.md                            — C4 Level 2: Containers (13 containers, 4 planes)
    c4-component-dashboard-ui.md               — C4 Level 3: Component (Dashboard UI, FSD)

  prd/
    dashboard-prd.md                           — Analytics Dashboard PRD (7 views, API spec, personas)

  researches/
    cloud_agent_architecture/
      architecture_research_prompt.md          — research brief
      gemini_architecture_research.md          — Gemini report
      openai_architecture_research.md          — OpenAI Deep Research report
      claude_architecture_summary_research.md  — Claude summary (synthesis of all reports)
    analytics_dashboard/
      dashboard_research_prompt.md             — research brief
      gemini_dashboard_research.md             — Gemini report
      openai_dashboard_research.md             — OpenAI Deep Research report
      dashboard_research_summary.md            — Claude summary (synthesis of all reports)

.claude/skills/
  fpf/                        — First Principles Framework (meta-reasoning)
  spf-software-architecture/  — Software Architecture (architecture evaluation)
```

## Architectural Context

The platform follows a **Bridge tenancy model** (pool control plane + silo data plane).

### Planes and Containers (C4 Container level)

- **Control Plane**: Web UI, API Gateway, Identity Service, Tenant Management, Task Orchestrator, Event Bus (Kafka + NATS), LLM Gateway (LiteLLM), Integrations Hub
- **Data Plane**: Sandbox Provisioner & Runtime (Firecracker), Artifact & Session Store
- **Analytics Plane**: Stream Processor (Flink), OLAP Store (ClickHouse), Analytics API (REST), Dashboard UI, Customer Data Export
- **Cross-Cutting**: Observability Pipeline (OpenTelemetry)

### Key Technology Decisions

- **Firecracker microVMs** — sandboxing (validated by E2B, AWS Lambda)
- **Temporal** — durable workflow orchestration
- **Kafka + NATS** — event streaming
- **GitHub App** — Git integration model
- **MCP** — tool integration protocol
- **LLM Gateway** — multi-provider routing (LiteLLM reference)

### Dashboard UI Stack

- **Framework**: React 18, Next.js 14+ App Router
- **Architecture**: Feature-Sliced Design (FSD) — 6 layers
- **Data fetching**: TanStack Query v5, Zod validation, openapi-typescript codegen
- **UI**: Tailwind CSS, Shadcn UI, Recharts
- **Auth**: NextAuth v5, JWT (httpOnly cookies)
- **Testing**: Jest, Playwright, MSW

## Workflow (README.md)

Spec-driven development with Human-in-the-loop:

1. ~~Platform architecture research (Gemini + OpenAI + Claude)~~ ✅
2. ~~C4 System Context~~ ✅
3. ~~Dashboard research (Gemini + OpenAI + Claude)~~ ✅
4. ~~C4 Container diagram~~ ✅
5. ~~Dashboard PRD~~ ✅
6. ~~C4 Component diagram (Dashboard UI)~~ ✅
7. ~~Figma Make UI~~ ✅
8. ~~Document consistency check~~ ✅
9. **Technical Implementation Spec** ← current step
10. Testing Spec
11. Implementation Plan
12. Implementation
13. Mock server
14. Deploy to Vercel

## Conventions

- Communication language: **Russian**. Technical terms in English.
- Documentation in Markdown, architecture follows C4 Model.
- For architecture evaluation: FPF and SPF skills.
- Approach: spec-driven development, planning mode for complex tasks, prompts generated via Claude.
