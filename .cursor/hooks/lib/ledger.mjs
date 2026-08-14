import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const PROJECT_ROOT = path.resolve(__dirname, "../../..");
export const LEDGER_PATH = path.join(PROJECT_ROOT, ".compliance", "ledger.json");

export const MOLOCH_KEYS = [
  "happy",
  "validation",
  "access",
  "boundary",
  "verification_fn",
  "dry_setup",
  "unique_errors",
  "path_coverage",
];

const SOURCE_DIR_PREFIXES = [
  "app/",
  "src/",
  "lib/",
  "components/",
  "pages/",
  "tests/",
  "__tests__/",
  "test/",
  "workers/",
  "prisma/",
  "scripts/",
  "public/",
];

const SOURCE_EXTENSIONS = new Set([
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".mjs",
  ".cjs",
  ".css",
  ".scss",
  ".html",
  ".vue",
  ".svelte",
  ".py",
  ".go",
  ".rs",
  ".java",
  ".json",
]);

const EXCLUDED_PREFIXES = [
  ".compliance/",
  ".cursor/",
  "docs/",
  "node_modules/",
  ".next/",
  ".git/",
];

const EXCLUDED_BASENAMES = new Set([
  "package-lock.json",
  "pnpm-lock.yaml",
  "yarn.lock",
  "ledger.json",
]);

export function emptyLedger(sessionId = null) {
  return {
    version: 1,
    session_id: sessionId,
    updated_at: new Date().toISOString(),
    docs_acked: [],
    code_dirty: false,
    dirty_files: [],
    build: {
      ran: false,
      passed: false,
      command: null,
      at: null,
      na: false,
    },
    tests: {
      ran: false,
      passed: false,
      command: null,
      at: null,
      files: [],
    },
    moloch_checklist: Object.fromEntries(MOLOCH_KEYS.map((k) => [k, false])),
    runtime_verify: {
      ran: false,
      passed: false,
      method: null,
      note: null,
      at: null,
    },
    notes: "",
    ready_to_commit: false,
    ready_to_declare_done: false,
  };
}

export function readLedger() {
  try {
    const raw = fs.readFileSync(LEDGER_PATH, "utf8");
    return { ...emptyLedger(), ...JSON.parse(raw) };
  } catch {
    return emptyLedger();
  }
}

export function writeLedger(ledger) {
  const next = recomputeReady(ledger);
  next.updated_at = new Date().toISOString();
  fs.mkdirSync(path.dirname(LEDGER_PATH), { recursive: true });
  fs.writeFileSync(LEDGER_PATH, JSON.stringify(next, null, 2) + "\n", "utf8");
  return next;
}

export function resetLedger(sessionId = null) {
  return writeLedger(emptyLedger(sessionId));
}

export function toPosixRelative(filePath) {
  const abs = path.isAbsolute(filePath)
    ? filePath
    : path.resolve(PROJECT_ROOT, filePath);
  let rel = path.relative(PROJECT_ROOT, abs);
  rel = rel.split(path.sep).join("/");
  if (rel.startsWith("../")) return null;
  return rel;
}

export function isSourcePath(filePath) {
  const rel = toPosixRelative(filePath);
  if (!rel) return false;
  if (EXCLUDED_BASENAMES.has(path.posix.basename(rel))) return false;
  if (EXCLUDED_PREFIXES.some((p) => rel === p.slice(0, -1) || rel.startsWith(p))) {
    return false;
  }
  if (SOURCE_DIR_PREFIXES.some((p) => rel.startsWith(p))) return true;
  const ext = path.posix.extname(rel).toLowerCase();
  if (SOURCE_EXTENSIONS.has(ext) && !rel.endsWith(".md") && !rel.endsWith(".mdc")) {
    // Root-level config/source that isn't docs
    if (
      rel === "package.json" ||
      rel.endsWith(".config.ts") ||
      rel.endsWith(".config.js") ||
      rel.endsWith(".config.mjs")
    ) {
      return true;
    }
    // Any non-excluded source extension outside docs/compliance
    if (!rel.includes("/")) return true;
    return true;
  }
  return false;
}

