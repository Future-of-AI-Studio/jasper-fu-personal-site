"use client";

import { type FormEvent, useState } from "react";

import {
  GATE_HOME_PATH,
  GATE_PASSWORD_FIELD,
  GATE_UNAVAILABLE_MESSAGE,
  GATE_UNLOCK_ENDPOINT,
  UNLOCK_CTA,
  UNLOCK_LABEL,
  parseUnlockSubmission,
  resolveNextPath,
} from "../../lib/gate";

function hardNavigate(next: string) {
  window.location.assign(next);
}

export function UnlockForm({
  next = GATE_HOME_PATH,
  onUnlocked = hardNavigate,
}: {
  next?: string;
  onUnlocked?: (next: string) => void;
}) {
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    let submission;

    try {
      submission = parseUnlockSubmission({
        password: form.get(GATE_PASSWORD_FIELD),
        next,
      });
    } catch (caught) {
      setError((caught as Error).message);
      return;
    }

    setError("");
    setPending(true);

    try {
      const response = await fetch(GATE_UNLOCK_ENDPOINT, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(submission),
      });
      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(payload.error || GATE_UNAVAILABLE_MESSAGE);
        setPending(false);
        return;
      }

      onUnlocked(resolveNextPath(payload.next));
    } catch {
      setError(GATE_UNAVAILABLE_MESSAGE);
      setPending(false);
    }
  }

  return (
    <form className="unlock-form" noValidate onSubmit={handleSubmit}>
      <div className="unlock-form__field">
        <label htmlFor={GATE_PASSWORD_FIELD}>{UNLOCK_LABEL}</label>
        <input
          aria-invalid={error ? true : undefined}
          autoComplete="current-password"
          autoFocus
          id={GATE_PASSWORD_FIELD}
          name={GATE_PASSWORD_FIELD}
          type="password"
        />
      </div>
      {error ? (
        <p className="form-error" role="alert">
          {error}
        </p>
      ) : null}
      <button className="button-link" disabled={pending} type="submit">
        {UNLOCK_CTA}
      </button>
    </form>
  );
}
