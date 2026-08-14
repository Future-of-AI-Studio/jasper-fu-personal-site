import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { ABOUT_PULL_QUOTE, aboutBioParagraphs, bios, interimBlogPosts, PUBLISHED_CALENDLY_PROMPT, PUBLISHED_RESPONSE_TIME_NOTE, PUBLISHED_SPEAKING_BOOKING_TITLE, PUBLISHED_SPEAKING_INTRO, SEND_REQUEST_CTA, TEAM_CONFIRMATION_COPY, speakingTopics } from "../lib/copy";
import { identity } from "../lib/identity";
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
  expect(document.querySelector(".topic-grid")).toBeTruthy();
  expect(document.querySelectorAll(".topic-grid li")).toHaveLength(
    speakingTopics.length,
  );
  expect(speakingTopics.length).toBe(5);
  for (const topic of speakingTopics) {
    expect(screen.getByRole("heading", { name: topic.title })).toBeTruthy();
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
  expect(screen.getByRole("heading", { level: 1, name: "Press inquiries" })).toBeTruthy();
  expect(screen.getByText(/press@coinsub.io/)).toBeTruthy();
  expect(screen.getByText(/speaking@jasperfu.com/)).toBeTruthy();
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
  expect(
    screen.getByRole("heading", { name: "Media Kit available on request" }),
  ).toBeTruthy();
  expect(
    screen
      .getByRole("img", {
        name: "Jasper Fu speaking during a NASDAQ interview at the New York Stock Exchange",
      })
      .getAttribute("src"),
  ).toBe(MEDIA_KIT_SPEAKING_PHOTO);
  expect(
    screen
      .getByRole("link", { name: "Request Full Media Kit" })
      .getAttribute("href"),
  ).toBe("/contact#inquiry-form");
  expect(document.querySelector(".media-kit-request")).toBeTruthy();
  expect(document.querySelectorAll(".media-kit-request__photo")).toHaveLength(1);
  expect(screen.queryByText("Circular seal")).toBeNull();
  expect(screen.queryByText("Asset pending")).toBeNull();
  expect(screen.queryByText("Copy to Clipboard")).toBeNull();
  expect(screen.queryByText("Fact sheet")).toBeNull();
  expect(screen.queryByText("Approved copy blocks")).toBeNull();
}

function renderAbout() {
  return render(<AboutPage />);
}

function verifyAboutPortrait(container: HTMLElement) {
  const figure = container.querySelector("figure.about-portrait");
  expect(figure).toBeTruthy();
  expect(figure?.getAttribute("aria-label")).toBe(identity.name);

  const image = figure?.querySelector("img.about-portrait__image");
  expect(image).toBeTruthy();
  expect(image?.getAttribute("src")).toBe(
    "/portraits/jasper-fu-placeholder.jpg",
  );
  expect(image?.getAttribute("alt")).toBe(identity.name);

  const overlay = figure?.querySelector(".about-portrait__overlay");
  expect(overlay?.textContent).toContain(identity.name);
  expect(overlay?.textContent).toContain("blockchain like plumbing");
  expect(overlay?.textContent).not.toMatch(/Placeholder photography/i);
  expect(overlay?.querySelector(".about-portrait__label")).toBeNull();
  expect(overlay?.querySelector(".about-portrait__thesis")?.textContent).toBe(
    identity.thesis,
  );
}

