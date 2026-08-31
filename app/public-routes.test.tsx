import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { ABOUT_FAQ_PUBLISHED_COUNT, ABOUT_PULL_QUOTE, aboutBioParagraphs, aboutFaqs, bios, BOOK_TO_SPEAK_CTA, careerTimeline, CAREER_TIMELINE_DRAFT, CAREER_TIMELINE_DRAFT_APPROVED, companyBoilerplate, companyStanding, credentials, CREDENTIALS_DRAFT_APPROVED, interimBlogPosts, PUBLISHED_CALENDLY_PROMPT, PUBLISHED_RESPONSE_TIME_NOTE, PUBLISHED_SPEAKING_BOOKING_TITLE, PUBLISHED_SPEAKING_INTRO, mediaCoverage, pullQuotes, quickFacts, SEND_REQUEST_CTA, TEAM_CONFIRMATION_COPY, speakingTopics, VIEW_ALL_COVERAGE_CTA, WATCH_INTERVIEW_CTA } from "../lib/copy";
import {
  assertOutletMarkFor,
  identity,
  PUBLISHED_ONE_LINER,
} from "../lib/identity";
import {
  MEDIA_KIT_INQUIRY_LABEL,
  MEDIA_KIT_INQUIRY_TYPE,
} from "../lib/contact";
import { MEDIA_KIT_PROMISE, RETIRED_MEDIA_KIT_PROMISE } from "../lib/copy";
import { MEDIA_KIT_SPEAKING_PHOTO } from "../lib/media-kit";
import { RETIRED_LEGAL_DRAFT_NOTICE } from "../lib/legal/published";
import {
  PRESS_THUMB_HEIGHT,
  PRESS_THUMB_WIDTH,
} from "../lib/press-thumbnail";

import AboutPage from "./about/page";
import CookiesPage from "./cookies/page";
import LegalPage from "./legal/page";
import MediaKitPage from "./media-kit/page";
import NotFoundPage from "./not-found";
import PressPage from "./press/page";
import CoveragePage from "./press/media-coverage/page";
import PrivacyPage from "./privacy/page";
import SpeakingPage from "./speaking/page";
import TermsPage from "./terms/page";
import ContactPage from "./contact/page";

afterEach(() => {
  cleanup();
});

const aboutFiftyWordOnlySnippet = "he was a fintech penetration tester";
const aboutWords150UniqueSnippet =
  "abstracts stablecoin complexity into plug-and-play";
const aboutWords250OnlySnippets = [
  "Jasper speaks and writes on stablecoin infrastructure",
  "a stint in fintech penetration testing",
  "12,000-ATM cash-access partnership with FCTI",
] as const;

function verifySpeakingPage() {
  expect(screen.getByRole("heading", { name: "Book Jasper" })).toBeTruthy();
  expect(screen.getByText(PUBLISHED_SPEAKING_INTRO)).toBeTruthy();
  expect(
    screen.getByRole("heading", { name: PUBLISHED_SPEAKING_BOOKING_TITLE }),
  ).toBeTruthy();
  expect(screen.queryByRole("heading", { name: "Book a speaking time" })).toBeNull();
  expect(screen.queryByText(TEAM_CONFIRMATION_COPY)).toBeNull();
  expect(document.querySelector("#speaking-booking")).toBeTruthy();
  expect(document.querySelector("#inquiry-form")).toBeNull();
  expect(screen.queryByRole("link", { name: "Open Calendly" })).toBeNull();
  expect(screen.getByRole("button", { name: SEND_REQUEST_CTA })).toBeTruthy();
  expect(screen.queryByRole("button", { name: "Prepare request" })).toBeNull();
  expect(screen.queryByLabelText("Request preview")).toBeNull();
  expect(screen.queryByText("request.json")).toBeNull();
  expect(
    screen.getByRole("button", { name: SEND_REQUEST_CTA }).textContent?.trim(),
  ).toBe(SEND_REQUEST_CTA);
  expect(document.querySelector(".section-intro--full")).toBeTruthy();
  expect(screen.getByRole("button", { name: "Conference keynote" })).toBeTruthy();
  expect(screen.queryByLabelText("Availability")).toBeNull();
  verifySpeakingTopics();
}

