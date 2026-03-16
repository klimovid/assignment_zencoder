# Tradition Card: Domain-Driven Design

## Identity

| Field | Value |
|-------|-------|
| **Name** | Domain-Driven Design |
| **Abbreviation** | DDD |
| **Community** | Software architects, domain modelers, microservice practitioners |
| **Origin** | Eric Evans, 2003 |
| **Status** | Active, widely adopted |

## Key Texts

| Type | Citation | Relevance |
|------|----------|-----------|
| Canonical | Evans, E. (2003). "Domain-Driven Design: Tackling Complexity in the Heart of Software" | Foundational text, all core concepts |
| Canonical | Vernon, V. (2013). "Implementing Domain-Driven Design" | Practical implementation patterns |
| Survey | Vernon, V. (2016). "Domain-Driven Design Distilled" | Accessible overview |
| Extension | Brandolini, A. "Event Storming" | Discovery methodology |

## Core Concepts

### Strategic Design

| Concept | Definition | Purpose |
|---------|------------|---------|
| **Bounded Context** | Explicit boundary within which a domain model is defined | Isolate models, prevent term pollution |
| **Ubiquitous Language** | Shared vocabulary between developers and domain experts | Align code with business concepts |
| **Context Map** | Visualization of relationships between bounded contexts | Document integration patterns |
| **Core Domain** | The part of the domain that provides competitive advantage | Focus effort where it matters |

### Context Relationships

| Pattern | Description | When to Use |
|---------|-------------|-------------|
| Partnership | Contexts evolve together | Close collaboration teams |
| Shared Kernel | Shared subset of model | Careful, limited sharing |
| Customer-Supplier | Upstream supplies downstream | Clear service dependency |
| Conformist | Downstream adopts upstream model | No influence on upstream |
| Anti-Corruption Layer | Translation layer | Protect from legacy/external |
| Open Host Service | Published protocol | Many consumers |
| Published Language | Documented interchange format | Standard data exchange |
| Separate Ways | No integration | Independent contexts |

### Tactical Patterns

| Pattern | Purpose | Characteristic Impact |
|---------|---------|----------------------|
| Entity | Identity-based object | Cohesion (encapsulation) |
| Value Object | Immutable, equality by value | Testability (no side effects) |
| Aggregate | Consistency boundary | Coupling (aggregate root) |
| Domain Service | Stateless domain operation | Cohesion (single responsibility) |
| Repository | Persistence abstraction | Testability (mockable) |
| Factory | Complex creation | Cohesion (separation of concerns) |

## Method Family

### Core Operators

| Operator | Purpose | Inputs | Outputs |
|----------|---------|--------|---------|
| Context Discovery | Identify bounded contexts | Domain knowledge, stakeholders | Context map |
| Language Modeling | Build ubiquitous language | Domain experts, scenarios | Glossary, model |
| Aggregate Design | Define consistency boundaries | Domain rules, transactions | Aggregate definitions |
| Context Mapping | Document integrations | Contexts, relationships | Context map diagram |

### Characteristic Types Used

| Characteristic | How Measured | Scale |
|----------------|--------------|-------|
| Context cohesion | Terms per context, overlap | Ordinal |
| Model alignment | Code-to-domain term match | Ordinal |
| Integration complexity | Context relationships count | Ratio |
| Aggregate size | Entities per aggregate | Count |

## Evidence Standards

| Evidence Type | Acceptable? | Notes |
|---------------|-------------|-------|
| Formal proof | No | Not emphasis of tradition |
| Empirical study | Sometimes | Industry case studies valued |
| Expert opinion | Yes | Domain expert knowledge central |
| Case study | Yes | Primary evidence form |
| Heuristic | Yes | "Smell"-based evaluation common |

## Trust Profile (F-G-R)

| Dimension | Value | Notes |
|-----------|-------|-------|
| **Formality (F)** | 1-2 | Semi-formal patterns, not calculus |
| **Scope (G)** | Business software with complex domains | Not suitable for all software |
| **Reliability (R)** | 0.7-0.8 | Well-established but requires expertise |

## Bridges to Other Traditions

### Aligned: Clean Architecture

| DDD Concept | Clean Equivalent | Notes |
|-------------|------------------|-------|
| Bounded Context | Component boundary | DDD: semantic, Clean: dependency |
| Domain Layer | Entities layer | Same intent |
| Application Service | Use Case | Similar role |
| Anti-Corruption Layer | Adapter | Same pattern |

### Aligned: Evolutionary Architecture

| DDD Concept | Evolutionary Equivalent | Notes |
|-------------|-------------------------|-------|
| Bounded Context | Architecture quantum | Natural evolution unit |
| Context Map | Fitness function scope | Integration contracts |

## Critique

### Strengths

- Strong focus on business alignment
- Handles domain complexity well
- Excellent for microservices decomposition
- Rich pattern language for integration

### Weaknesses

- Steep learning curve
- Overhead for simple domains
- Requires domain expert access
- Tactical patterns sometimes over-applied

### Blind Spots

- Technical quality attributes (performance, security)
- Infrastructure concerns
- Operational aspects
- Team dynamics beyond domain modeling

## Meta

| Field | Value |
|-------|-------|
| Card Created | 2026-01-26 |
| Last Updated | 2026-01-26 |
| Evidence Depth | Deep |
| Confidence | High |