export function hasPackageJson() {
  return fs.existsSync(path.join(PROJECT_ROOT, "package.json"));
}

export function readPackageScripts() {
  try {
    const pkg = JSON.parse(
      fs.readFileSync(path.join(PROJECT_ROOT, "package.json"), "utf8")
    );
    return pkg.scripts || {};
  } catch {
    return {};
  }
}

export function molochComplete(ledger) {
  return MOLOCH_KEYS.every((k) => ledger.moloch_checklist?.[k] === true);
}

export function docsAckedEnough(ledger) {
  const acked = new Set(ledger.docs_acked || []);
  const requiredHints = ["moloch", "protocol", "workflow", "testing"];
  if (acked.size === 0) return false;
  // Accept either explicit paths or short tokens
  const joined = [...acked].join(" ").toLowerCase();
  return (
    requiredHints.every((h) => joined.includes(h)) ||
    (acked.has(".cursor/rules/02-moloch-testing.mdc") &&
      acked.has(".compliance/PROTOCOL.md") &&
      (acked.has(".cursor/rules/01-mandatory-workflow.mdc") ||
        acked.has("docs/TESTING_GUIDE.md")))
  );
}

export function buildSatisfied(ledger) {
  const scripts = readPackageScripts();
  const hasBuild = Boolean(scripts.build);
  if (!hasBuild) {
    return ledger.build?.na === true || ledger.build?.passed === true || !hasPackageJson();
  }
  return ledger.build?.ran === true && ledger.build?.passed === true;
}

export function testsSatisfied(ledger) {
  return ledger.tests?.ran === true && ledger.tests?.passed === true;
}

export function runtimeSatisfied(ledger) {
  if (ledger.runtime_verify?.ran && ledger.runtime_verify?.passed) return true;
  const note = (ledger.runtime_verify?.note || "").toLowerCase();
  // Explicit N/A with reason is allowed for non-UI/API work
  if (note.startsWith("n/a") && note.length > 4) return true;
  // If no source dirty and no app surface, treat as N/A
  if (!ledger.code_dirty && !(ledger.dirty_files || []).length) return true;
  return false;
}

export function evaluateGates(ledger) {
  const reasons = [];
  const dirty = Boolean(ledger.code_dirty);

  if (!dirty) {
    return {
      ready_to_commit: true,
      ready_to_declare_done: true,
      reasons: [],
      dirty: false,
    };
  }

  if (!docsAckedEnough(ledger)) {
    reasons.push(
      "docs_acked incomplete — ack moloch + protocol + workflow/testing docs"
    );
  }
  if (!buildSatisfied(ledger)) {
    reasons.push("build not verified (run npm run build, or set build.na if none)");
  }
  if (!testsSatisfied(ledger)) {
    reasons.push("tests not verified green");
  }
  if (!molochComplete(ledger)) {
    const missing = MOLOCH_KEYS.filter((k) => !ledger.moloch_checklist?.[k]);
    reasons.push(`moloch_checklist incomplete: ${missing.join(", ")}`);
  }
  if (!runtimeSatisfied(ledger)) {
    reasons.push(
      "runtime_verify missing — run curl/browser proof or set note to 'N/A: <reason>'"
    );
  }

  const ok = reasons.length === 0;
  return {
    ready_to_commit: ok,
    ready_to_declare_done: ok,
    reasons,
    dirty: true,
  };
}

export function recomputeReady(ledger) {
  const evalResult = evaluateGates(ledger);
  return {
    ...ledger,
    ready_to_commit: evalResult.ready_to_commit,
    ready_to_declare_done: evalResult.ready_to_declare_done,
  };
}

export function markDirty(filePath) {
  const ledger = readLedger();
  const rel = toPosixRelative(filePath) || filePath;
  ledger.code_dirty = true;
  const files = new Set(ledger.dirty_files || []);
  files.add(rel);
  ledger.dirty_files = [...files];
  // New edits invalidate prior verification
  ledger.build.ran = false;
  ledger.build.passed = false;
  ledger.build.at = null;
  ledger.tests.ran = false;
  ledger.tests.passed = false;
  ledger.tests.at = null;
  ledger.runtime_verify.ran = false;
  ledger.runtime_verify.passed = false;
  ledger.runtime_verify.at = null;
  return writeLedger(ledger);
}