function verifySpeakingTopics() {
  const list = document.querySelector(".topic-grid");
  expect(list).toBeTruthy();
  expect(document.querySelectorAll(".topic-grid li")).toHaveLength(
    speakingTopics.length,
  );
  expect(speakingTopics.length).toBe(5);
  for (const topic of speakingTopics) {
    expect(screen.getByRole("heading", { name: topic.title })).toBeTruthy();
  }

  // Bulleted, not numbered: the topics have no running order, so the list is
  // unordered and each row is marked with a dot rather than a counter.
  expect(list?.tagName).toBe("UL");
  expect(document.querySelector("ol.topic-grid")).toBeNull();
  expect(document.querySelectorAll(".topic-grid .index-list__dot")).toHaveLength(
    speakingTopics.length,
  );
  for (const counter of ["01", "02", "03", "04", "05"]) {
    expect(screen.queryByText(counter)).toBeNull();
  }
}

function verifyHeading(Page: () => React.ReactNode, heading: string) {
  render(<Page />);
  expect(
    screen.getByRole("heading", { level: 1, name: heading }),
  ).toBeTruthy();
}

function verifyPressReleaseThumbs() {
  const thumbs = document.querySelectorAll("img.card__thumb");
  const frames = document.querySelectorAll(".card__media");
  expect(thumbs).toHaveLength(interimBlogPosts.length);
  expect(frames).toHaveLength(interimBlogPosts.length);
  expect(PRESS_THUMB_WIDTH * 9).toBe(PRESS_THUMB_HEIGHT * 16);
  for (const post of interimBlogPosts) {
    const img = screen.getByRole("img", { name: post.title });
    expect(img.getAttribute("src")).toBe(post.image);
    expect(img.getAttribute("width")).toBe(String(PRESS_THUMB_WIDTH));
    expect(img.getAttribute("height")).toBe(String(PRESS_THUMB_HEIGHT));
  }
  const sources = [...thumbs].map((img) => img.getAttribute("src"));
  expect(new Set(sources).size).toBe(interimBlogPosts.length);
}

