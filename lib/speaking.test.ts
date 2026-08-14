import { describe, expect, it } from "vitest";

import { identity } from "./identity";
import {
  type SpeakingBooking,
  type SpeakingBookingDraft,
  MAX_SPEAKING_AUDIENCE,
  MAX_SPEAKING_BUDGET,
  MAX_SPEAKING_DATE,
  MAX_SPEAKING_EVENT_NAME,
  MAX_SPEAKING_LOCATION,
  MAX_SPEAKING_NAME,
  MAX_SPEAKING_NOTES,
  MAX_SPEAKING_ORGANIZATION,
  MAX_SPEAKING_PHONE,
  SPEAKING_NOTES_PREVIEW_MAX,
  compileSpeakingRequestJson,
  countFilledSpeakingPreview,
  createSpeakingMailto,
  emptySpeakingBooking,
  engagementTypes,
  parseSpeakingBooking,
  speakingPreviewEntries,
  speakingRequestPayload,
  truncateSpeakingNotes,
} from "./speaking";

function makeSpeakingDraft(
  overrides: Partial<SpeakingBookingDraft> = {},
): SpeakingBookingDraft {
  return {
    ...emptySpeakingBooking,
    engagementType: "Conference keynote",
    eventName: "AI Summit 2026",
    date: "Oct 14–15",
    location: "New York",
    audience: "500",
    name: "Jane Doe",
    organization: "NASDAQ",
    email: "jane@example.com",
    phone: "+1 555 000 0000",
    budget: "$10k–$15k",
    notes: "Audience makeup, format constraints.",
    ...overrides,
  };
}

function verifySpeakingBooking(booking: SpeakingBooking) {
  expect(booking.engagementType).toBe("Conference keynote");
  expect(booking.eventName).toBe("AI Summit 2026");
  expect(booking.name).toBe("Jane Doe");
  expect(booking.organization).toBe("NASDAQ");
  expect(booking.email).toBe("jane@example.com");
  expect(booking.routeTo).toBe(identity.bookingEmail);
}

function verifySpeakingFailure(
  overrides: Partial<SpeakingBookingDraft>,
  message: string,
) {
  expect(() => parseSpeakingBooking(makeSpeakingDraft(overrides))).toThrow(
    message,
  );
}

describe("parseSpeakingBooking", () => {
  it("parses a complete speaking request on the happy path", () => {
    verifySpeakingBooking(parseSpeakingBooking(makeSpeakingDraft()));
  });

  it("rejects a missing engagement type", () => {
    verifySpeakingFailure({ engagementType: "" }, "Engagement type is required");
  });

  it("rejects an unpublished engagement type", () => {
    verifySpeakingFailure(
      { engagementType: "Birthday party" },
      "Please select a valid engagement type",
    );
  });

  it("rejects a missing event name", () => {
    verifySpeakingFailure({ eventName: "" }, "Event name is required");
  });

  it("rejects a missing full name", () => {
    verifySpeakingFailure({ name: " " }, "Full name is required");
  });

  it("rejects a missing organization", () => {
    verifySpeakingFailure({ organization: "" }, "Organization is required");
  });

  it("rejects a missing email", () => {
    verifySpeakingFailure({ email: "" }, "Email is required");
  });

  it("rejects an invalid email", () => {
    verifySpeakingFailure({ email: "not-an-email" }, "Email must be valid");
  });

  it("accepts optional fields when blank", () => {
    const booking = parseSpeakingBooking(
      makeSpeakingDraft({
        date: " ",
        location: "",
        audience: "",
        phone: "",
        budget: "",
        notes: "",
      }),
    );
    verifySpeakingBooking(booking);
    expect(booking.date).toBeUndefined();
    expect(booking.phone).toBeUndefined();
    expect(booking.notes).toBeUndefined();
  });

  it.each([
    [{ eventName: "e".repeat(MAX_SPEAKING_EVENT_NAME + 1) }, "Event name is too long"],
    [{ date: "d".repeat(MAX_SPEAKING_DATE + 1) }, "Date is too long"],
    [{ location: "l".repeat(MAX_SPEAKING_LOCATION + 1) }, "Location is too long"],
    [{ audience: "a".repeat(MAX_SPEAKING_AUDIENCE + 1) }, "Audience size is too long"],
    [{ name: "n".repeat(MAX_SPEAKING_NAME + 1) }, "Full name is too long"],
    [
      { organization: "o".repeat(MAX_SPEAKING_ORGANIZATION + 1) },
      "Organization is too long",
    ],
    [{ phone: "p".repeat(MAX_SPEAKING_PHONE + 1) }, "Phone is too long"],
    [{ budget: "b".repeat(MAX_SPEAKING_BUDGET + 1) }, "Budget range is too long"],
    [{ notes: "n".repeat(MAX_SPEAKING_NOTES + 1) }, "Notes are too long"],
  ] as const)("rejects oversized %s", (overrides, message) => {
    verifySpeakingFailure(overrides, message);
  });

  it.each([1, MAX_SPEAKING_NOTES - 1, MAX_SPEAKING_NOTES])(
    "accepts notes at the %i-character boundary",
    (length) => {
      expect(
        parseSpeakingBooking(makeSpeakingDraft({ notes: "n".repeat(length) }))
          .notes,
      ).toHaveLength(length);
    },
  );

  it("accepts every published engagement type", () => {
    for (const engagementType of engagementTypes) {
      expect(
        parseSpeakingBooking(makeSpeakingDraft({ engagementType })).engagementType,
      ).toBe(engagementType);
    }
  });
});

