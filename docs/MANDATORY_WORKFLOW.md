# 🚨 MANDATORY WORKFLOW FOR ALL BUILDS

**Status:** REQUIRED - NO EXCEPTIONS  
**Applies To:** Every feature, every build, every session  
**Created:** January 26, 2026

---

## ⚡ THE ONE-PAGE WORKFLOW

### Print This. Keep It Visible. Follow It Always.

```
┌─────────────────────────────────────────────┐
│  PROMPT TO DEPLOYMENT - MANDATORY STEPS     │
└─────────────────────────────────────────────┘

1. READ RULES
   □ Open .cursorrules
   □ Review docs/QUICK_REFERENCE.md
   □ Understand requirement

2. WRITE CODE (Minimal)
   □ 1-2 files maximum
   □ One feature only
   □ Keep it simple

3. BUILD IMMEDIATELY
   □ Run: npm run build
   □ Check: ✓ Compiled successfully
   □ Fix any errors NOW

4. TEST LOCALLY
   □ Run: curl http://localhost:3000/endpoint
   □ Verify: HTTP 200
   □ Check response data

5. VERIFY SUCCESS
   □ Build passed? ✓
   □ Test passed? ✓
   □ User can test? ✓

6. COMMIT WORKING CODE
   □ Run: git add -A
   □ Run: git commit -m "feat: [specific]"
   □ Run: git push origin main

7. NEXT FEATURE
   □ Return to step 1
   □ Repeat until complete

┌─────────────────────────────────────────────┐
│  NEVER SKIP STEPS. NEVER ASSUME SUCCESS.    │
└─────────────────────────────────────────────┘
```

---

## 🎯 MANDATORY FOR EVERY SESSION

### Session Start (5 minutes)

```bash
# 1. Verify environment
cd your-project
ls .cursorrules  # Must exist

# 2. Check documentation
ls docs/  # Must have 8+ files including:
# - DEVELOPMENT_PRACTICES.md (CRITICAL)
# - TESTING_GUIDE.md (for test patterns)
# - CURSOR_BEST_PRACTICES.md (mandatory rules)

# 3. Read DEVELOPMENT_PRACTICES.md
cat docs/DEVELOPMENT_PRACTICES.md  # CRITICAL before any code

# 4. Verify build works
npm run build  # Must pass

# 5. Start dev server
npm run dev  # Must be running

# 6. Review last work
git log --oneline -5

# NOW you can start coding
```

---

## 🛑 ABSOLUTE PROHIBITIONS

### NEVER Do These (Enforced):

1. **Build 10+ files before testing**
   - Penalty: Hours of debugging
   - Solution: 1-2 files → build → test

2. **Say "should work" without testing**
   - Penalty: User finds bugs
   - Solution: Test, then confirm

3. **Skip `npm run build`**
   - Penalty: Runtime errors in production
   - Solution: Build after EVERY change

4. **Commit broken code**
   - Penalty: Broken main branch
   - Solution: Test before commit

5. **Deploy without verification**
   - Penalty: Production downtime
   - Solution: Test locally first

---

## ✅ REQUIRED RESPONSES

### When User Asks "Is it done?"

```
❌ WRONG ANSWER:
"Yes, it should work now!"

✅ CORRECT ANSWER:
"Yes, verified working:
- Build: ✓ Passed
- Test: ✓ HTTP 200
- Endpoint: http://localhost:3000/feature
- Ready for you to test!"
```

---

## 📋 FEATURE DEVELOPMENT TEMPLATE

### Copy This for Every Feature:

```markdown
## Feature: [Name]

### 1. Planning (2 min)
- [ ] Read requirement
- [ ] Identify files to change (1-2 max)
- [ ] Check existing code
- [ ] Plan tests (Happy, Validation, Access, Boundary)

### 2. Write Tests FIRST (5 min) - Per TESTING_GUIDE.md
- [ ] Create verification function
- [ ] Write happy path test
- [ ] Write validation tests (one per check)
- [ ] Write access control tests
- [ ] Write boundary tests (0, 1, MAX-1, MAX)

### 3. Implementation (10 min)
- [ ] Write minimal code to pass tests
- [ ] Add types
- [ ] Add error handling with unique messages

### 4. Testing (3 min)
- [ ] Run: npm test (all tests pass)
- [ ] Run: npm run build (✓ or fix errors)
- [ ] Run: curl test
- [ ] Result: HTTP 200

### 5. Verification (2 min)
- [ ] All tests pass? ✓
- [ ] 100% code path coverage? ✓
- [ ] Feature works? ✓
- [ ] No errors? ✓

### 6. Commit (1 min)
- [ ] git commit -m "feat: [specific]"
- [ ] git push origin main

Total Time: ~23 minutes per feature (with TDD)
Success Rate: 100% when followed
Test Coverage: 100%
```

