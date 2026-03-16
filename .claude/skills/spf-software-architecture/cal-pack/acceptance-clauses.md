# Acceptance Clauses: Software Architecture

Pass/fail conditions for architectural conformance.

## Overview

| Clause ID | CHRs Used | Condition | Severity |
|-----------|-----------|-----------|----------|
| coupling.max | coupling | ≤ moderate | Major |
| cohesion.min | cohesion | ≥ moderate | Major |
| testability.min | testability | ≥ moderate | Major |
| evolvability.min | evolvability | ≥ moderate | Minor |
| no.cycles | coupling | cycles = 0 | Critical |
| architecture.health | all | min ≥ moderate | Major |

---

## Clause: coupling.max

### Identity

| Field | Value |
|-------|-------|
| **ID** | `accept.arch.coupling.max` |
| **Name** | Maximum Coupling |
| **Category** | Quality |
| **Severity** | Major |

### Purpose

Ensure module coupling remains manageable to enable independent development and testing.

### Characteristic References

| CHR ID | Name | Role in Clause |
|--------|------|----------------|
| arch.coupling | Coupling | Primary measurement |

### Predicate

```
ACCEPT IF arch.coupling ≤ moderate (level 2)
```

Equivalent:
```
ACCEPT IF arch.coupling.level IN [2, 3]
FAIL IF arch.coupling.level == 1 (tight)
```

### Thresholds

| Level | Threshold | Interpretation |
|-------|-----------|----------------|
| Pass | moderate or loose | Acceptable coupling |
| Fail | tight | Too many dependencies |

### Failure Policy

| Field | Value |
|-------|-------|
| **On Failure** | Block (for critical paths) or Warn |
| **Escalation Path** | Tech Lead review |
| **Override Allowed?** | Yes, with documented rationale |

### Remediation

1. **Immediate**: Identify highest-coupling modules
2. **Short-term**: Introduce interfaces, break direct dependencies
3. **Long-term**: Refactor module boundaries

---

## Clause: cohesion.min

### Identity

| Field | Value |
|-------|-------|
| **ID** | `accept.arch.cohesion.min` |
| **Name** | Minimum Cohesion |
| **Category** | Quality |
| **Severity** | Major |

### Purpose

Ensure modules have focused responsibilities for maintainability.

### Characteristic References

| CHR ID | Name | Role in Clause |
|--------|------|----------------|
| arch.cohesion | Cohesion | Primary measurement |

### Predicate

```
ACCEPT IF arch.cohesion ≥ moderate (level 2)
```

### Thresholds

| Level | Threshold | Interpretation |
|-------|-----------|----------------|
| Pass | moderate or high | Acceptable cohesion |
| Fail | low | Mixed responsibilities |

### Failure Policy

| Field | Value |
|-------|-------|
| **On Failure** | Warn |
| **Escalation Path** | Architecture review |
| **Override Allowed?** | Yes, for legacy code |

### Remediation

1. **Immediate**: Identify modules with mixed concerns
2. **Short-term**: Extract classes to appropriate modules
3. **Long-term**: Redesign module structure

---

## Clause: testability.min

### Identity

| Field | Value |
|-------|-------|
| **ID** | `accept.arch.testability.min` |
| **Name** | Minimum Testability |
| **Category** | Quality |
| **Severity** | Major |

### Purpose

Ensure components can be tested in isolation for quality assurance.

### Characteristic References

| CHR ID | Name | Role in Clause |
|--------|------|----------------|
| arch.testability | Testability | Primary measurement |

### Predicate

```
ACCEPT IF arch.testability ≥ moderate (level 2)
```

### Thresholds

| Level | Threshold | Interpretation |
|-------|-----------|----------------|
| Pass | moderate or high | Can be tested |
| Fail | low | Hard to test in isolation |

### Failure Policy

| Field | Value |
|-------|-------|
| **On Failure** | Block for new code, Warn for legacy |
| **Escalation Path** | Tech Lead |
| **Override Allowed?** | Yes, with test plan |

### Remediation

1. **Immediate**: Add dependency injection
2. **Short-term**: Replace hard deps with interfaces
3. **Long-term**: Refactor for testability

---

## Clause: evolvability.min

### Identity

| Field | Value |
|-------|-------|
| **ID** | `accept.arch.evolvability.min` |
| **Name** | Minimum Evolvability |
| **Category** | Quality |
| **Severity** | Minor |

### Purpose

Ensure architecture can accommodate future changes without extensive rework.

### Characteristic References

