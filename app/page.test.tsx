import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import HomePage from "./page";
import {
  FLAGSHIP_ESSAY_READY,
  interimBlogPosts,
  mediaCoverage,
  pullQuotes,
} from "../lib/copy";
import { identity, MEDIA_BAR_LOOP_COPIES, mediaOutlets } from "../lib/identity";
import { heroPortraits } from "../lib/portraits";
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
    screen
      .getAllByRole("link", { name: "Contact" })
      .every((link) => link.getAttribute("href") === "/contact"),
  ).toBe(true);
  expect(screen.queryByRole("link", { name: "Contact Jasper's Team" })).toBeNull();
  expect(
    screen.getByRole("link", { name: "Request Full Media Kit" }).getAttribute("href"),
  ).toBe("/media-kit");
  expect(screen.queryByRole("link", { name: "Download Media Kit" })).toBeNull();
  const portraits = document.querySelectorAll(".hero__photo-image");
  expect(portraits).toHaveLength(1);
  expect(portraits[0]?.getAttribute("src")).toBe(heroPortraits[0]!.src);
  expect(screen.queryByText("FCTI logo")).toBeNull();
  expect(document.querySelector(".hero__coinsub")).toBeNull();
  expect(
    screen.getByText((_, node) =>
      Boolean(
        node?.classList.contains("eyebrow") && node.textContent === identity.title,
      ),
    ).compareDocumentPosition(
      screen.getByRole("heading", { level: 1, name: identity.name }),
    ) & Node.DOCUMENT_POSITION_FOLLOWING,
  ).toBeTruthy();
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
  for (const outlet of mediaOutlets) {
    const logo = screen.getByRole("img", { name: outlet.name });
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
}

function verifyFeaturedInterviewTitle() {
  const heading = screen.getByRole("heading", {
    level: 2,
    name: mediaCoverage[0]!.title,
  });
  expect(heading.closest(".section-intro--full")).toBeTruthy();
  expect(
    screen.getByText("Biography").closest(".section-intro--full"),
  ).toBeNull();
  expect(screen.queryByRole("heading", { name: "Short bio" })).toBeNull();
}

function verifyHomeCompanyAndFlow() {
  expect(screen.queryByRole("heading", { name: "Quick facts" })).toBeNull();
  expect(screen.queryByText(homeQuote)).toBeNull();
  expect(screen.getAllByRole("img", { name: "Coinsub" })).toHaveLength(1);
  const company = screen.getByText("Company").closest(".home-company");
  expect(company?.querySelector("img")?.getAttribute("src")).toBe(
    "/logos/coinsub-logo.svg",
  );
  expect(company?.querySelector("a")?.getAttribute("href")).toBe(
    identity.coinsubUrl,
  );
  expect(
    screen.getByText("Biography").compareDocumentPosition(
      screen.getByText("Featured interview"),
    ) & Node.DOCUMENT_POSITION_FOLLOWING,
  ).toBeTruthy();
  expect(screen.queryByRole("heading", { name: "Short bio" })).toBeNull();
}

describe("HomePage", () => {
  beforeEach(() => {
    vi.stubGlobal("matchMedia", () => ({ matches: true }));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("renders Version B hero, recognition bar, and kit CTAs", () => {
    render(<HomePage />);
    verifyHomePage();
  });

  it("lets the featured interview title span the full content width", () => {
    render(<HomePage />);
    verifyFeaturedInterviewTitle();
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
