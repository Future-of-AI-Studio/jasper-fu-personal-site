import { describe, expect, it } from "vitest";

import { identity } from "./identity";
import {
  ABOUT_BIO_PARAGRAPH_MAX,
  ABOUT_BIO_PARAGRAPH_MIN,
  ABOUT_PULL_QUOTE,
  PUBLISHED_CALENDLY_PROMPT,
  PUBLISHED_RESPONSE_TIME_NOTE,
  PUBLISHED_SPEAKING_BOOKING_TITLE,
  PUBLISHED_SPEAKING_INTRO,
  BOOK_TO_SPEAK_CTA,
  CONTACT_CTA,
  REQUEST_FULL_MEDIA_KIT_CTA,
  RETIRED_FORWARD_LOOKING_DISCLAIMER,
  SEND_REQUEST_CTA,
  TEAM_CONFIRMATION_COPY,
  aboutBioParagraphs,
  assertAboutBioParagraphs,
  assertAboutPullQuote,
  assertBookToSpeakCta,
  assertCalendlyPrompt,
  assertContactCta,
  assertForwardLookingDisclaimer,
  assertRequestFullMediaKitCta,
  assertResponseTimeNote,
  assertSendRequestCta,
  assertSpeakingBookingTitle,
  assertSpeakingIntro,
  bios,
  calendlyPrompt,
  forwardLookingDisclaimer,
  responseTimeNote,
  speakingIntro,
} from "./copy";

function verifyAboutBioParagraphs(paragraphs: readonly string[]) {
  expect(assertAboutBioParagraphs(paragraphs)).toEqual([...paragraphs]);
  expect(paragraphs.join(" ")).toBe(bios.words150);
}

function verifyAboutPullQuote(quote: string) {
  expect(assertAboutPullQuote(quote)).toBe(ABOUT_PULL_QUOTE);
}

function verifyResponseTimeNote(note: string) {
  expect(assertResponseTimeNote(note)).toBe(PUBLISHED_RESPONSE_TIME_NOTE);
}

function verifyCalendlyPrompt(prompt: string) {
  expect(assertCalendlyPrompt(prompt)).toBe(PUBLISHED_CALENDLY_PROMPT);
}

function verifySpeakingIntro(intro: string) {
  expect(assertSpeakingIntro(intro)).toBe(PUBLISHED_SPEAKING_INTRO);
}

function verifySpeakingBookingTitle(title: string) {
  expect(assertSpeakingBookingTitle(title)).toBe(PUBLISHED_SPEAKING_BOOKING_TITLE);
}

function verifySendRequestCta(label: string) {
  expect(assertSendRequestCta(label)).toBe(SEND_REQUEST_CTA);
}

function verifyBookToSpeakCta(label: string) {
  expect(assertBookToSpeakCta(label)).toBe(BOOK_TO_SPEAK_CTA);
}

function verifyRequestFullMediaKitCta(label: string) {
  expect(assertRequestFullMediaKitCta(label)).toBe(REQUEST_FULL_MEDIA_KIT_CTA);
}

function verifyContactCta(label: string) {
  expect(assertContactCta(label)).toBe(CONTACT_CTA);
}

