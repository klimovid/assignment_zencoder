# SoTA Pack: Software Architecture

State-of-the-art traditions in software architecture.

## Overview

This SPF synthesizes three major architectural traditions:

| Tradition | Focus | Key Contribution |
|-----------|-------|------------------|
| [Domain-Driven Design](tradition-ddd.md) | Domain modeling | Bounded contexts, ubiquitous language |
| [Clean Architecture](tradition-clean.md) | Dependency management | Dependency rule, layers |
| [Evolutionary Architecture](tradition-evolutionary.md) | Change readiness | Fitness functions, evolvability |

## Tradition Relationships

```
       DDD                Clean              Evolutionary
        │                   │                     │
        │   Bounded         │   Dependency        │   Fitness
        │   Contexts        │   Rule              │   Functions
        │                   │                     │
        └───────┬───────────┴──────────┬──────────┘
                │                      │
                v                      v
        Context boundaries      Architecture goals
        inform layer            measured by fitness
        organization            functions
```

## When to Load Each Tradition

| Situation | Load |
|-----------|------|
| Defining service boundaries | DDD |
| Managing dependencies between modules | Clean |
| Ensuring architecture can evolve | Evolutionary |
| Evaluating overall architecture health | All three |
| Integrating with other teams/systems | DDD (context mapping) |
| Deciding where to put code | Clean (dependency rule) |
| Setting measurable architecture goals | Evolutionary |

## Shared Concepts

Concepts that appear in multiple traditions:

| Concept | DDD | Clean | Evolutionary |
|---------|-----|-------|--------------|
| Modularity | Bounded contexts | Components | Quantum |
| Isolation | Context boundaries | Layer boundaries | Fitness scope |
| Change | Strategic design | Low coupling | Evolvability |
| Contracts | Context mapping | Interfaces | Fitness functions |

## Tradition Cards

- [tradition-ddd.md](tradition-ddd.md) - Domain-Driven Design
- [tradition-clean.md](tradition-clean.md) - Clean Architecture  
- [tradition-evolutionary.md](tradition-evolutionary.md) - Evolutionary Architecture

## Cross-Tradition Mapping

See [bridge-matrix.md](bridge-matrix.md) for detailed concept translations.

## Key Sources

| Tradition | Primary Source | Year |
|-----------|---------------|------|
| DDD | "Domain-Driven Design" by Eric Evans | 2003 |
| DDD | "Implementing DDD" by Vaughn Vernon | 2013 |
| Clean | "Clean Architecture" by Robert C. Martin | 2017 |
| Evolutionary | "Building Evolutionary Architectures" by Ford, Parsons, Kua | 2017 |