---

## 🔥 WHEN THINGS GO WRONG

### Emergency Protocol:

```bash
# Step 1: DON'T PANIC
# Step 2: Read the error
# Step 3: Check docs/TROUBLESHOOTING.md

# Step 4: Nuclear option if needed
rm -rf node_modules .next
npm install
npx prisma generate
npm run build

# Step 5: Test again
curl http://localhost:3000/endpoint

# Step 6: Document the fix
echo "## Issue: [description]\n Solution: [fix]" >> docs/TROUBLESHOOTING.md
```

---

## 📊 SUCCESS METRICS

### Track These Every Session:

| Metric | Target | Your Score |
|--------|--------|------------|
| Build Success Rate | 100% | __% |
| Features Working First Try | 95%+ | __% |
| Time to Deploy Feature | <20 min | __ min |
| User-Reported Bugs | 0 | __ |
| Commits With Working Code | 100% | __% |

---

## 🎓 CERTIFICATION

### You're Certified When:

- [ ] Can recite TDD workflow from memory
- [ ] Build after EVERY change automatically
- [ ] Never say "should work" without testing
- [ ] All commits are working code
- [ ] Users never find bugs you missed
- [ ] Development feels smooth and fast
- [ ] Confidence is high

---

## 🚀 RAPID DEPLOYMENT CHECKLIST

### From Prompt to Live in 20 Minutes:

```
Minute 0-2: Understand requirement
Minute 2-10: Write minimal code
Minute 10-13: Build and fix errors
Minute 13-15: Test locally (curl)
Minute 15-17: Commit working code
Minute 17-20: Deploy and verify

Result: Working feature, tested and live
```

---

## 🏆 PROVEN SUCCESS PATTERN

### This Pattern Achieved:

- ✅ 11/11 builds passing
- ✅ 0 runtime errors
- ✅ 8 working features
- ✅ 2 hours to full deployment
- ✅ 100% user satisfaction

### By Following:

1. Build after every change
2. Test before declaring success  
3. Verify with real requests
4. Commit only working code
5. Repeat consistently

---

## 📞 QUICK HELP

### Most Common Issues:

1. **Build fails** → Read error, fix immediately
2. **Test fails** → Check endpoint, verify request
3. **Deploy fails** → Test locally first
4. **User reports bug** → You skipped testing
5. **Nothing works** → You changed too much at once

### Solution to All:

**Follow this mandatory workflow. No exceptions.**

---

## 🔒 ENFORCEMENT

### This Workflow Is:

- ✅ **Required** for all development
- ✅ **Enforced** in all sessions
- ✅ **Proven** with 100% success
- ✅ **Non-negotiable**

### Failure to Follow Results In:

- ❌ Wasted time
- ❌ Broken code
- ❌ Frustrated users
- ❌ Lost credibility

---

## 🎯 FINAL REMINDER

```
┌──────────────────────────────────────────┐
│                                          │
│  BUILD → TEST → VERIFY → COMMIT         │
│                                          │
│  Not a suggestion. The only way.        │
│                                          │
└──────────────────────────────────────────┘
```

---

## 📝 ACKNOWLEDGMENT

By continuing development, you acknowledge:

- ✅ I have read this workflow
- ✅ I understand the requirements
- ✅ I will follow all steps
- ✅ I will not skip verification
- ✅ I will build after every change
- ✅ I will test before claiming success
- ✅ I commit to quality code

**Sign (mentally) and proceed.**

---

**Version:** 1.0  
**Status:** MANDATORY & ACTIVE  
**Last Updated:** January 26, 2026  
**Next Review:** Every session

---

*Print this page. Keep it visible. Follow it religiously.*
