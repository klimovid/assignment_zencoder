# assignment_zencoder

## О проекте

Исследовательский и архитектурный проект: проектирование **облачной платформы выполнения AI-агентов для software engineering** (Cloud Agent Execution Platform).

Аналоги: Cursor Cloud Agents, Copilot Workspace, Devin, Factory AI, Ona (ex-Gitpod).

Исходного кода нет — проект содержит архитектурные исследования и reasoning-фреймворки.

## Структура

```
docs/researches/cloud_agent_architecture/
  research_prompt.md                         — research brief
  gemini-cloud-agent-architecture-research.md — Gemini отчёт (EN)
  openai-deep-research-report.md             — OpenAI Deep Research отчёт (RU)
  claude_research.md                         — Claude Code отчёт (RU/EN)

.claude/skills/
  fpf/                        — First Principles Framework (мета-рассуждения)
  spf-software-architecture/  — Software Architecture (оценка архитектуры)
```

## Архитектурный контекст

Платформа строится по **Bridge-модели tenancy** (pool control plane + silo data plane).

Ключевые технологические решения:
- **Firecracker microVMs** — sandboxing (validated by E2B, AWS Lambda)
- **Temporal** — durable workflow orchestration
- **Kafka + NATS** — event streaming
- **GitHub App** — Git integration model
- **MCP** — tool integration protocol
- **LLM Gateway** — multi-provider routing (LiteLLM reference)

C4 Container level: Web UI, API Gateway, Identity Service, Task Orchestrator, Queue/Event Bus, Sandbox Provisioner, LLM Gateway, Integrations Hub, Artifact Store, Observability Pipeline.

## Соглашения

- Язык общения: **русский**. Технические термины на английском.
- Документация в Markdown, архитектура по C4 Model.
- Для оценки архитектуры: скиллы FPF и SPF.
