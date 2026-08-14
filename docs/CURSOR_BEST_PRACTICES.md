# Cursor Development Best Practices
## Mandatory Guidelines for All Future Development

**Version:** 1.0  
**Last Updated:** January 26, 2026  
**Status:** REQUIRED for all projects

---

## 🎯 Core Principles

### 1. Test-Driven Development (TDD) is MANDATORY
```
Build → Test → Verify → Deploy

NOT: Build Everything → Hope It Works → Debug for Hours
```

### 2. Verify Before Declaring Success
```
❌ NEVER: "The feature should work now"
✅ ALWAYS: "I've verified the feature works (HTTP 200, test passing)"
```

### 3. One Feature at a Time
```
✅ Feature A → Build → Pass → Feature B → Build → Pass
❌ Features A, B, C, D → Build → 50 errors → Debug Hell
```

---

## 📋 Required Workflow

### For Every Feature

```bash
# Step 1: Write minimal code
# (Edit 1-2 files max)

# Step 2: BUILD IMMEDIATELY
npm run build

# Step 3: Fix any errors (should be 0-2)
# Fix errors NOW, not later

# Step 4: VERIFY it works
curl -s http://localhost:3000/your-endpoint
# OR
npm test

# Step 5: Commit
git add .
git commit -m "feat: specific working feature"

# Step 6: Only then move to next feature
```

---

## ✅ DO These Things

### 1. Build After EVERY Change
```bash
# After adding a file
npm run build

# After modifying a component
npm run build

# After updating types
npm run build

# After adding dependencies
npm run build
```

### 2. Verify With Real Tests
```bash
# Don't assume - TEST
curl http://localhost:3000/api/endpoint

# Check HTTP status
curl -I http://localhost:3000/page

# Test API with data
curl -X POST http://localhost:3000/api/endpoint \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}'
```

### 3. Create Test Infrastructure First
```typescript
// FIRST: Create factories
// tests/helpers/factories.ts
export const createTestUser = (overrides) => ({
  id: 'test-id',
  email: 'test@example.com',
  ...overrides
});

// SECOND: Create verification functions
// tests/helpers/verification.ts
export async function verifyUser(user, expected) {
  expect(user.id).toBeDefined();
  expect(user.email).toBe(expected.email);
}

// THIRD: Write actual tests
// tests/integration/feature.test.ts
it('creates user successfully', async () => {
  const user = await createUser(testData);
  await verifyUser(user, expected);
});
```

### 4. Use TypeScript to Catch Errors
```typescript
// ✅ DO: Let TypeScript catch errors
interface User {
  id: string;
  email: string;
}

const user: User = await getUser(); // TypeScript verifies

// ❌ DON'T: Use 'any' everywhere
const user: any = await getUser(); // No safety
```

### 5. Commit Frequently
```bash
# ✅ DO: Small, working commits
git commit -m "feat: add user schema"
git commit -m "feat: add user API route"
git commit -m "feat: add user UI"

# ❌ DON'T: Giant commits
git commit -m "feat: everything" # 100 files changed
```

---

## ❌ DON'T Do These Things

### 1. Don't Build Everything First
```
❌ DON'T:
- Create 50 files
- Write 5000 lines
- npm run build
- Spend hours debugging

✅ DO:
- Create 2 files
- Write 50 lines
- npm run build
- Fix 0-2 errors
- Repeat
```

### 2. Don't Assume Code Works
```typescript
// ❌ DON'T
console.log("API should work now"); // Assumption

// ✅ DO
const response = await fetch("/api/endpoint");
console.log("API verified:", response.status); // Proof
```

### 3. Don't Skip Testing Locally
```
❌ DON'T: Push to prod, hope it works
✅ DO: Test locally, THEN push
```

### 4. Don't Tell User It Works Before Verification
```
❌ DON'T: "I've updated the feature, it should work"
✅ DO: "I've updated and tested the feature - HTTP 200 confirmed"
```

### 5. Don't Accumulate Errors
```
❌ DON'T: "I'll fix all errors at the end"
✅ DO: Fix errors as soon as build reports them
```

---

## 🏗️ Project Setup Checklist

### Starting a New Feature

- [ ] Read existing code for context
- [ ] Identify minimal change needed
- [ ] Create test factories if needed
- [ ] Write feature code (1-2 files)
- [ ] Run `npm run build`
- [ ] Fix any errors (should be 0-2)
- [ ] Test endpoint/component works
- [ ] Commit working code
- [ ] Move to next feature

---

## 🧪 Testing Standards

### Minimum Test Coverage (per TESTING_GUIDE.md)

| Category | Coverage |
|----------|----------|
| Services | 90% |
| API Routes | 85% |
| Utilities | 95% |
| Components | 80% |

### Required Tests Per Feature

- [ ] Happy path test
- [ ] Validation tests (one per validation)
- [ ] Access control tests
- [ ] Boundary tests (0, 1, MAX-1, MAX)
- [ ] Verification functions created
- [ ] Test factories used (DRY)

