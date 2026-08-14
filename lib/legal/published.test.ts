import { describe, expect, it } from "vitest";

import { cookieSections, privacySections } from "./drafts";
import {
  INSERT_DATE_PLACEHOLDER,
  LEGAL_CONTACT_EMAIL,
  LEGAL_SITE_HOST,
  LEGAL_UPDATED,
  RETIRED_LEGAL_DRAFT_NOTICE,
  type LegalCopySection,
  assertLegalDraftNoticeOmitted,
  assertLegalSections,
  assertLegalUpdated,
} from "./published";
import { termsSections, termsUpdated } from "./terms";

function makeSection(
  overrides: Partial<LegalCopySection> = {},
): LegalCopySection {
  return {
    title: "Introduction",
    paragraphs: ["Published legal copy."],
    ...overrides,
  };
}

function verifyLegalUpdated(value: string) {
  expect(assertLegalUpdated(value)).toBe(LEGAL_UPDATED);
}

function verifyLegalDraftNoticeOmitted(value: string) {
  expect(assertLegalDraftNoticeOmitted(value)).toBe("");
}

function verifyPublishedPolicies() {
  expect(assertLegalUpdated(termsUpdated)).toBe(LEGAL_UPDATED);
  expect(privacySections).toHaveLength(15);
  expect(cookieSections).toHaveLength(7);
  expect(termsSections).toHaveLength(18);
  expect(
    privacySections.some((section) =>
      (section.paragraphs ?? []).some((paragraph) =>
        paragraph.includes(LEGAL_CONTACT_EMAIL),
      ),
    ),
  ).toBe(true);
  expect(
    termsSections.some((section) =>
      (section.paragraphs ?? []).some((paragraph) =>
        paragraph.includes(LEGAL_SITE_HOST),
      ),
    ),
  ).toBe(true);
}

describe("assertLegalUpdated", () => {
  it("accepts the published legal date", () => {
    verifyLegalUpdated(` ${LEGAL_UPDATED} `);
  });

  it("rejects a missing legal date", () => {
    expect(() => assertLegalUpdated(" ")).toThrow("Legal updated date is required");
  });

  it("rejects the Insert date placeholder", () => {
    expect(() => assertLegalUpdated(INSERT_DATE_PLACEHOLDER)).toThrow(
      "Insert date placeholder is not published",
    );
  });

  it("rejects an unpublished legal date", () => {
    expect(() => assertLegalUpdated("August 2, 2026")).toThrow(
      "Legal updated date must be August 14, 2026",
    );
  });
});

describe("assertLegalDraftNoticeOmitted", () => {
  it("accepts an omitted legal draft notice", () => {
    verifyLegalDraftNoticeOmitted(" ");
  });

  it("rejects the retired draft-review notice", () => {
    expect(() => assertLegalDraftNoticeOmitted(RETIRED_LEGAL_DRAFT_NOTICE)).toThrow(
      "Draft legal review notice is not published",
    );
  });

  it("rejects any other leftover legal draft notice", () => {
    expect(() => assertLegalDraftNoticeOmitted("Draft pending counsel.")).toThrow(
      "Legal draft notice must be omitted",
    );
  });
});

describe("assertLegalSections", () => {
  it("publishes privacy, cookie, and terms policies from the source document", () => {
    verifyPublishedPolicies();
  });

  it("rejects missing legal sections", () => {
    expect(() => assertLegalSections([])).toThrow("Legal sections are required");
  });

  it("rejects a blank legal section title", () => {
    expect(() => assertLegalSections([makeSection({ title: " " })])).toThrow(
      "Legal section 1 requires a title",
    );
  });

  it("rejects a legal section with no copy", () => {
    expect(() =>
      assertLegalSections([makeSection({ paragraphs: [], bullets: [], closing: [] })]),
    ).toThrow("Legal section 1 requires copy");
  });

  it("rejects an Insert date placeholder in legal copy", () => {
    expect(() =>
      assertLegalSections([
        makeSection({ paragraphs: [`Effective date: ${INSERT_DATE_PLACEHOLDER}`] }),
      ]),
    ).toThrow("Insert date placeholder is not published");
  });

  it("rejects a counsel placeholder in legal copy", () => {
    expect(() =>
      assertLegalSections([
        makeSection({ paragraphs: ["[Counsel to complete venue.]"] }),
      ]),
    ).toThrow("Counsel placeholder is not published");
  });
});
