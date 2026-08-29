import { z } from "zod";

import { assertBookingEmail, identity } from "./identity";

export const engagementTypes = [
  "Conference keynote",
  "Panel discussion",
  "Corporate / private event",
  "Podcast or media interview",
  "Fireside chat / moderated Q&A",
  "Workshop",
  "Other",
] as const;

export type EngagementType = (typeof engagementTypes)[number];

export const MAX_SPEAKING_EVENT_NAME = 160;
export const MAX_SPEAKING_LOCATION = 120;
export const MAX_SPEAKING_AUDIENCE = 40;
export const MAX_SPEAKING_NAME = 80;
export const MAX_SPEAKING_ORGANIZATION = 120;
export const MAX_SPEAKING_PHONE = 40;
export const MAX_SPEAKING_BUDGET = 80;
export const MAX_SPEAKING_NOTES = 2_000;
export const SPEAKING_NOTES_PREVIEW_MAX = 40;

export type SpeakingBookingDraft = {
  engagementType: string;
  eventName: string;
  startDate: string;
  endDate: string;
  location: string;
  audience: string;
  name: string;
  organization: string;
  email: string;
  phone: string;
  budget: string;
  notes: string;
};

export const emptySpeakingBooking: SpeakingBookingDraft = {
  engagementType: "",
  eventName: "",
  startDate: "",
  endDate: "",
  location: "",
  audience: "",
  name: "",
  organization: "",
  email: "",
  phone: "",
  budget: "",
  notes: "",
};

function optionalLimited(max: number, tooLong: string) {
  return z
    .string()
    .trim()
    .max(max, tooLong)
    .transform((value) => value || undefined);
}

/** What <input type="date"> submits. */
export const SPEAKING_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

/**
 * The pattern only proves the shape — "2026-13-01" is four-two-two digits
 * and still not a date. Round-tripping through Date is what rejects an
 * impossible month or day.
 */
export function isSpeakingDate(value: string) {
  if (!SPEAKING_DATE_PATTERN.test(value)) {
    return false;
  }
  const parsed = new Date(`${value}T00:00:00Z`);
  return (
    !Number.isNaN(parsed.getTime()) &&
    parsed.toISOString().slice(0, 10) === value
  );
}

function optionalDate(label: string) {
  return z
    .string()
    .trim()
    .refine((value) => value === "" || isSpeakingDate(value), {
      message: `${label} must be a valid date`,
    })
    .transform((value) => value || undefined);
}

const speakingBookingSchema = z.object({
  engagementType: z
    .string({ error: "Engagement type is required" })
    .trim()
    .min(1, "Engagement type is required")
    .refine(
      (value): value is EngagementType =>
        (engagementTypes as readonly string[]).includes(value),
      { message: "Please select a valid engagement type" },
    ),
  eventName: z
    .string({ error: "Event name is required" })
    .trim()
    .min(1, "Event name is required")
    .max(MAX_SPEAKING_EVENT_NAME, "Event name is too long"),
  startDate: optionalDate("Start date"),
  endDate: optionalDate("End date"),
  location: optionalLimited(MAX_SPEAKING_LOCATION, "Location is too long"),
  audience: optionalLimited(MAX_SPEAKING_AUDIENCE, "Audience size is too long"),
  name: z
    .string({ error: "Full name is required" })
    .trim()
    .min(1, "Full name is required")
    .max(MAX_SPEAKING_NAME, "Full name is too long"),
  organization: z
    .string({ error: "Organization is required" })
    .trim()
    .min(1, "Organization is required")
    .max(MAX_SPEAKING_ORGANIZATION, "Organization is too long"),
  email: z
    .string({ error: "Email is required" })
    .trim()
    .min(1, "Email is required")
    .email("Email must be valid"),
  phone: optionalLimited(MAX_SPEAKING_PHONE, "Phone is too long"),
  budget: optionalLimited(MAX_SPEAKING_BUDGET, "Budget range is too long"),
  notes: optionalLimited(MAX_SPEAKING_NOTES, "Notes are too long"),
})
  // A range the free-text field could never check. ISO dates compare
  // correctly as strings, so an equal pair is a valid single-day booking.
  .superRefine((booking, ctx) => {
    if (booking.endDate && !booking.startDate) {
      ctx.addIssue({
        code: "custom",
        message: "Start date is required with an end date",
        path: ["startDate"],
      });
      return;
    }
    if (
      booking.startDate &&
      booking.endDate &&
      booking.endDate < booking.startDate
    ) {
      ctx.addIssue({
        code: "custom",
        message: "End date cannot be before the start date",
        path: ["endDate"],
      });
    }
  });