describe("about bio copy", () => {
  it("keeps the published 150-word bio in paragraph breaks", () => {
    verifyAboutBioParagraphs(aboutBioParagraphs);
    expect(aboutBioParagraphs).toHaveLength(4);
  });

  it("rejects missing about bio paragraphs", () => {
    expect(() => assertAboutBioParagraphs([])).toThrow(
      "About bio paragraphs are required",
    );
  });

  it("rejects a single about bio paragraph", () => {
    expect(() => assertAboutBioParagraphs([bios.words150])).toThrow(
      `About bio needs at least ${ABOUT_BIO_PARAGRAPH_MIN} paragraphs`,
    );
  });

  it("rejects more than the max about bio paragraphs", () => {
    const overflow = Array.from(
      { length: ABOUT_BIO_PARAGRAPH_MAX + 1 },
      (_, index) => `Paragraph ${index + 1}.`,
    );
    expect(() => assertAboutBioParagraphs(overflow)).toThrow(
      `About bio cannot exceed ${ABOUT_BIO_PARAGRAPH_MAX} paragraphs`,
    );
  });

  it("rejects an empty about bio paragraph", () => {
    const withBlank = [...aboutBioParagraphs.slice(0, 3), "   "];
    expect(() => assertAboutBioParagraphs(withBlank)).toThrow(
      "About bio paragraphs cannot be empty",
    );
  });

  it("rejects paragraphs that drift from the 150-word bio", () => {
    const drifted = [...aboutBioParagraphs.slice(0, 3), "Different closing."];
    expect(() => assertAboutBioParagraphs(drifted)).toThrow(
      "About bio paragraphs must match the 150-word bio",
    );
  });

  it("accepts the min and max paragraph counts when copy still matches", () => {
    const minSplit = [
      aboutBioParagraphs[0],
      aboutBioParagraphs.slice(1).join(" "),
    ];
    verifyAboutBioParagraphs(minSplit);

    const six = [
      aboutBioParagraphs[0],
      aboutBioParagraphs[1],
      "Jasper's path to Coinsub began in digital transformation consulting at PwC, followed by fintech penetration testing, where he learned firsthand how payment systems get attacked.",
      "He later served as Director of Product at Community Gaming, onboarding users from Web2 into Web3.",
      "With co-founder David Akers, he built Coinsub around a unified API that abstracts stablecoin complexity into plug-and-play, white-label building blocks.",
      "Coinsub is MSB-registered in the US (FinCEN) and Canada (FINTRAC), with ISO 27001 and SOC 2 in progress.",
    ];
    expect(six).toHaveLength(ABOUT_BIO_PARAGRAPH_MAX);
    verifyAboutBioParagraphs(six);
  });

  it("keeps the published cash-to-digital quote without an attribution", () => {
    verifyAboutPullQuote(` ${ABOUT_PULL_QUOTE} `);
  });

  it("rejects a missing pull quote", () => {
    expect(() => assertAboutPullQuote("  ")).toThrow("About pull quote is required");
  });

  it("rejects a pull quote that is not the cash-to-digital line", () => {
    expect(() => assertAboutPullQuote(identity.thesis)).toThrow(
      "About pull quote must be the published cash-to-digital quote",
    );
  });
});

describe("response time note", () => {
  it("keeps the published 1 to 2 business day commitment", () => {
    verifyResponseTimeNote(` ${responseTimeNote} `);
  });

  it("rejects a missing response time note", () => {
    expect(() => assertResponseTimeNote(" ")).toThrow(
      "Response time note is required",
    );
  });

  it("rejects a publishing placeholder", () => {
    expect(() =>
      assertResponseTimeNote(
        `${PUBLISHED_RESPONSE_TIME_NOTE} [Confirm the actual commitment before publishing.]`,
      ),
    ).toThrow("Response time note cannot include a publishing placeholder");
  });

  it("rejects an unpublished commitment", () => {
    expect(() =>
      assertResponseTimeNote("We typically respond to press inquiries within a week."),
    ).toThrow(
      "Response time note is not the published 1 to 2 business day commitment",
    );
  });
});

