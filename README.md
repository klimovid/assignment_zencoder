<p align="center">
  <h1 align="center">Cloud Agent Execution Platform — Dashboard UI</h1>
  <p align="center">
    Analytics dashboard for monitoring AI coding agents.<br/>
    Built with Next.js, Feature-Sliced Design, and Shadcn UI.
  </p>
</p>

<p align="center">
  <a href="https://assignment-zencoder.vercel.app/auth"><img src="https://img.shields.io/badge/Live_Demo-▶_Vercel-black?style=for-the-badge&logo=vercel" alt="Live Demo" /></a>
  <a href="docs/architecture/"><img src="https://img.shields.io/badge/Architecture-C4_Diagrams-blue?style=for-the-badge" alt="Architecture" /></a>
  <a href="docs/prd/dashboard-prd.md"><img src="https://img.shields.io/badge/PRD-Dashboard-green?style=for-the-badge" alt="PRD" /></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind-v4-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind" />
  <img src="https://img.shields.io/badge/MobX-6-FF9955?logo=mobx&logoColor=white" alt="MobX" />
  <img src="https://img.shields.io/badge/Playwright-E2E-2EAD33?logo=playwright&logoColor=white" alt="Playwright" />
</p>

---

## 🔗 How and Where to Check

| What | Where |
|:-----|:------|
| Architecture diagrams | [`docs/architecture/`](docs/architecture/) — C4 System Context, Container, and Component diagrams (draw.io + SVG exports) |
| Live demo | Deployed on Vercel: https://assignment-zencoder.vercel.app/auth |

---


## 🏗️ How This Project Was Built

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
| 9 | Generate UI designs via Google Stitch from PRD |
| 10 | Cross-check all documents for consistency |
| 11 | Generate Technical Implementation Spec from PRD |
| 12 | Create implementation plan (TDD) |
| 13 | Implementation |
| 14 | Build mock API server |
| 15 | Deploy dashboard + mock server to Vercel |

---

## 🧭 Approaches

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

## 💡 Insights

<table>
<tr><th width="50%">What worked well</th><th width="50%">What didn't work</th></tr>
<tr>
<td>

**C4 + specs enable one-shot implementation.** Spend time on diagrams and specs upfront — the agent builds it right on the first try.

**FSD is great for TDD.** Clean layer boundaries (like Clean Architecture but for frontend) make writing tests first easy.

**MobX is great for TDD.** Plain classes, no mocking needed — just create a store, call methods, check state.

</td>
<td>

**Lost visual fidelity.** [Figma Make design](https://www.figma.com/make/db6k49YyR1nbP0Bw0aEpqP/Create-UI-Dashboard?t=AhSbs6JJWP6oeMmS-1) looked good, but export tokens ran out. Switched to [Google Stitch design](https://stitch.withgoogle.com/projects/8562584486654646230) — still an experimental product with a very immature MCP server, which led to losing design quality in the final output.

**Auth page was lost.** PRD said "no login page". Why? It causes some problems with RBAC.

**Charts got lost.** Should have matched PRD against designs before planning. The API has chart data, but nobody built the charts.

**Mermaid is unreadable for humans.** LLMs love it, people can't read it. Switched to draw.io.

</td>
</tr>
</table>

---

## 🛠️ Tech Stack

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

## 📁 Project Structure

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

## 🚀 Getting Started

```bash
yarn install
yarn dev          # http://localhost:3000
yarn build        # production build
yarn lint         # ESLint + FSD boundary rules
yarn test         # Jest (unit/integration)
yarn test:e2e     # Playwright (E2E)
```
