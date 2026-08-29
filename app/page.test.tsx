import { render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import HomePage from "./page";
import {
  bios,
  companyBoilerplate,
  factSheet,
  FLAGSHIP_ESSAY_READY,
  interimBlogPosts,
  mediaCoverage,
  parseFactSheet,
  pullQuotes,
  splitBioLede,
  VIEW_ALL_COVERAGE_CTA,
  WATCH_INTERVIEW_CTA,
} from "../lib/copy";
import {
  HERO_FEATURE_PORTRAIT,
  HERO_FEATURED_TOPIC,
  heroTopics,
  TEMPLATE_HERO_TOPICS,
} from "../lib/hero";
import {
  assertOutletMarkFor,
  identity,
  MEDIA_BAR_LOOP_COPIES,
  mediaOutlets,
} from "../lib/identity";
import {
  PRESS_THUMB_HEIGHT,
  PRESS_THUMB_WIDTH,
} from "../lib/press-thumbnail";

const homeQuote = pullQuotes[0];

function verifyHomePage() {
  expect(
    screen.getByRole("heading", { level: 1, name: "Jasper Fu" }),
  ).toBeTruthy();
  expect(
    screen.getByText(identity.thesis),
  ).toBeTruthy();
  expect(
    screen.getAllByRole("link", { name: "Coinsub" }).every(
      (link) => link.getAttribute("href") === identity.coinsubUrl,
    ),
  ).toBe(true);
  expect(screen.getByRole("link", { name: "Book to Speak" }).getAttribute("href")).toBe(
    "/speaking",
  );
  expect(screen.queryByRole("link", { name: "View Media Kit" })).toBeNull();
  expect(
    screen.getByRole("link", { name: "Request Full Media Kit" }).getAttribute("href"),
  ).toBe("/media-kit");
  expect(screen.queryByRole("link", { name: "Download Media Kit" })).toBeNull();
  const portraits = document.querySelectorAll(".hero__portrait-image");
  expect(portraits).toHaveLength(1);
  expect(portraits[0]?.getAttribute("src")).toBe(HERO_FEATURE_PORTRAIT);
  expect(portraits[0]?.getAttribute("alt")).toBe(identity.name);
  expect(document.querySelectorAll(".hero__photo-image")).toHaveLength(0);
  expect(screen.queryByText("FCTI logo")).toBeNull();
  expect(document.querySelector(".hero__coinsub")).toBeNull();
  // The oversized name now leads the hero, with the role eyebrow reading
  // beneath it in the intro column.
  expect(
    screen
      .getByRole("heading", { level: 1, name: identity.name })
      .compareDocumentPosition(
        screen.getByText((_, node) =>
          Boolean(
            node?.classList.contains("eyebrow") &&
              node.textContent === identity.title,
          ),
        ),
      ) & Node.DOCUMENT_POSITION_FOLLOWING,
  ).toBeTruthy();
}

function verifyHeroComposition() {
  const name = document.querySelector(".hero__name");
  const watermark = document.querySelector(".hero__watermark");
  expect(name?.textContent).toBe(identity.name);
  // Caps are a text-transform, so the accessible name stays a real name.
  expect(name?.textContent).not.toBe(identity.name.toUpperCase());
  expect(watermark?.textContent).toBe("Jasper");
  expect(watermark?.getAttribute("aria-hidden")).toBe("true");
  expect(
    document.querySelector(".hero__portrait-halftone")?.getAttribute("aria-hidden"),
  ).toBe("true");

  const topics = [...document.querySelectorAll(".hero__topic")];
  expect(topics).toHaveLength(heroTopics.length);
  expect(topics.map((topic) => topic.textContent)).toEqual([...heroTopics]);
  const featured = topics.filter((topic) =>
    topic.classList.contains("hero__topic--featured"),
  );
  expect(featured).toHaveLength(1);
  expect(featured[0]?.textContent).toBe(HERO_FEATURED_TOPIC);
  for (const filler of TEMPLATE_HERO_TOPICS) {
    expect(screen.queryByText(filler)).toBeNull();
  }

  const cta = screen.getByRole("link", { name: "Book to Speak" });
  expect(cta.classList.contains("marker-link")).toBe(true);
  expect(cta.getAttribute("href")).toBe("/speaking");
}

function verifyHomeMediaBar() {
  const bar = document.querySelector(".media-bar");
  const track = bar?.querySelector(".media-bar__track");
  const groups = bar?.querySelectorAll(".media-bar__group") ?? [];
  expect(bar).toBeTruthy();
  expect(track).toBeTruthy();
  expect(mediaOutlets).toHaveLength(4);
  expect(groups).toHaveLength(MEDIA_BAR_LOOP_COPIES);
  expect(groups[1]?.getAttribute("aria-hidden")).toBe("true");
  const logos = [...bar!.querySelectorAll("img.media-bar__logo")];
  expect(logos).toHaveLength(mediaOutlets.length * MEDIA_BAR_LOOP_COPIES);
  const sources = logos.map((img) => img.getAttribute("src"));
  expect(new Set(sources).size).toBe(mediaOutlets.length);
  // Scoped to the strip: Coinsub is both an outlet here and the Company mark
  // further down the page, so a page-wide query would match two elements.
  for (const outlet of mediaOutlets) {
    const logo = within(bar as HTMLElement).getByRole("img", {
      name: outlet.name,
    });
    expect(logo.getAttribute("src")).toBe(outlet.logo);
    expect(logo.closest("a")?.getAttribute("href")).toBe(outlet.href);
    if (outlet.name === "CEO Magazine") {
      expect(logo.classList.contains("media-bar__logo--ceo")).toBe(true);
    }
  }
  expect(screen.queryByRole("img", { name: "FCTI" })).toBeNull();
}

function verifyHomeBlogThumbs() {
  const section = screen
    .getByText("Latest from Coinsub")
    .closest("section");
  expect(section).toBeTruthy();
  const thumbs = section!.querySelectorAll("img.card__thumb");
  const frames = section!.querySelectorAll(".card__media");
  expect(thumbs).toHaveLength(interimBlogPosts.length);
  expect(frames).toHaveLength(interimBlogPosts.length);
  expect(PRESS_THUMB_WIDTH * 9).toBe(PRESS_THUMB_HEIGHT * 16);
  for (const post of interimBlogPosts) {
    const img = screen.getByRole("img", { name: post.title });
    expect(img.getAttribute("src")).toBe(post.image);
    expect(img.getAttribute("width")).toBe(String(PRESS_THUMB_WIDTH));
    expect(img.getAttribute("height")).toBe(String(PRESS_THUMB_HEIGHT));
    expect(img.closest(".card__media")).toBeTruthy();
  }

  // Each card foots with the site's solid button, marked external because
  // the posts live on coinsub.io.
  const cardLinks = [...section!.querySelectorAll("a.button-link")];
  expect(cardLinks).toHaveLength(interimBlogPosts.length);
  cardLinks.forEach((link, index) => {
    expect(link.textContent).toBe("Read More");
    expect(link.getAttribute("href")).toBe(interimBlogPosts[index]!.href);
    expect(link.classList.contains("button-link--block")).toBe(true);
    expect(link.classList.contains("button-link--external")).toBe(true);
    expect(link.getAttribute("href")?.startsWith("https://")).toBe(true);
  });
  expect(section!.querySelectorAll("a.text-link")).toHaveLength(0);
  expect(section!.querySelectorAll("a.card__link")).toHaveLength(0);

  // The section action moved into the split header as a marker link.
  const head = section!.querySelector(".post-head");
  expect(head).toBeTruthy();
  expect(head!.querySelector(".eyebrow")?.textContent).toBe(
    "Latest from Coinsub",
  );
  const blogCta = screen.getByRole("link", { name: "Read the Blog" });
  expect(blogCta.getAttribute("href")).toBe("/press");
  expect(blogCta.classList.contains("marker-link")).toBe(true);
  expect(blogCta.closest(".post-head")).toBeTruthy();
}

/**
 * The featured interview reads as a two-column header over a full-width
 * player: headline and outlet credit on the left, standfirst and actions on
 * the right. It no longer uses the full-width section-intro treatment.
 */
function verifyFeaturedInterview() {
  const featured = mediaCoverage[0]!;
  const heading = screen.getByRole("heading", { level: 2, name: featured.title });
  const section = heading.closest(".featured-interview");
  expect(section).toBeTruthy();
  expect(heading.closest(".section-intro--full")).toBeNull();
  expect(heading.closest(".featured-interview__head")).toBeTruthy();

  const outlet = assertOutletMarkFor(featured.outlet);
  const mark = section!.querySelector<HTMLImageElement>(
    ".featured-interview__outlet",
  );
  expect(mark?.getAttribute("src")).toBe(outlet.logo);
  // The mark carries the name in alt text; repeating it as visible text
  // beside the wordmark just said "Nasdaq NASDAQ".
  expect(mark?.getAttribute("alt")).toBe(outlet.name);
  expect(
    section!.querySelector(".featured-interview__credit")?.textContent,
  ).toBe("");

  expect(
    section!.querySelector(".featured-interview__lede")?.textContent,
  ).toBe(featured.caption);

  const watch = screen.getByRole("link", { name: WATCH_INTERVIEW_CTA });
  expect(watch.getAttribute("href")).toBe(featured.watchUrl);
  expect(watch.classList.contains("button-link")).toBe(true);
  expect(watch.classList.contains("button-link--ghost")).toBe(false);

  const all = screen.getByRole("link", { name: VIEW_ALL_COVERAGE_CTA });
  expect(all.getAttribute("href")).toBe("/press/media-coverage");
  expect(all.classList.contains("button-link--ghost")).toBe(true);

  // The player spans both columns beneath the header.
  const embed = section!.querySelector("iframe.featured-interview__media");
  expect(embed?.getAttribute("src")).toBe(featured.embedUrl);
  expect(embed?.getAttribute("title")).toBe(featured.title);

  expect(screen.queryByRole("link", { name: "Watch on YouTube" })).toBeNull();
  expect(screen.queryByRole("heading", { name: "Short bio" })).toBeNull();
}

/**
 * The Company column publishes the fact sheet as scannable rows. It used to
 * repeat the bio's prose, so the boilerplate must be gone from this page —
 * it still belongs to /about, where there is room for it.
 */
function verifyCompanyFactList(company: HTMLElement) {
  const rows = [...company.querySelectorAll(".fact-list__row")];
  const published = parseFactSheet(factSheet);
  expect(rows).toHaveLength(published.length);
  rows.forEach((row, index) => {
    const fact = published[index]!;
    expect(row.querySelector(".fact-list__label")?.textContent).toBe(fact.label);
    expect(row.querySelector(".fact-list__value")?.textContent).toBe(fact.value);
  });
  expect(company.querySelector("dl.fact-list")).toBeTruthy();
  expect(screen.queryByText(companyBoilerplate)).toBeNull();
}

/**
 * The bio leads with its opening sentence and carries the rest as detail,
 * from the 50-word cut rather than the denser 75-word one.
 */
function verifyHomeBioLede() {
  const { lede, rest } = splitBioLede(bios.words50);
  expect(document.querySelector(".home-brief__lede")?.textContent).toBe(lede);
  expect(document.querySelector(".home-brief__detail")?.textContent).toBe(rest);
  // Read Full Bio carries the same "// LABEL →" marker as the hero CTA.
  const readFullBio = screen.getByRole("link", { name: "Read Full Bio" });
  expect(readFullBio.getAttribute("href")).toBe("/about");
  expect(readFullBio.classList.contains("marker-link")).toBe(true);
  expect(readFullBio.classList.contains("text-link")).toBe(false);
  expect(screen.queryByText(bios.words75)).toBeNull();
  expect(screen.queryByText(bios.words50)).toBeNull();
}

function verifyHomeCompanyAndFlow() {
  expect(screen.queryByRole("heading", { name: "Quick facts" })).toBeNull();
  expect(screen.queryByText(homeQuote)).toBeNull();
  // Coinsub is Jasper's own company, so it belongs to the Company block and
  // not the recognition strip, which carries outlets that covered him.
  const company = screen.getByText("Company").closest(".home-company");
  expect(company?.querySelectorAll('img[alt="Coinsub"]')).toHaveLength(1);
  expect(
    document.querySelectorAll('.media-bar img[alt="Coinsub"]'),
  ).toHaveLength(0);
  expect(screen.getAllByRole("img", { name: "Coinsub" })).toHaveLength(1);
  expect(company?.querySelector("img")?.getAttribute("src")).toBe(
    "/logos/coinsub-logo.svg",
  );
  expect(company?.querySelector("a")?.getAttribute("href")).toBe(
    identity.coinsubUrl,
  );
  verifyCompanyFactList(company as HTMLElement);
  verifyHomeBioLede();
  expect(
    screen.getByText("Biography").compareDocumentPosition(
      screen.getByText("Featured interview"),
    ) & Node.DOCUMENT_POSITION_FOLLOWING,
  ).toBeTruthy();
  expect(screen.queryByRole("heading", { name: "Short bio" })).toBeNull();
}

describe("HomePage", () => {
  beforeEach(() => {
    // Desktop width: the logo strip is a static row, so the carousel's
    // animation loop stays parked for the duration of these tests.
    vi.stubGlobal("matchMedia", () => ({
      matches: false,
      addEventListener: () => {},
      removeEventListener: () => {},
    }));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("renders Version B hero, recognition bar, and kit CTAs", () => {
    render(<HomePage />);
    verifyHomePage();
  });

  it("leads the hero with the oversized name, headshot, and topic column", () => {
    render(<HomePage />);
    verifyHeroComposition();
  });

  it("frames the featured interview as a split header over the player", () => {
    render(<HomePage />);
    verifyFeaturedInterview();
  });

  it("places the Coinsub mark under Company and skips facts and the home quote", () => {
    render(<HomePage />);
    verifyHomeCompanyAndFlow();
  });

  it("replaces media-bar names with cleared outlet logos", () => {
    render(<HomePage />);
    verifyHomeMediaBar();
  });

  it("adds 16:9 thumbnails to Latest from Coinsub cards", () => {
    render(<HomePage />);
    verifyHomeBlogThumbs();
  });

  it("omits the flagship essay teaser until the essay is approved", () => {
    render(<HomePage />);
    expect(FLAGSHIP_ESSAY_READY).toBe(false);
    expect(
      screen.queryByRole("link", { name: "Read the Essay" }),
    ).toBeNull();
  });
});