describe("calendly and speaking booking copy", () => {
  it("keeps the published Calendly prompt without team confirmation", () => {
    verifyCalendlyPrompt(` ${calendlyPrompt} `);
    expect(calendlyPrompt).not.toContain(TEAM_CONFIRMATION_COPY);
  });

  it("rejects a missing Calendly prompt", () => {
    expect(() => assertCalendlyPrompt(" ")).toThrow("Calendly prompt is required");
  });

  it("rejects team confirmation copy in the Calendly prompt", () => {
    expect(() =>
      assertCalendlyPrompt(`${PUBLISHED_CALENDLY_PROMPT} ${TEAM_CONFIRMATION_COPY}`),
    ).toThrow("Calendly prompt cannot include team confirmation copy");
  });

  it("rejects an unpublished Calendly prompt", () => {
    expect(() => assertCalendlyPrompt("Pick any slot that works.")).toThrow(
      "Calendly prompt is not the published request-a-time line",
    );
  });

  it("keeps the published speaking intro under Book Jasper", () => {
    verifySpeakingIntro(` ${speakingIntro} `);
  });

  it("rejects a missing speaking intro", () => {
    expect(() => assertSpeakingIntro(" ")).toThrow("Speaking intro is required");
  });

  it("rejects Calendly booking copy as the speaking intro", () => {
    expect(() => assertSpeakingIntro(PUBLISHED_CALENDLY_PROMPT)).toThrow(
      "Speaking intro cannot use Calendly booking copy",
    );
  });

  it("rejects an unpublished speaking intro", () => {
    expect(() => assertSpeakingIntro("Book Jasper for a fireside chat.")).toThrow(
      "Speaking intro is not the published speaking invite",
    );
  });

  it("keeps Request Jasper to Speak as the booking heading", () => {
    verifySpeakingBookingTitle(` ${PUBLISHED_SPEAKING_BOOKING_TITLE} `);
  });

  it("rejects a missing speaking booking title", () => {
    expect(() => assertSpeakingBookingTitle(" ")).toThrow(
      "Speaking booking title is required",
    );
  });

  it("rejects the retired Book a speaking time heading", () => {
    expect(() => assertSpeakingBookingTitle("Book a speaking time")).toThrow(
      "Book-a-speaking-time title is not published",
    );
  });

  it("rejects an unpublished speaking booking title", () => {
    expect(() => assertSpeakingBookingTitle("Schedule a talk")).toThrow(
      "Speaking booking title is not Request Jasper to Speak",
    );
  });

  it("keeps Send Request as the inquiry CTA", () => {
    verifySendRequestCta(` ${SEND_REQUEST_CTA} `);
  });

  it("rejects a missing Send Request CTA", () => {
    expect(() => assertSendRequestCta(" ")).toThrow("Send Request CTA is required");
  });

  it("rejects the retired Prepare request CTA", () => {
    expect(() => assertSendRequestCta("Prepare request")).toThrow(
      "Prepare request CTA is not published",
    );
  });

  it("rejects an unpublished inquiry CTA", () => {
    expect(() => assertSendRequestCta("Submit")).toThrow(
      "Send Request CTA must be Send Request",
    );
  });

  it("keeps Book to Speak as the speaking CTA", () => {
    verifyBookToSpeakCta(` ${BOOK_TO_SPEAK_CTA} `);
  });

  it("rejects a missing Book to Speak CTA", () => {
    expect(() => assertBookToSpeakCta(" ")).toThrow("Book to Speak CTA is required");
  });

  it("rejects the retired View Media Kit CTA", () => {
    expect(() => assertBookToSpeakCta("View Media Kit")).toThrow(
      "View Media Kit CTA is not published",
    );
  });

  it("rejects an unpublished speaking CTA", () => {
    expect(() => assertBookToSpeakCta("Book now")).toThrow(
      "Book to Speak CTA must be Book to Speak",
    );
  });

  it("keeps Request Full Media Kit as the kit CTA", () => {
    verifyRequestFullMediaKitCta(` ${REQUEST_FULL_MEDIA_KIT_CTA} `);
  });

  it("rejects a missing Request Full Media Kit CTA", () => {
    expect(() => assertRequestFullMediaKitCta(" ")).toThrow(
      "Request Full Media Kit CTA is required",
    );
  });

  it("rejects the retired Download Media Kit CTA", () => {
    expect(() => assertRequestFullMediaKitCta("Download Media Kit")).toThrow(
      "Download Media Kit CTA is not published",
    );
  });

  it("rejects an unpublished media kit CTA", () => {
    expect(() => assertRequestFullMediaKitCta("Get the kit")).toThrow(
      "Request Full Media Kit CTA must be Request Full Media Kit",
    );
  });

  it("keeps Contact as the contact CTA", () => {
    verifyContactCta(` ${CONTACT_CTA} `);
  });

  it("rejects a missing Contact CTA", () => {
    expect(() => assertContactCta(" ")).toThrow("Contact CTA is required");
  });

  it("rejects the retired Contact Jasper's Team CTA", () => {
    expect(() => assertContactCta("Contact Jasper's Team")).toThrow(
      "Contact Jasper's Team CTA is not published",
    );
  });

  it("rejects an unpublished contact CTA", () => {
    expect(() => assertContactCta("Get in touch")).toThrow(
      "Contact CTA must be Contact",
    );
  });
});

describe("assertForwardLookingDisclaimer", () => {
  it("names Coinsub and Jasper Fu in the published disclaimer", () => {
    expect(assertForwardLookingDisclaimer(` ${forwardLookingDisclaimer} `)).toBe(
      forwardLookingDisclaimer,
    );
    expect(forwardLookingDisclaimer).toContain("Coinsub and Jasper Fu");
  });

  it("rejects a missing forward-looking disclaimer", () => {
    expect(() => assertForwardLookingDisclaimer(" ")).toThrow(
      "Forward-looking disclaimer is required",
    );
  });

  it("rejects the Coinsub-only forward-looking disclaimer", () => {
    expect(() =>
      assertForwardLookingDisclaimer(RETIRED_FORWARD_LOOKING_DISCLAIMER),
    ).toThrow("Coinsub-only forward-looking disclaimer is not published");
  });

  it("rejects an unpublished forward-looking disclaimer", () => {
    expect(() => assertForwardLookingDisclaimer("No forecasts.")).toThrow(
      "Forward-looking disclaimer must include Jasper Fu after Coinsub",
    );
  });
});
