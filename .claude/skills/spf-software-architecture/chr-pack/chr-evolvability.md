# CHR Card: Evolvability

## Identity

| Field | Value |
|-------|-------|
| **UTS.id** | `arch.evolvability` |
| **Name** | Evolvability |
| **Context** | System adaptation to change |
| **ReferencePlane** | Change impact analysis |

## Definition

The degree to which a software architecture can accommodate changes without requiring extensive modifications across multiple components.

High evolvability means changes are localized and low-risk; low evolvability means changes cascade across the system.

## Observable

| Field | Value |
|-------|-------|
| **Instrument/Protocol** | Change impact analysis, fitness functions |
| **Uncertainty** | ±15% (depends on change type) |
| **Validity Window** | Per-major-release |

### Measurement Protocol

1. Define representative change scenarios:
   - Add new feature
   - Modify existing behavior
   - Replace technology component
   - Scale specific functionality
2. For each scenario:
   - Count affected components
   - Assess risk of unintended effects
   - Estimate effort
3. Evaluate architecture characteristics:
   - Modularity
   - Information hiding
   - Abstraction levels
4. Classify overall evolvability level

### Instruments

| Instrument | Type | Precision | Notes |
|------------|------|-----------|-------|
| Change impact analysis | Manual | Medium | Based on hypothetical changes |
| Fitness functions | Automated | High | Executable checks |
| Coupling metrics | Automated | High | Proxy measure |
| Historical analysis | Automated | High | Past change patterns |
| ADR review | Manual | Medium | Documented decisions |

### Evolvability Dimensions

| Dimension | Description | Measure |
|-----------|-------------|---------|
| Technical | Can technology components be replaced? | Abstraction level |
| Functional | Can new features be added easily? | Modularity |
| Data | Can data structures evolve? | Schema flexibility |
| Operational | Can deployment change? | Infrastructure abstraction |
| Team | Can team structure change? | Conway alignment |

## Scale

| Field | Value |
|-------|-------|
| **Type** | Ordinal |
| **Units** | N/A (levels) |
| **Polarity** | ↑ higher is better |

### Levels

| Level | Label | Definition | Indicators |
|-------|-------|------------|------------|
| 1 | Low | Changes cascade widely | >30% components affected, high risk |
| 2 | Moderate | Some change localization | 10-30% affected, moderate risk |
| 3 | High | Changes are localized | <10% affected, low risk |

### Quantitative Indicators

| Metric | Low | Moderate | High |
|--------|-----|----------|------|
| Components affected per change | >30% | 10-30% | <10% |
| Average change lead time | >2 weeks | 1-2 weeks | <1 week |
| Change failure rate | >15% | 5-15% | <5% |
| Abstraction layers | 0-1 | 2-3 | 3+ |
| Technology lock-in | High | Moderate | Low |

## Legal Operations

| Operation | Legal? | Notes |
|-----------|--------|-------|
| Equality (=, ≠) | Yes | |
| Ordering (<, >) | Yes | High > Moderate > Low |
| Difference (+, -) | No | Ordinal |
| Ratio (×, ÷) | No | Ordinal |
| Mean | No | Use mode or median |
| Median | Yes | |
| Mode | Yes | |

## Evidence Lanes

| Lane | Type | Source |
|------|------|--------|
| Static | Automated | Coupling, modularity metrics |
| Historical | Automated | Git history, change patterns |
| Scenario | Manual | Hypothetical change analysis |

## Freshness

| Field | Value |
|-------|-------|
| **Half-life** | 3-6 months (architecture tends to degrade) |
| **Refresh Trigger** | After major changes or quarterly |
| **Missingness** | Mark as "unknown" |

## Tradition Sources

| Tradition | Term Used | Notes |
|-----------|-----------|-------|
| Evolutionary Architecture | Evolvability | Core focus |
| Clean Architecture | Framework independence | Enables evolvability |
| DDD | Bounded Context | Evolution boundary |
| Microservices | Independent deployability | Technical evolvability |

## Related Characteristics

| CHR | Relationship |
|-----|--------------|
| Coupling | Causal: low coupling enables evolvability |
| Cohesion | Causal: high cohesion localizes changes |
| Testability | Causal: good tests enable safe evolution |

## Anti-patterns

| Anti-pattern | Why Wrong | Correct Approach |
|--------------|-----------|------------------|
| Big Ball of Mud | Everything affects everything | Introduce boundaries |
| Framework lock-in | Can't change frameworks | Abstract frameworks |
| Distributed monolith | Microservices with tight coupling | True service boundaries |
| Shared database | Schema changes affect all | Database per service |
| Hardcoded config | Can't adapt without code change | Externalize configuration |

## Fitness Functions

Example automated checks for evolvability:

```python
# Structural fitness: no cycles in dependencies
def check_no_dependency_cycles():
    graph = extract_dependency_graph()
    assert not has_cycles(graph), "Dependency cycles detected"

# Modularity fitness: bounded component size
def check_component_size():
    for component in get_components():
        assert component.line_count < 10000
        assert component.class_count < 50

# Technology abstraction: no framework imports in domain
def check_domain_purity():
    domain_code = get_package("domain")
    for file in domain_code:
        assert "import flask" not in file
        assert "import sqlalchemy" not in file
```

## Examples

### Low Evolvability Example

```
System: Monolithic e-commerce
Structure: Single codebase, shared database, framework-specific code everywhere

Change: Replace payment provider
Impact:
- Modify 45 files
- Touch payment, order, subscription, refund modules
- Database schema change required
- 3 week timeline
- High risk of regression

Measured value: Low (Level 1)
Evidence: >30% codebase affected, high risk
```

### High Evolvability Example

```
System: Modular e-commerce
Structure: Domain modules, ports/adapters, abstracted infrastructure

Change: Replace payment provider
Impact:
- Modify 3 files (payment adapter, config, tests)
- One module affected
- No schema change (payment abstracted)
- 2 day timeline
- Low risk (adapter swap)

Measured value: High (Level 3)
Evidence: <5% codebase affected, low risk
```

### Evolution Scenarios

Common scenarios to test:

| Scenario | Questions to Ask |
|----------|-----------------|
| New feature | How many modules touched? New module possible? |
| Tech replacement | Is technology abstracted? Adapter pattern in use? |
| Scale part of system | Can we scale independently? Coupled to others? |
| Security update | How isolated is security logic? |
| API version | Can we support multiple versions? |

## Meta

| Field | Value |
|-------|-------|
| Created | 2026-01-26 |
| Last Updated | 2026-01-26 |
| Confidence | High |
| Review Due | 2027-01-26 |
