# Troubleshooting Guide
## Common Issues and Solutions

**Last Updated:** January 26, 2026

---

## 🔧 Build Errors

### Error: "Cannot find module '@/...'"

**Cause:** Import path issue or file doesn't exist

**Solution:**
```bash
# 1. Check file exists
ls app/your/path/file.ts

# 2. Verify tsconfig.json paths
cat tsconfig.json | grep -A 5 "paths"

# 3. Restart TypeScript server in Cursor
# CMD+Shift+P → "TypeScript: Restart TS Server"
```

### Error: "Property 'X' does not exist on type 'Y'"

**Cause:** Missing Prisma type or outdated client

**Solution:**
```bash
# Regenerate Prisma client
npx prisma generate

# Rebuild
npm run build
```

### Error: "Module not found: Can't resolve 'X'"

**Cause:** Missing npm package

**Solution:**
```bash
# Install missing package
npm install X

# Verify it's in package.json
cat package.json | grep X

# Rebuild
npm run build
```

---

## 🗄️ Database Errors

### Error: "Table doesn't exist"

**Cause:** Prisma schema not synced to database

**Solution:**
```bash
# Sync schema to database
npx prisma db push

# Verify sync
npx prisma studio
# Check tables exist in Studio
```

### Error: "Invalid connection string"

**Cause:** DATABASE_URL missing or incorrect

**Solution:**
```bash
# Check .env file
cat .env | grep DATABASE_URL

# Test connection
npx prisma db pull
# Should connect without error
```

### Error: "Unique constraint violation"

**Cause:** Trying to create duplicate unique field

**Solution:**
```typescript
// Check before creating
const existing = await prisma.model.findUnique({
  where: { uniqueField: value }
});

if (existing) {
  // Handle duplicate
}
```

### Vercel: "Failed to create user" on signup/register

**Cause:** Registration hits `/api/auth/register` and the server returns 500 with "Failed to create user". Usually the database is unreachable or not configured on Vercel.

**Solutions:**

1. **Set DATABASE_URL on Vercel**
   - Vercel Dashboard → your project → **Settings** → **Environment Variables**
   - Add `DATABASE_URL` with your **production** PostgreSQL connection string (not localhost).
   - Scope: **Production** (and **Preview** if you test preview deployments).
   - Redeploy after changing env vars.

2. **Use a database that accepts external connections**
   - Local Postgres or a DB that only allows same-network connections will fail from Vercel.
   - Use a hosted Postgres (e.g. Vercel Postgres, Neon, Supabase, Railway) and use its **production** URL.