| CHR ID | Name | Role in Clause |
|--------|------|----------------|
| arch.evolvability | Evolvability | Primary measurement |

### Predicate

```
ACCEPT IF arch.evolvability ≥ moderate (level 2)
```

### Thresholds

| Level | Threshold | Interpretation |
|-------|-----------|----------------|
| Pass | moderate or high | Can evolve |
| Fail | low | Changes cascade widely |

### Failure Policy

| Field | Value |
|-------|-------|
| **On Failure** | Warn |
| **Escalation Path** | Architect |
| **Override Allowed?** | Yes |

### Remediation

1. **Immediate**: Identify rigid areas
2. **Short-term**: Add abstraction layers
3. **Long-term**: Strategic redesign

---

## Clause: no.cycles

### Identity

| Field | Value |
|-------|-------|
| **ID** | `accept.arch.no.cycles` |
| **Name** | No Dependency Cycles |
| **Category** | Quality |
| **Severity** | Critical |

### Purpose

Prevent circular dependencies that make modules impossible to deploy or test independently.

### Characteristic References

| CHR ID | Name | Role in Clause |
|--------|------|----------------|
| arch.coupling | Coupling | Cycle detection |

### Predicate

```
ACCEPT IF dependency_cycles = 0
FAIL IF dependency_cycles > 0
```

### Thresholds

| Level | Threshold | Interpretation |
|-------|-----------|----------------|
| Pass | 0 cycles | No circular dependencies |
| Fail | ≥1 cycle | Circular dependency exists |

### Failure Policy

| Field | Value |
|-------|-------|
| **On Failure** | Block |
| **Escalation Path** | Architect |
| **Override Allowed?** | No (critical) |

### Remediation

1. **Immediate**: Identify cycle path
2. **Short-term**: Break with interface extraction
3. **Long-term**: Redesign module structure

---

## Clause: architecture.health

### Identity

| Field | Value |
|-------|-------|
| **ID** | `accept.arch.health` |
| **Name** | Overall Architecture Health |
| **Category** | Quality |
| **Severity** | Major |

### Purpose

Ensure no characteristic is critically poor.

### Characteristic References

| CHR ID | Name | Role in Clause |
|--------|------|----------------|
| arch.coupling | Coupling | Input |
| arch.cohesion | Cohesion | Input |
| arch.testability | Testability | Input |
| arch.evolvability | Evolvability | Input |

### Predicate

```
ACCEPT IF min(coupling, cohesion, testability, evolvability) ≥ moderate
```

Equivalent:
```
ACCEPT IF (
    coupling ≤ moderate
    AND cohesion ≥ moderate
    AND testability ≥ moderate
    AND evolvability ≥ moderate
)
```

Note: Coupling uses ≤ (lower is better), others use ≥.

### Thresholds

| Level | Threshold | Interpretation |
|-------|-----------|----------------|
| Pass | All ≥ moderate | Healthy architecture |
| Fail | Any low | Has critical weakness |

### Failure Policy

| Field | Value |
|-------|-------|
| **On Failure** | Warn, identify weakest |
| **Escalation Path** | Architect |
| **Override Allowed?** | Yes, with remediation plan |

### Remediation

Address the weakest characteristic first.

---

## Unknown Handling

For all clauses:

| Scenario | Action | Rationale |
|----------|--------|-----------|
| CHR value missing | Warn, do not fail | Can't penalize unmeasurable |
| Measurement uncertain | Widen threshold by 1 level | Account for uncertainty |
| Conflicting evidence | Use worst case | Conservative |

---

## Evaluation Order

Recommended evaluation sequence:

1. **no.cycles** (Critical) - Must pass first
2. **coupling.max** (Major) - Foundational
3. **cohesion.min** (Major) - Foundational
4. **testability.min** (Major) - Quality gate
5. **evolvability.min** (Minor) - Strategic
6. **architecture.health** (Major) - Overall check

---

## Conformance Report Template

```markdown
# Architecture Conformance Report

## Summary

| Clause | Result | Notes |
|--------|--------|-------|
| no.cycles | PASS/FAIL | {cycle count} |
| coupling.max | PASS/FAIL | {level} |
| cohesion.min | PASS/FAIL | {level} |
| testability.min | PASS/FAIL | {level} |
| evolvability.min | PASS/FAIL | {level} |
| architecture.health | PASS/FAIL | {weakest} |

## Failures

{For each failure:}
- Clause: {id}
- Measured: {value}
- Required: {threshold}
- Evidence: {locations}
- Remediation: {actions}

## Recommendations

1. {Highest priority}
2. {Next priority}
...
```