describe("speaking preview and mailto", () => {
  it("counts filled preview fields and truncates notes", () => {
    const empty = countFilledSpeakingPreview(emptySpeakingBooking);
    expect(empty).toBe(0);
    const filled = speakingPreviewEntries(makeSpeakingDraft());
    expect(countFilledSpeakingPreview(makeSpeakingDraft())).toBe(filled.length);
    expect(truncateSpeakingNotes("")).toBe("");
    expect(truncateSpeakingNotes("n".repeat(SPEAKING_NOTES_PREVIEW_MAX))).toHaveLength(
      SPEAKING_NOTES_PREVIEW_MAX,
    );
    expect(
      truncateSpeakingNotes("n".repeat(SPEAKING_NOTES_PREVIEW_MAX + 1)),
    ).toBe(`${"n".repeat(SPEAKING_NOTES_PREVIEW_MAX)}…`);
  });

  it("compiles request.json into the mailto body, not the button", () => {
    const empty = speakingRequestPayload(emptySpeakingBooking);
    expect(empty.engagement_type).toBeNull();
    expect(empty.event_name).toBeNull();
    expect(compileSpeakingRequestJson(emptySpeakingBooking)).toContain(
      '"engagement_type": null',
    );

    const longNotes = "n".repeat(SPEAKING_NOTES_PREVIEW_MAX + 8);
    const preview = speakingRequestPayload(
      makeSpeakingDraft({ notes: longNotes }),
      "preview",
    );
    const sent = speakingRequestPayload(
      makeSpeakingDraft({ notes: longNotes }),
      "send",
    );
    expect(preview.notes).toBe(`${"n".repeat(SPEAKING_NOTES_PREVIEW_MAX)}…`);
    expect(sent.notes).toBe(longNotes);

    const href = createSpeakingMailto(parseSpeakingBooking(makeSpeakingDraft()));
    expect(href.startsWith("mailto:speaking@jasperfu.io?")).toBe(true);
    expect(href).toContain(
      encodeURIComponent("Conference keynote — AI Summit 2026"),
    );
    expect(href).toContain(
      encodeURIComponent(compileSpeakingRequestJson(makeSpeakingDraft(), "send")),
    );
    expect(href).not.toContain("mailto:speaking@jasperfu.com?");
    expect(href).not.toContain("mailto:info@jasperfu.io");
    expect(href).not.toContain("mailto:press@coinsub.io");
  });

  it("rejects a speaking mailto that uses the retired speaking.com inbox", () => {
    const booking = parseSpeakingBooking(makeSpeakingDraft());
    expect(() =>
      createSpeakingMailto({ ...booking, routeTo: identity.speakingEmail }),
    ).toThrow("speaking@jasperfu.com booking inbox is not published");
  });

  it("rejects a speaking mailto that uses the retired info inbox", () => {
    const booking = parseSpeakingBooking(makeSpeakingDraft());
    expect(() =>
      createSpeakingMailto({ ...booking, routeTo: "info@jasperfu.io" }),
    ).toThrow("info@jasperfu.io booking inbox is not published");
  });

  it("rejects a missing booking inbox on a speaking mailto", () => {
    const booking = parseSpeakingBooking(makeSpeakingDraft());
    expect(() => createSpeakingMailto({ ...booking, routeTo: " " })).toThrow(
      "Booking inbox is required",
    );
  });

  it("rejects a speaking mailto that is not the booking inbox", () => {
    const booking = parseSpeakingBooking(makeSpeakingDraft());
    expect(() =>
      createSpeakingMailto({ ...booking, routeTo: identity.pressEmail }),
    ).toThrow("Booking inbox must be speaking@jasperfu.io");
  });
});