3. **Use a pooled connection string (recommended for serverless)**
   - Serverless functions can exhaust DB connections. Use your provider's **pooled** URL if available:
     - **Neon:** use the pooled endpoint from the dashboard (e.g. `...pooler.xxx.neon.tech`).
     - **Supabase:** use "Transaction" or "Session" pooler (e.g. port 6543).
     - **Vercel Postgres:** use the URL from the Vercel dashboard (it's pooled).
   - Set that pooled URL as `DATABASE_URL` on Vercel.

4. **Apply migrations to the production database**
   - Your production DB must have the same schema. From your machine (with production `DATABASE_URL` in `.env` or inline):
   ```bash
   npx prisma migrate deploy
   ```
   - Or if you use `db push` for this project: run it once against the production URL so tables exist.

5. **Check Vercel logs for the real error**
   - Vercel Dashboard → project → **Deployments** → latest deployment → **Functions** → open the log for a request to `/api/auth/register`.
   - Or: **Logs** tab and trigger signup again. You should see "Registration error:" and a Prisma code (e.g. P1001 = can't reach DB, P1003 = DB doesn't exist).

---

## 🔐 Authentication Errors

### Error: "Session not found" or "Unauthorized"

**Cause:** NextAuth not configured properly

**Solution:**
```bash
# 1. Check environment variables
cat .env | grep -E "(NEXTAUTH_SECRET|NEXTAUTH_URL)"

# 2. Verify auth.ts exists and is correct
cat lib/auth.ts

# 3. Check API route exists
ls app/api/auth/[...nextauth]/route.ts

# 4. Restart dev server
pkill -f "next dev"
npm run dev
```

### Error: "Callback URL mismatch"

**Cause:** NEXTAUTH_URL doesn't match actual URL

**Solution:**
```bash
# Update .env
# For local: NEXTAUTH_URL="http://localhost:3000"
# For prod: NEXTAUTH_URL="https://yourdomain.com"
```

---

## 🌐 API Errors

### Error: 404 on API route

**Cause:** Route file in wrong location or not exported

**Solution:**
```bash
# 1. Verify file structure
ls app/api/your-route/route.ts

# 2. Check exports
cat app/api/your-route/route.ts | grep "export"
# Should have: export async function GET/POST/etc

# 3. Rebuild
npm run build

# 4. Test
curl http://localhost:3000/api/your-route
```

### Error: 500 Internal Server Error

**Cause:** Unhandled exception in API route

**Solution:**
```bash
# 1. Check terminal/console for error logs
tail -f terminals/[terminal-id].txt

# 2. Add try-catch if missing
# In route.ts:
try {
  // your code
} catch (error) {
  console.error("Error:", error);
  return NextResponse.json({ error: "Message" }, { status: 500 });
}
```

### Error: CORS issues

**Cause:** Cross-origin request blocked

**Solution:**
```typescript
// Add to route.ts
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
```

---

## 🎨 UI Issues

### Issue: Text is hard to read / low contrast

**Solution:**
```typescript
// Add text-black to all text elements
<h1 className="text-black">Heading</h1>
<p className="text-black">Paragraph</p>
<input className="text-black" />
```

### Issue: Page not found (404)

**Cause:** File in wrong location or not exported

**Solution:**
```bash
# 1. Verify file path
# For /dashboard/page → app/dashboard/page.tsx
ls app/dashboard/page.tsx

# 2. Check default export
cat app/dashboard/page.tsx | grep "export default"

# 3. Rebuild
npm run build
```

### Issue: Component not updating

**Cause:** Missing "use client" directive

**Solution:**
```typescript
// Add at top of file for client components
"use client";

import { useState } from "react";
// ... rest of component
```

---

## 🚀 Deployment Issues

### Issue: "Site can't be reached" on localhost

**Cause:** Dev server not running

**Solution:**
```bash
# 1. Check if server running
lsof -i :3000

# 2. If not running, start it
npm run dev

# 3. Wait for "Ready" message
# ✓ Ready in XXXms

# 4. Test
curl http://localhost:3000
```

### Issue: Changes not reflecting in browser

**Cause:** Browser cache or hot reload failed

**Solution:**
```bash
# 1. Hard refresh browser
# Mac: CMD+Shift+R
# Windows: CTRL+Shift+R

# 2. Or restart dev server
pkill -f "next dev"
npm run dev

# 3. Clear Next.js cache
rm -rf .next
npm run dev
```

### Issue: Build succeeds but runtime error

**Cause:** Environment variable or external API issue

**Solution:**
```bash
# 1. Check all required env vars
cat .env

# 2. Test external APIs
curl -I https://external-api.com

# 3. Check console for errors
# Open browser DevTools → Console
```

---

## 🧪 Test Issues

### Error: "expect is not defined"

**Cause:** Test file not properly configured

**Solution:**
```typescript
// Add to test file
import { describe, it, expect, beforeEach } from 'vitest';
```

### Error: "Cannot find module in tests"

**Cause:** Tests excluded from TypeScript

**Solution:**
```bash
# Check tsconfig.json
cat tsconfig.json | grep exclude
# Should NOT exclude tests folder for test runs

# Create separate tsconfig.test.json if needed
```

---

## 🔌 External API Issues

### Issue: Anthropic API not working

**Cause:** Model name incorrect or API key invalid

**Solution:**
```bash
# 1. Verify API key in .env
cat .env | grep ANTHROPIC_API_KEY

# 2. Check model availability
# Use fallback models in code:
const models = [
  "claude-3-haiku-20240307",
  "claude-3-sonnet-20240229"
];

# 3. Test with curl
curl https://api.anthropic.com/v1/messages \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "content-type: application/json" \
  -d '{"model":"claude-3-haiku-20240307","max_tokens":10,"messages":[{"role":"user","content":"test"}]}'
```

### Issue: LinkedIn OAuth not working

**Cause:** Missing credentials or callback URL mismatch

**Solution:**
```bash
# 1. Check LinkedIn Developer Console
# - Verify Client ID and Secret
# - Check callback URL matches exactly

# 2. Update .env
LINKEDIN_CLIENT_ID="your-client-id"
LINKEDIN_CLIENT_SECRET="your-client-secret"

# 3. Ensure callback URL in LinkedIn app settings matches:
# http://localhost:3000/api/linkedin/callback (local)
# https://yourdomain.com/api/linkedin/callback (prod)
```

---

## 🐛 Common Patterns

### Pattern: "Works locally, fails in production"

**Checklist:**
- [ ] All environment variables set in production
- [ ] Database accessible from production
- [ ] External APIs whitelisted production domain
- [ ] Build completed successfully
- [ ] No hardcoded localhost URLs

### Pattern: "Build passes but page is blank"

**Checklist:**
- [ ] Check browser console for errors
- [ ] Verify all imports are correct
- [ ] Check if using client hooks in server component
- [ ] Verify "use client" directive where needed
- [ ] Check if data fetching has try-catch

### Pattern: "Intermittent failures"

**Checklist:**
- [ ] Add retry logic for external APIs
- [ ] Check for race conditions
- [ ] Verify database connection pooling
- [ ] Add error boundaries in React
- [ ] Log errors to identify pattern

---

## 🚨 Emergency Procedures

### If Everything is Broken

```bash
# Nuclear option - fresh start
# 1. Save your work
git commit -am "WIP: before reset"

# 2. Clean everything
rm -rf node_modules .next
npm install
npx prisma generate

# 3. Rebuild from scratch
npm run build

# 4. Test
npm run dev
```

### If Git is Broken

```bash
# Check what's actually committed
git log --oneline -10
git ls-files | grep "your-file"

# If file not in git
git add path/to/file
git commit -m "fix: add missing file"
git push origin main
```

### If Database is Broken

```bash
# Reset database (WARNING: deletes data)
npx prisma migrate reset

# Or push current schema
npx prisma db push

# Verify
npx prisma studio
```

---

## 📞 Getting Help

### Before Asking for Help

1. **Read the error message** - It often tells you exactly what's wrong
2. **Check this troubleshooting guide** - Your issue might be here
3. **Search the error online** - Many issues are common
4. **Try the nuclear option** - Sometimes starting fresh is fastest

### When Asking for Help

Include:
1. **Exact error message** - Copy/paste, don't paraphrase
2. **What you were trying to do** - Context matters
3. **What you've already tried** - Save time
4. **Relevant code snippets** - Help others help you
5. **Environment details** - OS, Node version, etc.

---

## 📚 Additional Resources

- **Next.js Docs:** https://nextjs.org/docs
- **Prisma Docs:** https://www.prisma.io/docs
- **NextAuth Docs:** https://next-auth.js.org
- **Anthropic Docs:** https://docs.anthropic.com
- **Stack Overflow:** https://stackoverflow.com/questions/tagged/next.js

---

**Remember:** Most issues are simple and can be fixed in <5 minutes if you follow TDD practices. Don't panic, read the error, fix incrementally.
