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
  routeInquiry,
} from "./contact";

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

  it("builds a mailto for a Request Media Kit inquiry", () => {
    const submission = parseInquirySubmission(
      makeInquiry({ inquiryType: MEDIA_KIT_INQUIRY_TYPE }),
    );
    const href = createMailto(submission);
    expect(href.startsWith("mailto:press@coinsub.io?")).toBe(true);
    expect(href).toContain(encodeURIComponent("Request Media Kit — NASDAQ"));
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
    expect(href).toContain(encodeURIComponent("Interview request — NASDAQ"));
    expect(href).not.toContain("Requested slot");
  });
});