function verifyAboutBioLayout(container: HTMLElement) {
  const prose = container.querySelector(".about-bio__prose.bio-full");
  expect(prose).toBeTruthy();
  const body = [...(prose?.querySelectorAll(":scope > p") ?? [])]
    .map((node) => node.textContent?.trim() ?? "")
    .join(" ");
  expect(body).toBe(bios.words150);
  expect(prose?.closest(".about-bio")).toBeTruthy();
  expect(prose?.closest(".band")).toBeNull();
  expect(container.querySelectorAll(".bio-full")).toHaveLength(1);
  expect(prose?.closest(".about-bio")?.querySelector("figure.about-portrait")).toBeTruthy();
  expect(prose?.closest("figure.about-portrait")).toBeNull();
  expect(container.querySelector("figure.about-portrait")?.contains(prose)).toBe(
    false,
  );
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
  expect(screen.queryByText("Who is David Akers?")).toBeNull();
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
  expect(pageHead?.querySelector(".eyebrow")?.textContent).toBe("About");
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

function verifyAboutPage(container: HTMLElement) {
  verifyAboutBioLayout(container);
  expect(container.querySelector(".about-bio__prose")?.textContent).toContain(
    aboutWords150UniqueSnippet,
  );
  verifyAboutPageHead(container);
  verifyAboutPortrait(container);
  verifyAboutClosingQuote(container);
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

  it("places the 150-word bio beside a framed portrait for the same vertical span", () => {
    const { container } = renderAbout();
    verifyAboutBioLayout(container);
    verifyAboutPortrait(container);
    const words = bios.words150.trim().split(/\s+/);
    expect(words.length).toBeGreaterThan(1);
    expect(words.length).toBeGreaterThanOrEqual(100);
    expect(words.length).toBeLessThan(200);
    expect(container.querySelectorAll("figure.about-portrait")).toHaveLength(1);
  });

  it("omits 250-word-only copy, approved lengths, FAQ, and the co-founder pair", () => {
    renderAbout();
    expect(screen.queryByText("Approved lengths")).toBeNull();
    expect(screen.queryByText("50 words")).toBeNull();
    expect(screen.queryByText("150 words")).toBeNull();
    expect(screen.queryByText(new RegExp(aboutFiftyWordOnlySnippet))).toBeNull();
    expect(screen.queryByText("Who is David Akers?")).toBeNull();
    expect(screen.queryByText("For desks and producers")).toBeNull();
    expect(screen.queryByText(/collaborative co-founder effort/)).toBeNull();
    expect(screen.queryByRole("heading", { name: "David Akers" })).toBeNull();
    for (const snippet of aboutWords250OnlySnippets) {
      expect(screen.queryByText(new RegExp(snippet))).toBeNull();
    }
  });

  it("keeps the Version B thesis on the portrait overlay, not in the page-head lede", () => {
    const { container } = renderAbout();
    verifyAboutPortrait(container);
    const lede = container.querySelector(".page-head__lede");
    expect(lede).toBeNull();
    const overlayTheses = container.querySelectorAll(".about-portrait__thesis");
    expect(overlayTheses).toHaveLength(1);
    expect(overlayTheses[0]?.textContent).toContain("blockchain like plumbing");
    expect(overlayTheses[0]?.textContent).not.toContain(
      "Trust shouldn't be a promise",
    );
  });

  it("shows a label-only About header and keeps Jasper Fu on the portrait", () => {
    const { container } = renderAbout();
    verifyAboutPageHead(container);
    verifyAboutPortrait(container);
    expect(
      container.querySelector(".about-portrait__name")?.textContent,
    ).toBe(identity.name);
  });

  it("places the cash-to-digital quote under the About label on the left", () => {
    const { container } = renderAbout();
    verifyAboutClosingQuote(container);
    verifyAboutBioLayout(container);
  });

  it("omits the unused pull-quote list from About", () => {
    renderAbout();
    expect(screen.queryByText("Ready pull-quotes")).toBeNull();
    expect(screen.queryByText(/I used to break payment systems for a living/)).toBeNull();
  });

  it("renders the interim press releases page", () => {
    verifyHeading(PressPage, "Press Releases");
    verifyPressReleaseThumbs();
  });

  it("renders media coverage including the NASDAQ interview", () => {
    render(<CoveragePage />);
    expect(screen.getByText("NASDAQ")).toBeTruthy();
    expect(screen.getByTitle(/crypto payments, stablecoins/i)).toBeTruthy();
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
