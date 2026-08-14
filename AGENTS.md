# Agent Entrypoint — Jasper Fu

Imported from Graffiti Creative Group. You MUST follow the rigid compliance stack in this repository. Long GrowLink docs are reference; enforcement is here:

## Binding controls (in order)

1. **Always-on rules:** `.cursor/rules/*.mdc`
2. **Protocol:** `.compliance/PROTOCOL.md`
3. **Ledger:** `.compliance/ledger.json` (machine truth)
4. **Hooks:** `.cursor/hooks.json` (hard-block commit/push; force follow-up on incomplete stops)
5. **Check:** `node .compliance/check-ledger.mjs` must exit 0 before done/commit when code changed

## Moloch testing

- Rule: `.cursor/rules/02-moloch-testing.mdc`
- Full guide: `docs/TESTING_GUIDE.md`
- Per-feature template: `.compliance/feature-checklist.md`

## Reference docs (imported)

See `docs/IMPORT_INDEX.md`, `START_HERE.md`, `MANDATORY_WORKFLOW.md`, and `docs/`.

## Widgets (imported)

Reusable Graffiti UI/motion widgets live in `widgets/`. See `widgets/README.md`.

Do not skip testing guidelines. If a hook blocks you, finish the gates — do not work around them.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
