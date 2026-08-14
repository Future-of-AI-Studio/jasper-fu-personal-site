#!/usr/bin/env node
import {
  classifyShellCommand,
  recordShellEvidence,
  evaluateGates,
  readLedger,
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
const output = input.output || "";
const { isBuild, isTest, isCurl } = classifyShellCommand(command);

if (isBuild || isTest || isCurl) {
  recordShellEvidence(command, output);
  const evaluation = evaluateGates(readLedger());
  const payload = {
    additional_context: [
      `Compliance shell evidence recorded for: ${command}`,
      `ready_to_commit=${evaluation.ready_to_commit}`,
      `ready_to_declare_done=${evaluation.ready_to_declare_done}`,
      evaluation.reasons.length
        ? `Remaining blockers: ${evaluation.reasons.join("; ")}`
        : "All compliance gates satisfied.",
    ].join("\n"),
  };
  process.stdout.write(JSON.stringify(payload) + "\n");
} else {
  process.stdout.write("{}\n");
}
