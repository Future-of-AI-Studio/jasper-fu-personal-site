#!/usr/bin/env node
import { isSourcePath, markDirty, GATE_REMINDER, evaluateGates, readLedger } from "./lib/ledger.mjs";

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
const filePath = input.file_path || "";

if (filePath && isSourcePath(filePath)) {
  markDirty(filePath);
  const evaluation = evaluateGates(readLedger());
  const payload = {
    additional_context: [
      GATE_REMINDER,
      "",
      `SOURCE EDIT DETECTED: ${filePath}`,
      "Ledger marked code_dirty=true. Prior build/test evidence cleared.",
      "Complete Moloch checklist + green tests before declaring done or committing.",
      evaluation.reasons.length
        ? `Current blockers: ${evaluation.reasons.join("; ")}`
        : "Update moloch_checklist after writing tests.",
    ].join("\n"),
  };
  process.stdout.write(JSON.stringify(payload) + "\n");
} else {
  process.stdout.write("{}\n");
}
