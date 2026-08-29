# Graffiti Creative Group — protocol & widget import

Imported into this agent from `/Users/kavsol/Documents/Influencer-Compliance/Graffiti Creative Group`.

## Enforcement (binding — use this, not prose alone)

- `AGENTS.md` — agent entrypoint
- `.cursor/rules/*.mdc` — always-on rules
- `.compliance/PROTOCOL.md` — rigid phase protocol
- `.compliance/ledger.json` — machine gates
- `.cursor/hooks.json` — hard-block commit/push + stop follow-ups
- `node .compliance/check-ledger.mjs` — pass/fail check

## Start here

- `docs/START_HERE.md` — entry point / orientation
- `docs/MANDATORY_WORKFLOW.md` — required development workflow
- `.cursorrules` — pointer to compliance stack (not the full rulebook), at the project root

## Testing

- `docs/TESTING_GUIDE.md` — Moloch-inspired testing methodology
- `docs/TEST_AUDIT.md` — example comprehensive test requirements
- `docs/growlink-ai/TESTING_GUIDE.md` — legacy v1 testing notes
- `.compliance/feature-checklist.md` — per-feature Moloch template
- `docs/examples/wix-motion-checklist.md` — filled Moloch checklist example

## Dev best practices & workflow

- `docs/CURSOR_BEST_PRACTICES.md`
- `docs/DEVELOPMENT_PRACTICES.md`
- `docs/QUICK_REFERENCE.md`
- `docs/TROUBLESHOOTING.md`
- `docs/README.md`
- `docs/growlink-ai/DEVELOPMENT_PRACTICES.md`

## Widgets

No folder named `widgets` existed in Graffiti Creative Group. These reusable UI/motion modules were imported instead:

- `widgets/site/` — site shell, motion root, legal page (+ tests)
- `widgets/motion/` — scroll-reveal helpers (+ tests)
- `widgets/lib/navigation.ts` — navigation data the site shell uses
- `widgets/site-styles.css` — Graffiti global stylesheet the widgets depend on
- `widgets/README.md` — inventory and original paths

## Not imported (out of scope)

- Graffiti app/source, `node_modules`, `.env`, feature-specific checklists (admin, proposals, etc.)
- GrowLink history/deployment docs (`DEVELOPMENT_HISTORY.md`, `DEPLOYMENT_*.md`, product READMEs)
