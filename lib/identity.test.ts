import { describe, expect, it } from "vitest";

import {
  assertBookingEmail,
  assertCalendlyUrl,
  assertCoinsubUrl,
  assertLinkedInUrl,
  assertLogoPublishable,
  assertMediaBarLoopCopies,
  assertMediaOutletLogo,
  assertMediaOutletMark,
  identity,
  mediaOutlets,
  MEDIA_BAR_LOOP_COPIES,
  MEDIA_OUTLET_LOGO_PREFIX,
  PUBLISHED_BOOKING_EMAIL,
  PUBLISHED_CALENDLY_URL,
  PUBLISHED_COINSUB_URL,
  PUBLISHED_LINKEDIN_URL,
  PUBLISHED_THESIS,
  RETIRED_INFO_BOOKING_EMAIL,
  RETIRED_SPEAKING_BOOKING_EMAIL,
  LEGACY_THESIS,
  assertThesis,
  splitTitleForCoinsub,
} from "./identity";

function verifyMediaOutletLogo(value: string, expected: string) {
  expect(assertMediaOutletLogo(value)).toBe(expected);
}

function verifyBookingEmail(value: string) {
  expect(assertBookingEmail(value)).toBe(PUBLISHED_BOOKING_EMAIL);
}

describe("assertLogoPublishable", () => {
  it("allows cleared editorial brands", () => {
    expect(assertLogoPublishable(" NASDAQ ")).toBe("NASDAQ");
  });

  it("rejects an empty name", () => {
    expect(() => assertLogoPublishable(" ")).toThrow("Logo name is required");
  });

  it("rejects uncleared partner logos", () => {
    expect(() => assertLogoPublishable("FCTI")).toThrow(
      "FCTI logo is not cleared for publication",
    );
  });

  it("rejects unknown logos", () => {
    expect(() => assertLogoPublishable("Unknown")).toThrow(
      "Unknown logo has no publication status",
    );
  });
});

describe("assertMediaOutletLogo", () => {
  it("accepts a published local outlet logo", () => {
    verifyMediaOutletLogo(" /logos/nasdaq.svg ", "/logos/nasdaq.svg");
  });

  it("rejects a missing outlet logo source", () => {
    expect(() => assertMediaOutletLogo(" ")).toThrow(
      "Media outlet logo source is required",
    );
  });

  it("rejects a placeholder outlet logo", () => {
    expect(() => assertMediaOutletLogo("/logos/placeholder.svg")).toThrow(
      "Placeholder media outlet logo is not published",
    );
  });

  it("rejects a remote or non-logos path", () => {
    expect(() =>
      assertMediaOutletLogo("https://cdn.example.com/nasdaq.svg"),
    ).toThrow("Media outlet logo must be a local /logos/ asset");
  });
});

describe("mediaOutlets marks", () => {
  it("gives every home media-bar outlet a unique cleared local logo", () => {
    const marks = mediaOutlets.map((outlet) => assertMediaOutletMark(outlet));
    expect(marks).toHaveLength(4);
    expect(new Set(marks.map((mark) => mark.logo)).size).toBe(4);
    expect(
      marks.every((mark) => mark.logo.startsWith(MEDIA_OUTLET_LOGO_PREFIX)),
    ).toBe(true);
  });
});

describe("assertMediaBarLoopCopies", () => {
  it("accepts two copies for a seamless loop", () => {
    expect(assertMediaBarLoopCopies(MEDIA_BAR_LOOP_COPIES)).toBe(2);
  });

  it("rejects a non-integer copy count", () => {
    expect(() => assertMediaBarLoopCopies(2.5)).toThrow(
      "Media bar loop copy count must be an integer",
    );
  });

  it("rejects a single copy that cannot seam", () => {
    expect(() => assertMediaBarLoopCopies(1)).toThrow(
      "Media bar loop needs at least two copies to seam",
    );
  });

  it("rejects more than two copies", () => {
    expect(() => assertMediaBarLoopCopies(3)).toThrow(
      "Media bar loop uses exactly two copies",
    );
  });
});

describe("assertCalendlyUrl", () => {
  it("accepts the published Jasper Calendly URL", () => {
    expect(assertCalendlyUrl(` ${identity.calendlyUrl} `)).toBe(
      PUBLISHED_CALENDLY_URL,
    );
  });

  it("rejects a missing Calendly URL", () => {
    expect(() => assertCalendlyUrl(" ")).toThrow("Calendly URL is required");
  });

  it("rejects a placeholder Calendly URL", () => {
    expect(() =>
      assertCalendlyUrl("https://calendly.com/placeholder"),
    ).toThrow("Placeholder Calendly URL is not published");
  });

  it("rejects any URL that is not the published Calendly link", () => {
    expect(() => assertCalendlyUrl("https://calendly.com/someone-else")).toThrow(
      "https://calendly.com/someone-else is not the published Calendly URL",
    );
  });
});

