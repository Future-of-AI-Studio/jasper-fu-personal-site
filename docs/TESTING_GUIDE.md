# Testing Guide

> Adapted from the [Moloch Testing Guide](https://github.com/MolochVentures/moloch/blob/master/test/README.md)

---

> "Your strength as a rationalist is your ability to be more confused by fiction than by reality. If you're equally good at explaining any outcome, you have zero knowledge."
> 
> ~ Harry Potter and the Methods of Rationality

---

## Core Philosophy

Tests should be written not only to verify correctness of the target code, but to be **comprehensively reviewed by other programmers**. For mission-critical code, the quality of tests are just as important (if not more so) than the code itself, and should be written with the highest standards of **clarity and elegance**.

---

## Test Code Quality

### Tests Should Follow DRY (Don't Repeat Yourself)

The first pass of unit tests will inevitably proceed faster by copy-pasting setup and verification code from one test to the next, but these duplicated lines of code get in the way of careful independent review.

A reviewer must read *every* line of test code and must fight the urge to gloss over certain lines that look the same as in the previous test, in case there is a slight but meaningful deviation.

**After the first pass of unit tests, refactor common setup and verification into their own functions.**

Benefits:
1. Saves time for reviewers who only review those functions once
2. **Emphasizes the differences** between unit test scenarios
3. Makes tests easier to reason about

---

## Verification Functions

For each function in your codebase, create a **verification function** that checks each state transition expected from successful execution.

### Example: Verification Function

```typescript
// ✅ Good: Dedicated verification function
async function verifyBetPlacement(
  bet: Bet,
  expectedState: {
    initialBalance: number;
    betAmount: number;
    expectedBalance: number;
    expectedStatus: BetStatus;
  }
) {
  // Check balance was deducted
  expect(await getBalance(bet.userId)).toBe(expectedState.expectedBalance);
  
  // Check bet was recorded
  expect(bet.amount).toBe(expectedState.betAmount);
  expect(bet.status).toBe(expectedState.expectedStatus);
  
  // Check timestamp was set
  expect(bet.createdAt).toBeDefined();
  expect(bet.createdAt).toBeInstanceOf(Date);
}

// ✅ Good: Use in test
it('happy case - place bet', async () => {
  const bet = await placeBet(user.id, 100, 'dice');
  
  await verifyBetPlacement(bet, {
    initialBalance: 1000,
    betAmount: 100,
    expectedBalance: 900,
    expectedStatus: 'pending'
  });
});
```

```typescript
// ❌ Bad: Inline assertions scattered everywhere
it('place bet', async () => {
  const bet = await placeBet(user.id, 100, 'dice');
  expect(await getBalance(user.id)).toBe(900);
  // ... 20 lines of other code ...
  expect(bet.amount).toBe(100);
  // ... more scattered assertions ...
});
```

---

## Test Setup: DRY Helpers

### Reusable Test Factories

```typescript
// ✅ Good: Test factory with sensible defaults
const createTestUser = (overrides?: Partial<User>): User => ({
  id: 'test-user-id',
  walletAddress: '0x1234567890abcdef',
  balance: 1000,
  vipLevel: 0,
  createdAt: new Date(),
  ...overrides
});

const createTestBet = (overrides?: Partial<Bet>): Bet => ({
  id: 'test-bet-id',
  userId: 'test-user-id',
  amount: 100,
  game: 'dice',
  status: 'pending',
  ...overrides
});

// Usage in tests - only specify what's different
it('VIP user gets bonus', async () => {
  const vipUser = createTestUser({ vipLevel: 5, balance: 10000 });
  // Test focuses on VIP-specific behavior
});
```

### Snapshot & Revert Pattern (for databases)

```typescript
describe('Wallet Operations', () => {
  let transactionId: string;
  
  beforeEach(async () => {
    // Take snapshot / start transaction
    transactionId = await db.startTransaction();
    
    // Reset to known state
    await seedTestData();
  });
  
  afterEach(async () => {
    // Revert to snapshot / rollback transaction
    await db.rollbackTransaction(transactionId);
  });
  
  it('deposit increases balance', async () => {
    // Test runs in isolation
  });
});
```

---

## Trigger Every Require / Validation

Write unit tests that trigger **every** validation check:

### Reasons:
1. Make sure the function fails when it should
2. Identify obviated checks that no scenario can trigger
3. Force you to reason about every way your function can fail

### Pattern: Minimal Deviation from Happy Case

```typescript
describe('placeBet', () => {
  // Baseline happy case
  it('happy case', async () => {
    const bet = await placeBet(user.id, 100, 'dice');
    await verifyBetPlacement(bet, { /* ... */ });
  });
  
  // Change ONLY one thing from happy case
  it('require fail - insufficient balance', async () => {
    const poorUser = createTestUser({ balance: 50 });
    
    await expect(placeBet(poorUser.id, 100, 'dice'))
      .rejects.toThrow('Insufficient balance');
  });
  
  // Change ONLY one thing from happy case
  it('require fail - zero amount', async () => {
    await expect(placeBet(user.id, 0, 'dice'))
      .rejects.toThrow('Bet amount must be positive');
  });
  
  // Change ONLY one thing from happy case
  it('require fail - negative amount', async () => {
    await expect(placeBet(user.id, -100, 'dice'))
      .rejects.toThrow('Bet amount must be positive');
  });
});
```

### Unique Error Messages

Each validation should have a **unique error message** so tests can verify the function failed for the **expected reason**, not just that it failed.

```typescript
// ✅ Good: Unique, specific error messages
if (amount <= 0) throw new Error('Bet amount must be positive');
if (amount > balance) throw new Error('Insufficient balance');
if (amount > maxBet) throw new Error('Bet exceeds maximum limit');

// ❌ Bad: Generic error messages
if (amount <= 0) throw new Error('Invalid bet');
if (amount > balance) throw new Error('Invalid bet');
if (amount > maxBet) throw new Error('Invalid bet');
```

---

## Test Access Control / Modifiers

Test that access control is properly enforced:

```typescript
describe('adminFunction', () => {
  it('happy case - admin can execute', async () => {
    const result = await adminFunction({ from: adminUser });
    expect(result.success).toBe(true);
  });
  
  // Change ONLY the caller
  it('modifier - requires admin role', async () => {
    await expect(adminFunction({ from: regularUser }))
      .rejects.toThrow('Not authorized: admin role required');
  });
  
  // Change ONLY the auth status
  it('modifier - requires authentication', async () => {
    await expect(adminFunction({ from: unauthenticatedUser }))
      .rejects.toThrow('Authentication required');
  });
});
```

---

## Test Boundary Conditions

For most integer/numeric inputs, test:

| Boundary | Value | Purpose |
|----------|-------|---------|
| Zero | `0` | Edge case, often invalid |
| Minimum valid | `1` | First valid value |
| Below maximum | `MAX - 1` | Should succeed |
| At maximum | `MAX` | Should succeed or fail depending on design |
| Above maximum | `MAX + 1` | Should fail |

### Example: Boundary Tests

```typescript
const MAX_BET = 10000;

describe('placeBet - boundary conditions', () => {
  it('boundary - zero amount fails', async () => {
    await expect(placeBet(user.id, 0, 'dice'))
      .rejects.toThrow('Bet amount must be positive');
  });
  
  it('boundary - minimum amount (1) succeeds', async () => {
    const bet = await placeBet(user.id, 1, 'dice');
    expect(bet.amount).toBe(1);
  });
  
  it('boundary - one below max succeeds', async () => {
    const bet = await placeBet(user.id, MAX_BET - 1, 'dice');
    expect(bet.amount).toBe(MAX_BET - 1);
  });
  
  it('boundary - at max succeeds', async () => {
    const bet = await placeBet(user.id, MAX_BET, 'dice');
    expect(bet.amount).toBe(MAX_BET);
  });
  
  it('boundary - above max fails', async () => {
    await expect(placeBet(user.id, MAX_BET + 1, 'dice'))
      .rejects.toThrow('Bet exceeds maximum limit');
  });
});
```

---

## Test All Code Paths

**100% of code paths must be tested.**

For every conditional:
- Test each possible outcome
- Treat combinations as separate conditions

```typescript
// Code with compound conditional
if (isVip && hasBonus) {
  applyVipBonus();
} else if (isVip) {
  applyStandardVip();
} else if (hasBonus) {
  applyBonus();
} else {
  applyDefault();
}

// Tests needed: 4 (one for each path)
it('applies VIP bonus when VIP and has bonus', ...);
it('applies standard VIP when VIP without bonus', ...);
it('applies bonus when not VIP but has bonus', ...);
it('applies default when not VIP and no bonus', ...);
```

---

## Test in a Logical Progression

Tests should provide an **intuitive map of the territory**, organized to match usage flow.

### Recommended Order by Function:

1. **Happy cases** - Normal successful operations
2. **Validation failures** - Trigger each `require` / validation
3. **Access control** - Check modifiers / permissions
4. **Boundary conditions** - Edge values (0, 1, MAX-1, MAX)
5. **Edge cases** - Unusual but valid scenarios

### Recommended Order by Feature:

Follow the natural user flow:
1. Authentication
2. Wallet (deposit, balance, withdraw)
3. Betting (place bet, resolve bet)
4. Rewards (rakeback, VIP progression)
5. Complex scenarios (multi-user, concurrent operations)

---

## Test File Structure

```
tests/
├── unit/
│   ├── services/
│   │   ├── auth.service.test.ts
│   │   ├── wallet.service.test.ts
│   │   └── bet.service.test.ts
│   ├── routes/
│   │   ├── auth.routes.test.ts
│   │   └── wallet.routes.test.ts
│   └── utils/
│       └── provably-fair.test.ts
├── integration/
│   ├── user-flow.test.ts
│   └── betting-flow.test.ts
├── helpers/
│   ├── factories.ts      # Test data factories
│   ├── verification.ts   # Verification functions
│   └── setup.ts          # Test setup utilities
└── fixtures/
    └── test-data.json    # Static test data
```

---

## Quick Reference Checklist

For each function/feature, ensure you have:

- [ ] **Happy path test(s)** - Normal successful operation
- [ ] **Validation tests** - One per `require` / validation check
- [ ] **Access control tests** - Authentication & authorization
- [ ] **Boundary tests** - 0, 1, MAX-1, MAX values
- [ ] **Verification function** - Reusable state verification
- [ ] **DRY setup** - Factored common setup code
- [ ] **Unique error messages** - Each failure has distinct message
- [ ] **100% code path coverage** - Every branch tested

---

## References

- [Moloch Testing Guide](https://github.com/MolochVentures/moloch/blob/master/test/README.md) - Original source of testing philosophy
- [Jest Documentation](https://jestjs.io/docs/getting-started) - JavaScript testing framework
- [Testing Library](https://testing-library.com/) - UI testing utilities
