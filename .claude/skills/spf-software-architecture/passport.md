# SPF Passport: Software Architecture

## Scope

### describedEntity

Software system architectures at the component and module level, including structural organization, dependency relationships, and quality attributes that enable system evolution.

### includedKinds

| Kind | Description | Example |
|------|-------------|---------|
| Component | Deployable unit of software | Microservice, library, package |
| Module | Logical grouping of code | Package, namespace, folder |
| Interface | Contract between components | API, port, protocol |
| Dependency | Relationship between components | Import, call, data flow |
| Boundary | Separation between contexts | Bounded context, layer boundary |
| Quality Attribute | Non-functional characteristic | Coupling, cohesion, testability |

### excludedKinds

| Kind | Why Excluded |
|------|--------------|
| Business requirements | Covered by requirements engineering |
| Project management | Out of technical scope |
| Infrastructure/DevOps | Separate domain (SPF-infrastructure) |
| UI/UX design | Separate domain (SPF-design) |
| Algorithm design | Lower level than architecture |
| Database schema | Covered partially, focus is on structure |

### Scope Statement

> This SPF covers **software architecture at the component/module level** for the purpose of **evaluating structural quality and enabling evolution**, but does NOT cover **business requirements, project management, or infrastructure**.

## Bounded Context

Terms with domain-specific meanings:

| Term | Definition in this SPF | NOT the same as |
|------|------------------------|-----------------|
| Component | Deployable unit with explicit interface | UI component, React component |
| Module | Logical code grouping (package/namespace) | Module pattern in JS |
| Coupling | Degree of interdependence between modules | Database coupling |
| Cohesion | Degree to which module elements belong together | Team cohesion |
| Layer | Horizontal slice of architecture | Layer in neural networks |
| Boundary | Explicit separation between contexts | Physical boundary |
| Fitness | Degree to which architecture meets goals | Biological fitness |
| Port | Abstract interface definition | Network port |
| Adapter | Implementation of port for specific tech | Design pattern adapter |

### Terminological Risks

| Term | Risk | Mitigation |
|------|------|------------|
| Service | Overloaded (web service, domain service, microservice) | Always qualify: "domain service", "application service" |
| Domain | Confusion with DNS domain | Use "business domain" or "problem domain" |
| Model | Confusion with ML models | Use "domain model" explicitly |
| Clean | Casual usage vs Clean Architecture | Capitalize when referring to tradition |
| SOLID | Often misapplied | Reference specific principle (SRP, OCP, etc.) |

## KindMap

### Systems (Real Things)

| Kind | What it IS | Evidence of Existence |
|------|------------|----------------------|
| Running system | Deployed, executing software | Process, container, logs |
| Codebase | Source code files | Repository, files on disk |
| Module | Compiled unit | JAR, DLL, package |
| Interface | Runtime contract | API calls, protocol exchanges |

### Descriptions (About Things)

| Kind | What it DESCRIBES | Source/Format |
|------|-------------------|---------------|
| Architecture diagram | System structure | Draw.io, C4, UML |
| Design document | Architectural decisions | Markdown, ADR |
| API specification | Interface contract | OpenAPI, gRPC proto |
| Context map | Integration patterns | DDD diagram |
| Fitness function | Quality criteria | Code, config |

### Model vs Reality Mapping

| Model Entity | Real-World Counterpart | Fidelity Notes |
|--------------|----------------------|----------------|
| Component box | Deployed service/process | May not match deployment exactly |
| Dependency arrow | Import/call chain | Runtime deps may differ from static |
| Layer boundary | Package structure | Enforcement varies |
| Bounded context | Team/codebase boundary | Social boundary, not just technical |

## Stakeholders

Who uses this SPF?

| Role | Uses SPF For | Key Decisions |
|------|--------------|---------------|
| Software Architect | Design evaluation | Structure, patterns, trade-offs |
| Tech Lead | Code review, standards | Module boundaries, dependencies |
| Senior Developer | Implementation guidance | Where to put code, how to integrate |
| Platform Engineer | System evolution | Service boundaries, API design |

## Traditions Covered

| Tradition | Primary Focus | Key Authors |
|-----------|--------------|-------------|
| Domain-Driven Design | Domain modeling, boundaries | Eric Evans, Vaughn Vernon |
| Clean Architecture | Dependency rules, layers | Robert C. Martin |
| Evolutionary Architecture | Fitness functions, change | Neal Ford, Rebecca Parsons |

## Evolution

| Field | Value |
|-------|-------|
| Created | 2026-01-26 |
| Last Updated | 2026-01-26 |
| Version | 1.0.0 |
| Refresh Trigger | Major tradition publication, annual review |
