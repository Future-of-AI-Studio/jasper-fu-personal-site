import { describe, expect, it } from "vitest";

import {
  type InquirySubmission,
  MAX_CONTACT_NAME_LENGTH,
  MAX_CONTACT_NOTES_LENGTH,
  MAX_CONTACT_ORGANIZATION_LENGTH,
  MEDIA_KIT_INQUIRY_LABEL,
  MEDIA_KIT_INQUIRY_TYPE,
  assertMediaKitInquiryLabel,
  createMailto,
  inquiryLabels,
  inquiryTypes,
  parseInquirySubmission,
  parseInquiryTypeOptions,
  routeInquiry,
  assertInquiryRouteGroups,
  EMPTY_INQUIRY_DRAFT,
  inquiryFieldErrors,
  inquiryNeedsScheduling,
  inquiryRouteGroups,
  isInquiryReady,
  REQUIRED_INQUIRY_FIELDS,
  routeGroupFor,
} from "./contact";
import { identity } from "./identity";

function makeInquiry(
  overrides: Partial<InquirySubmission> = {},
): Record<string, unknown> {
  return {
    name: "Jane King",
    organization: "NASDAQ",
    email: "jane@example.com",
    inquiryType: "interview",
    notes: "Need a comment on stablecoin infrastructure.",
    deadline: "2026-08-20",
    ...overrides,
  };
}

function verifyInquiry(submission: InquirySubmission) {
  expect(submission.name).toBe("Jane King");
  expect(submission.organization).toBe("NASDAQ");
  expect(submission.email).toBe("jane@example.com");
  expect(submission.inquiryType).toBe("interview");
  expect(submission.routeTo).toBe("press@coinsub.io");
  expect(submission).not.toHaveProperty("slotStartIso");
}

function verifyInquiryFailure(
  overrides: Partial<Record<string, unknown>>,
  message: string,
) {
  expect(() => parseInquirySubmission(makeInquiry(overrides))).toThrow(message);
}

function verifyMediaKitInquiry(submission: InquirySubmission) {
  expect(submission.inquiryType).toBe(MEDIA_KIT_INQUIRY_TYPE);
  expect(inquiryLabels[submission.inquiryType]).toBe(MEDIA_KIT_INQUIRY_LABEL);
  expect(submission.routeTo).toBe("press@coinsub.io");
}

function verifyMediaKitInquiryLabel(label: string) {
  expect(assertMediaKitInquiryLabel(label)).toBe(MEDIA_KIT_INQUIRY_LABEL);
}

