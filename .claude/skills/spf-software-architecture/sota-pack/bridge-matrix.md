# Bridge Matrix: Software Architecture Traditions

Cross-tradition concept mapping.

## Overview

| Tradition Pair | Alignment Level | Key Shared | Key Conflicts |
|----------------|-----------------|------------|---------------|
| DDD ↔ Clean | High | Layering, domain isolation | Terminology, scope |
| DDD ↔ Evolutionary | Medium | Modularity, boundaries | Focus (model vs change) |
| Clean ↔ Evolutionary | High | Low coupling, testability | Static vs dynamic view |

## Detailed Bridges

### Bridge: DDD ↔ Clean Architecture

**Overall Alignment:** High

#### Concept Mappings

| Concept in DDD | Concept in Clean | CL | Translation Loss |
|----------------|------------------|-----|------------------|
| Domain Layer | Entities | 4 | None |
| Application Service | Use Case | 3 | Slight scope difference |
| Infrastructure | Frameworks & Drivers | 3 | DDD broader |
| Repository Interface | Gateway | 4 | Same intent |
| Anti-Corruption Layer | Adapter | 4 | Same pattern |
| Bounded Context | Component | 2 | DDD: semantic, Clean: structural |
| Ubiquitous Language | ∅ | 0 | Not in Clean |
| Context Map | ∅ | 0 | Not in Clean |

#### Shared Operators

| Operator | In DDD | In Clean | Differences |
|----------|--------|----------|-------------|
| Layer separation | Tactical patterns | Concentric circles | Visual representation |
| Dependency direction | Toward domain | Toward center | Same rule |
| Interface abstraction | Repository | Gateway | Same pattern |

#### Fundamental Agreements

- Domain logic should be isolated from infrastructure
- Dependencies should point toward business rules
- Interfaces abstract external concerns

#### Fundamental Disagreements

| Topic | DDD Position | Clean Position | Reconcilable? |
|-------|--------------|----------------|---------------|
| Primary concern | Domain complexity | Dependency management | Yes (complementary) |
| Scope | Enterprise patterns | Single application | Yes (different levels) |

---

### Bridge: DDD ↔ Evolutionary Architecture

**Overall Alignment:** Medium

#### Concept Mappings

| Concept in DDD | Concept in Evolutionary | CL | Translation Loss |
|----------------|-------------------------|-----|------------------|
| Bounded Context | Architecture Quantum | 3 | EA adds deployment aspect |
| Context Mapping | Connascence analysis | 2 | Different frameworks |
| Strategic Design | Fitness functions | 1 | Different goals |
| Core Domain | ∅ | 0 | Not in EA |
| Ubiquitous Language | ∅ | 0 | Not in EA |

#### Shared Operators

| Operator | In DDD | In Evolutionary | Differences |
|----------|--------|-----------------|-------------|
| Boundary identification | Context Discovery | Quantum Analysis | Focus differs |
| Integration design | Context Mapping | Connascence Assessment | Framework differs |

#### Fundamental Agreements

- Modularity is essential
- Boundaries should be explicit
- Independent evolution is valuable

#### Fundamental Disagreements

| Topic | DDD Position | Evolutionary Position | Reconcilable? |
|-------|--------------|----------------------|---------------|
| Primary concern | Domain model fidelity | Change readiness | Yes (complementary) |
| Measurement | Expert judgment | Automated fitness | Yes (both useful) |

---

### Bridge: Clean Architecture ↔ Evolutionary Architecture

**Overall Alignment:** High

#### Concept Mappings

| Concept in Clean | Concept in Evolutionary | CL | Translation Loss |
|------------------|-------------------------|-----|------------------|
| Low coupling | Evolvability | 3 | EA broader view |
| Testability | Fitness function | 3 | EA more general |
| Dependency Rule | Structural fitness | 4 | Can be same check |
| Component | Quantum | 2 | EA adds deployment |
| Framework independence | Sacrificial architecture | 3 | Similar intent |

#### Shared Operators

| Operator | In Clean | In Evolutionary | Differences |
|----------|----------|-----------------|-------------|
| Dependency analysis | Dependency Check | Fitness Function | EA automated |
| Component health | Stability metric | Quantum assessment | Scope differs |

#### Fundamental Agreements

- Low coupling enables change
- Architecture should be testable
- External dependencies should be managed

#### Fundamental Disagreements

| Topic | Clean Position | Evolutionary Position | Reconcilable? |
|-------|----------------|----------------------|---------------|
| View | Static structure | Dynamic evolution | Yes (both needed) |
| Metrics | Component metrics | System fitness | Yes (different levels) |

---

## Cross-Tradition Concept Index

| Concept | DDD | Clean | Evolutionary | Notes |
|---------|-----|-------|--------------|-------|
| Modularity | Bounded Context | Component | Quantum | All three value it |
| Coupling | Context relationships | Dependencies | Connascence | Different frameworks |
| Cohesion | Aggregate | Layer | Quantum cohesion | Similar intent |
| Testability | (implicit) | Core principle | Fitness function | Clean/EA explicit |
| Evolution | Strategic design | Framework independence | Core focus | EA most explicit |
| Measurement | Expert judgment | Metrics (I, A, D) | Fitness functions | Different approaches |

## Translation Guidelines

### Safe Translations (CL ≥ 3)

| From | To | Concept |
|------|----|---------|
| DDD | Clean | Domain Layer → Entities |
| DDD | Clean | Repository → Gateway |
| Clean | EA | Testability → Fitness function |
| Clean | EA | Dependency Rule → Structural fitness |

### Risky Translations (CL ≤ 2)

| From | To | Concept | Risk |
|------|----|---------|------|
| DDD | Clean | Bounded Context → Component | May lose semantic richness |
| DDD | EA | Strategic Design → Fitness | Different concerns |
| Clean | EA | Component → Quantum | Miss deployment aspect |

### Untranslatable Concepts (CL = 0)

| Tradition | Concept | Why Untranslatable |
|-----------|---------|-------------------|
| DDD | Ubiquitous Language | Not addressed by others |
| DDD | Context Map | DDD-specific framework |
| DDD | Core Domain | Strategic, not structural |
| EA | Sacrificial Architecture | Mindset, not structure |
| EA | Last Responsible Moment | Decision timing |

## Conflict Resolution

When traditions conflict:

| Conflict Type | Strategy | Example |
|---------------|----------|---------|
| Terminological | Use qualified terms | "DDD.BoundedContext" vs "Clean.Component" |
| Methodological | Apply both, compare | Run DDD context discovery AND EA quantum analysis |
| Philosophical | Document, choose context | For modeling: DDD. For evolution: EA |

## Synthesis Recommendations

For comprehensive architectural evaluation:

1. **Use DDD for**: Domain modeling, service decomposition, integration patterns
2. **Use Clean for**: Internal structure, dependency management, layer organization
3. **Use Evolutionary for**: Quality attributes, automation, change readiness

Combine by:
- DDD bounded contexts as Clean components as EA quanta
- Clean dependency rule as EA structural fitness function
- DDD context mapping informs EA connascence analysis

## Meta

| Field | Value |
|-------|-------|
| Created | 2026-01-26 |
| Last Updated | 2026-01-26 |
| Confidence | High |
