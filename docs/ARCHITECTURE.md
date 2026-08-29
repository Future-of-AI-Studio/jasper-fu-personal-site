# Architecture

Map of the Jasper Fu press site. Written 2026-08-28 against commit `1a80205`.

Verified at the time of writing: `npx vitest run` → **36 files, 518 tests, all passing** in ~20s.

---

## 1. What this app is

A **statically-rendered press and media kit site for one person** — Jasper Fu, co-founder and CEO of Coinsub. It exists so journalists, conference organisers, and partners can self-serve: read approved bios at four lengths, grab portraits and logos, see prior coverage, and open a pre-addressed email to the right inbox.

Audiences, in the order the site serves them:

| Audience | What they come for | Where |
|---|---|---|
| Journalists | Bios, headshots, boilerplate, prior coverage, a quote-safe thesis | `/about`, `/media-kit`, `/press`, `/press/media-coverage` |
| Conference organisers | Speaking topics, a booking request form | `/speaking` |
| Partners / general | Routing to the right inbox | `/contact` |
| Legal / compliance | Privacy, cookies, ToS, MSB + forward-looking disclaimers | `/privacy`, `/cookies`, `/terms`, `/legal` |
| Pre-launch reviewers | A password gate over the whole site | `/unlock` |

**There is no database, no CMS, no user accounts, and no server-side form handling.** Every word on the site is a TypeScript constant compiled into the bundle. The single piece of server state in the entire app is the password-gate session cookie.

## 2. Stack and how it runs

| | |
|---|---|
| Framework | Next.js **16.2.12**, App Router, all pages Server Components |
| UI | React **19.2.8** |
| Language | TypeScript **6.0.3** — `strict` + `noUncheckedIndexedAccess`, no path aliases (all imports relative) |
| Validation | zod **4.4.3** (4 schemas) |
| Styling | One hand-authored stylesheet, `app/globals.css` (~1,580 lines). See §7 |
| Fonts | `@fontsource` — Libre Baskerville (display), IBM Plex Sans (body), IBM Plex Mono |
| Unit tests | Vitest **4.1.10** + Testing Library, jsdom, colocated `*.test.ts(x)` |
| E2E | Playwright **1.62.1** — **currently unrunnable**, see §8 |
| Lint | ESLint 9 flat config, `eslint-config-next` core-web-vitals + typescript |

```bash
npm run dev            # next dev
npm run build          # next build
npm run lint
npm test               # vitest run
npm run test:coverage
npm run test:e2e       # playwright — broken off macOS, see §8

npx vitest run lib/gate.test.ts            # single file
npx vitest run lib/gate.test.ts -t "name"  # single test
```

**Deployment: none is checked in.** No `.github/`, no `vercel.json`, no `Dockerfile`, no CI. `.gitignore` lists `.vercel`, so Vercel is the presumed target, but nothing enforces `lint`/`test`/`build` before a deploy. This is the largest single gap in the repo.

## 3. Directory map

| Path | What belongs here |
|---|---|
| `app/` | Routes only — one `page.tsx` per URL, plus `layout.tsx`, `robots.ts`, `sitemap.ts`, `not-found.tsx`, and the lone API route `api/unlock/route.ts`. Pages compose components and call content guards; they hold no logic of their own. |
| `components/` | React components grouped by feature: `site/` (shell, brand, motion, hero), `contact/`, `speaking/`, `press/`, `gate/`, `calendar/`. Client components are the leaves; everything else is a server component. |
| `lib/` | **The content and rules layer.** All copy, URLs, emails, and data as `as const` constants, each paired with `assert*()`/`parse*()` guards. Also the gate crypto, zod schemas, and pure helpers (motion, canvas math, availability). |
| `lib/legal/` | Legal document bodies (`drafts.ts`, `terms.ts`) and the shared types + date/section guards (`published.ts`). Names are misleading — see §8. |
| `public/` | Static assets: `portraits/`, `logos/`, `press/`, `media-kit/`. |
| `e2e/` | Playwright specs. Excluded from Vitest. |
| `docs/` | This file, plus ~10 imported prose docs from an unrelated project. See §8. |
| `widgets/` | **Dead reference code** copied from another project. Imported by nothing. ESLint-ignored but *not* Vitest-ignored. |
| `.compliance/` + `.cursor/` | Cursor-era workflow enforcement: a ledger, a gate-check script, and 6 hook scripts. Hooks do not fire under Claude Code. |

