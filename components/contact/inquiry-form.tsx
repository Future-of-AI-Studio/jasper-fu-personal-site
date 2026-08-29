"use client";

import { type FormEvent, useState } from "react";

import {
  createMailto,
  inquiryLabels,
  inquiryTypes,
  parseInquirySubmission,
  parseInquiryTypeOptions,
} from "../../lib/contact";
import {
  SEND_REQUEST_CTA,
  assertCalendlyPrompt,
  assertResponseTimeNote,
  assertSendRequestCta,
  calendlyPrompt,
  responseTimeNote,
} from "../../lib/copy";
import { assertCalendlyUrl, identity } from "../../lib/identity";

const NAME_REQUIRED = "Name is required";

export function InquiryForm({
  defaultType = "interview",
  types = inquiryTypes,
  showScheduling = true,
  onCancel,
}: {
  defaultType?: (typeof inquiryTypes)[number];
  /** Narrowed on pages dedicated to a single kind of request. */
  types?: readonly (typeof inquiryTypes)[number][];
  /** Calendly books a conversation, which a media-kit request does not need. */
  showScheduling?: boolean;
  /** Adds a Cancel action beside submit — used when the form is in a dialog. */
  onCancel?: () => void;
}) {
  const options = parseInquiryTypeOptions(types, defaultType);
  const [error, setError] = useState("");
  const [mailto, setMailto] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    try {
      const parsed = parseInquirySubmission({
        name: form.get("name"),
        organization: form.get("organization"),
        email: form.get("email"),
        inquiryType: form.get("inquiryType"),
        notes: form.get("notes"),
        deadline: form.get("deadline"),
      });
      setError("");
      setMailto(createMailto(parsed));
    } catch (caught) {
      setMailto("");
      setError((caught as Error).message);
    }
  }

  const nameError = error === NAME_REQUIRED ? error : "";
  const submitError = error && error !== NAME_REQUIRED ? error : "";

  return (
    <form className="inquiry-form" id="inquiry-form" noValidate onSubmit={handleSubmit}>
      <div className="inquiry-form__field">
        <label htmlFor="name">Name</label>
        <input
          aria-invalid={nameError ? true : undefined}
          autoComplete="name"
          id="name"
          name="name"
          type="text"
        />
        {nameError ? (
          <p className="form-error" role="alert">
            {nameError}
          </p>
        ) : null}
      </div>
      <div className="inquiry-form__field">
        <label htmlFor="organization">Organization / outlet</label>
        <input
          autoComplete="organization"
          id="organization"
          name="organization"
          type="text"
        />
      </div>
      {/* Email and deadline share a row: with the type picker hidden on a
          dedicated request, the deadline would otherwise sit alone. */}
      <div className="inquiry-form__field">
        <label htmlFor="email">Email</label>
        <input autoComplete="email" id="email" name="email" type="email" />
      </div>
      <div className="inquiry-form__field">
        <label htmlFor="deadline">Deadline (optional)</label>
        <input id="deadline" name="deadline" type="text" />
      </div>
      {/* A single offered type is not a choice, so it travels as a hidden
          value rather than a select the reader cannot change. */}
      {options.length > 1 ? (
        <div className="inquiry-form__field inquiry-form__field--wide">
          <label htmlFor="inquiryType">Inquiry type</label>
          <select defaultValue={defaultType} id="inquiryType" name="inquiryType">
            {options.map((type) => (
              <option key={type} value={type}>
                {inquiryLabels[type]}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <input defaultValue={defaultType} name="inquiryType" type="hidden" />
      )}
      <div className="inquiry-form__field inquiry-form__field--wide">
        <label htmlFor="notes">Notes</label>
        <textarea id="notes" name="notes" rows={6} />
      </div>
      {showScheduling ? (
        <div className="inquiry-form__field inquiry-form__field--wide" data-calendly-block="">
          <p className="eyebrow">Book a time</p>
          <p>{assertCalendlyPrompt(calendlyPrompt)}</p>
          <a
            className="button-link"
            href={assertCalendlyUrl(identity.calendlyUrl)}
            rel="noreferrer"
            target="_blank"
          >
            Open Calendly
          </a>
        </div>
      ) : null}
      {mailto ? (
        <p>
          Request prepared.{" "}
          <a className="button-link" href={mailto}>
            Open email to send
          </a>
        </p>
      ) : null}
      <p className="form-note">{assertResponseTimeNote(responseTimeNote)}</p>
      {submitError ? (
        <p className="form-error" role="alert">
          {submitError}
        </p>
      ) : null}
      <div className="inquiry-form__actions">
        {onCancel ? (
          <button
            className="button-link button-link--ghost"
            onClick={onCancel}
            type="button"
          >
            Cancel
          </button>
        ) : null}
        <button className="button-link" type="submit">
          {assertSendRequestCta(SEND_REQUEST_CTA)}
        </button>
      </div>
    </form>
  );
}
