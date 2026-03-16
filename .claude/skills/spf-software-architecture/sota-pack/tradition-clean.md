# Tradition Card: Clean Architecture

## Identity

| Field | Value |
|-------|-------|
| **Name** | Clean Architecture |
| **Abbreviation** | Clean, CA |
| **Community** | Object-oriented developers, enterprise architects |
| **Origin** | Robert C. Martin (Uncle Bob), 2012 blog post, 2017 book |
| **Status** | Active, widely referenced |

## Key Texts

| Type | Citation | Relevance |
|------|----------|-----------|
| Canonical | Martin, R.C. (2017). "Clean Architecture: A Craftsman's Guide to Software Structure and Design" | Complete exposition |
| Foundational | Martin, R.C. (2012). "The Clean Architecture" blog post | Original formulation |
| Related | Cockburn, A. "Hexagonal Architecture" | Ports and Adapters precursor |
| Related | Palermo, J. "Onion Architecture" | Similar layered approach |

## Core Concepts

### The Dependency Rule

The central principle:

> **Source code dependencies must point only inward, toward higher-level policies.**

```
                    ┌─────────────────────┐
                    │   External World    │
                    │  (Frameworks, DB,   │
                    │    UI, Devices)     │
                    └──────────┬──────────┘
                               │ depends on
                               v
                    ┌─────────────────────┐
                    │  Interface Adapters │
                    │  (Controllers, Gateways,
                    │   Presenters)        │
                    └──────────┬──────────┘
                               │ depends on
                               v
                    ┌─────────────────────┐
                    │   Application Layer │
                    │    (Use Cases)      │
                    └──────────┬──────────┘
                               │ depends on
                               v
                    ┌─────────────────────┐
                    │    Domain Layer     │
                    │  (Entities, Rules)  │
                    └─────────────────────┘
```

### Layers

| Layer | Contains | Depends On |
|-------|----------|------------|
| **Entities** | Enterprise business rules | Nothing |
| **Use Cases** | Application-specific rules | Entities |
| **Interface Adapters** | Controllers, Gateways, Presenters | Use Cases, Entities |
| **Frameworks & Drivers** | DB, Web, UI, External | All inner layers |

### Key Principles

| Principle | Description | Impact |
|-----------|-------------|--------|
| **Dependency Inversion** | Depend on abstractions | Low coupling |
| **Screaming Architecture** | Architecture reveals intent | High cohesion |
| **Independent of Frameworks** | Frameworks are details | Evolvability |
| **Testable** | Business rules testable without UI, DB | Testability |
| **Independent of Database** | Database is a detail | Evolvability |

### Component Principles

| Principle | Acronym | Guidance |
|-----------|---------|----------|
| Reuse-Release Equivalence | REP | Unit of reuse = unit of release |
| Common Closure | CCP | Classes that change together belong together |
| Common Reuse | CRP | Don't depend on things you don't use |
| Acyclic Dependencies | ADP | No cycles in dependency graph |
| Stable Dependencies | SDP | Depend toward stability |
| Stable Abstractions | SAP | Stable = abstract |

## Method Family

### Core Operators

| Operator | Purpose | Inputs | Outputs |
|----------|---------|--------|---------|
| Layer Assignment | Classify code into layers | Code module | Layer designation |
| Dependency Check | Verify dependency direction | Import graph | Violations list |
| Component Analysis | Evaluate component health | Component | Stability, abstractness metrics |
| Port/Adapter Design | Design boundary interfaces | Requirements | Interface definitions |

### Characteristic Types Used

| Characteristic | How Measured | Scale |
|----------------|--------------|-------|
| Dependency direction | Inward vs outward deps | Ordinal |
| Layer violations | Count of wrong-direction deps | Count |
| Stability | I = Fan-out / (Fan-in + Fan-out) | Ratio [0,1] |
| Abstractness | A = Abstract classes / Total classes | Ratio [0,1] |

### Metrics

| Metric | Formula | Healthy Value |
|--------|---------|---------------|
| Instability (I) | Fan-out / (Fan-in + Fan-out) | Varies by layer |
| Abstractness (A) | Abstract entities / Total entities | Higher for stable |
| Distance from Main Sequence (D) | \|A + I - 1\| | Close to 0 |

## Evidence Standards

| Evidence Type | Acceptable? | Notes |
|---------------|-------------|-------|
| Formal proof | No | Not used |
| Empirical study | Sometimes | Limited formal research |
| Expert opinion | Yes | Practitioner experience valued |
| Case study | Yes | Examples in book/talks |
| Heuristic | Yes | Rules of thumb common |

## Trust Profile (F-G-R)

| Dimension | Value | Notes |
|-----------|-------|-------|
| **Formality (F)** | 1-2 | Diagrams and principles, some metrics |
| **Scope (G)** | Applications with significant business logic | Less relevant for simple CRUD |
| **Reliability (R)** | 0.7 | Well-reasoned but limited empirical validation |

## Bridges to Other Traditions

### Aligned: Domain-Driven Design

| Clean Concept | DDD Equivalent | Notes |
|---------------|----------------|-------|
| Entities layer | Domain layer | Same intent |
| Use Cases | Application Services | Similar role |
| Adapters | Anti-Corruption Layer | Boundary protection |

### Aligned: Evolutionary Architecture

| Clean Concept | Evolutionary Equivalent | Notes |
|---------------|-------------------------|-------|
| Low coupling | Evolvability | Enables change |
| Dependency Rule | Fitness function | Can be automated |
| Testability | Fitness function | Measurable |

### Related: Hexagonal/Onion

| Clean Concept | Hexagonal Equivalent | Notes |
|---------------|---------------------|-------|
| Entities | Domain core | Identical |
| Use Cases | Application hexagon | Similar |
| Adapters | Ports/Adapters | Same pattern |

## Critique

### Strengths

- Clear, memorable principle (dependency rule)
- Strong focus on testability
- Framework independence
- Well-articulated component principles

### Weaknesses

- Can lead to over-engineering for simple cases
- Layer count sometimes overkill
- Book mixes levels of abstraction
- Some metrics (D) have limited practical use

### Blind Spots

- Distributed systems concerns
- Operational requirements
- Data-intensive applications
- Event-driven architectures

## Meta

| Field | Value |
|-------|-------|
| Card Created | 2026-01-26 |
| Last Updated | 2026-01-26 |
| Evidence Depth | Moderate |
| Confidence | High |