describe("assertCoinsubUrl", () => {
  it("accepts the published Coinsub URL", () => {
    expect(assertCoinsubUrl(` ${identity.coinsubUrl} `)).toBe(PUBLISHED_COINSUB_URL);
  });

  it("rejects a missing Coinsub URL", () => {
    expect(() => assertCoinsubUrl(" ")).toThrow("Coinsub URL is required");
  });

  it("rejects a placeholder Coinsub URL", () => {
    expect(() => assertCoinsubUrl("https://placeholder.coinsub.io")).toThrow(
      "Placeholder Coinsub URL is not published",
    );
  });

  it("rejects any URL that is not the published Coinsub link", () => {
    expect(() => assertCoinsubUrl("https://coinsub.io")).toThrow(
      "https://coinsub.io is not the published Coinsub URL",
    );
  });
});

describe("assertLinkedInUrl", () => {
  it("accepts the published LinkedIn URL", () => {
    expect(assertLinkedInUrl(` ${identity.linkedInUrl} `)).toBe(
      PUBLISHED_LINKEDIN_URL,
    );
  });

  it("rejects a missing LinkedIn URL", () => {
    expect(() => assertLinkedInUrl(" ")).toThrow("LinkedIn URL is required");
  });

  it("rejects a placeholder LinkedIn URL", () => {
    expect(() =>
      assertLinkedInUrl("https://www.linkedin.com/in/placeholder"),
    ).toThrow("Placeholder LinkedIn URL is not published");
  });

  it("rejects any URL that is not the published LinkedIn profile", () => {
    expect(() =>
      assertLinkedInUrl("https://www.linkedin.com/in/someone-else"),
    ).toThrow(
      "https://www.linkedin.com/in/someone-else is not the published LinkedIn URL",
    );
  });
});

describe("splitTitleForCoinsub", () => {
  it("keeps the title prefix and solo Coinsub copy", () => {
    expect(splitTitleForCoinsub(` ${identity.title} `)).toEqual({
      prefix: "Co-Founder and CEO, ",
      name: "Coinsub",
    });
  });

  it("rejects a missing title", () => {
    expect(() => splitTitleForCoinsub(" ")).toThrow("Title is required");
  });

  it("rejects a title without solo Coinsub copy", () => {
    expect(() => splitTitleForCoinsub("Co-Founder and CEO")).toThrow(
      "Title must end with solo Coinsub copy",
    );
  });
});

describe("assertThesis", () => {
  it("accepts the published plumbing thesis", () => {
    expect(assertThesis(` ${identity.thesis} `)).toBe(PUBLISHED_THESIS);
  });

  it("rejects a missing thesis", () => {
    expect(() => assertThesis(" ")).toThrow("Thesis is required");
  });

  it("rejects a placeholder thesis", () => {
    expect(() => assertThesis("placeholder thesis")).toThrow(
      "Placeholder thesis is not published",
    );
  });

  it("rejects the retired trust-as-architecture thesis", () => {
    expect(() => assertThesis(LEGACY_THESIS)).toThrow(
      "Trust-as-architecture thesis is not published",
    );
  });

  it("rejects any other unpublished thesis", () => {
    expect(() => assertThesis("A different line.")).toThrow(
      "A different line. is not the published thesis",
    );
  });
});

describe("assertBookingEmail", () => {
  it("accepts the published booking inbox", () => {
    verifyBookingEmail(` ${identity.bookingEmail} `);
  });

  it("rejects a missing booking inbox", () => {
    expect(() => assertBookingEmail(" ")).toThrow("Booking inbox is required");
  });

  it("rejects the retired speaking.com booking inbox", () => {
    expect(() => assertBookingEmail(RETIRED_SPEAKING_BOOKING_EMAIL)).toThrow(
      "speaking@jasperfu.com booking inbox is not published",
    );
  });

  it("rejects the retired info booking inbox", () => {
    expect(() => assertBookingEmail(RETIRED_INFO_BOOKING_EMAIL)).toThrow(
      "info@jasperfu.io booking inbox is not published",
    );
  });

  it("rejects an unpublished booking inbox", () => {
    expect(() => assertBookingEmail("press@coinsub.io")).toThrow(
      "Booking inbox must be speaking@jasperfu.io",
    );
  });
});
