#!/usr/bin/env node
import { evaluateGates, readLedger, recomputeReady, writeLedger } from "./lib/ledger.mjs";

async function readStdin() {
  const chunks = [];
  for await (const c of process.stdin) chunks.push(c);
  const text = Buffer.concat(chunks).toString("utf8").trim();
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    return {};
  }
}

const input = await readStdin();
const status = input.status || "completed";
const loopCount = Number(input.loop_count || 0);

// Do not fight user aborts forever
if (status === "aborted") {
  process.stdout.write("{}\n");
  process.exit(0);
}

const ledger = writeLedger(recomputeReady(readLedger()));
const evaluation = evaluateGates(ledger);

// No source work outstanding → allow stop
if (!evaluation.dirty || evaluation.ready_to_declare_done) {
  process.stdout.write("{}\n");
  process.exit(0);
}

// Bound automatic follow-ups (hooks.json also sets loop_limit)
if (loopCount >= 3) {
  process.stdout.write(
    JSON.stringify({
      followup_message: [
        "COMPLIANCE STOP: loop limit reached with gates still failing.",
        "Do not declare done. Report blockers to the user and continue only if they ask.",
        "Blockers:",
        ...evaluation.reasons.map((r) => `- ${r}`),
        "Run `node .compliance/check-ledger.mjs` and finish Moloch tests.",
      ].join("\n"),
    }) + "\n"
  );
  process.exit(0);
}

process.stdout.write(
  JSON.stringify({
    followup_message: [
      "COMPLIANCE GATE FAILED — you may not stop yet.",
      "Source changes are dirty and verification is incomplete.",
      "Required now:",
      "1) Ack docs in `.compliance/ledger.json` docs_acked",
      "2) Complete Moloch 8-point checklist (see `.compliance/feature-checklist.md`)",
      "3) Run build/tests; show proof",
      "4) Set runtime_verify or `N/A: <reason>`",
      "5) Run `node .compliance/check-ledger.mjs` until exit 0",
      "Blockers:",
      ...evaluation.reasons.map((r) => `- ${r}`),
      "Continue working until ready_to_declare_done is true. End with a Compliance Report.",
    ].join("\n"),
  }) + "\n"
);
