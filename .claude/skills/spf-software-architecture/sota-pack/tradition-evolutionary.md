# Tradition Card: Evolutionary Architecture

## Identity

| Field | Value |
|-------|-------|
| **Name** | Evolutionary Architecture |
| **Abbreviation** | EA, Evolvable Architecture |
| **Community** | ThoughtWorks, continuous delivery practitioners |
| **Origin** | Neal Ford, Rebecca Parsons, Patrick Kua, 2017 |
| **Status** | Active, growing adoption |

## Key Texts

| Type | Citation | Relevance |
|------|----------|-----------|
| Canonical | Ford, N., Parsons, R., Kua, P. (2017). "Building Evolutionary Architectures: Support Constant Change" | Primary source |
| Canonical | Ford, N., Parsons, R., Kua, P., Sadalage, P. (2022). "Building Evolutionary Architectures, 2nd Edition" | Updated with new patterns |
| Related | Humble, J., Farley, D. (2010). "Continuous Delivery" | Foundational CD practices |
| Related | Newman, S. (2015). "Building Microservices" | Architectural style context |

## Core Concepts

### Evolutionary Architecture Definition

> **An evolutionary architecture supports guided, incremental change across multiple dimensions.**

Three key characteristics:
1. **Incremental**: Supports small, frequent changes
2. **Guided**: Changes follow architectural goals
3. **Multiple dimensions**: Technical, data, security, operational

### Fitness Functions

The central mechanism:

| Type | Description | Example |
|------|-------------|---------|
| **Atomic** | Single characteristic | "Cyclomatic complexity < 10" |
| **Holistic** | System-wide property | "Latency P99 < 200ms" |
| **Triggered** | Event-based evaluation | "On deploy, check..." |
| **Continuous** | Always monitored | "Uptime > 99.9%" |
| **Temporal** | Time-series | "Coupling trend decreasing" |

### Architecture Quantum

> The smallest deployable unit with high functional cohesion and synchronous connascence.

Properties:
- Independent deployability
- High functional cohesion
- Static/dynamic coupling contained
- Natural service boundary

### Connascence

Types of coupling (from weak to strong):

| Static | Dynamic |
|--------|---------|
| Name | Execution |
| Type | Timing |
| Meaning | Values |
| Position | Identity |
| Algorithm | |

Rule: Prefer weaker forms, reduce scope, increase locality.

## Method Family

### Core Operators

| Operator | Purpose | Inputs | Outputs |
|----------|---------|--------|---------|
| Fitness Function Design | Define measurable goals | Quality attributes | Executable tests |
| Quantum Analysis | Identify deployment units | System structure | Quantum boundaries |
| Connascence Assessment | Evaluate coupling | Module interactions | Coupling classification |
| Change Simulation | Assess evolvability | Hypothetical changes | Impact analysis |

### Characteristic Types Used

| Characteristic | How Measured | Scale |
|----------------|--------------|-------|
| Evolvability | Change impact radius | Ordinal |
| Fitness score | Automated test results | Varies |
| Quantum size | Components per quantum | Count |
| Connascence strength | Type classification | Ordinal |

### Fitness Function Categories

| Category | Examples | Measurement |
|----------|----------|-------------|
| **Structural** | Coupling, cyclomatic complexity | Static analysis |
| **Performance** | Latency, throughput | Load testing |
| **Reliability** | Availability, error rate | Monitoring |
| **Security** | Vulnerability count, compliance | Scanning |
| **Data** | Freshness, consistency | Validation |
| **Operational** | Deploy frequency, MTTR | Metrics |

## Evidence Standards

| Evidence Type | Acceptable? | Notes |
|---------------|-------------|-------|
| Formal proof | No | Not emphasis |
| Empirical study | Sometimes | Industry surveys |
| Expert opinion | Yes | ThoughtWorks experience |
| Case study | Yes | Primary evidence form |
| Automated metrics | Yes | Fitness functions as evidence |

## Trust Profile (F-G-R)

| Dimension | Value | Notes |
|-----------|-------|-------|
| **Formality (F)** | 2 | Executable fitness functions |
| **Scope (G)** | Systems requiring continuous evolution | Less relevant for stable systems |
| **Reliability (R)** | 0.7-0.8 | Growing adoption, recent tradition |

## Bridges to Other Traditions

### Aligned: Domain-Driven Design

| Evolutionary Concept | DDD Equivalent | Notes |
|----------------------|----------------|-------|
| Architecture Quantum | Bounded Context | Similar boundaries |
| Team coupling | Context teams | Organizational alignment |

### Aligned: Clean Architecture

| Evolutionary Concept | Clean Equivalent | Notes |
|----------------------|------------------|-------|
| Low coupling goal | Dependency rule | Complementary |
| Fitness functions | Testability | Automation focus |
| Incremental change | Independent layers | Enables incremental |

### Related: Continuous Delivery

| Evolutionary Concept | CD Equivalent | Notes |
|----------------------|---------------|-------|
| Incremental change | Small batches | Same principle |
| Fitness functions | Deployment pipeline | Integration point |
| Guided evolution | Automated testing | Quality gates |

## Critique

### Strengths

- Quantifiable architecture goals
- Integrates with CI/CD
- Addresses change explicitly
- Practical automation focus

### Weaknesses

- Fitness function design is hard
- Holistic fitness difficult to define
- Newer tradition, less mature
- Can overfit to measurable

### Blind Spots

- Initial architecture design (focuses on evolution)
- Non-functional requirements not easily measured
- Organizational change resistance
- Cost of fitness function maintenance

## Practical Guidance

### Last Responsible Moment

Defer architectural decisions until:
- More information available
- Cost of deferral exceeds cost of decision
- Decision is needed for progress

### Sacrificial Architecture

Build knowing you'll replace:
- Prototype quickly
- Learn from usage
- Rebuild with knowledge
- Plan for replacement

### Fitness Function Examples

```python
# Structural fitness function
def check_coupling():
    coupling = analyze_dependencies()
    assert coupling.average < THRESHOLD
    
# Performance fitness function
def check_latency():
    p99 = measure_latency()
    assert p99 < 200  # ms
    
# Security fitness function
def check_vulnerabilities():
    vulns = scan_dependencies()
    assert vulns.critical == 0
```

## Meta

| Field | Value |
|-------|-------|
| Card Created | 2026-01-26 |
| Last Updated | 2026-01-26 |
| Evidence Depth | Moderate |
| Confidence | High |
