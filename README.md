# Cloud Agent Execution Platform — Dashboard UI

> Analytics dashboard for monitoring AI coding agents.
> Built with Next.js, Feature-Sliced Design, and Shadcn UI.

---

## How This Project Was Built

Spec-driven development with human-in-the-loop validation at every step:

| # | Step |
|:--|:-----|
| 1 | Define task understanding, requirements, and criteria with Claude |
| 2 | Agree on approaches and methodology |
| 3 | Research similar systems (architecture & product) |
| 3.1 | Generate research prompt for architecture |
| 3.2 | Architecture research via Gemini |
| 3.3 | Architecture research via OpenAI Deep Research |
| 3.4 | Architecture research via Claude + synthesis summary |
| 4 | Generate C4 System Context diagram |
| 5 | Generate research prompt for dashboard |
| 5.1 | Dashboard research via Gemini |
| 5.2 | Dashboard research via OpenAI Deep Research |
| 5.3 | Dashboard research via Claude + synthesis summary |
| 6 | Generate C4 Container diagram (full platform, dashboard focus) |
| 7 | Create Dashboard PRD from research + architecture |
| 8 | Generate C4 Component diagram (zoom into Dashboard container) |
| 9 | Generate UI designs via Stitch (Figma Make) from PRD |
| 10 | Cross-check all documents for consistency |
| 11 | Generate Technical Implementation Spec from PRD |
| 12 | Extend Technical Spec with testing strategy (section 11) |
| 13 | Create implementation plan |
| 14 | Implementation |
| 15 | Build mock API server |
| 16 | Deploy dashboard + mock server to Vercel |

---

## Approaches

| # | Approach | Details |
|:--|:---------|:--------|
| 0 | **Deep architecture via C4 Model** | Success of one-shot prompting heavily depends on this step |
| 1 | **Claude for prompt generation** | Use AI to generate research and implementation prompts |
| 2 | **Human in the loop** | Validation at every step |
| 3 | **First Principles Framework** | Structured reasoning for complex tasks |
| 4 | **Planning mode first** | Plan before implementing complex tasks |
| 5 | **Proper skills and MCPs** | Leverage specialized tools (Context7, Playwright, Stitch MCP, Chrome DevTools) |
| 6 | **Stitch for UI generation** | Design screens from PRD |
| 7 | **Spec-driven development** | Specs define the contract, code follows |
| 8 | **Self-verification** | Ask Claude to recheck its own result |
| 9 | **Assertive feedback to the agent** | Be direct and demanding — coding agents produce noticeably better output when you set high standards, point out mistakes explicitly, and push back on shortcuts |

---

## Insights

### What worked well

1. **C4 + specs enable one-shot implementation.** Spend time on diagrams and specs upfront — the agent builds it right on the first try.

2. **FSD is great for TDD.** Clean layer boundaries (like Clean Architecture but for frontend) make writing tests first easy.

3. **MobX is great for TDD.** Plain classes, no mocking needed — just create a store, call methods, check state.

### What didn't work

1. **Lost visual fidelity.** [Figma Make design](https://www.figma.com/make/db6k49YyR1nbP0Bw0aEpqP/Create-UI-Dashboard?t=AhSbs6JJWP6oeMmS-1) looked good, but export tokens ran out. Switched to [Google Stitch design](https://stitch.withgoogle.com/projects/8562584486654646230) — still an experimental product with a very immature MCP server, which led to losing design quality in the final output.

2. **Auth page was lost.** PRD said "no login page". Why? It causes some problems with RBAC.

3. **Charts got lost.** Should have matched PRD against designs before planning. The API has chart data, but nobody built the charts.

4. **Mermaid is unreadable for humans.** LLMs love it, people can't read it. Switched to draw.io.

---

## How and Where to Check

| What | Where |
|:-----|:------|
| Architecture diagrams | [`docs/architecture/`](docs/architecture/) — C4 System Context, Container, and Component diagrams (draw.io + SVG exports) |
| Live demo | Deployed on Vercel: https://assignment-zencoder.vercel.app/auth |

---

## Tech Stack

| Category | Technologies |
|:---------|:-------------|
| Framework | Next.js 16 (App Router, Turbopack), React 19, TypeScript |
| Architecture | Feature-Sliced Design (FSD) — 6 layers |
| UI | Tailwind CSS v4, Shadcn UI, Recharts, Lucide icons |
| State | MobX (client state), TanStack Query v5 (server state) |
| Validation | Zod |
| Testing | Jest, Playwright, MSW, Faker.js, jest-axe |
| Auth | JWT (jose), mock IdP |

---

## Project Structure

```
src/
  shared/       → UI kit, API client, utilities, config
  entities/     → Business entities (session, metric, notification, team, user)
  features/     → Capabilities (auth, filters, theme, export)
  widgets/      → Composite blocks (shell, sidebar, tables, timeline)
  views/        → Page compositions (overview, adoption, delivery, cost, ...)
  app/          → Providers, middleware, global config

app/            → Next.js routes (App Router)
  dashboard/    → All dashboard routes
  api/mock/     → Mock API (Route Handlers + Faker.js)
  api/auth/     → Auth mock routes

docs/
  architecture/ → C4 diagrams (system, container, component)
  prd/          → Product requirements
  specs/        → Technical spec, implementation plan
  researches/   → Architecture & dashboard research (Gemini, OpenAI, Claude)
```

---

## Getting Started

```bash
yarn install
yarn dev          # http://localhost:3000
yarn build        # production build
yarn lint         # ESLint + FSD boundary rules
yarn test         # Jest (unit/integration)
yarn test:e2e     # Playwright (E2E)
```