export function looksLikeSuccess(output) {
  const text = String(output || "");
  const lower = text.toLowerCase();
  if (/\b(fail|failed|error|errors)\b/.test(lower) && !/0 failed/.test(lower)) {
    // Vitest/Jest often print "Tests: 1 failed"
    if (/\d+\s+failed/.test(lower) || /failing/.test(lower)) return false;
    if (/compiled with .*error/.test(lower)) return false;
    if (/build failed|error command failed|exit code [1-9]/.test(lower)) return false;
  }
  if (/compiled successfully|build successful|✓|pass(ed)?|tests?\s+\d+\s+passed/i.test(text)) {
    return true;
  }
  if (/http\/1\.[01]\s+200|http\/2\s+200|\b200\b/.test(text) && /curl/i.test(text)) {
    return true;
  }
  // Empty output with exit unknown — treat conservatively as unknown
  return text.trim().length > 0 && !/\berror\b/i.test(text);
}

export function classifyShellCommand(command) {
  const cmd = String(command || "");
  const isGitCommit =
    /\bgit\s+commit\b/.test(cmd) || /\bgit\s+push\b/.test(cmd);
  const isBuild =
    /\bnpm\s+run\s+build\b/.test(cmd) ||
    /\bpnpm\s+(run\s+)?build\b/.test(cmd) ||
    /\byarn\s+build\b/.test(cmd) ||
    /\bnext\s+build\b/.test(cmd);
  const isTest =
    /\bnpm\s+test\b/.test(cmd) ||
    /\bnpm\s+run\s+test\b/.test(cmd) ||
    /\bpnpm\s+(test|run\s+test)\b/.test(cmd) ||
    /\byarn\s+test\b/.test(cmd) ||
    /\bvitest\b/.test(cmd) ||
    /\bjest\b/.test(cmd) ||
    /\bplaywright\s+test\b/.test(cmd);
  const isCurl = /\bcurl\b/.test(cmd);
  return { isGitCommit, isBuild, isTest, isCurl };
}

export function recordShellEvidence(command, output) {
  const ledger = readLedger();
  const { isBuild, isTest, isCurl } = classifyShellCommand(command);
  const now = new Date().toISOString();
  const success = looksLikeSuccess(output);

  if (isBuild) {
    ledger.build = {
      ran: true,
      passed: success,
      command,
      at: now,
      na: false,
    };
  }
  if (isTest) {
    ledger.tests = {
      ran: true,
      passed: success,
      command,
      at: now,
      files: ledger.tests.files || [],
    };
  }
  if (isCurl) {
    ledger.runtime_verify = {
      ran: true,
      passed: success,
      method: "curl",
      note: success ? "curl evidence recorded by hook" : "curl appeared to fail",
      at: now,
    };
  }

  // Clear dirty when verification stack is green
  const next = recomputeReady(ledger);
  if (
    next.code_dirty &&
    buildSatisfied(next) &&
    testsSatisfied(next) &&
    molochComplete(next) &&
    runtimeSatisfied(next)
  ) {
    // Keep dirty_files for audit but allow ready flags; code_dirty stays true
    // until agent explicitly clears after commit, OR we clear when fully green:
    next.code_dirty = false;
  }

  return writeLedger(next);
}

export function gateSummary(ledger = readLedger()) {
  const evaluation = evaluateGates(ledger);
  return { ledger, evaluation };
}

export const GATE_REMINDER = `
COMPLIANCE GATES ACTIVE (Rigid Documentation Compliance Protocol)
- Read/follow: .compliance/PROTOCOL.md
- Moloch testing: docs/TESTING_GUIDE.md + .cursor/rules/02-moloch-testing.mdc
- Update ledger: .compliance/ledger.json after each phase
- Fill: .compliance/feature-checklist.md per feature
- Cannot declare done or git commit/push until node .compliance/check-ledger.mjs exits 0
- Forbidden without evidence: "should work", "tests later", "LGTM"
`.trim();