describe("parseInquirySubmission", () => {
  it("parses a complete interview request", () => {
    verifyInquiry(parseInquirySubmission(makeInquiry()));
  });

  it("routes speaking requests to the speaking inbox", () => {
    const submission = parseInquirySubmission(
      makeInquiry({ inquiryType: "speaking" }),
    );
    expect(submission.routeTo).toBe("speaking@jasperfu.com");
    expect(routeInquiry("partnership")).toBe("partnerships@jasperfu.com");
  });

  it("publishes Request Media Kit as a press inquiry type", () => {
    expect(inquiryTypes).toContain(MEDIA_KIT_INQUIRY_TYPE);
    verifyMediaKitInquiryLabel(` ${MEDIA_KIT_INQUIRY_LABEL} `);
    verifyMediaKitInquiry(
      parseInquirySubmission(makeInquiry({ inquiryType: MEDIA_KIT_INQUIRY_TYPE })),
    );
  });

  it("rejects a missing Request Media Kit inquiry label", () => {
    expect(() => assertMediaKitInquiryLabel(" ")).toThrow(
      "Request Media Kit inquiry type is required",
    );
  });

  it("rejects the retired Download Media Kit inquiry type", () => {
    expect(() => assertMediaKitInquiryLabel("Download Media Kit")).toThrow(
      "Download Media Kit inquiry type is not published",
    );
  });

  it("rejects an unpublished media kit inquiry label", () => {
    expect(() => assertMediaKitInquiryLabel("Get the kit")).toThrow(
      "Media kit inquiry type must be Request Media Kit",
    );
  });

  it("offers every inquiry type by default", () => {
    expect(parseInquiryTypeOptions(inquiryTypes, "interview")).toEqual([
      ...inquiryTypes,
    ]);
  });

  it("narrows to a single type on a dedicated page", () => {
    expect(
      parseInquiryTypeOptions([MEDIA_KIT_INQUIRY_TYPE], MEDIA_KIT_INQUIRY_TYPE),
    ).toEqual([MEDIA_KIT_INQUIRY_TYPE]);
  });

  it("rejects a form with no inquiry type to pick", () => {
    expect(() => parseInquiryTypeOptions([], "interview")).toThrow(
      "Inquiry form needs at least one inquiry type",
    );
  });

  it("rejects duplicated inquiry types", () => {
    expect(() =>
      parseInquiryTypeOptions(["interview", "interview"], "interview"),
    ).toThrow("Inquiry types must each be unique");
  });

  it("rejects a default that is not among the offered types", () => {
    expect(() =>
      parseInquiryTypeOptions([MEDIA_KIT_INQUIRY_TYPE], "interview"),
    ).toThrow("interview is not among the offered inquiry types");
  });

  it("builds a mailto for a Request Media Kit inquiry", () => {
    const submission = parseInquirySubmission(
      makeInquiry({ inquiryType: MEDIA_KIT_INQUIRY_TYPE }),
    );
    const href = createMailto(submission);
    expect(href.startsWith("mailto:press@coinsub.io?")).toBe(true);
    expect(href).toContain(encodeURIComponent("Request Media Kit: NASDAQ"));
  });

  it.each([
    [{ name: "" }, "Name is required"],
    [{ name: "n".repeat(MAX_CONTACT_NAME_LENGTH + 1) }, "Name is too long"],
    [{ organization: "" }, "Organization is required"],
    [
      { organization: "o".repeat(MAX_CONTACT_ORGANIZATION_LENGTH + 1) },
      "Organization is too long",
    ],
    [{ email: "" }, "Email is required"],
    [{ email: "not-an-email" }, "Email must be valid"],
    [{ notes: "" }, "Notes are required"],
    [
      { notes: "n".repeat(MAX_CONTACT_NOTES_LENGTH + 1) },
      "Notes are too long",
    ],
    [{ inquiryType: "unknown" }, "Please select a valid inquiry type"],
  ] as const)("rejects invalid input with a specific error", (overrides, message) => {
    verifyInquiryFailure(overrides, message);
  });

  it.each([1, MAX_CONTACT_NOTES_LENGTH - 1, MAX_CONTACT_NOTES_LENGTH])(
    "accepts notes at the %i-character boundary",
    (length) => {
      expect(
        parseInquirySubmission(makeInquiry({ notes: "n".repeat(length) }))
          .notes,
      ).toHaveLength(length);
    },
  );

  it("builds a mailto to the routed inbox without a calendar slot", () => {
    const submission = parseInquirySubmission(makeInquiry());
    const href = createMailto(submission);
    expect(href.startsWith("mailto:press@coinsub.io?")).toBe(true);
    expect(href).toContain(encodeURIComponent("Interview request: NASDAQ"));
    expect(href).not.toContain("Requested slot");
  });
});

describe("inquiry route groups", () => {
  it("publishes one line per inbox, covering every type", () => {
    expect(assertInquiryRouteGroups()).toBe(inquiryRouteGroups);
    for (const type of inquiryTypes) {
      expect(routeGroupFor(type).email).toBe(routeInquiry(type));
    }
  });

  it("rejects an empty set of groups", () => {
    expect(() => assertInquiryRouteGroups([])).toThrow(
      "Inquiry route groups are required",
    );
  });

  it("rejects a group with no label", () => {
    expect(() =>
      assertInquiryRouteGroups([
        { label: "  ", email: identity.pressEmail, types: [...inquiryTypes] },
      ]),
    ).toThrow("Inquiry route group label is required");
  });

  it("rejects a group that routes nothing", () => {
    expect(() =>
      assertInquiryRouteGroups([
        { label: "Empty", email: identity.pressEmail, types: [] },
      ]),
    ).toThrow("Empty routes no inquiry types");
  });

  it("rejects a type claimed by two groups", () => {
    expect(() =>
      assertInquiryRouteGroups([
        { label: "One", email: identity.pressEmail, types: ["interview"] },
        { label: "Two", email: identity.pressEmail, types: ["interview"] },
      ]),
    ).toThrow("interview is routed by more than one group");
  });

  it("rejects a line that shows an inbox the mailto would not use", () => {
    // The failure this exists for: the page naming one address while the
    // request goes to another.
    expect(() =>
      assertInquiryRouteGroups([
        { label: "Wrong", email: identity.speakingEmail, types: ["interview"] },
      ]),
    ).toThrow("interview is shown routing to the wrong inbox");
  });

  it("rejects a type no group covers", () => {
    expect(() =>
      assertInquiryRouteGroups([
        { label: "Press", email: identity.pressEmail, types: ["interview"] },
      ]),
    ).toThrow("comment is routed by no group");
  });

  it("rejects a lookup for a type outside the taxonomy", () => {
    expect(() => routeGroupFor("nonsense" as never)).toThrow(
      "nonsense is routed by no group",
    );
  });
});

