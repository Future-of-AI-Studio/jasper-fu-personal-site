# Development Best Practices (CRITICAL)

> This file MUST be referenced before writing any code.
> All code changes MUST adhere to these practices.

---

## 1. Feature Branches

**ALWAYS** create a feature branch before making changes:

```bash
# Create and switch to feature branch
git checkout -b feature/<name>

# Examples:
git checkout -b feature/linkedin-integration
git checkout -b feature/chat-system
git checkout -b fix/auth-token-refresh

# When complete, merge to main
git checkout main && git merge feature/<name>

# Delete feature branch after merge
git branch -d feature/<name>
```

### Branch Naming Conventions:
- `feature/<name>` - New features
- `fix/<name>` - Bug fixes
- `refactor/<name>` - Code refactoring
- `docs/<name>` - Documentation updates
- `test/<name>` - Test additions/improvements

---

## 2. Task Tracking

### Before Starting Work:
1. Check `tasks.md` for current priorities
2. Mark your task as "in progress"
3. Note the start time

### After Completing Work:
1. Move task to `done.md` with:
   - Completion date
   - Git commit hash(es)
   - Brief summary of changes
   - Any notes for future reference

---

## 3. Test-Driven Development (TDD)

**Write tests BEFORE or alongside implementation.**

### Every Feature/Function Needs:

#### Happy Path Tests
- Normal operation with valid inputs
- Expected successful outcomes

#### Error/Validation Tests
- One test per validation check
- Invalid input handling
- Edge case error scenarios

#### Access Control Tests
- Unauthorized access attempts
- Role-based permission verification
- Authentication requirements

#### Boundary Condition Tests
- Zero values (0)
- Minimum values (1)
- Maximum values (MAX-1, MAX)
- Empty arrays/strings

---

## 4. Comprehensive Unit Tests

### Use Verification Functions
```typescript
// Good: Dedicated verification function
function verifyUserState(user: User, expected: ExpectedState) {
  expect(user.email).toBe(expected.email);
  expect(user.subscriptionTier).toBe(expected.tier);
  expect(user.linkedinConnected).toBe(expected.linkedinConnected);
}
```

### DRY Testing
```typescript
// Good: Reusable test helpers
const createTestUser = (overrides?: Partial<User>) => ({
  id: 'test-id',
  email: 'test@example.com',
  subscriptionTier: 'FREE',
  ...overrides
});
```

### Test Ordering
1. Happy path tests
2. Error/validation tests
3. Access control tests
4. Boundary condition tests
5. Edge case tests

---

## 5. Commit Frequently

### Commit Message Format:
```
<type>(<scope>): <description>

[optional body]
```

### Types:
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation
- `style` - Formatting
- `refactor` - Code restructuring
- `test` - Adding tests
- `chore` - Maintenance tasks

### Examples:
```bash
git commit -m "feat(auth): add LinkedIn OAuth integration"
git commit -m "fix(chat): correct message streaming timeout"
git commit -m "test(subscription): add boundary tests for tier limits"
```

---

## Quick Reference Checklist

Before starting work:
- [ ] Created feature branch?
- [ ] Updated tasks.md?

During work:
- [ ] Writing tests alongside code?
- [ ] Committing frequently?
- [ ] Following naming conventions?

Before finishing:
- [ ] All tests pass?
- [ ] No linting errors?
- [ ] Committed all changes?
- [ ] Updated done.md?
- [ ] Merged to main (if complete)?

---

## Related Documents

- [TESTING_GUIDE.md](./TESTING_GUIDE.md) - Detailed testing strategies
- [tasks.md](../tasks.md) - Current task list
- [done.md](../done.md) - Completed tasks history
