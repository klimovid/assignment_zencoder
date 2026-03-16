# CHR Card: Cohesion

## Identity

| Field | Value |
|-------|-------|
| **UTS.id** | `arch.cohesion` |
| **Name** | Cohesion |
| **Context** | Internal module structure |
| **ReferencePlane** | Code organization, responsibility distribution |

## Definition

The degree to which elements within a module belong together. Cohesion measures how focused a module is on a single purpose or concept.

High cohesion means elements work together on a unified purpose; low cohesion means elements are grouped arbitrarily or serve unrelated purposes.

## Observable

| Field | Value |
|-------|-------|
| **Instrument/Protocol** | Code structure analysis, semantic review |
| **Uncertainty** | ±10% (semantic judgment involved) |
| **Validity Window** | Per-release snapshot |

### Measurement Protocol

1. Identify module boundaries (package, class, service)
2. List all elements (functions, classes, data)
3. For each element:
   - What concept does it relate to?
   - What responsibility does it fulfill?
4. Check for single unifying purpose
5. Identify unrelated elements
6. Classify overall cohesion level

### Instruments

| Instrument | Type | Precision | Notes |
|------------|------|-----------|-------|
| LCOM metric | Automated | Medium | Lack of Cohesion of Methods |
| Naming analysis | Semi-auto | Medium | Check term consistency |
| Manual review | Manual | High | Expert judgment required |
| SonarQube | Automated | Medium | Uses LCOM variants |

### Cohesion Types (Weak to Strong)

| Type | Description | Desirability |
|------|-------------|--------------|
| Coincidental | No meaningful relationship | Worst |
| Logical | Related by type, not function | Poor |
| Temporal | Related by timing | Poor |
| Procedural | Related by execution order | Moderate |
| Communicational | Operate on same data | Good |
| Sequential | Output of one feeds another | Good |
| Functional | Single well-defined task | Best |

## Scale

| Field | Value |
|-------|-------|
| **Type** | Ordinal |
| **Units** | N/A (levels) |
| **Polarity** | ↑ higher is better |

### Levels

| Level | Label | Definition | Indicators |
|-------|-------|------------|------------|
| 1 | Low | Unrelated elements grouped | Mixed concerns, utility classes, "Manager" |
| 2 | Moderate | Partially related elements | Some shared concept, some outliers |
| 3 | High | Single focused purpose | All elements serve one concept |

### Qualitative Indicators

| Indicator | Low Cohesion | High Cohesion |
|-----------|--------------|---------------|
| Naming | Generic (Utils, Manager, Helper) | Specific (OrderProcessor, UserAuth) |
| Responsibility | Multiple unrelated | Single focused |
| Data usage | Elements use different data | Elements share data |
| Change reason | Multiple reasons to change | Single reason to change (SRP) |
| Testability | Hard to test in isolation | Easy to test in isolation |

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
| Static | Automated | LCOM metrics |
| Naming | Semi-auto | Term extraction |
| Semantic | Expert | Review responsibility |

## Freshness

| Field | Value |
|-------|-------|
| **Half-life** | 2-3 releases (cohesion tends to degrade) |
| **Refresh Trigger** | After module expansion |
| **Missingness** | Mark as "unknown" |

## Tradition Sources

| Tradition | Term Used | Notes |
|-----------|-----------|-------|
| Clean Architecture | Single Responsibility | Related principle |
| DDD | Aggregate cohesion | At domain level |
| Structured Design | Cohesion | Original source (Myers, 1975) |
| SOLID | SRP | Cohesion principle |

## Related Characteristics

| CHR | Relationship |
|-----|--------------|
| Coupling | Inverse: high cohesion often reduces coupling |
| Testability | Causal: high cohesion simplifies testing |
| Evolvability | Causal: high cohesion localizes changes |

## Anti-patterns

| Anti-pattern | Why Wrong | Correct Approach |
|--------------|-----------|------------------|
| God class | Too many responsibilities | Split by domain concept |
| Utility class | Coincidental grouping | Move to appropriate modules |
| Feature envy | Logic in wrong place | Move to cohesive home |
| Data class | No behavior with data | Add relevant behavior |
| Manager/Helper class | Vague responsibility | Name by domain function |

## Examples

### Low Cohesion Example

```python
# UserUtils - mixed responsibilities
class UserUtils:
    def validate_email(self, email): ...      # Validation
    def hash_password(self, password): ...    # Security
    def format_address(self, user): ...       # Display
    def calculate_age(self, birthdate): ...   # Date logic
    def send_welcome_email(self, user): ...   # Notification
```

- Measured value: Low (Level 1)
- Evidence: 5 unrelated responsibilities, "Utils" name

### High Cohesion Example

```python
# UserAuthentication - focused responsibility
class UserAuthentication:
    def __init__(self, user_repository, password_hasher):
        self.users = user_repository
        self.hasher = password_hasher
    
    def authenticate(self, email, password): ...
    def verify_token(self, token): ...
    def refresh_token(self, refresh_token): ...
    def revoke_token(self, token): ...
```

- Measured value: High (Level 3)
- Evidence: Single authentication concept, focused methods

### LCOM Metric Example

LCOM (Lack of Cohesion of Methods):
- Count method pairs that share instance variables
- Subtract pairs that don't share
- Higher LCOM = lower cohesion

```
Class A:
  - Method 1 uses: {x, y}
  - Method 2 uses: {y, z}
  - Method 3 uses: {w}
  
Pairs sharing: (1,2) - 1 pair
Pairs not sharing: (1,3), (2,3) - 2 pairs
LCOM = 2 - 1 = 1 (moderate cohesion issue)
```

## Meta

| Field | Value |
|-------|-------|
| Created | 2026-01-26 |
| Last Updated | 2026-01-26 |
| Confidence | High |
| Review Due | 2027-01-26 |