---

## 🚀 Deployment Checklist

### Before Deploying

- [ ] All builds passing locally
- [ ] All tests passing
- [ ] Verified with curl/browser
- [ ] No TypeScript errors
- [ ] No console errors
- [ ] Database migrations applied
- [ ] Environment variables set
- [ ] Dependencies installed

### After Deploying

- [ ] Verify deployment URL loads (HTTP 200)
- [ ] Test main user flows
- [ ] Check for console errors
- [ ] Verify database connection
- [ ] Test API endpoints
- [ ] Get user confirmation

---

## 🔧 Common Patterns

### Pattern 1: Adding a New API Route

```typescript
// 1. Define types
interface RequestBody {
  data: string;
}

// 2. Create route
export async function POST(request: NextRequest) {
  const body = await request.json();
  // ... implementation
  return NextResponse.json({ success: true });
}

// 3. TEST IMMEDIATELY
// Terminal: npm run build
// Terminal: curl -X POST http://localhost:3000/api/route

// 4. Only then move to UI
```

### Pattern 2: Adding a New Page

```typescript
// 1. Create minimal page
export default function Page() {
  return <div>Content</div>;
}

// 2. TEST IMMEDIATELY
// Terminal: npm run build
// Terminal: curl http://localhost:3000/page

// 3. Add features incrementally
// 4. Test after each addition
```

### Pattern 3: Adding Database Model

```prisma
// 1. Add to schema.prisma
model NewModel {
  id String @id @default(cuid())
  // ... fields
}

// 2. IMMEDIATELY sync database
// Terminal: npx prisma db push

// 3. VERIFY Prisma client generated
// Terminal: npm run build

// 4. Use in code
```

---

## 🚨 Error Handling

### When Build Fails

1. **DON'T panic or skip** - This is TDD catching errors!
2. **READ the error message** - It tells you exactly what's wrong
3. **FIX immediately** - Before moving on
4. **VERIFY fix** - Run build again
5. **LEARN** - Add to learnings doc if novel error

### When Test Fails

1. **Verify test is correct** - Is expected behavior right?
2. **Check code logic** - Does code match expected behavior?
3. **Fix code or test** - Whichever is wrong
4. **Re-run** - Verify now passing
5. **Commit** - Only when green

### When User Reports Issue

1. **Reproduce immediately** - Don't assume
2. **Verify current state** - Is it really broken?
3. **Fix with test** - Prevent regression
4. **Deploy** - Get user to verify
5. **Document** - Add to troubleshooting guide

---

## 📊 Quality Metrics

### Acceptable
- ✅ 95%+ builds passing
- ✅ <5 minutes per build failure
- ✅ All tests passing before deploy
- ✅ Zero runtime errors in production

### Unacceptable
- ❌ <80% builds passing
- ❌ >15 minutes debugging per feature
- ❌ Deploying with failing tests
- ❌ Runtime errors discovered by users

---

## 🎓 Key Reminders

### For Every Development Session

1. **TDD is not optional** - It's how we work
2. **Build after every change** - Verify constantly
3. **Test before claiming success** - Show proof
4. **Commit working code only** - No broken commits
5. **Verify before telling user** - No false positives

### For Code Reviews

1. **All tests must pass** - No exceptions
2. **Build must be clean** - No TypeScript errors
3. **Coverage must meet minimum** - Per TESTING_GUIDE.md
4. **Verification functions included** - For complex logic
5. **Factories used** - No repeated test setup

---

## 🏆 Success Criteria

### You're Doing It Right When:
- ✅ Builds pass on first try
- ✅ Features work when deployed
- ✅ Users don't find bugs
- ✅ Development feels smooth
- ✅ Confidence is high

### You're Doing It Wrong When:
- ❌ Builds fail repeatedly
- ❌ Features break in production
- ❌ Users report bugs
- ❌ Debugging takes hours
- ❌ Feeling stressed

---

## 📞 When In Doubt

### Ask These Questions:

1. **Have I built after this change?**
   - If no → Run `npm run build` NOW

2. **Have I tested this works?**
   - If no → Test with curl/browser NOW

3. **Am I changing too much at once?**
   - If yes → Reduce scope, build incrementally

4. **Do I know this will work?**
   - If no → DON'T tell user "it should work"

5. **Am I following TDD?**
   - If no → Stop, read this doc, start over

---

## 🎯 Final Word

**TDD is not about going slower.**  
**It's about going faster by being certain.**

Every minute spent testing is 10 minutes saved debugging.

**Follow these practices. Ship working code. Be proud.**

---

*"Fast is slow, but continuously, without interruption. Slow is fast, but poorly and with interruptions."* - Agile Maxim

**Mandated by:** GrowLinkAI Development Team  
**Effective:** January 26, 2026  
**Review:** Every 3 months or after major project
