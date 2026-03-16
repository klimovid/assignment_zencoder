# CHR Pack: Software Architecture

Characteristics for evaluating software architecture.

## Overview

| Characteristic | Scale Type | Polarity | Key Traditions |
|----------------|------------|----------|----------------|
| [Coupling](chr-coupling.md) | Ordinal | ↓ lower is better | Clean, DDD |
| [Cohesion](chr-cohesion.md) | Ordinal | ↑ higher is better | Clean, DDD |
| [Testability](chr-testability.md) | Ordinal | ↑ higher is better | Clean, EA |
| [Evolvability](chr-evolvability.md) | Ordinal | ↑ higher is better | EA, Clean |

## Characteristic Relationships

```
         Coupling
            │
            │ inverse correlation
            v
         Testability ←──── contributes to ───→ Evolvability
            ^                                      ^
            │                                      │
            │ enables                              │ enabled by
            │                                      │
         Cohesion ─────── contributes to ──────────┘
```

| CHR A | CHR B | Relationship |
|-------|-------|--------------|
| Coupling ↓ | Testability ↑ | Lower coupling enables better testing |
| Cohesion ↑ | Testability ↑ | Higher cohesion simplifies tests |
| Coupling ↓ | Evolvability ↑ | Lower coupling reduces change impact |
| Cohesion ↑ | Evolvability ↑ | Higher cohesion localizes changes |
| Testability ↑ | Evolvability ↑ | Good tests enable safe changes |

## When to Measure

| CHR | Measure When |
|-----|--------------|
| Coupling | Reviewing dependencies, integration design |
| Cohesion | Evaluating module structure, responsibilities |
| Testability | Assessing test coverage, isolation capability |
| Evolvability | Planning changes, evaluating architecture health |

## Scale Definitions

See [scales.md](scales.md) for detailed scale definitions.

All characteristics use the same ordinal scale:

| Level | Label | General Meaning |
|-------|-------|-----------------|
| 1 | Low | Poor quality, needs attention |
| 2 | Moderate | Acceptable, room for improvement |
| 3 | High | Good quality, target state |

## Aggregation Rules

Since all CHRs are ordinal:

| Aggregation | Legal? | Notes |
|-------------|--------|-------|
| Mode | Yes | Most common level |
| Median | Yes | Middle value |
| Min/Max | Yes | Boundary values |
| Mean | No | Ordinal, not interval |
| Sum | No | Ordinal, not ratio |

## Typical Evaluation

For a module/component:

```
Module: UserService

| CHR | Value | Level | Notes |
|-----|-------|-------|-------|
| Coupling | 7 deps | Moderate | External DB, 3 internal |
| Cohesion | Single domain | High | User management only |
| Testability | Partial isolation | Moderate | DB mock required |
| Evolvability | 3 affected | High | Changes localized |

Overall: Acceptable architecture
Priority fix: Reduce external coupling for better testability
```

## CHR Cards

- [chr-coupling.md](chr-coupling.md)
- [chr-cohesion.md](chr-cohesion.md)
- [chr-testability.md](chr-testability.md)
- [chr-evolvability.md](chr-evolvability.md)
- [scales.md](scales.md)
