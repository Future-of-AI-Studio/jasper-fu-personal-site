# Quick Reference Guide
## Essential Commands and Patterns

**Keep this open while developing**

---

## 🚀 Essential Commands

### Development
```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Run tests
npm test

# Watch tests
npm run test:watch
```

### Database
```bash
# Sync schema to database
npx prisma db push

# Generate Prisma client
npx prisma generate

# Open database GUI
npx prisma studio

# View schema
cat prisma/schema.prisma
```

### Git
```bash
# Status
git status

# Add all changes
git add -A

# Commit
git commit -m "feat: description"

# Push
git push origin main

# View recent commits
git log --oneline -10
```

### Testing
```bash
# Test if server is running
curl http://localhost:3000

# Test API endpoint
curl -X POST http://localhost:3000/api/endpoint \
  -H "Content-Type: application/json" \
  -d '{"key":"value"}'

# Check HTTP status
curl -I http://localhost:3000/page

# Test with verbose output
curl -v http://localhost:3000
```

---

## 📋 TDD Workflow (Memorize This)

```bash
# 1. Write code (1-2 files max)
# ... edit files ...

# 2. Build immediately
npm run build

# 3. Fix errors (should be 0-2)
# ... fix any issues ...

# 4. Verify it works
curl http://localhost:3000/your-route
# OR
open http://localhost:3000/your-page

# 5. Commit
git add -A
git commit -m "feat: working feature"

# 6. Next feature
# Repeat from step 1
```

---

## 🏗️ Code Templates

### API Route
```typescript
// app/api/your-route/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Your logic here

    return NextResponse.json({ data: "result" });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
```

### Page Component
```typescript
// app/your-page/page.tsx
"use client";

import { useState, useEffect } from "react";

export default function YourPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/your-endpoint");
      const json = await res.json();
      setData(json);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p className="text-black">Loading...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-black">Your Page</h1>
        {/* Your content */}
      </div>
    </div>
  );
}
```

### Prisma Model
```prisma
model YourModel {
  id        String   @id @default(cuid())
  userId    String
  data      String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

### Test File
```typescript
// tests/integration/api/feature.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { createTestUser } from '../../helpers/factories';
import { verifyResult } from '../../helpers/verification';

describe('Feature API', () => {
  describe('Happy Path', () => {
    it('works as expected', async () => {
      const user = createTestUser();
      const result = await yourFunction(user);
      await verifyResult(result, { expected: 'value' });
    });
  });

  describe('Validation', () => {
    it('rejects invalid input', async () => {
      await expect(yourFunction(invalidInput))
        .rejects.toThrow('Error message');
    });
  });

  describe('Access Control', () => {
    it('requires authentication', async () => {
      await expect(yourFunction(null))
        .rejects.toThrow('Unauthorized');
    });
  });
});
```

---

## 🎨 Common Tailwind Classes

```typescript
// Text
className="text-black"           // Black text (ALWAYS use for readability)
className="text-gray-600"        // Secondary text
className="text-sm"              // Small text
className="font-bold"            // Bold
className="font-semibold"        // Semi-bold

// Backgrounds
className="bg-white"             // White background
className="bg-gray-50"           // Light gray
className="bg-blue-600"          // Blue (buttons)
className="bg-green-50"          // Success background

// Layout
className="flex items-center"    // Flex center
className="grid grid-cols-2"     // 2 column grid
className="max-w-4xl mx-auto"    // Centered container
className="min-h-screen"         // Full height

// Spacing
className="p-4"                  // Padding all sides
className="px-6 py-3"            // Padding x and y
className="mb-4"                 // Margin bottom
className="space-y-4"            // Vertical spacing

// Borders & Shadows
className="rounded-lg"           // Rounded corners
className="shadow"               // Shadow
className="border border-gray-200" // Border

// Interactive
className="hover:bg-blue-700"    // Hover state
className="disabled:opacity-50"  // Disabled state
className="cursor-pointer"       // Pointer cursor
```

---

## 🔧 Environment Variables

```bash
# Required for all projects
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="generate-with-openssl"
NEXTAUTH_URL="http://localhost:3000"

# Optional based on features
ANTHROPIC_API_KEY="sk-ant-..."
LINKEDIN_CLIENT_ID="..."
LINKEDIN_CLIENT_SECRET="..."
OPENAI_API_KEY="sk-..."
```

### Generate NEXTAUTH_SECRET
```bash
openssl rand -base64 32
```

---

## 📊 Common Checks

### Is server running?
```bash
lsof -i :3000
# OR
curl http://localhost:3000
```

### Is database connected?
```bash
npx prisma studio
# Should open without error
```

### Are tests passing?
```bash
npm test
# All green
```

### Are there TypeScript errors?
```bash
npm run build
# Should complete without errors
```

### Is git up to date?
```bash
git status
# "nothing to commit, working tree clean"
```

---

## 🚨 Quick Fixes

### Server won't start
```bash
pkill -f "next dev"
rm -rf .next
npm run dev
```

### Database issues
```bash
npx prisma generate
npx prisma db push
```

### Build fails
```bash
rm -rf node_modules .next
npm install
npm run build
```

### Changes not showing
```bash
# Hard refresh browser: CMD+Shift+R (Mac) or CTRL+Shift+R (Windows)
```

### Git issues
```bash
git status
git add -A
git commit -m "fix: issue description"
git push origin main
```

---

## 📞 When Stuck

1. **Read error message** - Really read it
2. **Check TROUBLESHOOTING.md** - Your issue might be there
3. **Run `npm run build`** - See what TypeScript says
4. **Check browser console** - F12 → Console
5. **Check server logs** - Look at terminal output
6. **Try fresh start** - Sometimes fastest solution

---

## ✅ Success Checklist

Before considering a feature "done":

- [ ] Code written
- [ ] `npm run build` passes
- [ ] Tested with curl/browser
- [ ] No TypeScript errors
- [ ] No console errors
- [ ] Text is legible (text-black)
- [ ] Committed to git
- [ ] Actually works (verified, not assumed)

---

## 🎯 Remember

**Build → Test → Commit → Repeat**

That's it. That's the entire workflow.

Do this consistently and you'll ship quality code fast.

---

*Print this page and keep it visible while coding*
