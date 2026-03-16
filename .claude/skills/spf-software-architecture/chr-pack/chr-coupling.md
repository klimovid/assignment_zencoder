# CHR Card: Coupling

## Identity

| Field | Value |
|-------|-------|
| **UTS.id** | `arch.coupling` |
| **Name** | Coupling |
| **Context** | Module/component relationships |
| **ReferencePlane** | Code structure, dependency graph |

## Definition

The degree of interdependence between software modules. Coupling measures how much one module relies on the internal details or implementation of another module.

Lower coupling means modules can change independently; higher coupling means changes in one module require changes in others.

## Observable

| Field | Value |
|-------|-------|
| **Instrument/Protocol** | Dependency analysis (static or dynamic) |
| **Uncertainty** | ±5% for dynamic languages with reflection |
| **Validity Window** | Per-release or per-commit snapshot |

### Measurement Protocol

1. Extract dependency graph from codebase
2. For each module, count:
   - Fan-out: dependencies this module has on others
   - Fan-in: dependencies other modules have on this one
3. Identify dependency types:
   - Structural (import/include)
   - Semantic (shared concepts)
   - Temporal (call ordering)
4. Check for cycles in dependency graph
5. Classify overall coupling level

### Instruments

| Instrument | Type | Precision | Notes |
|------------|------|-----------|-------|
| Static analysis tools | Automated | High for explicit deps | Misses runtime deps |
| IDE dependency view | Automated | Medium | IDE-specific |
| Manual review | Manual | Varies | Catches semantic coupling |
| Architecture tests | Automated | High | ArchUnit, deptry, etc. |

### Coupling Types (Weak to Strong)

| Type | Description | Severity |
|------|-------------|----------|
| Data | Modules share only data | Weak |
| Stamp | Modules share data structures | Moderate |
| Control | One module controls flow of another | Moderate |
| External | Modules share external resource | Moderate-Strong |
| Common | Modules share global data | Strong |
| Content | One module modifies another's internals | Strongest |

## Scale

| Field | Value |
|-------|-------|
| **Type** | Ordinal |
| **Units** | N/A (levels) |
| **Polarity** | ↓ lower is better |

### Levels

| Level | Label | Definition | Indicators |
|-------|-------|------------|------------|
| 1 | Tight | High interdependence | >10 deps, cycles, content coupling |
| 2 | Moderate | Manageable dependencies | 4-10 deps, some stamp coupling |
| 3 | Loose | Minimal dependencies | <4 deps, data coupling only |

### Quantitative Thresholds (guidance)

| Metric | Tight | Moderate | Loose |
|--------|-------|----------|-------|
| Fan-out | >10 | 4-10 | <4 |
| Cycle count | >0 | 0 | 0 |
| External deps | >5 | 2-5 | <2 |
| Instability (I) | <0.3 or >0.8 | 0.3-0.8 | By design |

## Legal Operations

| Operation | Legal? | Notes |
|-----------|--------|-------|
| Equality (=, ≠) | Yes | |
| Ordering (<, >) | Yes | Loose > Moderate > Tight |
| Difference (+, -) | No | Ordinal |
| Ratio (×, ÷) | No | Ordinal |
| Mean | No | Use mode or median |
| Median | Yes | |
| Mode | Yes | |

## Evidence Lanes

| Lane | Type | Source |
|------|------|--------|
| Static | Static analysis | Import graphs, dependency tools |
| Dynamic | Runtime | Call traces, profiler |
| Design | Expert review | Architecture diagrams |

## Freshness

| Field | Value |
|-------|-------|
| **Half-life** | 1 release (coupling can change quickly) |
| **Refresh Trigger** | After significant code changes |
| **Missingness** | Mark as "unknown", cannot assume |

## Tradition Sources

| Tradition | Term Used | Notes |
|-----------|-----------|-------|
| Clean Architecture | Coupling, dependencies | Core concern |
| DDD | Context relationships | At bounded context level |
| Evolutionary Architecture | Connascence | Richer taxonomy |
| Structured Design | Coupling | Original source (Myers, 1975) |

## Related Characteristics

| CHR | Relationship |
|-----|--------------|
| Cohesion | Inverse: high cohesion often means lower coupling |
| Testability | Causal: low coupling enables testability |
| Evolvability | Causal: low coupling enables evolvability |

## Anti-patterns

| Anti-pattern | Why Wrong | Correct Approach |
|--------------|-----------|------------------|
| God class | Single module couples to everything | Split by responsibility |
| Circular deps | Tight bidirectional coupling | Break cycle with interface |
| Inappropriate intimacy | Module knows others' internals | Use public interfaces |
| Feature envy | Module uses another's data excessively | Move logic to data owner |

## Examples

### High Coupling Example (Tight)

```python
# OrderProcessor directly uses database, email, inventory internals
class OrderProcessor:
    def process(self, order):
        db.execute("INSERT INTO orders...")  # DB coupling
        email.smtp_client.send(...)          # Implementation coupling
        inventory._internal_stock[order.item] -= 1  # Content coupling
```

- Measured value: Tight (Level 1)
- Evidence: Direct DB access, private member access, 15+ dependencies

### Low Coupling Example (Loose)

```python
# OrderProcessor depends only on interfaces
class OrderProcessor:
    def __init__(self, repo: OrderRepository, notifier: Notifier, stock: StockService):
        self.repo = repo
        self.notifier = notifier
        self.stock = stock
        
    def process(self, order):
        self.repo.save(order)
        self.notifier.notify(OrderPlaced(order))
        self.stock.reserve(order.items)
```

- Measured value: Loose (Level 3)
- Evidence: 3 interface dependencies, no implementation details

## Meta

| Field | Value |
|-------|-------|
| Created | 2026-01-26 |
| Last Updated | 2026-01-26 |
| Confidence | High |
| Review Due | 2027-01-26 |
