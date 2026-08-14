"use client";

import { useState } from "react";

import { copyTextToClipboard } from "../../lib/media-kit";

export function CopyButton({ label, value }: { label: string; value: string }) {
  const [status, setStatus] = useState("");

  async function handleCopy() {
    try {
      await copyTextToClipboard(
        async (text) => {
          if (!navigator.clipboard?.writeText) {
            throw new Error("Clipboard is not available");
          }
          await navigator.clipboard.writeText(text);
        },
        value,
      );
      setStatus("Copied");
    } catch (caught) {
      setStatus((caught as Error).message);
    }
  }

  return (
    <div className="copy-block">
      <div className="copy-block__header">
        <h3>{label}</h3>
        <button className="button-link" onClick={handleCopy} type="button">
          Copy to Clipboard
        </button>
      </div>
      <p>{value}</p>
      {status ? <p className="copy-block__status">{status}</p> : null}
    </div>
  );
}
