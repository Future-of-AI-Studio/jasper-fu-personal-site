# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev            # next dev
npm run build          # next build — required proof before declaring a change done
npm run lint           # eslint (next core-web-vitals + typescript); widgets/ is ignored
npm test               # vitest run (jsdom, globals on, e2e/ excluded)
npm run test:watch
npm run test:coverage
npm run test:e2e       # playwright — see caveat below
```

Single test file / single test:

```bash
npx vitest run lib/gate.test.ts
npx vitest run lib/gate.test.ts -t "rejects a tampered signature"
```

`npm run test:e2e` does not work on Windows as configured: [playwright.config.ts:10-13](playwright.config.ts#L10-L13) pins a macOS `/Applications/Google Chrome.app` `executablePath`. Playwright specs are written but unrun on this machine (recorded as a known gap in [.compliance/ledger.json](.compliance/ledger.json)). Vitest is the real gate.

## Stack

Next.js 16 App Router + React 19 + TypeScript (`strict`, `noUncheckedIndexedAccess`). No path aliases — every import is relative (`../lib/identity`). No database, no CMS, no client data fetching; every page is static and every piece of content is a TypeScript constant.

Next 16 renamed middleware to **proxy**: the root [proxy.ts](proxy.ts) exports `proxy()` + `config.matcher`. [AGENTS.md](AGENTS.md) carries a `next dev`-generated block telling agents to read `node_modules/next/dist/docs/` before writing Next-specific code — this version diverges from older Next conventions, and the block is rewritten by `next dev`, so commit it with your work rather than reverting it.

## The core idiom: content guarded by assertions

This is the thing to understand before editing anything. All published copy, URLs, emails, nav labels, and brand values live as `as const` constants in `lib/*.ts`, and nearly every one has a paired `assert*()` / `parse*()` function (39 of them) that throws on anything that isn't the approved value — including *specific retired values*, each with its own error message:

```ts
// lib/identity.ts
export const PUBLISHED_THESIS = "I think of blockchain like plumbing. …";
export const LEGACY_THESIS = "Trust shouldn't be a promise. …";

export function assertThesis(value: string) { /* throws on empty, "placeholder", LEGACY_THESIS, or anything != PUBLISHED_THESIS */ }
```

Pages call the guard at render time rather than interpolating the constant directly — `{assertThesis(identity.thesis)}` in [app/page.tsx:44](app/page.tsx#L44), `assertHeaderCta(HEADER_CTA)` at module scope in [components/site/site-shell.tsx:17](components/site/site-shell.tsx#L17). A reverted or placeholder value therefore fails the build/test instead of shipping.

Consequences for any copy change:

- Update the constant **and** its guard (the old string usually becomes a new named `RETIRED_*` / `LEGACY_*` rejection), then the tests that assert both directions.
- Keep error messages distinct per failure mode — "unique errors" is an explicit gate here, and tests assert the exact message.
- `lib/copy.ts`, `lib/identity.ts`, `lib/navigation.ts`, `lib/legal/published.ts`, `lib/contact.ts`, `lib/speaking.ts`, `lib/availability.ts` are the content sources. `lib/legal/drafts.ts` holds unpublished legal text; `published.ts` guards what may go live.

## Styling and CSS-as-tested-artifact

All styling is one hand-authored stylesheet, [app/globals.css](app/globals.css) (~1600 lines): CSS custom properties in `:root` plus semantic class names (`.masthead`, `.hero__deck`, `.page-head--label`). Tailwind is wired into [postcss.config.mjs](postcss.config.mjs) but `globals.css` never imports it — **there are no utility classes; don't add any.** Fonts come from `@fontsource*` `@import`s at the top of the file.

[lib/identity-css.test.ts](lib/identity-css.test.ts) reads `globals.css` as *text* and asserts specific declarations — hero gap clamps, portrait max-widths, eyebrow font sizes, the unlock page painting no background — and rejects named legacy values. Layout edits to `globals.css` will break this test by design; update the expected constants at the top of that file alongside the CSS.

Scroll motion is attribute-driven: add `data-reveal` to an element, and the client-only [components/site/motion-root.tsx](components/site/motion-root.tsx) (mounted once by `SiteShell`) attaches an `IntersectionObserver` from [lib/motion/reveal.ts](lib/motion/reveal.ts), reveals everything immediately under `prefers-reduced-motion`.

## Password gate

Off by default; enabled solely by setting `SITE_PASSWORD` (8–200 chars, server-only, never `NEXT_PUBLIC_`). See [.env.example](.env.example).

- [proxy.ts](proxy.ts) redirects every non-bypassed path to `/unlock?next=…` with `x-robots-tag: noindex, nofollow`.
- [lib/gate.ts](lib/gate.ts) is the whole mechanism: bypass list, open-redirect-safe `resolveNextPath`, and an HMAC-SHA-256 cookie (`jf_gate` = `expiry.signature`) **keyed by the password itself**, so rotating `SITE_PASSWORD` invalidates every session. Comparison is timing-safe.
- [app/api/unlock/route.ts](app/api/unlock/route.ts) sets the cookie; 404 when the gate is off, 400 on bad JSON/validation, 401 on a wrong password.
- [app/layout.tsx:9](app/layout.tsx#L9) and [app/robots.ts](app/robots.ts) flip the site to `noindex` while the gate is on.

`NEXT_PUBLIC_SITE_URL` appears in `.env.example` but is unused — the canonical URL is hard-coded as `identity.siteUrl`.

## Testing expectations (Moloch)

Colocated `*.test.ts(x)` beside each module, 32 test files. Test structure is mandated by [.cursor/rules/02-moloch-testing.mdc](.cursor/rules/02-moloch-testing.mdc): happy path → one validation test per `assert`/`require` (changing exactly one input from the happy case) → access control (or a documented N/A) → boundaries (0, 1, MAX-1, MAX) → full path coverage, with reusable verification helpers and shared factories rather than scattered `expect`s. [app/public-routes.test.tsx](app/public-routes.test.tsx) shows the house style: `verifySpeakingPage()`-type helpers, and assertions that retired copy is *absent* (`queryBy…` → `toBeNull()`) as well as that current copy is present.

## Compliance gates

[AGENTS.md](AGENTS.md), [.cursorrules](.cursorrules), [.cursor/rules/*.mdc](.cursor/rules/), and [.compliance/PROTOCOL.md](.compliance/PROTOCOL.md) impose a hard workflow that applies to work in this repo:

1. Small increments (prefer 1–2 files), then `npm run build` and `npm test` immediately.
2. Never claim success without pasted command output. "should work" / "LGTM" / "tests later" are explicitly banned.
3. Track state in [.compliance/ledger.json](.compliance/ledger.json) (`docs_acked`, `moloch_checklist` 8/8, `runtime_verify`, dirty files) and verify with `node .compliance/check-ledger.mjs` — exit 0 means the gates pass. Do not commit or push while it exits non-zero.
4. End a feature with a **Compliance Report** block (docs acked / build / tests / Moloch 8/8 / runtime proof or `N/A: reason` / ledger flag) — format in [.compliance/PROTOCOL.md:78-86](.compliance/PROTOCOL.md#L78-L86).

The `beforeShellExecution` / `stop` enforcement in [.cursor/hooks.json](.cursor/hooks.json) is Cursor-specific and will not fire under Claude Code; the ledger and check script still apply, so run them yourself.

## Reference-only directories

- [widgets/](widgets/) — verbatim copies of another project's site shell, motion, and navigation modules, kept as reference. ESLint-ignored, not imported by the app, and its `site-styles.css` uses foreign class names. Don't edit it and don't import from it; the live equivalents are `components/site/` and `lib/`.
- [docs/](docs/) is imported prose from a prior project — [docs/START_HERE.md](docs/START_HERE.md), [docs/MANDATORY_WORKFLOW.md](docs/MANDATORY_WORKFLOW.md), and most of the rest describe a different codebase, and paths inside them refer to that project. Binding rules are the compliance stack above; [docs/TESTING_GUIDE.md](docs/TESTING_GUIDE.md) is the useful one and [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) maps this repo.
