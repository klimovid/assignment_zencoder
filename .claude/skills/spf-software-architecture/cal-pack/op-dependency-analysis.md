# Operator Card: Dependency Analysis

## Identity

| Field | Value |
|-------|-------|
| **UTS.id** | `op.arch.dependency-analysis` |
| **Name** | Dependency Analysis |
| **Category** | Analysis |
| **Tradition** | Clean Architecture, Structured Design |

## Purpose

Analyze dependencies between software modules to measure coupling, identify cycles, and visualize the dependency structure. Produces metrics and graph for coupling assessment.

## Signature

```
DependencyAnalysis:
  Inputs:
    - artifact: CodeArtifact — source code to analyze
    - scope: Scope — module, package, or system level
    - include_external: bool — include external dependencies
  Outputs:
    - graph: DependencyGraph — nodes and edges
    - metrics: DependencyMetrics — fan-in, fan-out, cycles
    - violations: List[DependencyViolation] — rule violations
```

### Input Types

| Input | Type | Required? | Default | Constraints |
|-------|------|-----------|---------|-------------|
| artifact | CodeArtifact | Yes | — | Valid source code |
| scope | Scope | No | "module" | module/package/system |
| include_external | bool | No | false | — |

### Output Types

| Output | Type | Guaranteed? | Notes |
|--------|------|-------------|-------|
| graph | DependencyGraph | Yes | Always produced |
| metrics | DependencyMetrics | Yes | Per-node metrics |
| violations | List | Yes | May be empty |

## Preconditions

| Precondition | Check | Failure Action |
|--------------|-------|----------------|
| Code accessible | Path exists | Error: path not found |
| Language supported | Parser available | Error: unsupported language |
| Parseable | No syntax errors | Warn: skip unparseable files |

## Postconditions

| Postcondition | Guarantee Level | Notes |
|---------------|-----------------|-------|
| Graph complete | Always | All discovered nodes included |
| Metrics calculated | Always | Per-node and aggregate |
| Cycles detected | Always | Listed if present |

## Algorithm

### Step 1: Parse Source

```
1.1 Identify source files in scope
1.2 For each file:
    - Parse to AST
    - Extract module identity
    - Extract import/dependency statements
1.3 Build initial node list
```

### Step 2: Build Graph

```
2.1 For each node (module):
    - Identify outgoing edges (dependencies)
    - Identify incoming edges (dependents)
    - Tag edge type (import, call, data)
2.2 Filter based on scope and include_external
2.3 Store graph structure
```

### Step 3: Calculate Metrics

```
3.1 Per-node metrics:
    - Fan-out = count(outgoing edges)
    - Fan-in = count(incoming edges)
    - Instability = Fan-out / (Fan-in + Fan-out)
    
3.2 Aggregate metrics:
    - Total nodes
    - Total edges
    - Average fan-out
    - Max fan-out
    
3.3 Cycle detection:
    - Run Tarjan's algorithm
    - List strongly connected components
    - Mark cycle participants
```

### Step 4: Check Rules

```
4.1 Check for cycles (always a violation)
4.2 Check dependency direction (if rules defined):
    - Domain should not depend on infrastructure
    - Inner layers should not depend on outer
4.3 Check excessive coupling:
    - Flag modules with fan-out > threshold
4.4 Compile violations
```

### Step 5: Output

```
5.1 Return:
    - DependencyGraph with nodes and edges
    - DependencyMetrics per node and aggregate
    - List of violations
```

## Evidence

### Evidence Produced

| Evidence Type | Format | Confidence | Notes |
|---------------|--------|------------|-------|
| Dependency graph | Structured/visual | High | Exact dependencies |
| Metrics | Numeric | High | Calculated values |
| Violation locations | File:line | High | Specific issues |
| Cycle paths | Node lists | High | Exact cycle paths |

### Evidence Required

| Evidence Type | Source | Minimum Quality |
|---------------|--------|-----------------|
| Source code | Repository | Parseable |

## Trust Profile (F-G-R)

| Dimension | Value | Notes |
|-----------|-------|-------|
| **Formality (F)** | 2-3 | Algorithmic, reproducible |
| **Scope (G)** | Per-artifact | Module or system level |
| **Reliability (R)** | 0.9 | Deterministic for static deps |