function verifyContactPage() {
  const layout = document.querySelector("article.contact-layout");
  expect(layout).toBeTruthy();
  expect(layout?.querySelector(".page-head")).toBeTruthy();
  expect(layout?.querySelector(".contact-copy")).toBeTruthy();
  expect(layout?.querySelector(".contact-routing")).toBeTruthy();
  expect(layout?.querySelector("#inquiry-form")).toBeTruthy();
  // /contact is the general entry point, so it keeps the interview default;
  // only the media-kit page pre-selects its own type.
  expect((screen.getByLabelText("Inquiry type") as HTMLSelectElement).value).toBe(
    "interview",
  );
  expect(screen.getByRole("heading", { level: 1, name: "Press inquiries" })).toBeTruthy();
  // Only the line the selected type actually routes to. The default is an
  // interview, which goes to the press inbox, so the speaking and
  // partnership lines are not on screen to be mistaken for it.
  expect(screen.getByText(/press@coinsub.io/)).toBeTruthy();
  expect(screen.queryByText(/speaking@jasperfu.com/)).toBeNull();
  expect(document.querySelectorAll(".route-list li")).toHaveLength(1);
  expect(
    screen.getByRole("link", { name: "Open Calendly" }).getAttribute("href"),
  ).toBe("https://calendly.com/jasper-coinsub");
  expect(screen.queryByLabelText("Availability")).toBeNull();
  expect(screen.getByRole("button", { name: SEND_REQUEST_CTA })).toBeTruthy();
  expect(screen.queryByRole("button", { name: "Prepare request" })).toBeNull();
  expect(screen.getByRole("option", { name: "Request Media Kit" })).toBeTruthy();
  expect(screen.queryByRole("option", { name: "Download Media Kit" })).toBeNull();
  expect(screen.getByText(PUBLISHED_CALENDLY_PROMPT)).toBeTruthy();
  expect(screen.queryByText(TEAM_CONFIRMATION_COPY)).toBeNull();
  expect(screen.getAllByText(PUBLISHED_RESPONSE_TIME_NOTE)).toHaveLength(1);
  expect(screen.queryByText(/Confirm the actual commitment before publishing/)).toBeNull();
  expect(screen.queryByText(/\[/)).toBeNull();
}

function verifyMediaKitRequest() {
  expect(screen.getByRole("heading", { level: 1, name: "Media Kit" })).toBeTruthy();
  expect(screen.getByText(MEDIA_KIT_PROMISE)).toBeTruthy();
  // No hero still here: the same NYSE frame already leads About and is
  // embedded on the home page, and it earned nothing beside the form.
  expect(screen.queryByRole("img")).toBeNull();
  expect(document.querySelector(".media-kit-request")).toBeNull();
  // The ask sits on one screen: a button that opens the form, then what to
  // expect. The page no longer forwards to /contact, and no longer opens on
  // a long form.
  expect(
    screen.getByRole("button", { name: "Request Full Media Kit" }),
  ).toBeTruthy();
  expect(
    screen.queryByRole("link", { name: "Request Full Media Kit" }),
  ).toBeNull();
  // Once under the button for a reader who never opens the form, and once
  // inside it at the point of submitting — never both on screen at once.
  expect(document.querySelector(".media-kit-hero__note")?.textContent).toBe(
    PUBLISHED_RESPONSE_TIME_NOTE,
  );
  expect(
    screen.getByRole("link", { name: identity.pressEmail }).getAttribute("href"),
  ).toBe(`mailto:${identity.pressEmail}`);

  // The form is carried in a native dialog, pre-selected and narrowed to the
  // one request this page is for, with no scheduling block.
  const dialog = document.querySelector("dialog.request-dialog");
  expect(dialog).toBeTruthy();
  expect(dialog?.hasAttribute("open")).toBe(false);
  const form = dialog?.querySelector("form.inquiry-form");
  expect(form).toBeTruthy();
  expect(document.querySelectorAll("form.inquiry-form")).toHaveLength(1);
  // One offered type is not a choice, so no picker is shown at all — the
  // value still travels with the submission as a hidden field.
  expect(form?.querySelector("select")).toBeNull();
  expect(screen.queryByLabelText("Inquiry type")).toBeNull();
  const hidden = form?.querySelector<HTMLInputElement>(
    'input[type="hidden"][name="inquiryType"]',
  );
  expect(hidden?.value).toBe(MEDIA_KIT_INQUIRY_TYPE);
  expect(document.querySelector("[data-calendly-block]")).toBeNull();
  expect(screen.queryByRole("link", { name: "Open Calendly" })).toBeNull();
  // Cancel sits beside submit in the dialog footer. Queried through the DOM
  // rather than by role: the dialog is closed, so its contents are hidden
  // from the accessibility tree.
  const actions = form?.querySelector(".inquiry-form__actions");
  expect(actions?.querySelector(".button-link--ghost")?.textContent).toBe("Cancel");
  expect(actions?.querySelector('button[type="submit"]')).toBeTruthy();

  expect(screen.queryByText(RETIRED_MEDIA_KIT_PROMISE)).toBeNull();
  expect(document.querySelector(".media-kit-hero")).toBeTruthy();
  expect(screen.queryByText("Circular seal")).toBeNull();
  expect(screen.queryByText("Asset pending")).toBeNull();
  expect(screen.queryByText("Copy to Clipboard")).toBeNull();
  expect(screen.queryByText("Fact sheet")).toBeNull();
  expect(screen.queryByText("Approved copy blocks")).toBeNull();
}

function renderAbout() {
  return render(<AboutPage />);
}

/**
 * Every public page used to open with an eyebrow naming the page the reader
 * was already on, above a heading that said much the same thing. They were
 * all retired. Sweeping every route rather than listing the ones changed by
 * hand, because the hand-written list is exactly what missed /press/media-
 * coverage the first time.
 */
function verifyNoPageNameEyebrow(container: HTMLElement, route: string) {
  const head = container.querySelector(".page-head");
  expect(head).toBeTruthy();
  const eyebrow = head?.querySelector(":scope > .eyebrow");
  expect(
    eyebrow,
    `${route} still prints a page-name eyebrow: ${eyebrow?.textContent}`,
  ).toBeNull();
}

function verifyAboutShowcase(container: HTMLElement) {
  const figure = container.querySelector("figure.showcase__frame");
  expect(figure).toBeTruthy();

  const image = figure?.querySelector("img.showcase__image");
  expect(image?.getAttribute("src")).toBe(MEDIA_KIT_SPEAKING_PHOTO);
  expect(image?.getAttribute("alt")).toContain(identity.name);
  expect(image?.getAttribute("alt")).toContain("New York Stock Exchange");

  // Name and role ride the foot of the still; the numbers sit beside them.
  expect(figure?.querySelector(".showcase__name")?.textContent).toBe(identity.name);
  expect(figure?.querySelector(".showcase__role")?.textContent).toBe(identity.title);

  const stats = [...(figure?.querySelectorAll(".showcase__stat") ?? [])];
  expect(stats).toHaveLength(quickFacts.length);
  stats.forEach((stat, index) => {
    const fact = quickFacts[index]!;
    expect(stat.querySelector(".showcase__stat-value")?.textContent).toBe(fact.value);
    expect(stat.querySelector(".showcase__stat-label")?.textContent).toBe(fact.label);
  });

  // The 4:5 studio portrait and the standalone Quick facts band retired with
  // this card — the numbers live on the still now, in one place only.
  expect(container.querySelector(".about-portrait")).toBeNull();
  expect(container.querySelector(".fact-grid")).toBeNull();
  expect(screen.queryByRole("heading", { name: "Quick facts" })).toBeNull();
  expect(container.textContent).not.toMatch(/Placeholder photography/i);
}

function verifyAboutBioLayout(container: HTMLElement) {
  const prose = container.querySelector(".about-bio__prose.bio-full");
  expect(prose).toBeTruthy();
  const body = [...(prose?.querySelectorAll(":scope > p") ?? [])]
    .map((node) => node.textContent?.trim() ?? "")
    .join(" ");
  expect(body).toBe(bios.words150);
  // The bio is its own labelled band under the hero still, running beside
  // the company panel rather than alone in a narrow column.
  const section = prose?.closest(".about-bio");
  expect(section).toBeTruthy();
  expect(section?.classList.contains("band")).toBe(true);
  expect(section?.querySelector(".about-bio__main .eyebrow")?.textContent).toBe(
    "Biography",
  );
  const company = section?.querySelector("aside.about-company");
  expect(company).toBeTruthy();
  expect(company?.querySelector(".eyebrow")?.textContent).toBe(
    "Current Endeavour",
  );
  expect(company?.querySelector(".about-company__copy")?.textContent).toBe(
    companyBoilerplate,
  );
  expect(container.querySelectorAll(".bio-full")).toHaveLength(1);
  expect(section?.querySelector("figure")).toBeNull();
  expect(prose?.closest("figure")).toBeNull();
  expect(prose?.querySelectorAll(":scope > p")).toHaveLength(
    aboutBioParagraphs.length,
  );
  for (const paragraph of aboutBioParagraphs) {
    expect(body).toContain(paragraph);
  }
}

function verifyAboutClosingQuote(container: HTMLElement) {
  const quote = container.querySelector(
    ".page-head--label blockquote.about-bio__quote",
  );
  expect(quote?.querySelector("p")?.textContent).toContain(ABOUT_PULL_QUOTE);
  expect(quote?.querySelector("cite")).toBeNull();
  expect(quote?.textContent).not.toContain(identity.name);
  expect(container.querySelectorAll("cite")).toHaveLength(0);
  expect(
    container.querySelector(".about-bio__prose blockquote.about-bio__quote"),
  ).toBeNull();
}

function verifyAboutAbsences() {
  expect(screen.queryByText("Approved lengths")).toBeNull();
  expect(screen.queryByText(/Placeholder photography/i)).toBeNull();
  expect(screen.queryByText("For desks and producers")).toBeNull();
  expect(screen.queryByText(new RegExp(aboutFiftyWordOnlySnippet))).toBeNull();
  expect(screen.queryByText("Co-founder")).toBeNull();
  for (const snippet of aboutWords250OnlySnippets) {
    expect(screen.queryByText(new RegExp(snippet))).toBeNull();
  }
}

function verifyAboutPageHead(container: HTMLElement) {
  const pageHead = container.querySelector(".page-head--label");
  expect(pageHead).toBeTruthy();
  // No page-name eyebrow: the label read "About" on the About page, above a
  // heading that said the same. The visually-hidden h1 still names the page
  // for assistive tech.
  expect(pageHead?.querySelector(".eyebrow")).toBeNull();
  expect(pageHead?.querySelector("h1")?.className).toContain("visually-hidden");
  expect(pageHead?.querySelector("cite")).toBeNull();
  expect(pageHead?.textContent).not.toContain(identity.name);
  expect(
    screen.getByRole("heading", { level: 1, name: "About" }).className,
  ).toContain("visually-hidden");
  expect(
    screen.queryByRole("heading", { level: 1, name: identity.name }),
  ).toBeNull();
}

/**
 * The stat-card band is retired: its numbers moved onto the hero still, so
 * each figure is published in exactly one place. The longer `detail` line
 * has no home on a chip and must not survive anywhere on the page.
 */
function verifyRetiredQuickFactsBand(container: HTMLElement) {
  expect(container.querySelector(".fact-grid")).toBeNull();
  expect(container.querySelectorAll(".stat-card")).toHaveLength(0);
  for (const fact of quickFacts) {
    expect(screen.getAllByText(fact.value)).toHaveLength(1);
    expect(screen.getAllByText(fact.label)).toHaveLength(1);
    expect(screen.queryByText(fact.detail)).toBeNull();
  }
}

function verifyAboutPullQuotesSection(container: HTMLElement) {
  const cards = container.querySelectorAll(".quote-card");
  expect(cards).toHaveLength(pullQuotes.length);
  for (const line of pullQuotes) {
    expect(screen.getByText(`“${line}”`)).toBeTruthy();
  }
  expect(container.querySelectorAll(".quote-card cite")).toHaveLength(0);
}

function verifyAboutFaqSection(container: HTMLElement) {
  const items = container.querySelectorAll(".faq-item");
  expect(items).toHaveLength(ABOUT_FAQ_PUBLISHED_COUNT);
  for (const faq of aboutFaqs.slice(0, ABOUT_FAQ_PUBLISHED_COUNT)) {
    expect(screen.getByText(faq.question)).toBeTruthy();
    expect(screen.getByText(faq.answer)).toBeTruthy();
  }
  expect(screen.queryByText("What does programmable money mean?")).toBeNull();
  expect(screen.queryByText(/Definition pending/)).toBeNull();
}

function verifyAboutClosingCta() {
  expect(
    screen.getByRole("link", { name: BOOK_TO_SPEAK_CTA }).getAttribute("href"),
  ).toBe("/speaking");
  expect(
    screen.getByRole("link", { name: VIEW_ALL_COVERAGE_CTA }).getAttribute("href"),
  ).toBe("/press/media-coverage");
}

function verifyAboutPage(container: HTMLElement) {
  verifyAboutBioLayout(container);
  expect(container.querySelector(".about-bio__prose")?.textContent).toContain(
    aboutWords150UniqueSnippet,
  );
  verifyAboutPageHead(container);
  verifyAboutShowcase(container);
  verifyAboutClosingQuote(container);
  verifyRetiredQuickFactsBand(container);
  verifyAboutPullQuotesSection(container);
  verifyAboutFaqSection(container);
  verifyAboutClosingCta();
  expect(screen.getByText("Current Endeavour")).toBeTruthy();
  expect(screen.getByText("Current Endeavour").querySelector("img")).toBeNull();
  expect(
    screen.getByRole("img", { name: "Coinsub" }).getAttribute("src"),
  ).toBe("/logos/coinsub-logo.svg");
  expect(screen.getByRole("img", { name: "Coinsub" }).closest("h2")).toBeTruthy();
  expect(
    screen.getByRole("link", { name: "Coinsub" }).getAttribute("href"),
  ).toBe(identity.coinsubUrl);
  verifyAboutAbsences();
  expect(screen.queryByText("Ready pull-quotes")).toBeNull();
  expect(container.querySelector(".topic-grid")).toBeNull();
}

describe("public routes", () => {
  it("renders the 150-word bio, portrait overlay, and current endeavour", () => {
    const { container } = renderAbout();
    verifyAboutPage(container);
  });

  it("pairs the career timeline with credentials instead of leaving half-rows empty", () => {
    const { container } = renderAbout();
    const row = container.querySelector(".band.two-col");
    expect(row).toBeTruthy();
    const columns = [...(row?.children ?? [])];
    expect(columns).toHaveLength(2);
    expect(columns[0]?.querySelector(".eyebrow")?.textContent).toBe("Journey");
    expect(columns[0]?.querySelectorAll(".career-timeline__item")).toHaveLength(
      careerTimeline.length,
    );

    // The right column carries two lists, because the old single list put
    // Jasper's degree and Coinsub's registration under one heading and only
    // one of them is about him.
    const rightEyebrows = [
      ...(columns[1]?.querySelectorAll(".eyebrow") ?? []),
    ].map((el) => el.textContent);
    expect(rightEyebrows).toEqual(["Credentials", "Company"]);
    const rightLists = columns[1]?.querySelectorAll("ul.credentials-list") ?? [];
    expect(rightLists).toHaveLength(2);
    expect(rightLists[0]?.querySelectorAll(".career-timeline__item")).toHaveLength(
      credentials.length,
    );
    expect(rightLists[1]?.querySelectorAll(".career-timeline__item")).toHaveLength(
      companyStanding.length,
    );
    // Neither list trails the page as its own full-width band.
    expect(container.querySelectorAll("ul.credentials-list")).toHaveLength(2);
  });

  it("opens every public page on its heading, with no page-name eyebrow", () => {
    const routes = [
      ["/about", <AboutPage key="about" />],
      ["/press", <PressPage key="press" />],
      ["/press/media-coverage", <CoveragePage key="coverage" />],
      ["/speaking", <SpeakingPage key="speaking" />],
      ["/media-kit", <MediaKitPage key="kit" />],
      ["/contact", <ContactPage key="contact" />],
    ] as const;

    for (const [route, element] of routes) {
      const { container, unmount } = render(element);
      verifyNoPageNameEyebrow(container, route);
      unmount();
    }
  });

  it("keeps the section eyebrows that orient rather than repeat", () => {
    // Only the page-name labels went. Section eyebrows still carry the
    // internal hierarchy.
    const { container } = renderAbout();
    const labels = [...container.querySelectorAll(".eyebrow")].map(
      (el) => el.textContent,
    );
    expect(labels).toContain("Biography");
    expect(labels).toContain("Journey");
    expect(labels).toContain("Credentials");
    expect(labels).not.toContain("About");
  });

  it("keeps Jasper's credentials apart from Coinsub's standing", () => {
    const { container } = renderAbout();
    const lists = [...container.querySelectorAll("ul.credentials-list")];
    const personal = lists[0]?.textContent ?? "";
    const corporate = lists[1]?.textContent ?? "";

    expect(personal).toContain("Emory University");
    expect(personal).not.toContain("MSB-registered");
    expect(corporate).toContain("MSB-registered");
    expect(corporate).toContain("Middletown, Delaware");
    expect(corporate).not.toContain("Emory");

    // Unconfirmed LinkedIn detail stays off a build.
    expect(CREDENTIALS_DRAFT_APPROVED).toBe(false);
    expect(personal).not.toContain("Strategy and Management Consulting");
    expect(personal).not.toContain("Darden");
    // And the two certificates that were judged not press copy never appear.
    expect(container.textContent).not.toContain("Oracle");
    expect(container.textContent).not.toContain("Python");
  });

  it("keeps the unconfirmed LinkedIn timeline off the page", () => {
    const { container } = renderAbout();
    const journey = container.querySelector(".career-timeline")?.textContent ?? "";

    // Drafted from a self-reported source and not yet confirmed by Jasper.
    expect(CAREER_TIMELINE_DRAFT_APPROVED).toBe(false);
    for (const entry of CAREER_TIMELINE_DRAFT) {
      // The period is the part that only exists in the draft; the Coinsub
      // sentence is shared with the published timeline.
      expect(journey).not.toContain(entry.period);
    }
    expect(journey).not.toContain("Director of Product Management");
    // None of the advisory companies has been cleared to appear anywhere.
    for (const company of ["Otim Labs", "Aztlan", "Vantack", "Heimata", "Walapay"]) {
      expect(container.textContent).not.toContain(company);
    }
    // The published spine is what still renders, and undated.
    for (const entry of careerTimeline) {
      expect(journey).toContain(entry.detail);
      expect(entry.period).toBeUndefined();
    }
    expect(container.querySelectorAll(".career-timeline__period")).toHaveLength(
      0,
    );
  });

  it("publishes each quick fact once, on the hero still rather than a stat band", () => {
    const { container } = renderAbout();
    verifyAboutShowcase(container);
    verifyRetiredQuickFactsBand(container);
  });

  it("answers the first 3 FAQs and excludes the unfinished 4th", () => {
    const { container } = renderAbout();
    verifyAboutFaqSection(container);
  });

  it("closes with Book to Speak and View All Media Coverage CTAs", () => {
    renderAbout();
    verifyAboutClosingCta();
  });

  it("sets the 150-word bio in one measured column under the hero still", () => {
    const { container } = renderAbout();
    verifyAboutBioLayout(container);
    verifyAboutShowcase(container);
    const words = bios.words150.trim().split(/\s+/);
    expect(words.length).toBeGreaterThan(1);
    expect(words.length).toBeGreaterThanOrEqual(100);
    expect(words.length).toBeLessThan(200);
    expect(container.querySelectorAll("figure.showcase__frame")).toHaveLength(1);
  });

  it("omits 250-word-only copy, approved lengths, and the standalone co-founder card", () => {
    renderAbout();
    expect(screen.queryByText("Approved lengths")).toBeNull();
    expect(screen.queryByText("50 words")).toBeNull();
    expect(screen.queryByText("150 words")).toBeNull();
    expect(screen.queryByText(new RegExp(aboutFiftyWordOnlySnippet))).toBeNull();
    expect(screen.queryByText("For desks and producers")).toBeNull();
    expect(screen.queryByRole("heading", { name: "David Akers" })).toBeNull();
    for (const snippet of aboutWords250OnlySnippets) {
      expect(screen.queryByText(new RegExp(snippet))).toBeNull();
    }
  });

  it("leaves the thesis to the home hero rather than repeating it on About", () => {
    const { container } = renderAbout();
    verifyAboutShowcase(container);
    expect(container.querySelector(".page-head__lede")).toBeNull();
    expect(container.querySelectorAll(".about-portrait__thesis")).toHaveLength(0);
    expect(container.textContent).not.toContain(identity.thesis);
    expect(container.textContent).not.toContain("Trust shouldn't be a promise");
  });

  it("leads with the locked one-liner over the quote as its deck", () => {
    const { container } = renderAbout();
    verifyAboutPageHead(container);
    const headline = container.querySelector(".about-headline");
    expect(headline?.textContent).toBe(PUBLISHED_ONE_LINER);
    // The one-liner reads before the quote, not after it.
    const deck = container.querySelector(".page-head--label .about-bio__quote");
    expect(deck).toBeTruthy();
    expect(
      headline!.compareDocumentPosition(deck as Node) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });

  it("places the cash-to-digital quote under the About label on the left", () => {
    const { container } = renderAbout();
    verifyAboutClosingQuote(container);
    verifyAboutBioLayout(container);
  });

  it("surfaces the pull-quote list on About", () => {
    const { container } = renderAbout();
    verifyAboutPullQuotesSection(container);
  });

  it("renders the interim press releases page", () => {
    verifyHeading(PressPage, "Press Releases");
    verifyPressReleaseThumbs();
  });

  it("pairs the alerts ask with an inline signup rather than a page-wide field", () => {
    const { container } = render(<PressPage />);
    const panel = container.querySelector(".alert-panel");
    expect(panel).toBeTruthy();
    // The ask and the form are one block, not a heading with a stray field.
    expect(panel?.querySelector(".section-intro .eyebrow")?.textContent).toBe(
      "Alerts",
    );
    const form = panel?.querySelector("form.alert-form");
    expect(form).toBeTruthy();
    // The field is wrapped so the label stacks over the input while the
    // button stays on the same line as the field.
    const field = form?.querySelector(".alert-form__field");
    expect(field?.querySelector("label")?.getAttribute("for")).toBe("alert-email");
    expect(field?.querySelector("input")?.getAttribute("type")).toBe("email");
    expect(form?.querySelector('button[type="submit"]')?.textContent).toBe(
      "Notify me",
    );
    expect(field?.querySelector("button")).toBeNull();
    expect(screen.getByLabelText("Email")).toBeTruthy();
  });

  it("renders media coverage including the NASDAQ interview", () => {
    const { container } = render(<CoveragePage />);
    const featured = mediaCoverage[0]!;
    const outlet = assertOutletMarkFor(featured.outlet);

    // The featured item now uses the home page's split-header treatment:
    // headline and outlet mark left, standfirst and action right, over a
    // full-width player — not a bordered card.
    const section = container.querySelector("section.featured-interview");
    expect(section).toBeTruthy();
    expect(
      section?.querySelector(".featured-interview__title")?.textContent,
    ).toBe(featured.title);
    const mark = section?.querySelector<HTMLImageElement>(
      "img.featured-interview__outlet",
    );
    expect(mark?.getAttribute("alt")).toBe(outlet.name);
    expect(mark?.getAttribute("src")).toBe(outlet.logo);
    expect(
      section?.querySelector(".featured-interview__lede")?.textContent,
    ).toBe(featured.caption);
    expect(
      section?.querySelector<HTMLIFrameElement>("iframe.featured-interview__media")
        ?.getAttribute("src"),
    ).toBe(featured.embedUrl);
    expect(screen.getByTitle(/crypto payments, stablecoins/i)).toBeTruthy();

    // The featured action reads the same as it does on the home page.
    const watch = section?.querySelector<HTMLAnchorElement>("a.button-link");
    expect(watch?.textContent).toBe(WATCH_INTERVIEW_CTA);
    expect(watch?.getAttribute("href")).toBe(featured.watchUrl);
    expect(section?.querySelector("article.card")).toBeNull();
    expect(screen.queryByRole("link", { name: "Watch on YouTube" })).toBeNull();

    // The remaining items keep their text outlet label, since only cleared
    // outlets have a wordmark to show, and take the press-release card:
    // thumbnail, copy, then a full-width button naming the medium.
    const actions = { video: "Watch", audio: "Listen", article: "Read coverage" };
    for (const item of mediaCoverage.slice(1)) {
      expect(screen.getByText(item.outlet)).toBeTruthy();
      const card = screen.getByText(item.title).closest("article.card--thumb");
      expect(card).toBeTruthy();
      const thumb = card?.querySelector<HTMLImageElement>("img.card__thumb");
      expect(thumb?.getAttribute("src")).toBe(item.image);
      expect(thumb?.getAttribute("width")).toBe(String(PRESS_THUMB_WIDTH));
      expect(thumb?.getAttribute("height")).toBe(String(PRESS_THUMB_HEIGHT));
      const action = card?.querySelector<HTMLAnchorElement>("a.button-link--block");
      expect(action?.textContent).toBe(actions[item.kind]);
      expect(action?.getAttribute("href")).toBe(item.watchUrl);
      // No card is left linking to a bare corporate home page.
      expect(item.watchUrl).not.toBe("https://www.circle.com");
      expect(new URL(item.watchUrl).pathname).not.toBe("/");
    }
    // The Circle entry points at the Builder Series episode itself.
    const circle = mediaCoverage.find((item) => item.outlet === "Circle");
    expect(circle?.watchUrl).toBe("https://www.youtube.com/watch?v=j3MOBy6PUnU");
  });

  it("renders speaking topics and a Book Jasper request form", () => {
    render(<SpeakingPage />);
    verifySpeakingPage();
  });

  it("offers the full media kit on request beside a speaking photo", () => {
    render(<MediaKitPage />);
    verifyMediaKitRequest();
  });

  it("renders contact routing copy", () => {
    render(<ContactPage />);
    verifyContactPage();
  });

  it("renders ToS V2 with the press-materials license", () => {
    render(<TermsPage />);
    expect(
      screen.getByRole("heading", { level: 1, name: "Terms of Service" }),
    ).toBeTruthy();
    expect(screen.getByText("Last updated: August 14, 2026")).toBeTruthy();
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "Press and Media Materials; Limited License",
      }),
    ).toBeTruthy();
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "Scope; Relationship to Coinsub",
      }),
    ).toBeTruthy();
    expect(screen.getByText(/info@jasperfu.io/)).toBeTruthy();
    expect(screen.queryByText(/Insert date/)).toBeNull();
    expect(screen.queryByText(RETIRED_LEGAL_DRAFT_NOTICE)).toBeNull();
  });

  it("renders published companion legal pages", () => {
    verifyHeading(PrivacyPage, "Privacy Policy");
    expect(screen.getByText("Last updated: August 14, 2026")).toBeTruthy();
    expect(screen.getByText(/info@jasperfu.io/)).toBeTruthy();
    expect(screen.queryByText(/Insert date/)).toBeNull();
    expect(screen.queryByText(RETIRED_LEGAL_DRAFT_NOTICE)).toBeNull();
    cleanup();
    verifyHeading(CookiesPage, "Cookie Policy");
    expect(screen.getByText("Last updated: August 14, 2026")).toBeTruthy();
    expect(screen.queryByText(RETIRED_LEGAL_DRAFT_NOTICE)).toBeNull();
    cleanup();
    render(<LegalPage />);
    expect(screen.getByText("Last updated: August 14, 2026")).toBeTruthy();
    expect(screen.getByText(/FinCEN/)).toBeTruthy();
    expect(screen.getByText(/Coinsub and Jasper Fu undertake/)).toBeTruthy();
    expect(screen.queryByText(/Insert date/)).toBeNull();
    expect(screen.queryByText(RETIRED_LEGAL_DRAFT_NOTICE)).toBeNull();
  });

  it("renders a branded not-found route", () => {
    render(<NotFoundPage />);
    expect(
      screen.getByRole("link", { name: "Back to home" }).getAttribute("href"),
    ).toBe("/");
  });
});
