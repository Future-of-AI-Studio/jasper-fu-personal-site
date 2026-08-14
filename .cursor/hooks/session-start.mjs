#!/usr/bin/env node
import { resetLedger, GATE_REMINDER, writeLedger, readLedger } from "./lib/ledger.mjs";

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
const sessionId = input.session_id || input.conversation_id || null;

// Fresh session ledger; preserve nothing across chats
resetLedger(sessionId);

// Ensure file exists even if reset failed somehow
const ledger = readLedger();
if (!ledger.session_id && sessionId) {
  ledger.session_id = sessionId;
  writeLedger(ledger);
}

const payload = {
  additional_context: GATE_REMINDER,
  env: {
    COMPLIANCE_PROTOCOL: "1",
    COMPLIANCE_LEDGER: ".compliance/ledger.json",
  },
};

process.stdout.write(JSON.stringify(payload) + "\n");
