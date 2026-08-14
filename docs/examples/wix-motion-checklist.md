# Moloch Feature Checklist — Wix-Inspired Motion System

**Paths / functions touched:**

- Scroll-reveal observer helpers
- Homepage motion-enabled composition
- Reduced-motion fallbacks

## Required tests

- [x] **Happy path** — Reveal observes elements and marks them visible
- [x] **Validation failures** — Invalid thresholds / missing elements fail specifically
- [x] **Access control** — N/A: presentation-only motion with no auth surface
- [x] **Boundary conditions** — threshold 0, 1, and out-of-range values
- [x] **Verification function** — Shared reveal-state verification helper
- [x] **DRY setup** — Shared observer/options factories
- [x] **Unique error messages** — Distinct asserted failure messages
- [x] **100% path coverage** — Every touched logic branch exercised

## Evidence

- Test command: `npm run test:coverage` — 43 files and 349 tests passed; 100% statements/branches/functions/lines
- Build command: `npm run build` — Next.js production build passed
- Runtime verify: 6 Playwright checks passed; homepage review server restarted for visual motion confirmation