## Cost Model

| Resource | Cost | Notes |
|----------|------|-------|
| Time | 10s - 5min | Scales with codebase size |
| Compute | Low | AST parsing |
| Human effort | None | Fully automated |

## Error Handling

| Error | Cause | Recovery |
|-------|-------|----------|
| Parse error | Invalid syntax | Skip file, warn |
| Circular import | Python limitation | Note in graph |
| Timeout | Very large codebase | Sample or parallelize |

## Composition

### Composes With

| Operator | Composition | Result |
|----------|-------------|--------|
| op-fitness-function | dep-analysis → fitness | Coupling score from metrics |
| Visualization | graph → render | Dependency diagram |

### Alternatives

| Alternative | When to Use Instead |
|-------------|---------------------|
| IDE dependency view | Quick check |
| Architecture tests | CI/CD enforcement |

## Known Failures

| Failure Mode | Cause | Detection | Mitigation |
|--------------|-------|-----------|------------|
| Missing runtime deps | Dynamic loading | Coverage gaps | Add runtime tracing |
| False edges | Unused imports | Inflate metrics | Dead code detection |
| Reflection deps | Metaprogramming | Incomplete graph | Manual annotation |

## Output Formats

### Graph Representation

```
DependencyGraph:
  nodes:
    - id: "order_service"
      type: "module"
      metrics: {fan_in: 3, fan_out: 5, instability: 0.625}
    - id: "payment_gateway"
      type: "module"
      metrics: {fan_in: 1, fan_out: 8, instability: 0.889}
  edges:
    - from: "order_service"
      to: "payment_gateway"
      type: "import"
    - from: "order_service"
      to: "user_repository"
      type: "import"
```

### Metrics Summary

```
DependencyMetrics:
  total_nodes: 24
  total_edges: 67
  avg_fan_out: 2.8
  max_fan_out: 8
  cycles: [
    ["order", "payment", "invoice", "order"]
  ]
  high_coupling_nodes: ["payment_gateway", "order_processor"]
```

### Violation Example

```
DependencyViolation:
  type: "cycle"
  severity: "major"
  nodes: ["order", "payment", "invoice"]
  path: "order -> payment -> invoice -> order"
  recommendation: "Break cycle by introducing interface"
```

## Examples

### Example 1: Module Analysis

**Input:**
```python
artifact = CodeArtifact(path="/src/order_service")
scope = "module"
include_external = False
```

**Output:**
```python
AnalysisResult(
    graph=DependencyGraph(
        nodes=[
            Node("handlers", fan_in=0, fan_out=4),
            Node("services", fan_in=3, fan_out=2),
            Node("repositories", fan_in=2, fan_out=1),
            Node("domain", fan_in=3, fan_out=0)
        ],
        edges=[
            Edge("handlers", "services"),
            Edge("handlers", "domain"),
            Edge("services", "repositories"),
            Edge("services", "domain"),
            Edge("repositories", "domain")
        ]
    ),
    metrics=DependencyMetrics(
        total_nodes=4,
        total_edges=5,
        avg_fan_out=1.75,
        cycles=[]
    ),
    violations=[]
)
```

### Example 2: Cycle Detection

**Input:**
```python
artifact = CodeArtifact(path="/src/legacy_system")
```

**Output:**
```python
AnalysisResult(
    graph=...,
    metrics=DependencyMetrics(
        cycles=[
            Cycle(["billing", "order", "inventory", "billing"])
        ]
    ),
    violations=[
        DependencyViolation(
            type="cycle",
            severity="major",
            path="billing -> order -> inventory -> billing",
            recommendation="Extract shared interface to break cycle"
        )
    ]
)
```

## Tools

Common tools for dependency analysis:

| Language | Tool | Notes |
|----------|------|-------|
| Python | pydeps, import-linter | Static analysis |
| Java | JDepend, ArchUnit | Architecture testing |
| JavaScript | madge, dependency-cruiser | Module deps |
| .NET | NDepend | Comprehensive |
| Multi | Understand, Lattix | Commercial |

## Meta

| Field | Value |
|-------|-------|
| Created | 2026-01-26 |
| Last Updated | 2026-01-26 |
| Confidence | High |
| Tested | Yes |
