# Scales: Software Architecture

Scale definitions for architectural characteristics.

## Common Ordinal Scale

All four characteristics use the same base ordinal scale:

| Level | Value | Label | General Meaning |
|-------|-------|-------|-----------------|
| 1 | Low | Poor | Needs immediate attention |
| 2 | Moderate | Acceptable | Room for improvement |
| 3 | High | Good | Target state achieved |

### Scale Properties

| Property | Value |
|----------|-------|
| **Type** | Ordinal |
| **Order** | Total (all pairs comparable) |
| **Ties** | Allowed |
| **Equidistant** | No (ordinal, not interval) |

### Legal Operations

| Operation | Legal | Why |
|-----------|-------|-----|
| = | Yes | Equality defined |
| ≠ | Yes | Inequality defined |
| < | Yes | Order defined |
| > | Yes | Order defined |
| ≤ | Yes | Order defined |
| ≥ | Yes | Order defined |
| + | No | No interval meaning |
| - | No | No interval meaning |
| × | No | No ratio meaning |
| ÷ | No | No ratio meaning |
| Mean | No | Requires interval scale |
| Median | Yes | Uses order only |
| Mode | Yes | Uses equality only |
| Min/Max | Yes | Uses order only |

### Guard Macros

```
GUARD: ORDINAL_ONLY
  IF characteristic.scale.type == ordinal
  THEN BLOCK: mean, sum, difference, ratio
  ALLOW: median, mode, min, max, comparisons
```

## Per-Characteristic Scales

### arch.coupling

| Level | Label | Definition | Quantitative Proxy |
|-------|-------|------------|-------------------|
| 1 | Tight | High interdependence | Fan-out > 10, cycles present |
| 2 | Moderate | Manageable | Fan-out 4-10, no cycles |
| 3 | Loose | Minimal | Fan-out < 4, interface deps only |

**Polarity**: ↓ (lower numeric level is worse)

### arch.cohesion

| Level | Label | Definition | Quantitative Proxy |
|-------|-------|------------|-------------------|
| 1 | Low | Unrelated elements | High LCOM, mixed concerns |
| 2 | Moderate | Partial relationship | Some shared concepts |
| 3 | High | Single purpose | Low LCOM, focused naming |

**Polarity**: ↑ (higher numeric level is better)

### arch.testability

| Level | Label | Definition | Quantitative Proxy |
|-------|-------|------------|-------------------|
| 1 | Low | Hard to isolate | >5 hard deps, >50 setup lines |
| 2 | Moderate | Partial isolation | 2-5 hard deps, some mocking |
| 3 | High | Easy isolation | 0-1 hard deps, DI available |

**Polarity**: ↑ (higher numeric level is better)

### arch.evolvability

| Level | Label | Definition | Quantitative Proxy |
|-------|-------|------------|-------------------|
| 1 | Low | Changes cascade | >30% affected per change |
| 2 | Moderate | Some localization | 10-30% affected per change |
| 3 | High | Changes localized | <10% affected per change |

**Polarity**: ↑ (higher numeric level is better)

## Aggregation Across Characteristics

When combining multiple CHR measurements:

### Valid Aggregations

```
Overall Assessment:
- Mode: Most common level across characteristics
- Min: Weakest characteristic (conservative)
- Profile: Keep all values (best for comparison)
```

### Invalid Aggregations

```
Invalid:
- Mean of levels (ordinal, not interval)
- Sum of levels (meaningless)
- Weighted average (ordinal, not interval)
```

### Profile Representation

Best practice is to maintain the full profile:

```
Component Profile:
  Coupling:    [███░░] Moderate
  Cohesion:    [████░] High
  Testability: [██░░░] Low
  Evolvability:[███░░] Moderate
  
  Weakest: Testability
  Priority: Improve testability first
```

## Level Transitions

How characteristics typically change:

| Transition | Common Cause | Typical Effort |
|------------|--------------|----------------|
| Low → Moderate | Basic refactoring | 1-2 sprints |
| Moderate → High | Systematic redesign | 2-4 sprints |
| High → Moderate | Debt accumulation | Gradual |
| Moderate → Low | Major shortcuts | Rapid |

## Cross-Characteristic Dependencies

| If | Then typically |
|----|----------------|
| Coupling improves | Testability, evolvability improve |
| Cohesion improves | Testability, evolvability improve |
| Testability improves | Evolvability can improve (safer changes) |
| Evolvability degrades | Often coupling or cohesion degraded first |

## Visual Representation

Recommended visualization approaches:

### Radar Chart
```
        Coupling (Low=outer)
              ╱╲
             ╱  ╲
Evolvability     Cohesion
             ╲  ╱
              ╲╱
         Testability
```

### Bar Chart
```
Coupling     |███░░░| Moderate
Cohesion     |████░░| High  
Testability  |██░░░░| Low
Evolvability |███░░░| Moderate
```

### Traffic Light
```
🟡 Coupling (Moderate)
🟢 Cohesion (High)
🔴 Testability (Low)
🟡 Evolvability (Moderate)
```
