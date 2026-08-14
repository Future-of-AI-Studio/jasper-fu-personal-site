#!/usr/bin/env node
import {
  classifyShellCommand,
  evaluateGates,
  readLedger,
  recomputeReady,
  writeLedger,
} from "./lib/ledger.mjs";

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
const command = input.command || "";
const { isGitCommit } = classifyShellCommand(command);

if (!isGitCommit) {
  process.stdout.write(JSON.stringify({ permission: "allow" }) + "\n");
  process.exit(0);
}

const ledger = writeLedger(recomputeReady(readLedger()));
const evaluation = evaluateGates(ledger);

if (evaluation.ready_to_commit) {
  process.stdout.write(
    JSON.stringify({
      permission: "allow",
      agent_message: "Compliance commit gate passed.",
    }) + "\n"
  );
  process.exit(0);
}

const reasons =
  evaluation.reasons.length > 0
    ? evaluation.reasons.map((r) => `- ${r}`).join("\n")
    : "- unknown compliance failure";

const message = [
  "COMPLIANCE GATE: git commit/push denied.",
  "Finish Moloch testing + verification first.",
  "Run: node .compliance/check-ledger.mjs",
  "Blockers:",
  reasons,
].join("\n");

process.stdout.write(
  JSON.stringify({
    permission: "deny",
    user_message: message,
    agent_message: message,
  }) + "\n"
);
process.exit(0);
