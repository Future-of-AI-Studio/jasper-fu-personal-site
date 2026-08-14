# Rigid Documentation Compliance Protocol

**Status:** REQUIRED — NO EXCEPTIONS  
**Enforcement:** Cursor rules + machine ledger + project hooks

This protocol replaces “please follow the docs” with hard gates. Chat claims do not count. Only [`.compliance/ledger.json`](ledger.json) plus shell evidence do.

---

## Non-negotiables

1. You MAY NOT declare a feature done unless `ready_to_declare_done` is `true` in the ledger.
2. You MAY NOT `git commit` / `git push` while verification is incomplete (`beforeShellExecution` denies it).
3. Moloch testing rules in [`docs/TESTING_GUIDE.md`](../docs/TESTING_GUIDE.md) are binding for every function/feature you touch.
4. Forbidden without ledger evidence: “should work”, “LGTM”, “tests later”, “skipped for speed”.

---

## Required reading (ack in ledger)

Before writing production code in a session, set `docs_acked` after reading:

- `.cursor/rules/02-moloch-testing.mdc`
- Relevant sections of `docs/TESTING_GUIDE.md`
- `.cursor/rules/01-mandatory-workflow.mdc`
- This file (`.compliance/PROTOCOL.md`)

---

## Only allowed feature sequence

1. **Ack docs** — Read rules above; update `docs_acked` in the ledger.
2. **Audit** — List functions/paths touched; fill [`.compliance/feature-checklist.md`](feature-checklist.md).
3. **Implement minimally** — Prefer 1–2 files per increment.
4. **Write Moloch tests** — Factories + verification helpers required before “done”.
5. **Run build + tests** — Hooks record evidence from shell output into the ledger.
6. **Runtime verify** — curl/browser/manual when UI/API exists; else note N/A with reason.
7. **Declare done** — Only when ledger `ready_to_declare_done` is `true`.
8. **Commit** — Only when commit gate allows (`ready_to_commit` true).

Never skip steps. Never assume success.

---

## Moloch gate (8 items)

All must be `true` in `ledger.moloch_checklist` before done:

| Key | Requirement |
|-----|-------------|
| `happy` | Happy-path test(s) for normal success |
| `validation` | One failure test per validation / require |
| `access` | Auth/authorization tests when applicable (or N/A documented in notes) |
| `boundary` | Boundary tests (0, 1, MAX-1, MAX) when numeric/limits apply |
| `verification_fn` | Reusable verification helper(s), not only scattered expects |
| `dry_setup` | Factories / shared setup (DRY) |
| `unique_errors` | Distinct error messages per failure mode |
| `path_coverage` | Every branch/path of touched logic tested |

Copy the feature template from [`feature-checklist.md`](feature-checklist.md) per feature.

---

## Ledger fields

See [`ledger.schema.json`](ledger.schema.json). Agents and hooks update [`.compliance/ledger.json`](ledger.json).

- Hooks set `code_dirty` on source edits and record build/test/curl evidence from shell.
- Agents set `docs_acked`, `moloch_checklist`, `runtime_verify`, and feature notes.
- `ready_to_commit` / `ready_to_declare_done` are computed by [`.compliance/check-ledger.mjs`](check-ledger.mjs) logic (also used by hooks).

---

## Definition of Done (user-visible)

Every feature response MUST end with a **Compliance Report**:

```markdown
## Compliance Report
- Docs acked: …
- Build: `<command>` → pass/fail/N/A
- Tests: `<command>` → pass/fail
- Moloch (8/8): happy/validation/access/boundary/verification_fn/dry_setup/unique_errors/path_coverage
- Runtime proof: … or N/A (reason)
- Ledger: `.compliance/ledger.json` → ready_to_declare_done: true
```

If any item is false, continue working. The `stop` hook will force a follow-up when gates fail.

---

## Hard stops (hooks)

| Event | Behavior |
|-------|----------|
| `sessionStart` | Init/reset ledger; inject gate reminder |
| `afterFileEdit` | Source edits → `code_dirty=true`; clear ready flags |
| `afterShellExecution` | Successful build/test/curl → record evidence; may clear dirty |
| `beforeShellExecution` | Deny `git commit` / `git push` if gates fail |
| `stop` | If incomplete after code changes → `followup_message` to finish gates |

---

## Stack adaptation

- If `package.json` has `build` / `test` scripts, those commands are required evidence.
- If no build script exists, build may be N/A.
- If no test script exists yet, you must still add tests and a runner before `ready_to_declare_done`, unless the change is docs/rules/compliance-only (then `code_dirty` stays false).

---

## Quick check

```bash
node .compliance/check-ledger.mjs
```

Exit code `0` = gates satisfied. Non-zero = not ready.
