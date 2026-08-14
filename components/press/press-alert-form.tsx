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
      <label htmlFor="alert-email">Email</label>
      <input id="alert-email" name="email" type="email" />
      {error ? (
        <p className="form-error" role="alert">
          {error}
        </p>
      ) : null}
      {mailto ? (
        <a className="button-link" href={mailto}>
          Confirm signup email
        </a>
      ) : null}
      <button className="button-link" type="submit">
        Notify me
      </button>
    </form>
  );
}
