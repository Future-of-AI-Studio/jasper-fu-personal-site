import { describe, expect, it } from "vitest";

import { identity } from "./identity";
import {
  ABOUT_BIO_PARAGRAPH_MAX,
  ABOUT_BIO_PARAGRAPH_MIN,
  BIO_LEDE_MIN_LENGTH,
  CAREER_TIMELINE_MAX,
  CAREER_TIMELINE_MIN,
  CREDENTIALS_MAX,
  CREDENTIALS_MIN,
  FACT_SHEET_MAX_ROWS,
  FACT_SHEET_MIN_ROWS,
  MEDIA_KIT_PROMISE,
  RETIRED_MEDIA_KIT_PROMISE,
  assertMediaKitPromise,
  ABOUT_FAQ_PUBLISHED_COUNT,
  PULL_QUOTES_MAX,
  PULL_QUOTES_MIN,
  QUICK_FACTS_MAX,
  QUICK_FACTS_MIN,
  aboutFaqs,
  assertAboutFaq,
  assertCareerTimelineItem,
  assertCredentialItem,
  assertFactSheetRow,
  assertPullQuote,
  assertQuickFact,
  assertViewAllCoverageCta,
  assertWatchInterviewCta,
  careerTimeline,
  credentials,
  factSheet,
  parseAboutFaqs,
  parseCareerTimeline,
  parseCredentials,
  parseFactSheet,
  parsePullQuotes,
  parseQuickFacts,
  pullQuotes,
  quickFacts,
  splitBioLede,
  VIEW_ALL_COVERAGE_CTA,
  WATCH_INTERVIEW_CTA,
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

function factSheetRows(count: number) {
  return Array.from({ length: Math.max(count, 0) }, (_, index) => ({
    label: `Label ${index}`,
    value: `Value ${index}`,
  }));
}

function verifyPublishedFactSheet(rows: ReturnType<typeof parseFactSheet>) {
  expect(rows).toHaveLength(factSheet.length);
  expect(new Set(rows.map((row) => row.label)).size).toBe(rows.length);
  for (const row of rows) {
    expect(row.label.length).toBeGreaterThan(0);
    expect(row.value.length).toBeGreaterThan(0);
  }
}

describe("assertFactSheetRow", () => {
  it("returns a published row unchanged", () => {
    expect(assertFactSheetRow({ label: "Founded", value: "2023" })).toEqual({
      label: "Founded",
      value: "2023",
    });
  });

  it("trims surrounding whitespace from both halves", () => {
    expect(
      assertFactSheetRow({ label: "  Founded  ", value: "  2023  " }),
    ).toEqual({ label: "Founded", value: "2023" });
  });

  it("rejects an empty label", () => {
    expect(() => assertFactSheetRow({ label: "  ", value: "2023" })).toThrow(
      "Fact sheet label is required",
    );
  });

  it("names the row when its value is empty", () => {
    expect(() => assertFactSheetRow({ label: "Founded", value: " " })).toThrow(
      "Founded fact sheet value is required",
    );
  });

  it("rejects a placeholder value", () => {
    expect(() =>
      assertFactSheetRow({ label: "Founded", value: "placeholder" }),
    ).toThrow("Founded fact sheet value is a placeholder");
  });

  it("rejects a bracketed value the way the legal guards do", () => {
    expect(() =>
      assertFactSheetRow({ label: "Founded", value: "[Insert year]" }),
    ).toThrow("Founded fact sheet value still carries a bracketed placeholder");
  });
});

describe("parseFactSheet", () => {
  it("publishes the shipped fact sheet", () => {
    verifyPublishedFactSheet(parseFactSheet(factSheet));
  });

  it("rejects a sheet below the minimum", () => {
    expect(() => parseFactSheet(factSheetRows(FACT_SHEET_MIN_ROWS - 1))).toThrow(
      `Fact sheet needs at least ${FACT_SHEET_MIN_ROWS} rows`,
    );
  });

  it("accepts a sheet exactly at the minimum", () => {
    expect(parseFactSheet(factSheetRows(FACT_SHEET_MIN_ROWS))).toHaveLength(
      FACT_SHEET_MIN_ROWS,
    );
  });

  it("accepts a sheet exactly at the maximum", () => {
    expect(parseFactSheet(factSheetRows(FACT_SHEET_MAX_ROWS))).toHaveLength(
      FACT_SHEET_MAX_ROWS,
    );
  });

  it("rejects a sheet above the maximum", () => {
    expect(() => parseFactSheet(factSheetRows(FACT_SHEET_MAX_ROWS + 1))).toThrow(
      `Fact sheet cannot exceed ${FACT_SHEET_MAX_ROWS} rows`,
    );
  });

  it("rejects duplicated labels", () => {
    expect(() =>
      parseFactSheet([
        { label: "Founded", value: "2023" },
        { label: "Founded", value: "2024" },
        { label: "Headquarters", value: "New York" },
      ]),
    ).toThrow("Fact sheet labels must each be unique");
  });
});

function timelineItems(count: number) {
  return Array.from({ length: Math.max(count, 0) }, (_, index) => `Item ${index}`);
}

describe("assertCareerTimelineItem", () => {
  it("returns a published item unchanged", () => {
    expect(assertCareerTimelineItem("PwC, digital transformation consulting")).toBe(
      "PwC, digital transformation consulting",
    );
  });

  it("trims surrounding whitespace", () => {
    expect(assertCareerTimelineItem("  PwC  ")).toBe("PwC");
  });

  it("rejects an empty item", () => {
    expect(() => assertCareerTimelineItem("  ")).toThrow(
      "Career timeline item is required",
    );
  });

  it("rejects a placeholder item", () => {
    expect(() => assertCareerTimelineItem("placeholder")).toThrow(
      "Career timeline item is a placeholder",
    );
  });
});

describe("parseCareerTimeline", () => {
  it("publishes the shipped career timeline", () => {
    expect(parseCareerTimeline(careerTimeline)).toEqual([...careerTimeline]);
  });

  it("rejects a timeline below the minimum", () => {
    expect(() => parseCareerTimeline(timelineItems(CAREER_TIMELINE_MIN - 1))).toThrow(
      `Career timeline needs at least ${CAREER_TIMELINE_MIN} items`,
    );
  });

  it("accepts a timeline exactly at the minimum", () => {
    expect(parseCareerTimeline(timelineItems(CAREER_TIMELINE_MIN))).toHaveLength(
      CAREER_TIMELINE_MIN,
    );
  });

  it("accepts a timeline exactly at the maximum", () => {
    expect(parseCareerTimeline(timelineItems(CAREER_TIMELINE_MAX))).toHaveLength(
      CAREER_TIMELINE_MAX,
    );
  });

  it("rejects a timeline above the maximum", () => {
    expect(() => parseCareerTimeline(timelineItems(CAREER_TIMELINE_MAX + 1))).toThrow(
      `Career timeline cannot exceed ${CAREER_TIMELINE_MAX} items`,
    );
  });

  it("rejects duplicated items", () => {
    expect(() =>
      parseCareerTimeline(["Same item", "Same item"]),
    ).toThrow("Career timeline items must each be unique");
  });
});

describe("assertCredentialItem", () => {
  it("returns a published item unchanged", () => {
    expect(
      assertCredentialItem("Emory University, Goizueta Business School, BBA"),
    ).toBe("Emory University, Goizueta Business School, BBA");
  });

  it("trims surrounding whitespace", () => {
    expect(assertCredentialItem("  BBA  ")).toBe("BBA");
  });

  it("rejects an empty item", () => {
    expect(() => assertCredentialItem("  ")).toThrow("Credential item is required");
  });

  it("rejects a placeholder item", () => {
    expect(() => assertCredentialItem("placeholder")).toThrow(
      "Credential item is a placeholder",
    );
  });
});

describe("parseCredentials", () => {
  it("publishes the shipped credentials", () => {
    expect(parseCredentials(credentials)).toEqual([...credentials]);
  });

  it("rejects credentials below the minimum", () => {
    expect(() => parseCredentials(timelineItems(CREDENTIALS_MIN - 1))).toThrow(
      `Credentials need at least ${CREDENTIALS_MIN} items`,
    );
  });

  it("accepts credentials exactly at the minimum", () => {
    expect(parseCredentials(timelineItems(CREDENTIALS_MIN))).toHaveLength(
      CREDENTIALS_MIN,
    );
  });

  it("accepts credentials exactly at the maximum", () => {
    expect(parseCredentials(timelineItems(CREDENTIALS_MAX))).toHaveLength(
      CREDENTIALS_MAX,
    );
  });

  it("rejects credentials above the maximum", () => {
    expect(() => parseCredentials(timelineItems(CREDENTIALS_MAX + 1))).toThrow(
      `Credentials cannot exceed ${CREDENTIALS_MAX} items`,
    );
  });

  it("rejects duplicated items", () => {
    expect(() =>
      parseCredentials(["Same item", "Same item"]),
    ).toThrow("Credential items must each be unique");
  });
});

function quickFactRows(count: number) {
  return Array.from({ length: Math.max(count, 0) }, (_, index) => ({
    label: `Label ${index}`,
    value: `Value ${index}`,
    detail: `Detail ${index}`,
  }));
}

describe("assertQuickFact", () => {
  it("returns a published fact unchanged", () => {
    expect(
      assertQuickFact({ label: "Regulatory", value: "MSB", detail: "Registered across the US and Canada" }),
    ).toEqual({ label: "Regulatory", value: "MSB", detail: "Registered across the US and Canada" });
  });

  it("trims surrounding whitespace from all three fields", () => {
    expect(
      assertQuickFact({ label: "  Regulatory  ", value: "  MSB  ", detail: "  Registered  " }),
    ).toEqual({ label: "Regulatory", value: "MSB", detail: "Registered" });
  });

  it("rejects an empty label", () => {
    expect(() =>
      assertQuickFact({ label: "  ", value: "MSB", detail: "Registered" }),
    ).toThrow("Quick fact label is required");
  });

  it("names the fact when its value is empty", () => {
    expect(() =>
      assertQuickFact({ label: "Regulatory", value: " ", detail: "Registered" }),
    ).toThrow("Regulatory quick fact value is required");
  });

  it("names the fact when its detail is empty", () => {
    expect(() =>
      assertQuickFact({ label: "Regulatory", value: "MSB", detail: " " }),
    ).toThrow("Regulatory quick fact detail is required");
  });

  it("rejects a placeholder value", () => {
    expect(() =>
      assertQuickFact({ label: "Regulatory", value: "placeholder", detail: "Registered" }),
    ).toThrow("Regulatory quick fact is a placeholder");
  });
});

describe("parseQuickFacts", () => {
  it("publishes the shipped quick facts", () => {
    expect(parseQuickFacts(quickFacts)).toEqual([...quickFacts]);
  });

  it("rejects facts below the minimum", () => {
    expect(() => parseQuickFacts(quickFactRows(QUICK_FACTS_MIN - 1))).toThrow(
      `Quick facts need at least ${QUICK_FACTS_MIN} entries`,
    );
  });

  it("accepts facts exactly at the minimum", () => {
    expect(parseQuickFacts(quickFactRows(QUICK_FACTS_MIN))).toHaveLength(QUICK_FACTS_MIN);
  });

  it("accepts facts exactly at the maximum", () => {
    expect(parseQuickFacts(quickFactRows(QUICK_FACTS_MAX))).toHaveLength(QUICK_FACTS_MAX);
  });

  it("rejects facts above the maximum", () => {
    expect(() => parseQuickFacts(quickFactRows(QUICK_FACTS_MAX + 1))).toThrow(
      `Quick facts cannot exceed ${QUICK_FACTS_MAX} entries`,
    );
  });

  it("rejects duplicated labels", () => {
    expect(() =>
      parseQuickFacts([
        { label: "Regulatory", value: "MSB", detail: "Registered" },
        { label: "Regulatory", value: "MSB", detail: "Registered again" },
        { label: "Cash access", value: "12,000+", detail: "ATMs" },
      ]),
    ).toThrow("Quick fact labels must each be unique");
  });
});

function pullQuoteStrings(count: number) {
  return Array.from({ length: Math.max(count, 0) }, (_, index) => `Quote ${index}`);
}

describe("assertPullQuote", () => {
  it("returns a published quote unchanged", () => {
    expect(assertPullQuote("Compliance is the product. Everything else is a feature.")).toBe(
      "Compliance is the product. Everything else is a feature.",
    );
  });

  it("trims surrounding whitespace", () => {
    expect(assertPullQuote("  Compliance is the product.  ")).toBe(
      "Compliance is the product.",
    );
  });

  it("rejects an empty quote", () => {
    expect(() => assertPullQuote("  ")).toThrow("Pull quote is required");
  });

  it("rejects a placeholder quote", () => {
    expect(() => assertPullQuote("placeholder")).toThrow("Pull quote is a placeholder");
  });
});

describe("parsePullQuotes", () => {
  it("publishes the shipped pull-quotes", () => {
    expect(parsePullQuotes(pullQuotes)).toEqual([...pullQuotes]);
  });

  it("rejects quotes below the minimum", () => {
    expect(() => parsePullQuotes(pullQuoteStrings(PULL_QUOTES_MIN - 1))).toThrow(
      `Pull quotes need at least ${PULL_QUOTES_MIN}`,
    );
  });

  it("accepts quotes exactly at the minimum", () => {
    expect(parsePullQuotes(pullQuoteStrings(PULL_QUOTES_MIN))).toHaveLength(
      PULL_QUOTES_MIN,
    );
  });

  it("accepts quotes exactly at the maximum", () => {
    expect(parsePullQuotes(pullQuoteStrings(PULL_QUOTES_MAX))).toHaveLength(
      PULL_QUOTES_MAX,
    );
  });

  it("rejects quotes above the maximum", () => {
    expect(() => parsePullQuotes(pullQuoteStrings(PULL_QUOTES_MAX + 1))).toThrow(
      `Pull quotes cannot exceed ${PULL_QUOTES_MAX}`,
    );
  });

  it("rejects duplicated quotes", () => {
    expect(() => parsePullQuotes(["Same quote.", "Same quote."])).toThrow(
      "Pull quotes must each be unique",
    );
  });
});

describe("assertAboutFaq", () => {
  it("returns a published FAQ unchanged", () => {
    expect(
      assertAboutFaq({ question: "What does Coinsub do?", answer: "It orchestrates programmable money." }),
    ).toEqual({ question: "What does Coinsub do?", answer: "It orchestrates programmable money." });
  });

  it("trims surrounding whitespace from question and answer", () => {
    expect(
      assertAboutFaq({ question: "  Q?  ", answer: "  A.  " }),
    ).toEqual({ question: "Q?", answer: "A." });
  });

  it("rejects an empty question", () => {
    expect(() => assertAboutFaq({ question: " ", answer: "A." })).toThrow(
      "About FAQ question is required",
    );
  });

  it("names the question when its answer is empty", () => {
    expect(() => assertAboutFaq({ question: "Q?", answer: " " })).toThrow(
      "Q? FAQ answer is required",
    );
  });

  it("rejects the drafted programmable-money stub answer", () => {
    expect(() => assertAboutFaq(aboutFaqs[3]!)).toThrow(
      "What does programmable money mean? FAQ answer is still a pending stub",
    );
  });
});

describe("parseAboutFaqs", () => {
  it("publishes the first 3 approved questions, excluding the stub", () => {
    const parsed = parseAboutFaqs(aboutFaqs);
    expect(parsed).toHaveLength(ABOUT_FAQ_PUBLISHED_COUNT);
    expect(parsed.map((faq) => faq.question)).not.toContain(
      "What does programmable money mean?",
    );
  });

  it("rejects a published count below 1", () => {
    expect(() => parseAboutFaqs(aboutFaqs, 0)).toThrow(
      "About FAQ needs at least 1 published question",
    );
  });

  it("rejects a published count above the available questions", () => {
    expect(() => parseAboutFaqs(aboutFaqs, aboutFaqs.length + 1)).toThrow(
      "About FAQ published count exceeds available questions",
    );
  });

  it("publishes a 4th question once it has real copy, proving the future one-line bump", () => {
    const withRealFourthAnswer = [
      ...aboutFaqs.slice(0, 3),
      { question: "What does programmable money mean?", answer: "Value that moves and settles in software." },
    ];
    expect(parseAboutFaqs(withRealFourthAnswer, 4)).toHaveLength(4);
  });

  it("rejects duplicated questions", () => {
    expect(() =>
      parseAboutFaqs(
        [
          { question: "Q?", answer: "A." },
          { question: "Q?", answer: "B." },
        ],
        2,
      ),
    ).toThrow("About FAQ questions must each be unique");
  });
});

describe("assertMediaKitPromise", () => {
  it("publishes the sent-on-request line", () => {
    expect(assertMediaKitPromise(` ${MEDIA_KIT_PROMISE} `)).toBe(MEDIA_KIT_PROMISE);
  });

  it("rejects a missing promise", () => {
    expect(() => assertMediaKitPromise(" ")).toThrow("Media kit promise is required");
  });

  it("rejects the retired no-request-email promise", () => {
    expect(() => assertMediaKitPromise(RETIRED_MEDIA_KIT_PROMISE)).toThrow(
      "No-request-email media kit promise is not published",
    );
  });

  it("rejects any rewording that still claims no request is required", () => {
    expect(() =>
      assertMediaKitPromise("Approved copy, no request email required, ready now."),
    ).toThrow("Media kit promise cannot claim no request is required");
  });

  it("rejects any other unpublished promise", () => {
    expect(() => assertMediaKitPromise("Download the kit.")).toThrow(
      "Media kit promise must be the sent-on-request line",
    );
  });
});

describe("splitBioLede", () => {
  it("splits the published short bio at its first sentence", () => {
    const { lede, rest } = splitBioLede(bios.words50);
    expect(lede.endsWith("settlement certainty.")).toBe(true);
    expect(rest.startsWith("Before Coinsub,")).toBe(true);
    expect(`${lede} ${rest}`).toBe(bios.words50);
  });

  it("leaves no sentence unaccounted for in either half", () => {
    const { lede, rest } = splitBioLede(bios.words75);
    expect(`${lede} ${rest}`).toBe(bios.words75);
    expect(lede).not.toContain(". ");
  });

  it("rejects an empty bio", () => {
    expect(() => splitBioLede("   ")).toThrow("Bio is required");
  });

  it("rejects a single-sentence bio", () => {
    expect(() => splitBioLede("Jasper Fu leads Coinsub.")).toThrow(
      "Bio needs more than one sentence to carry a lede",
    );
  });

  it("refuses to split inside an abbreviation", () => {
    expect(() =>
      splitBioLede("U.S. based founder of Coinsub. More detail follows here."),
    ).toThrow("Bio lede is too short to be a sentence");
  });

  it("accepts a lede exactly at the minimum length", () => {
    const lede = `${"a".repeat(BIO_LEDE_MIN_LENGTH - 1)}.`;
    expect(splitBioLede(`${lede} Trailing sentence.`).lede).toHaveLength(
      BIO_LEDE_MIN_LENGTH,
    );
  });

  it("rejects a lede one character below the minimum", () => {
    const lede = `${"a".repeat(BIO_LEDE_MIN_LENGTH - 2)}.`;
    expect(() => splitBioLede(`${lede} Trailing sentence.`)).toThrow(
      "Bio lede is too short to be a sentence",
    );
  });
});

describe("assertWatchInterviewCta", () => {
  it("accepts the published label", () => {
    expect(assertWatchInterviewCta(` ${WATCH_INTERVIEW_CTA} `)).toBe(
      WATCH_INTERVIEW_CTA,
    );
  });

  it("rejects an empty label", () => {
    expect(() => assertWatchInterviewCta("  ")).toThrow(
      "Watch the Interview CTA is required",
    );
  });

  it("rejects the platform-named label", () => {
    expect(() => assertWatchInterviewCta("Watch on YouTube")).toThrow(
      "Watch on YouTube CTA is not published",
    );
  });

  it("rejects any other label", () => {
    expect(() => assertWatchInterviewCta("Play Video")).toThrow(
      "Watch the Interview CTA must be Watch the Interview",
    );
  });
});

describe("assertViewAllCoverageCta", () => {
  it("accepts the published label", () => {
    expect(assertViewAllCoverageCta(` ${VIEW_ALL_COVERAGE_CTA} `)).toBe(
      VIEW_ALL_COVERAGE_CTA,
    );
  });

  it("rejects an empty label", () => {
    expect(() => assertViewAllCoverageCta("  ")).toThrow(
      "View All Media Coverage CTA is required",
    );
  });

  it("rejects the retired shorthand", () => {
    expect(() => assertViewAllCoverageCta("See All Press")).toThrow(
      "See All Press CTA is not published",
    );
  });

  it("rejects any other label", () => {
    expect(() => assertViewAllCoverageCta("All Coverage")).toThrow(
      "View All Media Coverage CTA must be View All Media Coverage",
    );
  });
});
