"use client";

import { type FormEvent, useState } from "react";

import { parsePressAlertEmail } from "../../lib/press-alert";

export function PressAlertForm() {
  const [error, setError] = useState("");
  const [mailto, setMailto] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    try {
      const email = parsePressAlertEmail(form.get("email"));
      setError("");
      setMailto(
        `mailto:press@coinsub.io?subject=${encodeURIComponent("Press alert signup")}&body=${encodeURIComponent(`Please add ${email} to press alerts.`)}`,
      );
    } catch (caught) {
      setMailto("");
      setError((caught as Error).message);
    }
  }

  return (
    <form className="alert-form" noValidate onSubmit={handleSubmit}>
      {/* The field and its button share a line — stacked full-width they
          stretched the whole page and read as a broken layout. */}
      <div className="alert-form__field">
        <label htmlFor="alert-email">Email</label>
        <input
          aria-invalid={error ? true : undefined}
          autoComplete="email"
          id="alert-email"
          name="email"
          placeholder="you@outlet.com"
          type="email"
        />
      </div>
      <button className="button-link" type="submit">
        Notify me
      </button>
      {error ? (
        <p className="form-error" role="alert">
          {error}
        </p>
      ) : null}
      {mailto ? (
        <a className="button-link button-link--ghost" href={mailto}>
          Confirm signup email
        </a>
      ) : null}
    </form>
  );
}
