"use client";

import { type FormEvent, type ReactNode, useState } from "react";

import { SEND_REQUEST_CTA, assertSendRequestCta } from "../../lib/copy";
import {
  type SpeakingBookingDraft,
  createSpeakingMailto,
  emptySpeakingBooking,
  engagementTypes,
  parseSpeakingBooking,
} from "../../lib/speaking";

const ERROR_FIELDS: Record<string, keyof SpeakingBookingDraft> = {
  "Engagement type is required": "engagementType",
  "Please select a valid engagement type": "engagementType",
  "Event name is required": "eventName",
  "Event name is too long": "eventName",
  "Date is too long": "date",
  "Location is too long": "location",
  "Audience size is too long": "audience",
  "Full name is required": "name",
  "Full name is too long": "name",
  "Organization is required": "organization",
  "Organization is too long": "organization",
  "Email is required": "email",
  "Email must be valid": "email",
  "Phone is too long": "phone",
  "Budget range is too long": "budget",
  "Notes are too long": "notes",
};

function SpeakingField({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="speaking-field">
      <label htmlFor={htmlFor}>{label}</label>
      {children}
      {error ? (
        <p className="form-error" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function BookJasperForm() {
  const [draft, setDraft] = useState<SpeakingBookingDraft>(emptySpeakingBooking);
  const [error, setError] = useState("");
  const [mailto, setMailto] = useState("");

  function update(key: keyof SpeakingBookingDraft) {
    return (value: string) => {
      setDraft((current) => ({ ...current, [key]: value }));
    };
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      const parsed = parseSpeakingBooking(draft);
      setError("");
      setMailto(createSpeakingMailto(parsed));
    } catch (caught) {
      setMailto("");
      setError((caught as Error).message);
    }
  }

  const errorField = ERROR_FIELDS[error];
  const fieldError = (key: keyof SpeakingBookingDraft) =>
    errorField === key ? error : "";

  if (mailto) {
    return (
      <div className="speaking-booking speaking-booking--sent" id="speaking-booking">
        <p className="eyebrow">Booking</p>
        <h3>Request prepared</h3>
        <p>
          Thanks{draft.name.trim() ? `, ${draft.name.trim()}` : ""} — open email to send
          this speaking request.
        </p>
        <a className="button-link" href={mailto}>
          Open email to send
        </a>
        <button
          className="button-link button-link--ghost"
          type="button"
          onClick={() => {
            setMailto("");
            setError("");
          }}
        >
          Submit another
        </button>
      </div>
    );
  }

  return (
    <div className="speaking-booking" id="speaking-booking">
      <form className="speaking-booking__form" noValidate onSubmit={handleSubmit}>
        <div className="speaking-booking__pills">
          <p className="eyebrow" id="engagement-type-label">
            Engagement type
          </p>
          <div
            aria-labelledby="engagement-type-label"
            className="speaking-pills"
            role="group"
          >
            {engagementTypes.map((type) => (
              <button
                aria-pressed={draft.engagementType === type}
                key={type}
                onClick={() => update("engagementType")(type)}
                type="button"
              >
                {type}
              </button>
            ))}
          </div>
          {fieldError("engagementType") ? (
            <p className="form-error" role="alert">
              {fieldError("engagementType")}
            </p>
          ) : null}
        </div>

        <p className="eyebrow speaking-booking__section">01 — Event details</p>
        <div className="speaking-booking__grid">
          <SpeakingField
            error={fieldError("eventName")}
            htmlFor="speaking-event-name"
            label="Event name"
          >
            <input
              id="speaking-event-name"
              onChange={(event) => update("eventName")(event.target.value)}
              placeholder="AI Summit 2026"
              value={draft.eventName}
            />
          </SpeakingField>
          <SpeakingField error={fieldError("date")} htmlFor="speaking-date" label="Date(s)">
            <input
              id="speaking-date"
              onChange={(event) => update("date")(event.target.value)}
              placeholder="Oct 14–15"
              value={draft.date}
            />
          </SpeakingField>
          <SpeakingField
            error={fieldError("location")}
            htmlFor="speaking-location"
            label="Location"
          >
            <input
              id="speaking-location"
              onChange={(event) => update("location")(event.target.value)}
              placeholder="City or Virtual"
              value={draft.location}
            />
          </SpeakingField>
          <SpeakingField
            error={fieldError("audience")}
            htmlFor="speaking-audience"
            label="Expected audience"
          >
            <input
              id="speaking-audience"
              onChange={(event) => update("audience")(event.target.value)}
              placeholder="e.g. 500"
              value={draft.audience}
            />
          </SpeakingField>
        </div>

        <p className="eyebrow speaking-booking__section">02 — Requester info</p>
        <div className="speaking-booking__grid">
          <SpeakingField error={fieldError("name")} htmlFor="speaking-name" label="Full name">
            <input
              autoComplete="name"
              id="speaking-name"
              onChange={(event) => update("name")(event.target.value)}
              placeholder="Jane Doe"
              value={draft.name}
            />
          </SpeakingField>
          <SpeakingField
            error={fieldError("organization")}
            htmlFor="speaking-organization"
            label="Organization"
          >
            <input
              autoComplete="organization"
              id="speaking-organization"
              onChange={(event) => update("organization")(event.target.value)}
              placeholder="Company / publication"
              value={draft.organization}
            />
          </SpeakingField>
          <SpeakingField error={fieldError("email")} htmlFor="speaking-email" label="Email">
            <input
              autoComplete="email"
              id="speaking-email"
              onChange={(event) => update("email")(event.target.value)}
              placeholder="jane@company.com"
              type="email"
              value={draft.email}
            />
          </SpeakingField>
          <SpeakingField
            error={fieldError("phone")}
            htmlFor="speaking-phone"
            label="Phone (optional)"
          >
            <input
              autoComplete="tel"
              id="speaking-phone"
              onChange={(event) => update("phone")(event.target.value)}
              placeholder="+1 555 000 0000"
              value={draft.phone}
            />
          </SpeakingField>
        </div>

        <p className="eyebrow speaking-booking__section">03 — Additional context</p>
        <SpeakingField
          error={fieldError("budget")}
          htmlFor="speaking-budget"
          label="Budget / honorarium range"
        >
          <input
            id="speaking-budget"
            onChange={(event) => update("budget")(event.target.value)}
            placeholder="e.g. $10k–$15k, or Flexible"
            value={draft.budget}
          />
        </SpeakingField>
        <SpeakingField
          error={fieldError("notes")}
          htmlFor="speaking-notes"
          label="Anything else we should know?"
        >
          <textarea
            id="speaking-notes"
            onChange={(event) => update("notes")(event.target.value)}
            placeholder="Audience makeup, format constraints, travel notes…"
            rows={5}
            value={draft.notes}
          />
        </SpeakingField>

        {error && !errorField ? (
          <p className="form-error" role="alert">
            {error}
          </p>
        ) : null}

        <button className="button-link" type="submit">
          {assertSendRequestCta(SEND_REQUEST_CTA)}
        </button>
      </form>
    </div>
  );
}