describe("inquiryNeedsScheduling", () => {
  it("offers a call for the types that are a conversation", () => {
    expect(inquiryNeedsScheduling("interview")).toBe(true);
    expect(inquiryNeedsScheduling("comment")).toBe(true);
    expect(inquiryNeedsScheduling("speaking")).toBe(true);
    expect(inquiryNeedsScheduling("partnership")).toBe(true);
  });

  it("withholds it where a call is not what is being asked for", () => {
    // A media kit is a file to send; "Other" is too vague to put a call in
    // front of.
    expect(inquiryNeedsScheduling("mediaKit")).toBe(false);
    expect(inquiryNeedsScheduling("other")).toBe(false);
  });

  it("decides for every published type", () => {
    for (const type of inquiryTypes) {
      expect(typeof inquiryNeedsScheduling(type)).toBe("boolean");
    }
  });
});

describe("inquiry draft validation", () => {
  const complete = {
    name: "Jane King",
    organization: "NASDAQ",
    email: "jane@example.com",
    inquiryType: "interview",
    notes: "Need a comment on rails.",
    deadline: "",
  };

  it("passes a complete draft", () => {
    expect(inquiryFieldErrors(complete)).toEqual({});
    expect(isInquiryReady(complete)).toBe(true);
  });

  it("reports every empty required field at once", () => {
    const errors = inquiryFieldErrors(EMPTY_INQUIRY_DRAFT);
    expect(errors).toEqual({
      name: "Name is required",
      organization: "Organization is required",
      email: "Email is required",
      notes: "Notes are required",
    });
    expect(isInquiryReady(EMPTY_INQUIRY_DRAFT)).toBe(false);
  });

  it("rejects a malformed email", () => {
    const errors = inquiryFieldErrors({ ...complete, email: "not-an-email" });
    expect(errors.email).toBe("Email must be valid");
    expect(isInquiryReady({ ...complete, email: "not-an-email" })).toBe(false);
  });

  it("holds at the length boundaries", () => {
    const atMax = {
      ...complete,
      name: "n".repeat(MAX_CONTACT_NAME_LENGTH),
      organization: "o".repeat(MAX_CONTACT_ORGANIZATION_LENGTH),
      notes: "x".repeat(MAX_CONTACT_NOTES_LENGTH),
    };
    expect(isInquiryReady(atMax)).toBe(true);
    expect(
      inquiryFieldErrors({ ...atMax, name: "n".repeat(MAX_CONTACT_NAME_LENGTH + 1) })
        .name,
    ).toBe("Name is too long");
  });

  it("treats the deadline as optional", () => {
    expect(isInquiryReady({ ...complete, deadline: "" })).toBe(true);
    expect(isInquiryReady({ ...complete, deadline: "Friday" })).toBe(true);
  });

  it("agrees with the submit path it shares a schema with", () => {
    // What the form says while you type cannot drift from what it says when
    // you send, because both run the same schema.
    expect(() => parseInquirySubmission(complete)).not.toThrow();
    expect(() =>
      parseInquirySubmission({ ...complete, email: "not-an-email" }),
    ).toThrow("Email must be valid");
  });

  it("names the required fields in form order", () => {
    expect(REQUIRED_INQUIRY_FIELDS).toEqual([
      "name",
      "organization",
      "email",
      "notes",
    ]);
  });
});
