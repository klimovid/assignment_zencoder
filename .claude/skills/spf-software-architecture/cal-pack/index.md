# CAL Pack: Software Architecture

Operators and acceptance clauses for architectural evaluation.

## Overview

### Operators

| Operator | Purpose | Key Output |
|----------|---------|------------|
| [Fitness Function](op-fitness-function.md) | Evaluate architecture against goals | Fitness score, violations |
| [Dependency Analysis](op-dependency-analysis.md) | Analyze module dependencies | Coupling metrics, graph |

### Acceptance Clauses

See [acceptance-clauses.md](acceptance-clauses.md) for all pass/fail conditions.

| Clause | CHRs Used | Typical Threshold |
|--------|-----------|-------------------|
| coupling.max | coupling | ≤ moderate |
| cohesion.min | cohesion | ≥ moderate |
| testability.min | testability | ≥ moderate |
| evolvability.min | evolvability | ≥ moderate |
| architecture.health | all | min ≥ moderate |

## Operator Workflow

Typical evaluation sequence:

```
1. Input artifact (code, design)
           │
           v
2. op-dependency-analysis
   └─> Coupling metrics, dependency graph
           │
           v
3. op-fitness-function
   └─> Fitness scores for all CHRs
           │
           v
4. acceptance-clauses
   └─> Pass/fail per clause
           │
           v
5. Conformance report
```

## Operator Dependencies

```
┌──────────────────────┐
│ op-dependency-       │
│ analysis             │
└──────────┬───────────┘
           │ produces metrics for
           v
┌──────────────────────┐
│ op-fitness-function  │
└──────────┬───────────┘
           │ produces scores for
           v
┌──────────────────────┐
│ acceptance-clauses   │
└──────────────────────┘
```

## When to Use Each Operator

| Situation | Operator | Why |
|-----------|----------|-----|
| Quick coupling check | op-dependency-analysis | Fast, focused |
| Full evaluation | Both operators | Complete picture |
| CI/CD gate | op-fitness-function | Automated, all CHRs |
| Design review | Manual + operators | Expert + metrics |

## Operator Cards

- [op-fitness-function.md](op-fitness-function.md)
- [op-dependency-analysis.md](op-dependency-analysis.md)

## Acceptance

- [acceptance-clauses.md](acceptance-clauses.md)
