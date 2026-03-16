# CHR Card: Testability

## Identity

| Field | Value |
|-------|-------|
| **UTS.id** | `arch.testability` |
| **Name** | Testability |
| **Context** | Component isolation and verification capability |
| **ReferencePlane** | Test infrastructure, dependency injection |

## Definition

The degree to which a software component can be tested in isolation and the ease with which tests can be written and maintained.

High testability means components can be tested without external dependencies; low testability means tests require complex setup, mocks, or live systems.

## Observable

| Field | Value |
|-------|-------|
| **Instrument/Protocol** | Test infrastructure analysis, isolation assessment |
| **Uncertainty** | ±10% (judgment on "ease" required) |
| **Validity Window** | Per-release snapshot |

### Measurement Protocol

1. Identify component to evaluate
2. Assess isolation capability:
   - Can dependencies be substituted?
   - Is dependency injection available?
3. Analyze external dependencies:
   - Database connections
   - Network calls
   - File system access
   - Shared state
4. Review existing test structure:
   - Mock/stub complexity
   - Test setup complexity
   - Test speed
5. Classify overall testability level

### Instruments

| Instrument | Type | Precision | Notes |
|------------|------|-----------|-------|
| Dependency analysis | Automated | High | Counts hard dependencies |
| Test coverage tools | Automated | High | Shows what's tested |
| Mock count analysis | Semi-auto | Medium | Complex mocks = low testability |
| Test execution time | Automated | High | Slow tests = low testability |
| Manual review | Manual | High | Expert assessment |

### Testability Factors

| Factor | High Testability | Low Testability |
|--------|------------------|-----------------|
| Dependencies | Injected interfaces | Hard-coded instances |
| State | Stateless or explicit | Hidden global state |
| Side effects | None or controlled | Uncontrolled I/O |
| Configuration | Explicit parameters | Environment/config files |
| Time | Clock injection | System time calls |
| Randomness | Seed injection | Uncontrolled random |

## Scale

| Field | Value |
|-------|-------|
| **Type** | Ordinal |
| **Units** | N/A (levels) |
| **Polarity** | ↑ higher is better |

### Levels

| Level | Label | Definition | Indicators |
|-------|-------|------------|------------|
| 1 | Low | Hard to test in isolation | Requires live systems, complex mocks |
| 2 | Moderate | Partial isolation possible | Some mocking needed, some hard deps |
| 3 | High | Easily tested in isolation | Pure functions, DI, no external deps |

### Quantitative Indicators

| Metric | Low | Moderate | High |
|--------|-----|----------|------|
| Hard dependencies | >5 | 2-5 | 0-1 |
| Test setup lines | >50 | 20-50 | <20 |
| Mocks per test | >5 | 2-5 | 0-2 |
| Test execution time | >1s | 100ms-1s | <100ms |
| Coverage achievable | <50% | 50-80% | >80% |

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
| Static | Automated | Dependency injection analysis |
| Test | Automated | Test coverage and speed |
| Dynamic | Runtime | Mock complexity |

## Freshness

| Field | Value |
|-------|-------|
| **Half-life** | 2 releases (testability can degrade) |
| **Refresh Trigger** | After adding new dependencies |
| **Missingness** | Mark as "unknown" |

## Tradition Sources

| Tradition | Term Used | Notes |
|-----------|-----------|-------|
| Clean Architecture | Testability | Core principle |
| TDD | Design for testability | Central concern |
| Evolutionary Architecture | Fitness function | Testability as fitness |
| SOLID | DIP | Enables testability |

## Related Characteristics

| CHR | Relationship |
|-----|--------------|
| Coupling | Causal: low coupling enables testability |
| Cohesion | Causal: high cohesion simplifies tests |
| Evolvability | Causal: good tests enable safe changes |

## Anti-patterns

| Anti-pattern | Why Wrong | Correct Approach |
|--------------|-----------|------------------|
| Singleton abuse | Can't substitute | Use DI container |
| Static methods | No polymorphism | Instance methods with DI |
| Hidden deps | Not mockable | Explicit constructor injection |
| Service locator | Runtime resolution | Constructor injection |
| God class | Too many test cases | Split by responsibility |

## Examples

### Low Testability Example

```python
# Hard dependencies, impossible to test in isolation
class OrderProcessor:
    def process(self, order_id):
        # Hard-coded database
        order = database.orders.find(order_id)
        
        # Static service call
        inventory = InventoryService.get_stock(order.item_id)
        
        # Hard-coded external call
        payment = stripe.charge(order.total)
        
        # Singleton
        EmailSender.instance().send(order.user.email, "Confirmed")
```

- Measured value: Low (Level 1)
- Evidence: 4 hard dependencies, static calls, singleton

### High Testability Example

```python
# All dependencies injected, pure logic
class OrderProcessor:
    def __init__(
        self,
        orders: OrderRepository,
        inventory: InventoryService,
        payments: PaymentGateway,
        notifications: Notifier
    ):
        self.orders = orders
        self.inventory = inventory
        self.payments = payments
        self.notifications = notifications
    
    def process(self, order_id: OrderId) -> ProcessingResult:
        order = self.orders.get(order_id)
        if not self.inventory.has_stock(order.items):
            return ProcessingResult.insufficient_stock()
        
        payment = self.payments.charge(order.total)
        if not payment.successful:
            return ProcessingResult.payment_failed()
        
        self.orders.mark_processed(order_id)
        self.notifications.notify(OrderProcessed(order))
        return ProcessingResult.success()
```

- Measured value: High (Level 3)
- Evidence: All deps via DI, testable with stubs

### Test Comparison

Low testability test:
```python
def test_process_order():
    # Requires database, Stripe, email server running
    setup_test_database()
    create_test_stripe_account()
    mock_email_server()
    # 50+ lines of setup...
```

High testability test:
```python
def test_process_order_success():
    processor = OrderProcessor(
        orders=InMemoryOrderRepository([test_order]),
        inventory=StubInventory(has_stock=True),
        payments=StubPayments(successful=True),
        notifications=SpyNotifier()
    )
    result = processor.process(test_order.id)
    assert result.is_success()
```

## Meta

| Field | Value |
|-------|-------|
| Created | 2026-01-26 |
| Last Updated | 2026-01-26 |
| Confidence | High |
| Review Due | 2027-01-26 |
