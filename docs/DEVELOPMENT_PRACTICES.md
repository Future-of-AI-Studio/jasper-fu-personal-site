# Development Best Practices (CRITICAL)

> ⚠️ **This file MUST be referenced before writing any code.**
> All code changes MUST adhere to these practices.

---

## 1. Feature Branches

**ALWAYS** create a feature branch before making changes:

```bash
# Create and switch to feature branch
git checkout -b feature/<name>

# Examples:
git checkout -b feature/vip-dashboard
git checkout -b feature/crash-game-improvements
git checkout -b fix/wallet-balance-display

# Do your work...

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

### During Work:
- Update `tasks.md` if scope changes
- Add subtasks as discovered

### After Completing Work:
1. Move task to `done.md` with:
   - Completion date
   - Git commit hash(es)
   - Brief summary of changes
   - Any notes for future reference

### File Locations:
- `tasks.md` - Active and pending tasks
- `done.md` - Completed tasks with history

---

## 3. Test-Driven Development (TDD)

**Write tests BEFORE or alongside implementation.**

Reference: [docs/TESTING_GUIDE.md](./TESTING_GUIDE.md)

### Every Feature/Function Needs:

#### Happy Path Tests
- Normal operation with valid inputs
- Expected successful outcomes

#### Error/Validation Tests
- One test per `require!`, validation check, or error condition
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
- Null/undefined handling

---

## 4. Comprehensive Unit Tests

### Testing Philosophy (Moloch-inspired)

#### Use Verification Functions
```typescript
// ✅ Good: Dedicated verification function
function verifyUserState(user: User, expected: ExpectedState) {
  expect(user.balance).toBe(expected.balance);
  expect(user.vipLevel).toBe(expected.vipLevel);
  expect(user.lastActivity).toBeDefined();
}

// ❌ Bad: Inline assertions scattered everywhere
expect(user.balance).toBe(100);
// ... 50 lines later ...
expect(user.vipLevel).toBe(1);
```

#### DRY Testing
```typescript
// ✅ Good: Reusable test helpers
const createTestUser = (overrides?: Partial<User>) => ({
  id: 'test-id',
  balance: 1000,
  vipLevel: 0,
  ...overrides
});

// ❌ Bad: Copy-pasting setup in every test
```

#### 100% Code Path Coverage
- Every `if` branch
- Every `switch` case
- Every `catch` block
- Every early return

### Test Ordering
1. Happy path tests
2. Error/validation tests
3. Access control tests
4. Boundary condition tests
5. Edge case tests

---

## 5. Commit Frequently

### When to Commit:
- After each logical unit of work
- After tests pass
- Before switching context
- At minimum, every 30 minutes of active work

### Commit Message Format:
```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Types:
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation
- `style` - Formatting (no code change)
- `refactor` - Code restructuring
- `test` - Adding tests
- `chore` - Maintenance tasks

### Examples:
```bash
git commit -m "feat(vip): add tier advancement bonus calculation"
git commit -m "fix(wallet): correct balance display for zero amounts"
git commit -m "test(crash): add boundary tests for multiplier limits"
git commit -m "docs(api): update authentication endpoint documentation"
```

### Rules:
- ❌ Never leave work uncommitted at end of session
- ❌ Never commit broken code to main
- ✅ Commit working increments frequently
- ✅ Include tests in same commit as feature

---

## Planning Integration

When planning ANY implementation:

### 1. Identify Feature Branch
```markdown
Branch: feature/user-notifications
```

### 2. List Tests to Write
```markdown
Tests:
- [ ] Happy: User receives notification on bet win
- [ ] Happy: User receives notification on level up
- [ ] Error: Invalid notification type throws error
- [ ] Access: Unauthenticated user cannot access notifications
- [ ] Boundary: Empty notification list returns empty array
- [ ] Boundary: 1000+ notifications paginated correctly
```

### 3. Plan Task Tracking Updates
```markdown
Task Updates:
- Start: Mark "Implement notifications" as in_progress in tasks.md
- End: Move to done.md with commit hash
```

### 4. Include Commit Points
```markdown
Commit Points:
1. After notification service skeleton + tests
2. After notification storage implementation
3. After notification retrieval API
4. After WebSocket integration
5. Final cleanup and documentation
```

---

## Quick Reference Checklist

Before starting work:
- [ ] Created feature branch?
- [ ] Updated tasks.md?
- [ ] Reviewed related tests?

During work:
- [ ] Writing tests alongside code?
- [ ] Committing frequently?
- [ ] Following naming conventions?

Before finishing:
- [ ] All tests pass?
- [ ] Code reviewed for best practices?
- [ ] Committed all changes?
- [ ] Updated done.md?
- [ ] Merged to main (if complete)?

---

## Related Documents

- [TESTING_GUIDE.md](./TESTING_GUIDE.md) - Detailed testing strategies
- [tasks.md](../tasks.md) - Current task list
- [done.md](../done.md) - Completed tasks history
