"use client";

import { type FormEvent, useMemo, useState } from "react";

import {
  createMailto,
  EMPTY_INQUIRY_DRAFT,
  inquiryFieldErrors,
  inquiryLabels,
  inquiryNeedsScheduling,
  inquiryTypes,
  isInquiryReady,
  parseInquirySubmission,
  parseInquiryTypeOptions,
  REQUIRED_INQUIRY_FIELDS,
  type InquiryDraft,
  type InquiryField,
  type InquiryType,
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

const INCOMPLETE_HINT =
  "Add your name, organization, a valid email, and a note to send this request.";

export function InquiryForm({
  defaultType = "interview",
  types = inquiryTypes,
  showScheduling = true,
  onCancel,
  onTypeChange,
}: {
  defaultType?: InquiryType;
  /** Narrowed on pages dedicated to a single kind of request. */
  types?: readonly InquiryType[];
  /**
   * Whether this form may offer scheduling at all. Even when it may, the
   * link only shows for types that book a conversation.
   */
  showScheduling?: boolean;
  /** Adds a Cancel action beside submit — used when the form is in a dialog. */
  onCancel?: () => void;
  /** Lets the page mirror the reader's choice, e.g. in the routing list. */
  onTypeChange?: (inquiryType: InquiryType) => void;
}) {
  const options = parseInquiryTypeOptions(types, defaultType);
  const [draft, setDraft] = useState<InquiryDraft>({
    ...EMPTY_INQUIRY_DRAFT,
    inquiryType: defaultType,
  });
  const [touched, setTouched] = useState<Partial<Record<InquiryField, true>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [mailto, setMailto] = useState("");

  const errors = useMemo(() => inquiryFieldErrors(draft), [draft]);
  const ready = isInquiryReady(draft);
  const inquiryType = draft.inquiryType as InquiryType;
  // Two gates: the form has to allow scheduling, and the chosen type has to
  // be one that books a conversation rather than asks for a file.
  const offersScheduling = showScheduling && inquiryNeedsScheduling(inquiryType);

  /** Shown once the reader has left the field, or tried to send. */
  const shownError = (field: InquiryField) =>
    submitted || touched[field] ? (errors[field] ?? "") : "";

  function update(field: InquiryField, value: string) {
    setDraft((previous) => ({ ...previous, [field]: value }));
    if (field === "inquiryType") {
      onTypeChange?.(value as InquiryType);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);

    try {
      const parsed = parseInquirySubmission(draft);
      setError("");
      setMailto(createMailto(parsed));
    } catch (caught) {
      setMailto("");
      setError((caught as Error).message);
    }
  }

  const fieldProps = (field: InquiryField) => ({
    id: field,
    name: field,
    value: draft[field],
    onChange: (
      event: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) => update(field, event.target.value),
    onBlur: () => setTouched((previous) => ({ ...previous, [field]: true })),
    "aria-invalid": shownError(field) ? (true as const) : undefined,
    "aria-describedby": shownError(field) ? `${field}-error` : undefined,
  });

  const message = (field: InquiryField) => {
    const text = shownError(field);
    return text ? (
      <p className="form-error" id={`${field}-error`} role="alert">
        {text}
      </p>
    ) : null;
  };

  return (
    <form className="inquiry-form" id="inquiry-form" noValidate onSubmit={handleSubmit}>
      <div className="inquiry-form__field">
        <label htmlFor="name">Name</label>
        <input autoComplete="name" required type="text" {...fieldProps("name")} />
        {message("name")}
      </div>
      <div className="inquiry-form__field">
        <label htmlFor="organization">Organization / outlet</label>
        <input
          autoComplete="organization"
          required
          type="text"
          {...fieldProps("organization")}
        />
        {message("organization")}
      </div>
      {/* Email and deadline share a row: with the type picker hidden on a
          dedicated request, the deadline would otherwise sit alone. */}
      <div className="inquiry-form__field">
        <label htmlFor="email">Email</label>
        <input autoComplete="email" required type="email" {...fieldProps("email")} />
        {message("email")}
      </div>
      <div className="inquiry-form__field">
        <label htmlFor="deadline">Deadline (optional)</label>
        <input type="text" {...fieldProps("deadline")} />
      </div>
      {/* A single offered type is not a choice, so it travels as a hidden
          value rather than a select the reader cannot change. */}
      {options.length > 1 ? (
        <div className="inquiry-form__field inquiry-form__field--wide">
          <label htmlFor="inquiryType">Inquiry type</label>
          <select {...fieldProps("inquiryType")}>
            {options.map((type) => (
              <option key={type} value={type}>
                {inquiryLabels[type]}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <input name="inquiryType" type="hidden" value={draft.inquiryType} readOnly />
      )}
      <div className="inquiry-form__field inquiry-form__field--wide">
        <label htmlFor="notes">Notes</label>
        <textarea required rows={6} {...fieldProps("notes")} />
        {message("notes")}
      </div>
      {offersScheduling ? (
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
      {/* A disabled button cannot be focused and says nothing about why, so
          it is described by this line rather than left to be guessed at. */}
      {!ready ? (
        <p className="form-note" id="inquiry-incomplete">
          {INCOMPLETE_HINT}
        </p>
      ) : null}
      {error ? (
        <p className="form-error" role="alert">
          {error}
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
        <button
          aria-describedby={ready ? undefined : "inquiry-incomplete"}
          className="button-link"
          disabled={!ready}
          type="submit"
        >
          {assertSendRequestCta(SEND_REQUEST_CTA)}
        </button>
      </div>
    </form>
  );
}

export { REQUIRED_INQUIRY_FIELDS };
