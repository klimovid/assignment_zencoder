# Operator Card: Fitness Function

## Identity

| Field | Value |
|-------|-------|
| **UTS.id** | `op.arch.fitness-function` |
| **Name** | Fitness Function Evaluation |
| **Category** | Evaluation |
| **Tradition** | Evolutionary Architecture |

## Purpose

Evaluate software architecture against defined quality goals using automated or semi-automated fitness functions. Produces measurable fitness scores for each characteristic.

## Signature

```
FitnessEvaluation:
  Inputs:
    - artifact: Artifact — code, design, or system to evaluate
    - characteristics: List[CHR] — which characteristics to measure
    - thresholds: Map[CHR, Threshold] — optional custom thresholds
  Outputs:
    - scores: Map[CHR, FitnessScore] — score per characteristic
    - violations: List[Violation] — failed fitness checks
    - evidence: List[Evidence] — supporting data
```

### Input Types

| Input | Type | Required? | Default | Constraints |
|-------|------|-----------|---------|-------------|
| artifact | Artifact | Yes | — | Must be valid code or design |
| characteristics | List[CHR] | No | All 4 CHRs | Valid CHR IDs |
| thresholds | Map | No | Default thresholds | Per-CHR thresholds |

### Output Types

| Output | Type | Guaranteed? | Notes |
|--------|------|-------------|-------|
| scores | Map[CHR, Score] | Yes | Always produced |
| violations | List[Violation] | Yes | May be empty |
| evidence | List[Evidence] | Yes | Source for each score |

## Preconditions

| Precondition | Check | Failure Action |
|--------------|-------|----------------|
| Artifact accessible | Path exists, readable | Error: cannot access |
| CHRs defined | All CHR IDs valid | Error: unknown CHR |
| Measurement possible | Tooling available | Warn: partial evaluation |

## Postconditions

| Postcondition | Guarantee Level | Notes |
|---------------|-----------------|-------|
| All requested CHRs scored | Always | May be "unknown" if unmeasurable |
| Evidence provided | Always | At least source reference |
| Violations listed | Always | Empty if all pass |

## Algorithm

### Step 1: Artifact Analysis

```
1.1 Determine artifact type:
    - code → static analysis path
    - design → document analysis path
    - system → runtime analysis path
    
1.2 Load artifact into analysis context
```

### Step 2: Per-CHR Evaluation

For each characteristic:

```
2.1 Coupling:
    - Run dependency analysis
    - Count fan-in/fan-out
    - Check for cycles
    - Classify: tight/moderate/loose
    
2.2 Cohesion:
    - Analyze module contents
    - Check naming consistency
    - Evaluate responsibility focus
    - Classify: low/moderate/high
    
2.3 Testability:
    - Check dependency injection
    - Count hard dependencies
    - Analyze test structure (if exists)
    - Classify: low/moderate/high
    
2.4 Evolvability:
    - Simulate change scenarios
    - Count affected components
    - Check abstraction layers
    - Classify: low/moderate/high
```

### Step 3: Threshold Evaluation

```
3.1 For each CHR:
    - Compare score to threshold
    - If below threshold: create violation
    - Record evidence
```

### Step 4: Report Compilation

```
4.1 Aggregate scores
4.2 Compile violation list
4.3 Attach evidence
4.4 Return FitnessResult
```

## Evidence

### Evidence Produced

| Evidence Type | Format | Confidence | Notes |
|---------------|--------|------------|-------|
| Metric values | Structured data | High | Automated measurement |
| Code locations | File:line refs | High | Specific evidence |
| Violations | Structured list | High | With severity |
| Trend data | Time series | Medium | If history available |

### Evidence Required

| Evidence Type | Source | Minimum Quality |
|---------------|--------|-----------------|
| Source code | Repository | Accessible, parseable |
| Config | Project files | Valid format |
| Test code | Test directory | Optional |

## Trust Profile (F-G-R)

| Dimension | Value | Notes |
|-----------|-------|-------|
| **Formality (F)** | 2 | Automated metrics, ordinal classification |
| **Scope (G)** | Per-artifact | Module or system level |
| **Reliability (R)** | 0.8 | Well-defined measurements |

