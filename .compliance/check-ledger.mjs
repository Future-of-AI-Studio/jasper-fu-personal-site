#!/usr/bin/env node
import {
  gateSummary,
  MOLOCH_KEYS,
  LEDGER_PATH,
} from "../.cursor/hooks/lib/ledger.mjs";

const { ledger, evaluation } = gateSummary();

const moloch = MOLOCH_KEYS.map(
  (k) => `${k}:${ledger.moloch_checklist?.[k] ? "✓" : "✗"}`
).join(" ");

console.log("Compliance ledger:", LEDGER_PATH);
console.log("code_dirty:", ledger.code_dirty);
console.log("docs_acked:", (ledger.docs_acked || []).join(", ") || "(none)");
console.log(
  "build:",
  ledger.build?.na
    ? "N/A"
    : `${ledger.build?.ran ? "ran" : "not-ran"} / ${
        ledger.build?.passed ? "pass" : "fail"
      } (${ledger.build?.command || "—"})`
);
console.log(
  "tests:",
  `${ledger.tests?.ran ? "ran" : "not-ran"} / ${
    ledger.tests?.passed ? "pass" : "fail"
  } (${ledger.tests?.command || "—"})`
);
console.log("moloch:", moloch);
console.log(
  "runtime:",
  ledger.runtime_verify?.note ||
    `${ledger.runtime_verify?.ran ? "ran" : "not-ran"} / ${
      ledger.runtime_verify?.passed ? "pass" : "fail"
    }`
);
console.log("ready_to_commit:", evaluation.ready_to_commit);
console.log("ready_to_declare_done:", evaluation.ready_to_declare_done);

if (evaluation.reasons.length) {
  console.log("\nBlocking reasons:");
  for (const r of evaluation.reasons) console.log(" -", r);
  process.exit(1);
}

console.log("\nGATES SATISFIED");
process.exit(0);
