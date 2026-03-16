# Conformance Check Procedure

Step-by-step process for checking artifact conformance.

## Prerequisites

- Artifact to evaluate (code, design, documentation)
- Acceptance clauses from [cal-pack/acceptance-clauses.md](../cal-pack/acceptance-clauses.md)
- Relevant CHR cards loaded

## Procedure

### 1. Artifact Identification

Determine artifact type and scope:

```
Artifact:
  Type: {system-design | module-structure | api-design | codebase}
  Name: {identifier}
  Scope: {what's included}
  Context: {bounded context if applicable}
```

### 2. Characteristic Selection

Based on artifact type, select CHRs to evaluate:

| Check | Artifact Types | CHR Card |
|-------|----------------|----------|
| Coupling Check | All | [chr-coupling.md](../chr-pack/chr-coupling.md) |
| Cohesion Check | module-structure, codebase | [chr-cohesion.md](../chr-pack/chr-cohesion.md) |
| Testability Check | module-structure, codebase | [chr-testability.md](../chr-pack/chr-testability.md) |
| Evolvability Check | system-design, codebase | [chr-evolvability.md](../chr-pack/chr-evolvability.md) |

### 3. Measurement

For each selected CHR:

#### 3.1 Coupling

**Method**: Dependency analysis or manual review

For code:
1. Extract import/dependency graph
2. Count dependencies per module
3. Identify dependency cycles
4. Classify: tight (>10 deps), moderate (4-10), loose (<4)

For design:
1. Count arrows/connections per component
2. Identify bidirectional dependencies
3. Check for dependency direction violations

#### 3.2 Cohesion

**Method**: Module composition analysis

For code:
1. Analyze module contents (classes, functions)
2. Check naming consistency
3. Evaluate single responsibility
4. Classify: low (mixed concerns), moderate (mostly related), high (single concern)

For design:
1. Check component naming vs. contents
2. Verify logical grouping
3. Assess boundary clarity

#### 3.3 Testability

**Method**: Isolation analysis

For code:
1. Check for dependency injection support
2. Identify hard-coded dependencies
3. Count external dependencies in tests
4. Classify: low (mocks required), moderate (partial isolation), high (easily isolated)

#### 3.4 Evolvability

**Method**: Change impact analysis

For code/design:
1. Simulate hypothetical changes
2. Count affected components per change
3. Identify rigid areas
4. Classify: low (changes cascade), moderate (localized with effort), high (changes localized)

### 4. Acceptance Evaluation

Apply acceptance clauses from [acceptance-clauses.md](../cal-pack/acceptance-clauses.md):

| Clause | Condition | Your Value | Result |
|--------|-----------|------------|--------|
| coupling.max | ≤ moderate | {value} | PASS/FAIL |
| cohesion.min | ≥ moderate | {value} | PASS/FAIL |
| testability.min | ≥ moderate | {value} | PASS/FAIL |
| evolvability.min | ≥ moderate | {value} | PASS/FAIL |

### 5. Evidence Collection

For each measurement, document:

```
CHR: {characteristic}
Value: {measured value}
Evidence:
  - Source: {file/diagram location}
  - Method: {how measured}
  - Confidence: {high/medium/low}
Notes: {observations}
```

### 6. Issue Documentation

For each failure:

```
Issue: {short description}
Severity: {critical/major/minor}
CHR: {which characteristic}
Location: {where in artifact}
Evidence: {what shows the issue}
Remediation: {how to fix}
```

### 7. Report Generation

Compile final report:

```markdown
# Conformance Report

## Summary
- Artifact: {name}
- Date: {date}
- Overall: {CONFORMANT / NON-CONFORMANT}
- Issues: {count by severity}

## Results

| CHR | Value | Threshold | Result |
|-----|-------|-----------|--------|
| ... | ... | ... | ... |

## Issues

### Critical
{list}

### Major
{list}

### Minor
{list}

## Recommendations

1. {highest priority}
2. {next priority}
3. ...

## Evidence Trail
{evidence citations}
```

## Quick Checklist

- [ ] Artifact type identified
- [ ] Relevant CHRs selected
- [ ] Each CHR measured with evidence
- [ ] Acceptance clauses evaluated
- [ ] Issues documented with severity
- [ ] Recommendations prioritized
- [ ] Report generated