## Cost Model

| Resource | Cost | Notes |
|----------|------|-------|
| Time | 1-10 minutes | Depends on codebase size |
| Compute | Low-Medium | Static analysis |
| Human effort | Low | Automated, review results |

## Error Handling

| Error | Cause | Recovery |
|-------|-------|----------|
| Artifact not found | Invalid path | Return error, list valid paths |
| Parse failure | Invalid syntax | Skip unparseable, warn |
| Tool not available | Missing analyzer | Fall back to manual assessment |
| Timeout | Large codebase | Sample subset, warn |

## Composition

### Composes With

| Operator | Composition | Result |
|----------|-------------|--------|
| op-dependency-analysis | dep-analysis → fitness | Use dep results for coupling |
| acceptance-clauses | fitness → acceptance | Check scores against clauses |

### Alternatives

| Alternative | When to Use Instead |
|-------------|---------------------|
| Manual review | When automated tools unavailable |
| Sampling | When full analysis too slow |

## Known Failures

| Failure Mode | Cause | Detection | Mitigation |
|--------------|-------|-----------|------------|
| False positives | Metric thresholds too strict | Expert review | Calibrate thresholds |
| Dynamic language issues | Reflection, metaprogramming | Coverage gaps | Add runtime analysis |
| Design-only artifacts | No code to analyze | No metrics | Use qualitative assessment |

## Examples

### Example 1: Codebase Evaluation

**Input:**
```python
artifact = CodebaseArtifact(path="/src/order-service")
characteristics = [CHR.COUPLING, CHR.COHESION, CHR.TESTABILITY, CHR.EVOLVABILITY]
thresholds = default_thresholds()
```

**Output:**
```python
FitnessResult(
    scores={
        CHR.COUPLING: Score(level=2, label="moderate", raw_value=6.2),
        CHR.COHESION: Score(level=3, label="high", raw_value=0.85),
        CHR.TESTABILITY: Score(level=1, label="low", raw_value=0.3),
        CHR.EVOLVABILITY: Score(level=2, label="moderate", raw_value=0.6)
    },
    violations=[
        Violation(
            chr=CHR.TESTABILITY,
            message="5 classes have >5 hard dependencies",
            locations=["OrderProcessor.py:15", "PaymentHandler.py:8", ...],
            severity="major"
        )
    ],
    evidence=[...]
)
```

### Example 2: Design Evaluation

**Input:**
```python
artifact = DesignArtifact(path="/docs/architecture.md", diagrams=[...])
characteristics = [CHR.COUPLING, CHR.EVOLVABILITY]
```

**Output:**
```python
FitnessResult(
    scores={
        CHR.COUPLING: Score(level=2, label="moderate", qualitative="Based on diagram analysis"),
        CHR.EVOLVABILITY: Score(level=3, label="high", qualitative="Good abstraction layers")
    },
    violations=[],
    evidence=[
        Evidence(type="manual", source="architecture.md", assessor="analyst")
    ]
)
```

## Fitness Function Examples

Executable fitness functions for CI/CD:

```python
# Coupling fitness
def check_coupling():
    deps = analyze_dependencies()
    for module in deps.modules:
        assert module.fan_out <= 10, f"{module.name} has too many dependencies"
    assert not deps.has_cycles(), "Dependency cycles detected"

# Cohesion fitness (via naming)
def check_cohesion():
    for module in get_modules():
        terms = extract_domain_terms(module)
        assert coherence_score(terms) > 0.7, f"{module.name} has mixed terminology"

# Testability fitness
def check_testability():
    for cls in get_classes():
        hard_deps = count_hard_dependencies(cls)
        assert hard_deps <= 2, f"{cls.name} has {hard_deps} hard dependencies"

# Evolvability fitness (proxy: no framework in domain)
def check_domain_purity():
    domain_code = get_package("domain")
    framework_imports = find_imports(domain_code, patterns=["flask", "django", "sqlalchemy"])
    assert not framework_imports, "Framework code in domain layer"
```

## Meta

| Field | Value |
|-------|-------|
| Created | 2026-01-26 |
| Last Updated | 2026-01-26 |
| Confidence | High |
| Tested | Yes |
