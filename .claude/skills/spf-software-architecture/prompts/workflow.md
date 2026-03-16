# SPF Software Architecture Workflow

How to use this SPF for architectural evaluation.

## Quick Start

1. Identify what you're evaluating (artifact type)
2. Select relevant characteristics (coupling, cohesion, testability, evolvability)
3. Apply operators to measure
4. Check acceptance clauses
5. Generate report

## Detailed Workflow

### Step 1: LOAD Context

1. Read the passport to confirm scope: [passport.md](../passport.md)
2. Identify artifact type:
   - System design (diagrams)
   - Module structure (code organization)
   - API design (interfaces)
   - Full codebase

3. Load relevant tradition based on context:
   - Domain modeling → [tradition-ddd.md](../sota-pack/tradition-ddd.md)
   - Dependency management → [tradition-clean.md](../sota-pack/tradition-clean.md)
   - Change readiness → [tradition-evolutionary.md](../sota-pack/tradition-evolutionary.md)

### Step 2: MATCH Characteristics

For each artifact type, select applicable characteristics:

| Artifact Type | Recommended CHRs |
|---------------|------------------|
| System design | coupling, cohesion, evolvability |
| Module structure | coupling, cohesion, testability |
| API design | coupling, testability |
| Full codebase | All four |

Load CHR cards:
- [chr-coupling.md](../chr-pack/chr-coupling.md)
- [chr-cohesion.md](../chr-pack/chr-cohesion.md)
- [chr-testability.md](../chr-pack/chr-testability.md)
- [chr-evolvability.md](../chr-pack/chr-evolvability.md)

### Step 3: EVALUATE

Apply operators to measure characteristics:

1. **For static analysis** (code-level):
   - Use [op-dependency-analysis.md](../cal-pack/op-dependency-analysis.md)
   - Measure coupling via import/dependency graphs
   - Measure cohesion via module composition

2. **For design review** (diagram/doc-level):
   - Manual evaluation against CHR cards
   - Use tradition-specific heuristics

3. **For fitness testing**:
   - Use [op-fitness-function.md](../cal-pack/op-fitness-function.md)
   - Define executable fitness functions
   - Run against codebase/system

### Step 4: REPORT

Generate conformance report:

```markdown
# Architecture Evaluation Report

## Artifact
- Type: {artifact type}
- Name: {identifier}
- Date: {evaluation date}

## Characteristics

| CHR | Value | Level | Pass/Fail |
|-----|-------|-------|-----------|
| Coupling | {value} | {low/moderate/high} | {✓/✗} |
| Cohesion | {value} | {low/moderate/high} | {✓/✗} |
| Testability | {value} | {low/moderate/high} | {✓/✗} |
| Evolvability | {value} | {low/moderate/high} | {✓/✗} |

## Evidence
{List evidence sources for each measurement}

## Issues
{List violations with severity}

## Recommendations
{Ordered list of improvements}
```

## Common Evaluation Scenarios

### Scenario 1: New Service Design Review

```
1. LOAD: passport.md, tradition-clean.md
2. MATCH: coupling, cohesion
3. EVALUATE: 
   - Check dependency direction (Clean Architecture)
   - Verify bounded context alignment (DDD)
4. REPORT: Design feedback with specific fixes
```

### Scenario 2: Codebase Health Check

```
1. LOAD: passport.md, all traditions
2. MATCH: all four characteristics
3. EVALUATE:
   - Run op-dependency-analysis
   - Calculate metrics
   - Check against acceptance thresholds
4. REPORT: Health dashboard with trends
```

### Scenario 3: Architecture Decision Record

```
1. LOAD: passport.md, relevant tradition
2. MATCH: characteristics affected by decision
3. EVALUATE:
   - Compare alternatives on each CHR
   - Assess trade-offs
4. REPORT: ADR with quantified trade-offs
```

## Tips

- Start with the characteristic most relevant to your concern
- Use tradition-specific terminology for stakeholder communication
- Always cite evidence (code locations, diagram elements)
- Track trends over time, not just point-in-time values
