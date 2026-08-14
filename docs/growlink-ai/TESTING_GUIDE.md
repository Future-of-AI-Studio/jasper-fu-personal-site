# Testing Guide

> GrowLinkAI Testing Best Practices

---

## Core Philosophy

Tests should verify correctness AND be comprehensible to reviewers. For mission-critical code (auth, payments, LinkedIn integration), test quality is as important as the code itself.

---

## Test Structure

```
tests/
├── unit/
│   ├── services/          # Service layer tests
│   ├── utils/             # Utility function tests
│   └── components/        # Component unit tests
├── integration/
│   ├── api/               # API endpoint tests
│   └── flows/             # Multi-step flow tests
├── e2e/                   # End-to-end tests
└── helpers/
    ├── factories.ts       # Test data factories
    ├── verification.ts    # State verification functions
    └── mocks.ts           # Mock implementations
```

---

## Verification Functions

Create verification functions for each service:

```typescript
// Good: Dedicated verification function
async function verifySubscription(
  subscription: Subscription,
  expected: {
    tier: SubscriptionTier;
    status: SubscriptionStatus;
    userId: string;
  }
) {
  expect(subscription.tier).toBe(expected.tier);
  expect(subscription.status).toBe(expected.status);
  expect(subscription.userId).toBe(expected.userId);
  expect(subscription.currentPeriodEnd).toBeInstanceOf(Date);
}
```

---

## Test Factories

```typescript
// tests/helpers/factories.ts
export const createTestUser = (overrides?: Partial<User>): User => ({
  id: 'test-user-id',
  email: 'test@example.com',
  name: 'Test User',
  subscriptionTier: 'FREE',
  createdAt: new Date(),
  ...overrides
});

export const createTestPost = (overrides?: Partial<ContentPost>): ContentPost => ({
  id: 'test-post-id',
  userId: 'test-user-id',
  content: 'Test content',
  contentType: 'TEXT',
  status: 'DRAFT',
  ...overrides
});
```

---

## Test Categories

### 1. Happy Path Tests
```typescript
it('creates post successfully', async () => {
  const post = await createPost(user.id, { content: 'Hello LinkedIn!' });
  await verifyPost(post, { userId: user.id, status: 'DRAFT' });
});
```

### 2. Validation Tests
```typescript
it('rejects empty content', async () => {
  await expect(createPost(user.id, { content: '' }))
    .rejects.toThrow('Content cannot be empty');
});
```

### 3. Access Control Tests
```typescript
it('requires authentication', async () => {
  await expect(createPost(null, { content: 'Test' }))
    .rejects.toThrow('Authentication required');
});
```

### 4. Boundary Tests
```typescript
describe('post limits', () => {
  it('allows post at limit', async () => {
    const freeUser = createTestUser({ tier: 'FREE', postCount: 4 });
    await expect(createPost(freeUser.id, { content: 'Test' })).resolves.toBeDefined();
  });
  
  it('rejects post over limit', async () => {
    const freeUser = createTestUser({ tier: 'FREE', postCount: 5 });
    await expect(createPost(freeUser.id, { content: 'Test' }))
      .rejects.toThrow('Monthly post limit reached');
  });
});
```

---

## Running Tests

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run specific file
npm test -- auth.service.test.ts

# Watch mode
npm run test:watch
```

---

## Coverage Requirements

| Category | Minimum Coverage |
|----------|-----------------|
| Services | 90% |
| API Routes | 85% |
| Utilities | 95% |
| Components | 80% |

---

## Quick Checklist

For each function/feature:
- [ ] Happy path test(s)
- [ ] Validation tests (one per check)
- [ ] Access control tests
- [ ] Boundary tests (0, 1, MAX-1, MAX)
- [ ] Verification function created
- [ ] DRY setup with factories