export type SpeakingBooking = z.infer<typeof speakingBookingSchema> & {
  routeTo: string;
};

export function truncateSpeakingNotes(notes: string) {
  const trimmed = notes.trim();
  if (trimmed.length <= SPEAKING_NOTES_PREVIEW_MAX) {
    return trimmed;
  }
  return `${trimmed.slice(0, SPEAKING_NOTES_PREVIEW_MAX)}…`;
}

export function speakingPreviewEntries(draft: SpeakingBookingDraft) {
  return [
    ["engagement_type", draft.engagementType.trim()],
    ["event_name", draft.eventName.trim()],
    ["start_date", draft.startDate.trim()],
    ["end_date", draft.endDate.trim()],
    ["location", draft.location.trim()],
    ["audience_size", draft.audience.trim()],
    ["requested_by", draft.name.trim()],
    ["organization", draft.organization.trim()],
    ["email", draft.email.trim()],
    ["phone", draft.phone.trim()],
    ["budget_range", draft.budget.trim()],
    ["notes", truncateSpeakingNotes(draft.notes)],
  ] as const;
}

export function countFilledSpeakingPreview(
  draft: SpeakingBookingDraft,
) {
  return speakingPreviewEntries(draft).filter(([, value]) => value).length;
}

export function speakingRequestPayload(
  draft: SpeakingBookingDraft,
  mode: "preview" | "send" = "preview",
) {
  const payload: Record<string, string | null> = {};
  for (const [key, value] of speakingPreviewEntries(draft)) {
    payload[key] = value || null;
  }
  if (mode === "send") {
    payload.notes = draft.notes.trim() || null;
  }
  return payload;
}

export function compileSpeakingRequestJson(
  draft: SpeakingBookingDraft,
  mode: "preview" | "send" = "preview",
) {
  return JSON.stringify(speakingRequestPayload(draft, mode), null, 2);
}

export function speakingDraftFromBooking(booking: SpeakingBooking): SpeakingBookingDraft {
  return {
    engagementType: booking.engagementType,
    eventName: booking.eventName,
    startDate: booking.startDate ?? "",
    endDate: booking.endDate ?? "",
    location: booking.location ?? "",
    audience: booking.audience ?? "",
    name: booking.name,
    organization: booking.organization,
    email: booking.email,
    phone: booking.phone ?? "",
    budget: booking.budget ?? "",
    notes: booking.notes ?? "",
  };
}

export function parseSpeakingBooking(input: unknown): SpeakingBooking {
  const result = speakingBookingSchema.safeParse(input);

  if (!result.success) {
    throw new Error(result.error.issues[0]!.message);
  }

  return {
    ...result.data,
    routeTo: assertBookingEmail(identity.bookingEmail),
  };
}

export function createSpeakingMailto(booking: SpeakingBooking) {
  assertBookingEmail(booking.routeTo);

  const subject = encodeURIComponent(
    `${booking.engagementType} — ${booking.eventName}`,
  );
  const body = encodeURIComponent(
    compileSpeakingRequestJson(speakingDraftFromBooking(booking), "send"),
  );

  return `mailto:${booking.routeTo}?subject=${subject}&body=${body}`;
}