## 4. The files that matter

Ordered by how much you need to understand them before changing anything.

1. **`lib/identity.ts`** — the canonical facts: name, title, `siteUrl`, thesis, five email addresses, LinkedIn/Coinsub/Calendly URLs, the colour palette, and the media-outlet logo list. Also the clearance guards (`assertLogoPublishable` refuses to render a partner logo that isn't cleared for publication). Everything else derives from this.
2. **`lib/copy.ts`** (413 lines) — every piece of marketing prose: four bio lengths, about paragraphs, pull quotes, coverage list, CTAs, speaking topics, company boilerplate. The largest content file.
3. **`app/layout.tsx`** — root metadata (title template, OpenGraph, Twitter), `Person` JSON-LD, `SiteShell` wrap, and the gate-aware `robots.index` flip.
4. **`components/site/site-shell.tsx`** — the chrome every page gets: masthead, nav, header CTA, footer, plus the `NetworkField` canvas backdrop and `MotionRoot`. Calls `parseNavigationItems`/`assertHeaderCta` **at module scope**, so a bad nav entry fails the build.
5. **`app/globals.css`** — the entire visual system. CSS custom properties in `:root`, semantic class names, no utilities.
6. **`lib/identity-css.test.ts`** (864 lines) — parses `globals.css` *as text* and asserts specific declarations. Any layout edit must update this file. It is ~15% of all test code.
7. **`proxy.ts`** — the Next 16 request interceptor (Next 16 renamed middleware → proxy; `mv middleware.ts proxy.ts` is the documented upgrade step). Redirects every gated request to `/unlock`.
8. **`lib/gate.ts`** (287 lines) — the whole auth mechanism: config resolution, bypass list, open-redirect-safe `resolveNextPath`, HMAC-SHA-256 cookie tokens.
9. **`app/api/unlock/route.ts`** — the only API route and the only server-side write in the app.
10. **`lib/contact.ts`** — inquiry taxonomy, the `inquiryType → inbox` routing table, zod schema, and `createMailto()`.
11. **`lib/speaking.ts`** — the speaking-booking model, its zod schema, and the JSON-body mailto composer.
12. **`lib/legal/published.ts`** — `LegalCopySection` types plus `assertLegalUpdated` / `assertLegalSections`, which refuse to publish `[Insert date]` or `[Counsel …]` placeholders.
13. **`app/page.tsx`** — the home page; the best worked example of the page idiom (import constant + its guard, call the guard inline while rendering).
14. **`app/public-routes.test.tsx`** — renders every page and asserts both that current copy is present *and* that retired copy is absent. The regression net for content.
15. **`.compliance/PROTOCOL.md`** — the workflow this repo is governed by (build + test with real output, 8-point test checklist, ledger gates).

## 5. Data model

There is no schema, no migrations, and no persistence. The "data model" is a set of frozen TypeScript literals in `lib/`, and the "constraints" are hand-written guard functions instead of DB constraints.

Main shapes (field names only):

```
identity          { name, title, siteUrl, thesis, lockedOneLiner, pressEmail,
                    speakingEmail, bookingEmail, partnershipEmail, linkedInUrl,
                    coinsubUrl, calendlyUrl, monogram, colors{9} }
mediaOutlets      { name, href, logo }[]
bios              { words50, words75, words150, words250 }
mediaCoverage     { outlet, title, caption, embedUrl|null, watchUrl, kind }[]
interimBlogPosts  { title, summary, href, image }[]
insightLanes      { title, summary }[]          // aliased as speakingTopics
LegalCopySection  { title, paragraphs?, bullets?, closing?, blocks? }
LegalBlock        { type:"paragraph", text } | { type:"bullets", items }
NavigationItem    { label, href:`/${string}` }
heroPortraits     { src, alt }[]
AvailabilitySlot  { startIso, endIso, dateKey }
GateConfig        { enabled:false, password:"" } | { enabled:true, password }
```

**Four zod schemas**, all client-side only except the unlock one:

| Schema | File | Validates |
|---|---|---|
| `inquirySchema` | `lib/contact.ts` | name / organization / email / inquiryType enum / notes / deadline, trimmed and length-capped |
| `speakingBookingSchema` | `lib/speaking.ts` | 11-field booking draft; `engagementType` refined against the allowed list |
| `unlockSchema` | `lib/gate.ts` | password 1–200 chars; `next` coerced through `resolveNextPath` |
| (inline email) | `lib/press-alert.ts` | a single trimmed email |

**The guard layer is the real model.** ~39 `assert*()`/`parse*()` functions encode editorial policy as code: which logos are cleared to publish, which email addresses are retired, which thesis statement is current, that the About bio must concatenate to exactly `bios.words150`, that legal sections carry no `[Insert date]`. Each rejection gets its own distinct error message, and tests assert the exact string.

## 6. Auth, config, env, external services

**Auth** is a single shared-secret gate over the whole site — pre-launch protection, not user accounts. There are no roles, sessions-per-user, or identities.

- Off by default. Setting `SITE_PASSWORD` (8–200 chars) turns it on; unset leaves the site fully public.
- The cookie `jf_gate` is `expiry.HMAC-SHA-256(expiry)` **keyed by the password itself**, so rotating `SITE_PASSWORD` invalidates every outstanding session. 7-day max age, `httpOnly`, `sameSite=lax`, `secure` in production.
- While the gate is on, `app/robots.ts` serves a blanket `Disallow: /` and `app/layout.tsx` flips metadata to `noindex, nofollow`.

**Environment variables — only one is read:**

| Var | Read at | Notes |
|---|---|---|
| `SITE_PASSWORD` | `lib/gate.ts` | Server-only. Never give it a `NEXT_PUBLIC_` prefix. |
| `NODE_ENV` | `app/api/unlock/route.ts` | Sets the cookie `secure` flag. |
| `NEXT_PUBLIC_SITE_URL` | **nowhere** | Declared in `.env.example` but unused; the canonical URL is hard-coded as `identity.siteUrl`. |

**External services: effectively none.** No analytics, no email service, no CRM, no CDN SDK, no error tracking. The only outbound references are a Calendly link, a LinkedIn link, the Coinsub site, and embedded coverage URLs — all plain anchors. Forms hand off to the visitor's own mail client.

## 7. Conventions

**Content is code, and code guards content.** The dominant idiom: define the approved value as a constant, define a guard that rejects everything else *including named retired values*, and call the guard at render time.

```ts
// lib/identity.ts
export const PUBLISHED_THESIS = "I think of blockchain like plumbing. …";
export const LEGACY_THESIS    = "Trust shouldn't be a promise. …";
export function assertThesis(value: string) { /* throws on empty, "placeholder", LEGACY_THESIS, or ≠ PUBLISHED */ }

// app/page.tsx
<p className="hero__deck">{assertThesis(identity.thesis)}</p>
```

A reverted or placeholder value therefore fails the build or the test suite instead of shipping. Guards called at *module scope* (`site-shell.tsx`, `lib/navigation.ts`, `lib/legal/drafts.ts`) fail the **whole build**, not one route.

**State management**: none, globally. No Redux/Zustand/Context, no client data fetching, no server actions. Client components are isolated leaves holding one or two `useState` atoms. Two form styles coexist: `InquiryForm` uses **uncontrolled** inputs read via `FormData`; `BookJasperForm` uses a **fully controlled** draft object.

**Styling**: semantic BEM-ish class names (`.masthead__inner`, `.hero__deck`, `.page-head--label`) against CSS custom properties. Tailwind is installed and wired into `postcss.config.mjs` but `globals.css` never imports it — **there are no utility classes anywhere in `app/` or `components/`; do not add any.**

**Motion**: attribute-driven. Put `data-reveal` on an element; the single `MotionRoot` client component attaches an `IntersectionObserver` and adds `.is-revealed`. Everything reveals immediately under `prefers-reduced-motion`.

**Error handling**: guards throw `Error` with a unique message per failure mode. Forms catch, read `error.issues[0].message`, and map it to a field. There are no error boundaries and no `error.tsx` — a guard that throws during render is a build/render failure by design.

**Testing**: colocated, and structured by the 8-point checklist in `.cursor/rules/02-moloch-testing.mdc` — happy path → one validation test per guard (changing exactly one input) → access control → boundaries (0, 1, MAX-1, MAX) → full path coverage, using shared factories and reusable `verify*()` helpers rather than scattered `expect`s. Page tests assert retired copy is **absent** as well as current copy present.

### Adding things end to end

**A new page** — (1) add the copy constants + guards to a `lib/` module and test the guards; (2) create `app/<route>/page.tsx` as a server component exporting `metadata`, opening with `<PageHead eyebrow title lede>` and splitting sections with `<SectionIntro>`; (3) add the route to `lib/navigation.ts` if it belongs in the nav (max 7 items) and to `app/sitemap.ts`; (4) style it in `app/globals.css`, then update `lib/identity-css.test.ts` if you touched pinned values; (5) add render assertions to `app/public-routes.test.tsx`; (6) `npm run build && npm test`.

**A new interactive widget** — build it as a `"use client"` leaf under `components/<feature>/`, keep validation in a `lib/` zod schema so it is testable without rendering, and have the server page import it. Do not make a page a client component.

**A new endpoint** — `app/api/<name>/route.ts`, validate the body with a zod schema defined in `lib/`, return `NextResponse.json` with a distinct message and status per failure mode (`api/unlock` is the model: 404 disabled / 400 malformed / 401 rejected). Add the path to `gateBypassExactPaths` in `lib/gate.ts` if it must work while the gate is on.

## 8. Traced flow: a journalist sends a press inquiry

The site's central conversion path. Note it terminates in the visitor's mail client — nothing is transmitted to a server.

1. **`proxy.ts:11`** `proxy(request)` — runs on every request. `resolveGateConfig()` reads `SITE_PASSWORD`; if unset, `NextResponse.next()` and the request proceeds. (Gated case in the second chain below.)
2. **`app/layout.tsx:43`** `RootLayout` — wraps children in `SiteShell`, injects `Person` JSON-LD.
3. **`components/site/site-shell.tsx:16-17`** — at *module scope*, `parseNavigationItems(primaryNavigation)` and `assertHeaderCta(HEADER_CTA)` run. A bad nav label throws here and the build fails.
4. **`app/contact/page.tsx:13`** `ContactPage` (server) — renders `PageHead`, a static list of the three routing inboxes read from `identity`, then `<InquiryForm />` with no props (defaults to `inquiryType: "interview"`).
5. **`components/contact/inquiry-form.tsx:23`** `InquiryForm` (`"use client"`) — holds exactly two state atoms, `error` and `mailto`. Inputs are **uncontrolled**.
6. Visitor submits → **`:31`** `handleSubmit` → `preventDefault()` → reads `name, organization, email, inquiryType, notes, deadline` out of `new FormData(event.currentTarget)`.
7. **`lib/contact.ts:94`** `parseInquirySubmission(raw)` → `inquirySchema.safeParse` (`lib/contact.ts:55`). On failure it throws `new Error(result.error.issues[0]!.message)` — **only the first issue survives**.
8. **`lib/contact.ts:90`** `routeInquiry(inquiryType)` → looks up `inquiryRoutes` (`:46`) → returns the destination inbox. This is where the recipient is decided: interview / comment / mediaKit / other → `identity.pressEmail`; speaking → `identity.speakingEmail`; partnership → `identity.partnershipEmail`.
9. **`lib/contact.ts:111`** `createMailto(parsed)` — composes the message. Subject `"{inquiryLabel} — {organization}"`; body is newline-joined `Name / Organization / Email / Type / [Deadline] / blank / notes`. Both halves `encodeURIComponent`'d into `mailto:{routeTo}?subject=…&body=…`.
10. **`inquiry-form.tsx:45`** `setMailto(...)` → re-render swaps in a "Request prepared — **Open email to send**" anchor.
11. Visitor clicks the anchor → their OS mail client opens with the message pre-filled. **They still have to press send.** Nothing was persisted, logged, or transmitted by the site.

Error path: **`:46-49`** clears `mailto` and sets `error`; **`:52-53`** renders the message inline under the name field *only* when it is exactly `"Name is required"`, otherwise at form level.

### Second chain: unlocking the gate (the only server-side flow)

1. **`proxy.ts:11`** — `SITE_PASSWORD` is set, so `resolveGateConfig()` returns `enabled: true`.
2. **`proxy.ts:20`** `isGateBypassPath(pathname)` — lets `/unlock`, `/api/unlock`, `/robots.txt`, the icons, the seal image, and `/_next/*` through.
3. **`proxy.ts:24-27`** reads the `jf_gate` cookie → `verifyGateToken(token, password, Date.now())` (`lib/gate.ts:239`) — parses `expiry.signature`, rejects a non-numeric or expired expiry, then compares the HMAC with `timingSafeEqual`.
4. Miss → **`proxy.ts:30-35`** `buildUnlockPath()` → redirect to `/unlock?next=…` with `x-robots-tag: noindex, nofollow`.
5. **`app/unlock/page.tsx`** (async server component, awaits `searchParams`) renders the seal, copy from `lib/gate.ts`, and `<UnlockForm />`.
6. **`components/gate/unlock-form.tsx:30`** `handleSubmit` → client-side `parseUnlockSubmission` → **`:50`** `fetch("/api/unlock", POST, JSON)` — the only `fetch()` in the entire codebase.
7. **`app/api/unlock/route.ts:14`** `POST` → `resolveGateConfig()` (404 if off) → `request.json()` (400 if malformed) → `parseUnlockSubmission` (400 with the zod message) → `timingSafeEqual(submitted, actual)` (401 if wrong).
8. **`lib/gate.ts:268`** `createGateSession()` → HMAC token → `response.cookies.set(...)` with `gateCookieOptions(isProd)`.
9. Client reads `payload.next`, re-runs `resolveNextPath` defensively, and calls `window.location.assign`. The next request passes step 3.

## 9. Rough edges

**Broken / will bite you**

- **`playwright.config.ts:11`** hard-codes a macOS Chrome `executablePath`, so `npm run test:e2e` cannot launch on this Windows machine or in any Linux CI. The specs are written but have never run here (recorded as a known gap in `.compliance/ledger.json`). Removing the `executablePath` and using Playwright's bundled Chromium is the fix.
- **No CI or deploy config at all** — nothing enforces `build`/`test`/`lint` before shipping.
- **`app/page.tsx:173`** links to `/insights/trust-shouldnt-be-a-promise`. **No such route exists** — it is a 404 on the home page. (The slug also matches `LEGACY_THESIS`, which the guards elsewhere explicitly refuse to publish.)
- **`NEXT_PUBLIC_SITE_URL` is declared but never read**, so a preview or staging deploy emits production URLs in its sitemap, robots host, and JSON-LD.
- **`app/about/page.tsx:40` and `lib/portraits.ts:15` ship `/portraits/jasper-fu-placeholder.jpg`** while `public/portraits/jasper-fu-about.jpg` sits unused. `assertPortraitSrc` only rejects the token `"unpublished"`, not `"placeholder"` — unlike `assertMediaOutletLogo` and `assertCalendlyUrl`, which do. The one placeholder that actually ships is the one the guards don't catch, and `app/public-routes.test.tsx:158` locks it in.

**Contradictions in the content layer** — the guard system is fighting itself over email addresses:

- `identity.speakingEmail` is `speaking@jasperfu.com`, which `identity.ts` itself names `RETIRED_SPEAKING_BOOKING_EMAIL` and `assertBookingEmail` throws on. It is published on `/contact` and used by `lib/contact.ts` to route speaking inquiries — while `lib/speaking.ts` routes the booking form to `speaking@jasperfu.io`. **Two inboxes for the same intent, one explicitly declared retired.**
- `LEGAL_CONTACT_EMAIL = "info@jasperfu.io"` (published on /privacy, /cookies, /terms) is exactly `RETIRED_INFO_BOOKING_EMAIL`.
- `LEGAL_SITE_HOST = "jasperfu.com"` disagrees with `identity.siteUrl = "https://www.jasperfu.com"` on the `www`.
- `components/press/press-alert-form.tsx:19` hard-codes `mailto:press@coinsub.io` instead of reading `identity.pressEmail` — the only component that bypasses the identity module.

**Dead code (~1,000+ lines of live-tree code, plus 3,656 in `widgets/`)**

- **`widgets/`** is confirmed imported by nothing. It has *diverged* from the live equivalents rather than mirroring them — `widgets/site/site-shell.tsx` still renders "Graffiti Creative Group", a client-portal link, and `.site-header__*` classes the live CSS doesn't define; `widgets/site/legal-page.tsx` still contains the draft notice that `assertLegalDraftNoticeOmitted` exists to forbid. **`vitest.config.ts` excludes only `e2e/**`, so its 5 test files run on every `npm test`** while ESLint ignores the directory — dead code that is lint-exempt but test-enforced, the opposite of the intent.
- **The entire availability/booking-calendar feature is orphaned**: `components/calendar/availability-calendar.tsx` (114 lines, no test file) is rendered by no page, and `lib/availability.ts` (191 lines of DST-correct slot math) is imported only by its own test. Its `blackoutDates` are hard-coded 2026-only holidays.
- **`components/site/copy-button.tsx`** is never rendered, which also strands `lib/media-kit.ts`'s `copyTextToClipboard`, `mediaKitCopyBlocks`, and `pendingAssets`.
- Exported-but-unrendered content: `copy.aboutFaqs`, `factSheet`, `quickFacts`, `pullQuotes`, `usageRights`, `bookingDisclaimer`, `heroName/heroTitle/heroThesis`. Plus unused deps `@fontsource-variable/inter` and `@fontsource-variable/source-serif-4`, and unreferenced SVGs in `public/media-kit/`.
- The **Tailwind toolchain** (`tailwindcss`, `@tailwindcss/postcss`, `postcss.config.mjs`) exists only to serve `widgets/site-styles.css`, which nothing imports. `postcss` is also miscategorised as a runtime dependency.

**Fragile by design (mostly deliberate, but know the tradeoff)**

- **`lib/identity-css.test.ts`** pins literal CSS strings like `"clamp(1rem, 2.5vw, 2.5rem)"`. Reformatting the stylesheet breaks the suite with zero behavioural regression.
- **Module-scope guards** (`lib/navigation.ts:32`, `lib/contact.ts:40`, `lib/legal/drafts.ts`, `components/site/site-shell.tsx:17`) throw at import time, killing the whole build. `assertLegalUpdated` requires the date to be literally `"August 14, 2026"` — editing legal copy without bumping that constant is a build failure.
- **Non-null assertions defeat `noUncheckedIndexedAccess`** in exactly the places it was meant to help: `app/page.tsx:33` `mediaCoverage[0]!`, `hero-portrait-carousel.tsx:47`, `network-field.tsx:40-41`, and `result.error.issues[0]!` in all four zod parsers. Emptying a content array crashes the page at render.
- **`lib/gate.ts:226` `timingSafeEqual`** returns early on length mismatch, so it leaks password length. Worth replacing with a fixed-length comparison.
- **`app/layout.tsx:63`** uses `dangerouslySetInnerHTML` for JSON-LD without escaping `<`/`</script`. Safe today because every input is a constant, but notable in a repo this defensive elsewhere.
- **`e2e/public-routes.spec.ts:36`** asserts `h1` visibility, but `/about` renders `<h1 className="visually-hidden">` — the test depends on clip-based hiding keeping a non-zero box.
- **Naming inversions**: `lib/legal/drafts.ts` is the source of the *published* /privacy and /cookies pages, while `published.ts` holds only shared constants. `LegalPage` (39 lines) and `LegalDocument` (93 lines) are two components for one job, split across routes arbitrarily.
- **Metadata**: no page overrides `alternates.canonical`, so every URL inherits the root `canonical: "/"` and self-reports as the home page. `app/sitemap.ts` hard-codes `lastModified: 2026-08-13` for every route.

**Stale imported documentation** — roughly ten docs came from unrelated projects and describe a different stack:

- `docs/START_HERE.md` documents the file tree of `/Users/kavsol/growlink-ai-v2/`.
- `docs/QUICK_REFERENCE.md` and `docs/TROUBLESHOOTING.md` are Prisma/Postgres runbooks (`npx prisma db push`, `import { prisma } from "@/lib/db"`) for a project with no database.
- `docs/TEST_AUDIT.md` opens with "**NO TESTS EXIST** — Critical compliance gap" and audits an `auth.service.ts` that doesn't exist here. This repo has 36 test files and 518 passing tests.
- `AGENTS.md`, `docs/IMPORT_INDEX.md`, and `widgets/README.md` all cite a "Graffiti Creative Group" source path.
- `.compliance/ledger.json` is committed with mutable session state (`code_dirty: true`, a 16-file dirty list) that `session-start.mjs` rewrites every run — a tracked file guaranteed to churn.
- The `.cursor/` hooks that enforce all of this are Cursor-specific and **do not fire under Claude Code**; `node .compliance/check-ledger.mjs` has to be run by hand.

On the positive side: there is **not a single** `TODO`, `FIXME`, `HACK`, `console.log`, `debugger`, `@ts-ignore`, or `eslint-disable` anywhere in `app/`, `components/`, `lib/`, `e2e/`, or `proxy.ts`. The application source is genuinely clean; the mess is all in the imported scaffolding around it.

## 10. Open questions

Things this map could not settle from the code alone:

1. **Is the mailto-only approach intentional and permanent?** Three forms build `mailto:` links and nothing more, so there is no delivery guarantee, no record of an inquiry, and no press-alert list — the "signup" asks the visitor to email a request to be added manually. That is a defensible pre-launch choice, but if inbound volume matters, it is the biggest functional gap.
2. **Which speaking inbox is correct** — `.com` (published on `/contact`, used by the contact form) or `.io` (used by the booking form, and the only one `assertBookingEmail` accepts)? The guards say `.io`; the shipped page says `.com`. Same question for `info@jasperfu.io` in the legal pages.
3. **Is the availability calendar abandoned or unfinished?** ~400 lines including careful DST handling and tests, wired to nothing. Delete or complete — I'd want to know which before touching it.
4. **Is `widgets/` meant to stay?** If it is a reference library, it should at minimum be excluded from Vitest. If it was a one-time import, deleting it removes 3,656 lines and the entire Tailwind toolchain.
5. **Where does this deploy, and does anything run the tests before it does?** No CI or host config is checked in.
6. **Is the `/insights/...` link a planned route or a leftover?** The slug matches the retired thesis, which suggests leftover — but an essay page may be planned (`FLAGSHIP_ESSAY_READY = false` in `lib/copy.ts` hints at one).
7. **How much of the compliance stack still applies?** Its hooks don't run under Claude Code, and its supporting docs describe another project. The Moloch test structure is clearly still honoured in practice; the ledger workflow may or may not be.
