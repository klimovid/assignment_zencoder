---
name: spf-software-architecture
description: Evaluate and guide software architecture decisions using structured characteristics from multiple architectural traditions.
priority: normal
---

# SPF: Software Architecture

Evaluate software architectures against established characteristics from Domain-Driven Design, Clean Architecture, and Evolutionary Architecture traditions.

## When to Use

- Reviewing architectural designs or decisions
- Evaluating codebase structure against quality attributes
- Making architectural trade-off decisions
- Checking conformance to architectural standards
- Comparing alternative architectural approaches

## Core Workflow

```
┌─────────────────────────────────────────────────────────────┐
│ 1. LOAD - Identify artifact type, load relevant CHR Cards  │
│    → passport.md → chr-pack/index.md                        │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│ 2. MATCH - Select applicable characteristics                │
│    → Based on artifact kind and evaluation goals            │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│ 3. EVALUATE - Apply operators, measure characteristics      │
│    → cal-pack/op-*.md for measurement procedures            │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│ 4. REPORT - Generate conformance report with evidence       │
│    → Characteristic values, pass/fail, recommendations      │
└─────────────────────────────────────────────────────────────┘
```

## Navigation

| Resource | Path | Load When |
|----------|------|-----------|
| Passport | [passport.md](passport.md) | Understanding scope |
| Workflow | [prompts/workflow.md](prompts/workflow.md) | Running evaluation |
| Conformance | [prompts/conformance-check.md](prompts/conformance-check.md) | Checking artifacts |

### Traditions (SoTA Pack)

| Tradition | Path | Core Focus |
|-----------|------|------------|
| Overview | [sota-pack/index.md](sota-pack/index.md) | All traditions |
| DDD | [sota-pack/tradition-ddd.md](sota-pack/tradition-ddd.md) | Domain modeling, bounded contexts |
| Clean | [sota-pack/tradition-clean.md](sota-pack/tradition-clean.md) | Dependency rules, layers |
| Evolutionary | [sota-pack/tradition-evolutionary.md](sota-pack/tradition-evolutionary.md) | Fitness functions, evolvability |
| Bridges | [sota-pack/bridge-matrix.md](sota-pack/bridge-matrix.md) | Cross-tradition mapping |

### Characteristics (CHR Pack)

| Characteristic | Path | Scale |
|----------------|------|-------|
| Overview | [chr-pack/index.md](chr-pack/index.md) | All characteristics |
| Coupling | [chr-pack/chr-coupling.md](chr-pack/chr-coupling.md) | Ordinal |
| Cohesion | [chr-pack/chr-cohesion.md](chr-pack/chr-cohesion.md) | Ordinal |
| Testability | [chr-pack/chr-testability.md](chr-pack/chr-testability.md) | Ordinal |
| Evolvability | [chr-pack/chr-evolvability.md](chr-pack/chr-evolvability.md) | Ordinal |
| Scales | [chr-pack/scales.md](chr-pack/scales.md) | Scale definitions |

### Operators (CAL Pack)

| Operator | Path | Purpose |
|----------|------|---------|
| Overview | [cal-pack/index.md](cal-pack/index.md) | All operators |
| Fitness Function | [cal-pack/op-fitness-function.md](cal-pack/op-fitness-function.md) | Evaluate fitness |
| Dependency Analysis | [cal-pack/op-dependency-analysis.md](cal-pack/op-dependency-analysis.md) | Analyze dependencies |
| Acceptance | [cal-pack/acceptance-clauses.md](cal-pack/acceptance-clauses.md) | Pass/fail criteria |

## Quick Evaluation

For rapid architectural assessment:

1. **Coupling**: Is the architecture loosely coupled?
2. **Cohesion**: Are modules/components cohesive?
3. **Testability**: Can components be tested in isolation?
4. **Evolvability**: Can the architecture adapt to change?

## Key Principles

From the traditions covered:

| Principle | Tradition | Summary |
|-----------|-----------|---------|
| Dependency Rule | Clean | Dependencies point inward |
| Bounded Context | DDD | Explicit model boundaries |
| Fitness Functions | Evolutionary | Measurable architecture goals |
| Screaming Architecture | Clean | Architecture reveals intent |
| Context Mapping | DDD | Explicit integration patterns |
| Last Responsible Moment | Evolutionary | Defer decisions appropriately |

## Typical Artifacts

This SPF can evaluate:

| Artifact Type | Example | Key Characteristics |
|---------------|---------|---------------------|
| System design | Architecture diagram | Coupling, cohesion |
| Module structure | Package/folder layout | Cohesion, dependency direction |
| API design | Interface definitions | Coupling, testability |
| Integration | Context map | Coupling, evolvability |
| Codebase | Source code | All four |
