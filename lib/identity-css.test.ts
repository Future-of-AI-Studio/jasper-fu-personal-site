import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { identity, MEDIA_BAR_LOOP_COPIES } from "./identity";
import { LOGO_CAROUSEL_BREAKPOINT_PX } from "./logo-carousel";

const css = readFileSync(
  join(dirname(fileURLToPath(import.meta.url)), "../app/globals.css"),
  "utf8",
);

const HERO_COLUMN_GAP = {
  min: "1rem",
  preferred: "2.5vw",
  max: "2.5rem",
} as const;
const HERO_INTRO_MAX_WIDTH = "24rem";
const LEGACY_HERO_COPY_MAX_WIDTH = "28rem";
const HERO_NAME_FONT_SIZE = {
  min: "3rem",
  preferred: "15vw",
  max: "13rem",
} as const;
const HERO_NAME_WEIGHT = "font-weight: 700";
const HERO_BODY_WEIGHT = "font-weight: 400";
const HERO_PORTRAIT_LIFT = {
  min: "-5rem",
  preferred: "-5vw",
  max: "-2rem",
} as const;
const HERO_WATERMARK_TINT = "color-mix(in srgb, var(--navy) 4%, transparent)";
const MEDIA_BAR_GAP = "clamp(2rem, 4vw, 3.5rem)";
const MEDIA_BAR_ROW_MAX_TOKEN = "media-bar-row-max";
const MEDIA_BAR_ROW_MAX = "68rem";
const MEDIA_BAR_PADDING = "0.85rem 0";
/* Retired with the top rule that split the strip off from the hero. */
const LEGACY_MEDIA_BAR_PADDING = "1.75rem 0";
/* Clears before the image edge — the suit runs to the bottom of the cutout,
   so a fade ending at 100% leaves a visible band across the shoulders. */
const HERO_PORTRAIT_FADE = "linear-gradient(to bottom, black 68%, transparent 95%)";
/* Retired with the studio-backdrop JPEG: the cutout needs no edge mask. */
const LEGACY_HERO_PORTRAIT_EDGE_MASK = "ellipse 70% 78% at 50% 42%";
const LEGACY_HERO_ITALIC_DECK = "font-style: italic";
const WORDMARK_NAME_INSET = "calc(3.5rem + 0.9rem)";
const LEGACY_HERO_GAP = "clamp(2rem, 5vw, 5rem)";
const TOO_TIGHT_HERO_GAP = "clamp(1rem, 2vw, 1.75rem)";
const LEGACY_HERO_PADDING = "clamp(3.5rem, 8vw, 7.5rem)";
const LEGACY_HERO_PHOTO_MIN_HEIGHT = "clamp(22rem, 48vw, 34rem)";
const HERO_FOLD_CHROME = "15rem";
const HERO_FOLD_CHROME_MIN = 12;
const HERO_FOLD_CHROME_MAX = 18;
const EYEBROW_SIZE_REM = 0.75;
const ABOUT_LABEL_REM = EYEBROW_SIZE_REM;
/* Retired: the About label was set at twice the eyebrow scale in gold, which
   read as neither an eyebrow nor a headline. */
const RETIRED_ABOUT_LABEL_REM = EYEBROW_SIZE_REM * 2;
const ABOUT_HEADLINE_FONT_SIZE = "clamp(2.1rem, 4.4vw, 3.5rem)";
/* The quote now sits under the one-liner as a deck. */
const ABOUT_QUOTE_FONT_SIZE = "clamp(1rem, 1.3vw, 1.18rem)";
/* Retired with the bordered-callout treatment of the opening quote. */
const RETIRED_ABOUT_QUOTE_FONT_SIZE = "clamp(1.12rem, 1.7vw, 1.38rem)";
/* Retired when the quote stopped being the headline and became the deck. */
const RETIRED_ABOUT_QUOTE_HEADLINE_SIZE = "clamp(1.7rem, 3.1vw, 2.6rem)";
const ABOUT_BIO_COLUMN =
  "grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr)";
/* Retired: the bio ran alone in one narrow column, leaving half the row empty. */
const RETIRED_ABOUT_BIO_SINGLE_COLUMN = "grid-template-columns: minmax(0, 42rem)";
const SHOWCASE_ASPECT_RATIO = "12 / 5";
/* The source still is 16:9 with a broadcast lower-third across its bottom
   ~23%. A crop any narrower than this shows less than that band, which puts
   the chyron back on screen behind the name and the stat chips. */
const SHOWCASE_ASPECT_RATIO_MIN = 2.32;
const SHOWCASE_ASPECT_RATIO_MAX = 3;
const ABOUT_BIO_FONT_SIZE = {
  min: "0.945rem",
  preferred: "1.26vw",
  max: "1.08rem",
} as const;
const LEGACY_ABOUT_BIO_FONT_SIZE = "clamp(1.05rem, 1.4vw, 1.2rem)";
const CONTACT_COLUMN_GAP = {
  min: "1.5rem",
  preferred: "3vw",
  max: "2.5rem",
} as const;
const LEGACY_CONTACT_GAP = "clamp(2rem, 5vw, 5rem)";
const CONTACT_TITLE_SIZE = {
  min: "2rem",
  preferred: "3.2vw",
  max: "2.85rem",
} as const;

function aboutPageLabelBlock(source = css) {
  return source.match(/\.page-head--label \.eyebrow\s*\{[^}]+\}/)?.[0] ?? "";
}

function parseAboutPageLabelSize(source: string) {
  const block = aboutPageLabelBlock(source);
  if (!block.trim()) {
    throw new Error("About page label rule is required");
  }
  const match = block.match(/font-size:\s*([^;]+);/);
  if (!match?.[1]?.trim()) {
    throw new Error("About page label font-size is required");
  }
  const value = match[1].trim();
  if (!value.endsWith("rem")) {
    throw new Error("About page label must be a rem length");
  }
  const rem = Number.parseFloat(value);
  if (!Number.isFinite(rem)) {
    throw new Error("About page label must be a rem length");
  }
  if (rem === RETIRED_ABOUT_LABEL_REM) {
    throw new Error("Doubled gold About label is not published");
  }
  if (rem !== ABOUT_LABEL_REM) {
    throw new Error(
      `About page label must be ${ABOUT_LABEL_REM}rem (the eyebrow scale)`,
    );
  }
  return value;
}

function verifyAboutPageLabel() {
  const eyebrow = css.match(/^\.eyebrow\s*\{[^}]+\}/m)?.[0] ?? "";
  const block = aboutPageLabelBlock();
  const head = css.match(/\.page-head--label\s*\{[^}]+\}/)?.[0] ?? "";
  expect(eyebrow).toContain(`font-size: ${EYEBROW_SIZE_REM}rem`);
  expect(parseAboutPageLabelSize(css)).toBe(`${ABOUT_LABEL_REM}rem`);
  expect(block).toContain("color: var(--sky)");
  expect(block).not.toContain("color: var(--gold)");
  // The navy rule under the header boxed the page in like a form.
  expect(head).toContain("border-bottom: 0");
  expect(head).not.toContain("border-bottom: 1px solid var(--navy)");
}

function parseAboutBioFontSize(source: string) {
  const block = source.match(/\.bio-full\s*\{[^}]+\}/)?.[0] ?? "";
  if (!block.trim()) {
    throw new Error("About bio font rule is required");
  }
  const match = block.match(
    /font-size:\s*clamp\(([^,]+),\s*([^,]+),\s*([^)]+)\)/,
  );
  if (!match?.[1] || !match[2] || !match[3]) {
    throw new Error("About bio font-size clamp is required");
  }
  const value = {
    min: match[1].trim(),
    preferred: match[2].trim(),
    max: match[3].trim(),
  };
  if (block.includes(LEGACY_ABOUT_BIO_FONT_SIZE)) {
    throw new Error("About bio font-size must be 10% smaller");
  }
  if (value.min !== ABOUT_BIO_FONT_SIZE.min) {
    throw new Error("About bio min font-size must be 10% smaller");
  }
  if (value.preferred !== ABOUT_BIO_FONT_SIZE.preferred) {
    throw new Error("About bio preferred font-size must be 10% smaller");
  }
  if (value.max !== ABOUT_BIO_FONT_SIZE.max) {
    throw new Error("About bio max font-size must be 10% smaller");
  }
  return value;
}

function verifyAboutBioProse() {
  const prose = css.match(/\.about-bio__prose\s*\{[^}]+\}/)?.[0] ?? "";
  const quote = css.match(/\.about-bio__quote\s*\{[^}]+\}/)?.[0] ?? "";
  const paragraphs =
    css.match(/\.about-bio__prose > p,\n\.about-bio__prose > p:first-of-type\s*\{[^}]+\}/)?.[0] ??
    css.match(/\.about-bio__prose > p(?:,[^\{]+)?\s*\{[^}]+\}/)?.[0] ??
    "";
  expect(prose).toContain("display: grid");
  expect(prose).toContain("gap: 1.1rem");
  expect(prose).toContain("color: var(--navy)");
  expect(prose).toContain("z-index: 1");
  expect(prose).toContain("min-width: 0");
  expect(prose).not.toContain("color: var(--white)");
  // The one-liner leads at display scale; the quote follows as the deck.
  const headline = css.match(/\.about-headline\s*\{[^}]+\}/)?.[0] ?? "";
  const quoteText = css.match(/\.about-bio__quote p\s*\{[^}]+\}/)?.[0] ?? "";
  expect(headline).toContain(`font-size: ${ABOUT_HEADLINE_FONT_SIZE}`);
  expect(headline).toContain("font-family: var(--font-display)");
  expect(quote).toContain("display: block");
  expect(quote).toContain("border-left: 0");
  expect(quote).not.toContain("border-left: 2px solid var(--gold)");
  expect(quoteText).toContain(`font-size: ${ABOUT_QUOTE_FONT_SIZE}`);
  expect(quoteText).not.toContain(RETIRED_ABOUT_QUOTE_FONT_SIZE);
  expect(quoteText).not.toContain(RETIRED_ABOUT_QUOTE_HEADLINE_SIZE);
  expect(css).not.toContain(".about-bio__quote cite");
  expect(paragraphs).toContain("color: var(--navy)");
  expect(parseAboutBioFontSize(css)).toEqual(ABOUT_BIO_FONT_SIZE);
  const headQuote =
    css.match(/\.page-head--label \.about-bio__quote\s*\{[^}]+\}/)?.[0] ?? "";
  const head = css.match(/\.page-head--label\s*\{[^}]+\}/)?.[0] ?? "";
  expect(head).toContain("justify-items: center");
  expect(head).toContain("text-align: center");
  expect(headQuote).toContain("max-width: none");
}

function showcaseImageBlock(source = css) {
  return source.match(/\.showcase__image\s*\{[^}]+\}/)?.[0] ?? "";
}

/**
 * The crop is load-bearing, not cosmetic: the published still carries a
 * broadcast lower-third across its bottom, and only a wide enough frame
 * anchored to the top lifts that band out of shot.
 */
function parseShowcaseAspectRatio(source: string) {
  const block = showcaseImageBlock(source);
  if (!block.trim()) {
    throw new Error("Showcase image rule is required");
  }
  const match = block.match(/aspect-ratio:\s*([0-9.]+)\s*\/\s*([0-9.]+)\s*;/);
  if (!match?.[1] || !match[2]) {
    throw new Error("Showcase image aspect-ratio is required");
  }
  const width = Number.parseFloat(match[1]);
  const height = Number.parseFloat(match[2]);
  if (!Number.isFinite(width) || !Number.isFinite(height) || height === 0) {
    throw new Error("Showcase image aspect-ratio must be a numeric ratio");
  }
  const ratio = width / height;
  if (ratio < SHOWCASE_ASPECT_RATIO_MIN) {
    throw new Error(
      "Showcase crop must stay wide enough to cut the broadcast lower-third",
    );
  }
  if (ratio > SHOWCASE_ASPECT_RATIO_MAX) {
    throw new Error(
      `Showcase crop cannot be wider than ${SHOWCASE_ASPECT_RATIO_MAX}:1`,
    );
  }
  return `${match[1]} / ${match[2]}`;
}

function verifyShowcaseCard() {
  const frame = css.match(/\.showcase__frame\s*\{[^}]+\}/)?.[0] ?? "";
  const image = showcaseImageBlock();
  const overlay = css.match(/\.showcase__overlay\s*\{[^}]+\}/)?.[0] ?? "";
  const stats = css.match(/\.showcase__stats\s*\{[^}]+\}/)?.[0] ?? "";
  expect(frame).toContain("position: relative");
  expect(frame).toContain("overflow: hidden");
  expect(parseShowcaseAspectRatio(css)).toBe(SHOWCASE_ASPECT_RATIO);
  // Anchoring to the top is what actually lifts the chyron out of frame.
  expect(image).toContain("object-position: center top");
  expect(image).toContain("object-fit: cover");
  // The img carries width/height attributes, which act as presentational
  // hints. Without height:auto both axes are definite, aspect-ratio is
  // ignored, and the crop silently stops happening.
  expect(image).toContain("height: auto");
  expect(overlay).toContain("position: absolute");
  expect(stats).toContain("backdrop-filter: blur(14px) saturate(140%)");
}

function verifyAboutBioColumn() {
  const layout = css.match(/\.about-bio\s*\{[^}]+\}/)?.[0] ?? "";
  const panel =
    css.match(/\.home-company\s*,\s*\.about-company\s*\{[^}]+\}/)?.[0] ?? "";
  expect(layout).toContain(ABOUT_BIO_COLUMN);
  expect(layout).toContain("align-items: start");
  expect(layout).not.toContain("align-items: stretch");
  // The bio runs beside the company panel rather than alone in one column.
  expect(layout).not.toContain(RETIRED_ABOUT_BIO_SINGLE_COLUMN);
  // The panel is shared with the home brief, not duplicated for About.
  expect(panel).toContain("background: var(--paper)");
  expect(panel).toContain("border-radius: var(--radius)");
  // The 4:5 portrait column and its scrim retired with the hero card.
  expect(layout).not.toContain("grid-template-columns: 32rem");
  expect(css).not.toContain(".about-portrait");
}

function heroBlock() {
  return css.match(/\.hero\s*\{[^}]+\}/)?.[0] ?? "";
}

function heroIntroBlock() {
  return css.match(/\.hero__intro\s*\{[^}]+\}/)?.[0] ?? "";
}

function heroNameBlock() {
  return css.match(/\.hero__name\s*\{[^}]+\}/)?.[0] ?? "";
}

function heroWatermarkBlock() {
  return css.match(/\.hero__watermark\s*\{[^}]+\}/)?.[0] ?? "";
}

function heroPortraitBlock() {
  return css.match(/\.hero__portrait\s*\{[^}]+\}/)?.[0] ?? "";
}

function heroPortraitImageBlock() {
  return css.match(/\.hero__portrait-image\s*\{[^}]+\}/)?.[0] ?? "";
}

function heroDeckBlock() {
  return css.match(/\.hero__deck\s*\{[^}]+\}/)?.[0] ?? "";
}

/** The mobile-only block that turns the static logo row into the carousel. */
function mediaBarCarouselBlock() {
  const start = css.indexOf(
    `@media (max-width: ${LOGO_CAROUSEL_BREAKPOINT_PX}px) and (prefers-reduced-motion: no-preference)`,
  );
  if (start === -1) {
    throw new Error("Logo carousel media query is required");
  }
  return css.slice(start, css.indexOf("\n}", start));
}

function heroPhotoImageBlock() {
  return css.match(/\.hero__photo-image\s*\{[^}]+\}/)?.[0] ?? "";
}

function contactLayoutBlock(source = css) {
  return source.match(/\.contact-layout\s*\{[^}]+\}/)?.[0] ?? "";
}

function contactTitleBlock(source = css) {
  return source.match(/\.contact-layout \.page-head h1\s*\{[^}]+\}/)?.[0] ?? "";
}

function contactCopyBlock(source = css) {
  return source.match(/\.contact-copy\s*\{[^}]+\}/)?.[0] ?? "";
}

function parseContactColumnGap(source: string) {
  const block = contactLayoutBlock(source);
  if (!block.trim()) {
    throw new Error("Contact layout rule is required");
  }
  if (block.includes(LEGACY_CONTACT_GAP)) {
    throw new Error("Contact layout cannot keep the 5rem column gap");
  }
  const match = block.match(
    /column-gap:\s*clamp\(([^,]+),\s*([^,]+),\s*([^)]+)\)/,
  );
  if (!match?.[1] || !match[2] || !match[3]) {
    throw new Error("Contact layout column-gap clamp is required");
  }
  const value = {
    min: match[1].trim(),
    preferred: match[2].trim(),
    max: match[3].trim(),
  };
  if (value.min !== CONTACT_COLUMN_GAP.min) {
    throw new Error("Contact layout min column-gap is too wide");
  }
  if (value.preferred !== CONTACT_COLUMN_GAP.preferred) {
    throw new Error("Contact layout preferred column-gap is too wide");
  }
  if (value.max !== CONTACT_COLUMN_GAP.max) {
    throw new Error("Contact layout max column-gap is too wide");
  }
  return value;
}

function parseContactTitleSize(source: string) {
  const block = contactTitleBlock(source);
  if (!block.trim()) {
    throw new Error("Contact title rule is required");
  }
  if (block.includes("max-width: 16ch")) {
    throw new Error("Contact title cannot keep the 16ch cap");
  }
  if (!block.includes("max-width: none")) {
    throw new Error("Contact title must drop the page-head measure");
  }
  const match = block.match(
    /font-size:\s*clamp\(([^,]+),\s*([^,]+),\s*([^)]+)\)/,
  );
  if (!match?.[1] || !match[2] || !match[3]) {
    throw new Error("Contact title font-size clamp is required");
  }
  const value = {
    min: match[1].trim(),
    preferred: match[2].trim(),
    max: match[3].trim(),
  };
  if (value.min !== CONTACT_TITLE_SIZE.min) {
    throw new Error("Contact title min font-size must fit the routing column");
  }
  if (value.preferred !== CONTACT_TITLE_SIZE.preferred) {
    throw new Error(
      "Contact title preferred font-size must fit the routing column",
    );
  }
  if (value.max !== CONTACT_TITLE_SIZE.max) {
    throw new Error("Contact title max font-size must fit the routing column");
  }
  return value;
}

function verifyContactPressLayout() {
  const layout = contactLayoutBlock();
  expect(layout).toContain("display: grid");
  expect(layout).toContain("align-items: start");
  expect(parseContactColumnGap(css)).toEqual(CONTACT_COLUMN_GAP);
  expect(parseContactTitleSize(css)).toEqual(CONTACT_TITLE_SIZE);
  const copy = contactCopyBlock();
  expect(copy).toContain("display: grid");
  expect(copy).toContain("align-content: start");
  expect(copy).toContain("gap: 1.25rem");
  expect(css).not.toContain("grid-row: 1 / span 2");
}

function parseClamp(declaration: string, property: string) {
  const match = declaration.match(
    new RegExp(
      `(?<![\\w-])${property}:\\s*clamp\\(([^,]+),\\s*([^,]+),\\s*([^)]+)\\)`,
    ),
  );
  if (!match?.[1] || !match[2] || !match[3]) {
    throw new Error(`${property} clamp is required in .hero`);
  }
  return {
    min: match[1].trim(),
    preferred: match[2].trim(),
    max: match[3].trim(),
  };
}

function verifyHeroCopyPhotoGap(
  hero = heroBlock(),
  intro = heroIntroBlock(),
) {
  const columnGap = parseClamp(hero, "column-gap");
  expect(columnGap).toEqual(HERO_COLUMN_GAP);
  expect(hero).not.toContain(`gap: ${LEGACY_HERO_GAP}`);
  expect(hero).not.toContain(TOO_TIGHT_HERO_GAP);
  expect(intro).toContain(`max-width: ${HERO_INTRO_MAX_WIDTH}`);
  expect(intro).not.toContain(`max-width: ${LEGACY_HERO_COPY_MAX_WIDTH}`);
  expect(intro).toContain("margin-inline-start: var(--wordmark-name-inset)");
  expect(intro).toContain("align-self: end");
}

function parseWordmarkNameInset(source: string) {
  const match = source.match(/--wordmark-name-inset:\s*([^;]+);/);
  if (!match?.[1]?.trim()) {
    throw new Error("Wordmark name inset is required");
  }

  const value = match[1].trim();
  if (!value.includes("3.5rem")) {
    throw new Error("Wordmark name inset must include the seal width");
  }
  if (!value.includes("0.9rem")) {
    throw new Error("Wordmark name inset must include the wordmark gap");
  }

  return value;
}

function verifyHeroNameAlignsWithWordmark() {
  expect(parseWordmarkNameInset(css)).toBe(WORDMARK_NAME_INSET);
  const intro = heroIntroBlock();
  const topics = css.match(/\.hero__topics\s*\{[^}]+\}/)?.[0] ?? "";
  expect(intro).toContain("margin-inline-start: var(--wordmark-name-inset)");
  expect(topics).toContain("var(--wordmark-name-inset)");
  const seal = css.match(/\.wordmark \.jasper-seal\s*\{[^}]+\}/)?.[0] ?? "";
  const wordmark = css.match(/\.wordmark\s*\{[^}]+\}/)?.[0] ?? "";
  expect(seal).toContain("width: 3.5rem");
  expect(wordmark).toContain("gap: 0.9rem");
}

function parseHeroFoldChrome(source: string) {
  const match = source.match(/--hero-fold-chrome:\s*([^;]+);/);
  if (!match?.[1]?.trim()) {
    throw new Error("Hero fold chrome is required");
  }

  const value = match[1].trim();
  const rem = Number.parseFloat(value);
  if (!value.endsWith("rem") || !Number.isFinite(rem)) {
    throw new Error("Hero fold chrome must be a rem length");
  }
  if (rem < HERO_FOLD_CHROME_MIN) {
    throw new Error(
      `Hero fold chrome cannot be below ${HERO_FOLD_CHROME_MIN}rem`,
    );
  }
  if (rem > HERO_FOLD_CHROME_MAX) {
    throw new Error(
      `Hero fold chrome cannot be above ${HERO_FOLD_CHROME_MAX}rem`,
    );
  }

  return value;
}

function verifyHeroFitsMediaBarOnLoad() {
  const hero = heroBlock();
  const photo = css.match(/\.hero__photo\s*\{[^}]+\}/)?.[0] ?? "";
  expect(parseHeroFoldChrome(css)).toBe(HERO_FOLD_CHROME);
  expect(hero).not.toContain(LEGACY_HERO_PADDING);
  expect(hero).toContain("padding: clamp(1.1rem, 2vw, 1.75rem) 0 0");
  expect(photo).not.toContain(LEGACY_HERO_PHOTO_MIN_HEIGHT);
  expect(photo).toContain("height: min(28rem, calc(100svh - var(--hero-fold-chrome)))");
  expect(photo).toContain("min-height: 0");
  expect(photo).toContain("aspect-ratio: 4 / 5");
}

function verifyIdentityTokens() {
  expect(css).toContain(identity.colors.navy.toLowerCase());
  expect(css).toContain(identity.colors.sky.toLowerCase());
  expect(css).toContain(identity.colors.white.toLowerCase());
  expect(css).toContain(identity.colors.paper.toLowerCase());
  expect(css).toContain(identity.colors.muted.toLowerCase());
  expect(css).toContain(identity.colors.border.toLowerCase());
}

describe("visual identity in CSS", () => {
  it("keeps the brand-kit color tokens", () => {
    verifyIdentityTokens();
  });

  it("never lets the page scroll sideways, without breaking the sticky masthead", () => {
    const html = css.match(/^html\s*\{[^}]+\}/m)?.[0] ?? "";
    const body = css.match(/^body\s*\{[^}]+\}/m)?.[0] ?? "";
    const field = css.match(/\.network-field\s*\{[^}]+\}/)?.[0] ?? "";
    expect(html).toContain("overflow-x: clip");
    expect(body).toContain("overflow-x: clip");
    // hidden would make the root a scroll container and kill position:sticky
    // on the masthead; clip clips without that side effect.
    expect(html).not.toContain("overflow-x: hidden");
    expect(body).not.toContain("overflow-x: hidden");
    // The fixed backdrop is sized by inset, not by a scrollbar-inclusive vw.
    expect(field).toContain("inset: 0");
    expect(field).not.toContain("100vw");
  });

  it("resolves every type role to Inter", () => {
    const root = css.match(/:root\s*\{[^}]+\}/)?.[0] ?? "";
    for (const token of ["--font-display", "--font-sans", "--font-mono"]) {
      expect(root).toContain(`${token}: "Inter Variable", Inter,`);
    }
  });

  it("loads Inter upright and italic and drops the retired faces", () => {
    expect(css).toContain('@import "@fontsource-variable/inter";');
    expect(css).toContain('@import "@fontsource-variable/inter/wght-italic.css";');
    expect(css).not.toContain("Libre Baskerville");
    expect(css).not.toContain("IBM Plex");
    expect(css).not.toContain("@fontsource/");
  });

  it("lets the masthead take the background of the section below it", () => {
    const masthead = css.match(/\.masthead\s*\{[^}]+\}/)?.[0] ?? "";
    expect(masthead).toContain("background: transparent");
    expect(masthead).not.toContain("border-bottom");
    expect(css).not.toContain("var(--bronze)");
  });

  it("pins the masthead to the top of the viewport above the page", () => {
    const masthead = css.match(/\.masthead\s*\{[^}]+\}/)?.[0] ?? "";
    expect(masthead).toContain("position: sticky");
    expect(masthead).toContain("top: 0");
    expect(masthead).toContain("z-index: 10");
  });

  it("glassifies the masthead only once the page has scrolled", () => {
    const scrolled =
      css.match(/\.masthead\[data-scrolled="true"\]\s*\{[^}]+\}/)?.[0] ?? "";
    expect(scrolled).toContain("backdrop-filter: blur(14px)");
    expect(scrolled).toContain("-webkit-backdrop-filter: blur(14px)");
    expect(scrolled).toContain("color-mix(in srgb, var(--background) 70%");
    expect(css).toContain("@supports not (backdrop-filter: blur(1px))");
  });

  it("keeps the wordmark in navy on the light masthead", () => {
    const wordmarkBlock = css.match(/\.wordmark\s*\{[^}]+\}/)?.[0] ?? "";
    expect(wordmarkBlock).toContain("color: var(--navy)");
  });

  it("lets the About bio fill its column beside the portrait", () => {
    const bioBlock = css.match(/\.bio-full\s*\{[^}]+\}/)?.[0] ?? "";
    expect(bioBlock).toContain("max-width: none");
    expect(bioBlock).toContain("width: 100%");
    expect(bioBlock).not.toContain("max-width: var(--measure)");
  });

  it("sizes the Current Endeavour Coinsub logo to the h2 type scale", () => {
    const heading = css.match(/^h2\s*\{[^}]+\}/m)?.[0] ?? "";
    const logo = css.match(/\.endeavour__logo\s*\{[^}]+\}/)?.[0] ?? "";
    const typeScale = heading.match(/font-size:\s*([^;]+);/)?.[1];
    expect(typeScale).toBe("clamp(1.75rem, 3vw, 2.5rem)");
    expect(logo).toContain(`height: ${typeScale}`);
    expect(logo).toContain("width: auto");
  });

  it("centers desktop navigation between the seal and the header control", () => {
    const inner = css.match(/\.masthead__inner\s*\{[^}]+\}/)?.[0] ?? "";
    const nav = css.match(/\.desktop-nav\s*\{[^}]+\}/)?.[0] ?? "";
    const navList = css.match(/\.desktop-nav ul\s*\{[^}]+\}/)?.[0] ?? "";
    const cta = css.match(/\.header-cta\s*\{[^}]+\}/)?.[0] ?? "";
    expect(inner).toContain("grid-template-columns: 1fr auto 1fr");
    expect(nav).toContain("justify-self: center");
    expect(navList).toContain("justify-content: center");
    expect(cta).toContain("justify-self: end");
    expect(nav).not.toContain("justify-self: end");
    expect(navList).not.toContain("justify-content: flex-end");
  });

  it("sweeps a gold fill across solid CTAs and trails them with an arrow", () => {
    const fill =
      css.match(/\.button-link:not\(\.button-link--ghost\)::before\s*\{[^}]+\}/)?.[0] ??
      "";
    const arrow =
      css.match(/\.button-link:not\(\.button-link--ghost\)::after\s*\{[^}]+\}/)?.[0] ??
      "";

    expect(fill).toContain("background: var(--gold)");
    expect(fill).toContain("transform: scaleX(0)");
    expect(fill).toContain("transform-origin: right center");
    expect(fill).toContain("z-index: -1");
    expect(arrow).toContain('content: "→"');
  });

  it("clips the CTA fill and keeps it under the label", () => {
    const base =
      css.match(/\.button-link,\s*\.header-cta,\s*button\.button-link\s*\{[^}]+\}/)?.[0] ??
      "";
    expect(base).toContain("overflow: hidden");
    expect(base).toContain("isolation: isolate");
    expect(base).toContain("position: relative");
  });

  it("leaves the ghost CTA without a fill or an arrow", () => {
    const ghost = css.match(/\.button-link--ghost\s*\{[^}]+\}/)?.[0] ?? "";
    expect(ghost).not.toContain("var(--gold)");
    expect(css).not.toContain(".button-link--ghost::after");
    expect(css).not.toContain(".button-link--ghost::before");
  });

  it("stops a disabled CTA from sweeping", () => {
    const disabled = css.match(/\.button-link:disabled::before\s*\{[^}]+\}/)?.[0] ?? "";
    expect(disabled).toContain("transform: scaleX(0)");
  });

  it("marks the current nav item with a persistent rule and hover with a thin one", () => {
    const hover = css.match(/\.desktop-nav a::after\s*\{[^}]+\}/)?.[0] ?? "";
    const current =
      css.match(/\.desktop-nav a\[aria-current="page"\]::after\s*\{[^}]+\}/)?.[0] ?? "";
    expect(hover).toContain("height: 1px");
    expect(hover).toContain("transform: scaleX(0)");
    expect(current).toContain("height: 2px");
    expect(current).toContain("transform: scaleX(1)");
    expect(current).toContain("background: var(--navy)");
  });

  it("keeps the circular seal circular", () => {
    const seal = css.match(/\.jasper-seal\s*\{[^}]+\}/)?.[0] ?? "";
    const wordmarkSeal = css.match(/\.wordmark \.jasper-seal\s*\{[^}]+\}/)?.[0] ?? "";
    expect(seal).toContain("border-radius: 50%");
    expect(wordmarkSeal).toContain("width: 3.5rem");
  });

  it("drops the hero text columns to the foot of the portrait band", () => {
    const hero = heroBlock();
    const intro = heroIntroBlock();
    expect(hero).toContain("align-items: end");
    expect(hero).not.toContain("align-items: center");
    expect(intro).toContain("align-self: end");
    expect(css).not.toContain(".hero__coinsub");
  });

  it("lays the hero out as a name band above three flanking columns", () => {
    const hero = heroBlock();
    expect(hero).toContain(
      "grid-template-columns: minmax(0, 1fr) minmax(0, 1.05fr) minmax(0, 1fr)",
    );
    expect(hero).toContain('"name     name     name"');
    expect(hero).toContain('"intro    portrait topics"');
    expect(hero).toContain("isolation: isolate");
  });

  it("keeps the hero copy beside the portrait at half the previous gap", () => {
    verifyHeroCopyPhotoGap();
  });

  it("aligns the hero name with the masthead wordmark name", () => {
    verifyHeroNameAlignsWithWordmark();
  });

  it("rejects a missing or incomplete wordmark name inset", () => {
    expect(() => parseWordmarkNameInset(":root { color: navy; }")).toThrow(
      "Wordmark name inset is required",
    );
    expect(() =>
      parseWordmarkNameInset(":root { --wordmark-name-inset: calc(0.9rem); }"),
    ).toThrow("Wordmark name inset must include the seal width");
    expect(() =>
      parseWordmarkNameInset(":root { --wordmark-name-inset: calc(3.5rem); }"),
    ).toThrow("Wordmark name inset must include the wordmark gap");
  });

  it("rejects the previous oversized and too-tight hero gaps", () => {
    const hero = heroBlock();
    expect(hero).not.toContain(LEGACY_HERO_GAP);
    expect(hero).not.toContain(TOO_TIGHT_HERO_GAP);
    expect(hero).not.toContain("gap: clamp(2rem");
    expect(() => parseClamp(hero, "gap")).toThrow(
      "gap clamp is required in .hero",
    );
    expect(() => parseClamp(".hero { display: grid; }", "column-gap")).toThrow(
      "column-gap clamp is required in .hero",
    );
  });

  it("sets the hero column gap to half the old 5rem maximum", () => {
    const columnGap = parseClamp(heroBlock(), "column-gap");
    expect(columnGap.min).toBe(HERO_COLUMN_GAP.min);
    expect(columnGap.preferred).toBe(HERO_COLUMN_GAP.preferred);
    expect(columnGap.max).toBe(HERO_COLUMN_GAP.max);
    expect(Number.parseFloat(columnGap.max) * 2).toBe(5);
    expect(Number.parseFloat(columnGap.max)).toBeGreaterThan(
      Number.parseFloat(columnGap.min),
    );
  });

  it("stacks the hero into a single column on small screens", () => {
    const introBlocks = [...css.matchAll(/\.hero__intro\s*\{[^}]+\}/g)].map(
      (match) => match[0],
    );
    expect(introBlocks).toHaveLength(2);
    expect(introBlocks[0]).toContain(`max-width: ${HERO_INTRO_MAX_WIDTH}`);
    expect(introBlocks[1]).toContain("max-width: none");
    expect(introBlocks[1]).toContain("margin-inline-start: 0");

    const mobile = css.slice(css.indexOf("@media (max-width: 900px)"));
    const mobileHero = mobile.match(/\.hero\s*\{[^}]+\}/)?.[0] ?? "";
    expect(mobileHero).toContain("grid-template-columns: minmax(0, 1fr)");
    expect(mobileHero).toContain('"name"');
    expect(mobileHero).toContain('"portrait"');
    expect(mobileHero).toContain('"intro"');
    expect(mobileHero).toContain('"topics"');
  });

  it("keeps the portrait in a 4:5 cover frame", () => {
    const photo = css.match(/\.hero__photo\s*\{[^}]+\}/)?.[0] ?? "";
    const image = heroPhotoImageBlock();
    expect(photo).toContain("aspect-ratio: 4 / 5");
    expect(image).toContain("object-fit: cover");
  });

  it("fits the media-bar in the first viewport with a compact hero", () => {
    verifyHeroFitsMediaBarOnLoad();
  });

  it("rejects a missing or out-of-range hero fold chrome", () => {
    expect(() => parseHeroFoldChrome(":root { color: navy; }")).toThrow(
      "Hero fold chrome is required",
    );
    expect(() =>
      parseHeroFoldChrome(":root { --hero-fold-chrome: 15px; }"),
    ).toThrow("Hero fold chrome must be a rem length");
    expect(() =>
      parseHeroFoldChrome(":root { --hero-fold-chrome: 11rem; }"),
    ).toThrow("Hero fold chrome cannot be below 12rem");
    expect(() =>
      parseHeroFoldChrome(":root { --hero-fold-chrome: 19rem; }"),
    ).toThrow("Hero fold chrome cannot be above 18rem");
    expect(parseHeroFoldChrome(":root { --hero-fold-chrome: 12rem; }")).toBe(
      "12rem",
    );
    expect(parseHeroFoldChrome(":root { --hero-fold-chrome: 18rem; }")).toBe(
      "18rem",
    );
  });

  it("sets the hero name in Inter bold caps at display scale", () => {
    const name = heroNameBlock();
    const fontSize = parseClamp(name, "font-size");
    expect(name).toContain("font-family: var(--font-display)");
    expect(name).toContain(HERO_NAME_WEIGHT);
    expect(name).toContain("text-transform: uppercase");
    expect(name).toContain("text-align: center");
    expect(name).toContain("color: var(--navy)");
    expect(fontSize.min).toBe(HERO_NAME_FONT_SIZE.min);
    expect(fontSize.preferred).toBe(HERO_NAME_FONT_SIZE.preferred);
    expect(fontSize.max).toBe(HERO_NAME_FONT_SIZE.max);
  });

  it("keeps the hero body copy at regular weight behind the bold name", () => {
    const deck = heroDeckBlock();
    const topic = css.match(/\.hero__topic\s*\{[^}]+\}/)?.[0] ?? "";
    expect(deck).toContain(HERO_BODY_WEIGHT);
    expect(deck).not.toContain(HERO_NAME_WEIGHT);
    expect(deck).not.toContain(LEGACY_HERO_ITALIC_DECK);
    expect(topic).toContain(HERO_BODY_WEIGHT);
  });

  it("ghosts the first name behind the headline without catching clicks", () => {
    const watermark = heroWatermarkBlock();
    expect(watermark).toContain("position: absolute");
    expect(watermark).toContain("z-index: 0");
    expect(watermark).toContain(`color: ${HERO_WATERMARK_TINT}`);
    expect(watermark).toContain("pointer-events: none");
    expect(watermark).toContain("user-select: none");
    expect(watermark).toContain("text-transform: uppercase");
  });

  it("lifts the portrait over the name so the letters run behind the head", () => {
    const name = heroNameBlock();
    const portrait = heroPortraitBlock();
    const lift = parseClamp(portrait, "margin-top");
    expect(name).toContain("z-index: 1");
    expect(portrait).toContain("z-index: 2");
    expect(lift.min).toBe(HERO_PORTRAIT_LIFT.min);
    expect(lift.preferred).toBe(HERO_PORTRAIT_LIFT.preferred);
    expect(lift.max).toBe(HERO_PORTRAIT_LIFT.max);
  });

  it("dissolves the cutout's shoulders into the page", () => {
    const image = heroPortraitImageBlock();
    expect(image).toContain(`mask-image: ${HERO_PORTRAIT_FADE}`);
    expect(image).toContain(`-webkit-mask-image: ${HERO_PORTRAIT_FADE}`);
    // The transparent cutout carries its own edges, so the elliptical
    // all-edge mask the backdrop JPEG needed is gone.
    expect(image).not.toContain(LEGACY_HERO_PORTRAIT_EDGE_MASK);
    expect(image).toContain("width: 100%");
    expect(image).toContain("height: auto");
  });

  it("holds the halftone bloom below the headline and behind the portrait", () => {
    const halftone =
      css.match(/\.hero__portrait-halftone\s*\{[^}]+\}/)?.[0] ?? "";
    expect(halftone).toContain("z-index: -1");
    expect(halftone).toContain("inset: 16% -24% 14%");
    expect(halftone).toContain("pointer-events: none");
    expect(halftone).toContain("background-size: 10px 10px");
  });

  it("marks the featured hero topic and mutes the rest", () => {
    const topic = css.match(/\.hero__topic\s*\{[^}]+\}/)?.[0] ?? "";
    const featured =
      css.match(/\.hero__topic--featured\s*\{[^}]+\}/)?.[0] ?? "";
    expect(topic).toContain("color: color-mix(in srgb, var(--navy) 38%, transparent)");
    expect(featured).toContain("color: var(--navy)");
    expect(featured).toContain("font-weight: 500");
  });

  it("trails the shared marker link with slashes and an arrow", () => {
    const before = css.match(/\.marker-link::before\s*\{[^}]+\}/)?.[0] ?? "";
    const after = css.match(/\.marker-link::after\s*\{[^}]+\}/)?.[0] ?? "";
    const hover = css.match(/\.marker-link:hover::after\s*\{[^}]+\}/)?.[0] ?? "";
    // Shared by the hero and the biography, so the hero-scoped name is gone.
    expect(css).not.toContain(".hero__cta");
    expect(before).toContain('content: "//"');
    expect(after).toContain('content: "→"');
    expect(hover).toContain("transform: translateX(0.35rem)");
  });

  it("splits the featured interview header over a full-width player", () => {
    const section = css.match(/\.featured-interview\s*\{[^}]+\}/)?.[0] ?? "";
    const media =
      css.match(/\.featured-interview__media\s*\{[^}]+\}/)?.[0] ?? "";
    const credit =
      css.match(/\.featured-interview__credit\s*\{[^}]+\}/)?.[0] ?? "";
    const title =
      css.match(/\.featured-interview__title\s*\{[^}]+\}/)?.[0] ?? "";
    const aside =
      css.match(/\.featured-interview__aside\s*\{[^}]+\}/)?.[0] ?? "";
    expect(section).toContain(
      "grid-template-columns: minmax(0, 1.5fr) minmax(0, 1fr)",
    );
    expect(section).toContain("align-items: start");
    // The headline fills its column; an 18ch cap broke it over five lines.
    expect(title).toContain("max-width: none");
    expect(title).not.toContain("max-width: 18ch");
    // Both columns start on the same top line, level with the eyebrow.
    expect(aside).toContain("padding-top: 0");
    // The player spans both columns and rounds off rather than bleeding.
    expect(media).toContain("grid-column: 1 / -1");
    expect(media).toContain("border-radius: var(--radius)");
    expect(media).toContain("overflow: hidden");
    expect(credit).toContain("display: flex");
    expect(credit).toContain("align-items: center");
  });

  it("stacks the featured interview on small screens", () => {
    const mobile = css.slice(css.indexOf("@media (max-width: 900px)"));
    expect(mobile).toContain(".featured-interview,");
  });

  it("opens the post card out of its bordered box onto the page", () => {
    const thumb = css.match(/\.card--thumb\s*\{[^}]+\}/)?.[0] ?? "";
    const media =
      css.match(/\.card--thumb \.card__media\s*\{[^}]+\}/)?.[0] ?? "";
    const base =
      css.match(/\.card,\s*\.copy-block,\s*\.inquiry-form,\s*\.calendar\s*\{[^}]+\}/)?.[0] ??
      "";
    expect(thumb).toContain("background: transparent");
    expect(thumb).toContain("border: 0");
    // The thumbnail's own corners carry the shape now.
    expect(media).toContain("border-radius: var(--radius)");
    // Plain .card keeps its frame for the other pages that use it.
    expect(base).toContain("border: 1px solid var(--border)");
  });

  it("foots each post card with a full-width solid button", () => {
    const block = css.match(/\.button-link--block\s*\{[^}]+\}/)?.[0] ?? "";
    const base =
      css.match(/\.button-link,\s*\.header-cta,\s*button\.button-link\s*\{[^}]+\}/)?.[0] ??
      "";
    expect(block).toContain("width: 100%");
    expect(block).toContain("display: flex");
    // Reuses the site's one solid button rather than a second style, so the
    // navy fill, pill radius, and gold sweep all come along.
    expect(base).toContain("background: var(--navy)");
    expect(base).toContain("color: var(--white)");
    expect(base).toContain("border-radius: var(--radius-pill)");
    // The retired mono arrow link is gone entirely.
    expect(css).not.toContain(".card__link");
  });

  it("marks off-site card buttons with a diagonal arrow", () => {
    const external =
      css.match(/\.button-link\.button-link--external::after\s*\{[^}]+\}/)?.[0] ?? "";
    const internal =
      css.match(/\.button-link:not\(\.button-link--ghost\)::after\s*\{[^}]+\}/)?.[0] ??
      "";
    expect(internal).toContain('content: "→"');
    expect(external).toContain('content: "↗"');
    // Same specificity as the base rule, so it has to come after it to win.
    expect(css.indexOf(".button-link.button-link--external::after")).toBeGreaterThan(
      css.indexOf(".button-link:not(.button-link--ghost)::after"),
    );
  });

  it("drops every post card button onto one baseline", () => {
    const thumb = css.match(/\.card--thumb\s*\{[^}]+\}/)?.[0] ?? "";
    // Anchored to a line start so it matches the standalone rule, not the
    // trailing selector of the margin reset above it.
    const foot =
      css.match(/^\.card--thumb \.button-link\s*\{[^}]+\}/m)?.[0] ?? "";
    // A flex column plus margin-top:auto pins the button to the card foot,
    // so summaries of different lengths still line their buttons up.
    expect(thumb).toContain("display: flex");
    expect(thumb).toContain("flex-direction: column");
    expect(foot).toContain("margin-top: auto");
  });

  it("stacks the post header action beneath its title", () => {
    const head = css.match(/\.post-head\s*\{[^}]+\}/)?.[0] ?? "";
    const title = css.match(/\.post-head__title\s*\{[^}]+\}/)?.[0] ?? "";
    // Stacked, not split beside the title, so the action reads in the same
    // order as the hero's marker link under its deck.
    expect(head).toContain("display: block");
    expect(head).not.toContain("grid-template-columns");
    expect(title).toContain("margin: 0 0 1.35rem");
    expect(css).not.toContain(".post-head__cta");
  });

  it("sizes media-bar outlet logos larger, with CEO Magazine extra-large", () => {
    const logo = css.match(/\.media-bar__logo\s*\{[^}]+\}/)?.[0] ?? "";
    const ceo = css.match(/\.media-bar__logo--ceo\s*\{[^}]+\}/)?.[0] ?? "";
    expect(logo).toContain("height: 2.4rem");
    expect(logo).toContain("object-fit: contain");
    expect(ceo).toContain("height: 3.35rem");
  });

  it("shows every outlet at rest on desktop, with no marquee or edge blur", () => {
    const track = css.match(/\.media-bar__track\s*\{[^}]+\}/)?.[0] ?? "";
    const group = css.match(/\.media-bar__group\s*\{[^}]+\}/)?.[0] ?? "";
    const edge = css.match(/\.media-bar__edge\s*\{[^}]+\}/)?.[0] ?? "";
    const hiddenCopy =
      css.match(/\.media-bar__group\[aria-hidden="true"\]\s*\{[^}]+\}/)?.[0] ?? "";
    expect(track).toContain("width: 100%");
    expect(track).not.toContain("animation:");
    const bar = css.match(/\.media-bar\s*\{[^}]+\}/)?.[0] ?? "";
    expect(group).toContain("width: 100%");
    expect(group).toContain("flex-wrap: wrap");
    // Distributed across a capped, centred row. Spanning the whole monitor
    // drifted the logos ~400px apart, which is the spacing this replaced.
    expect(group).toContain("justify-content: space-between");
    expect(group).toContain(`max-width: var(--${MEDIA_BAR_ROW_MAX_TOKEN})`);
    expect(group).toContain("margin-inline: auto");
    expect(bar).toContain(`--${MEDIA_BAR_ROW_MAX_TOKEN}: ${MEDIA_BAR_ROW_MAX}`);
    // The gap stays the floor so a narrow row never crowds.
    expect(group).toContain("gap: var(--media-bar-gap)");
    // The duplicate copies exist only to seam the mobile loop.
    expect(hiddenCopy).toContain("display: none");
    expect(edge).toContain("display: none");
  });

  it("loops the media-bar logos with a seamless marquee only on mobile", () => {
    const carousel = mediaBarCarouselBlock();
    const keyframes = css.match(
      /@keyframes media-bar-marquee\s*\{[\s\S]*?\n\}/,
    )?.[0] ?? "";
    expect(carousel).toContain(
      "animation: media-bar-marquee 32s linear infinite",
    );
    expect(carousel).toContain("animation-play-state: paused");
    expect(carousel).toContain("display: block");
    // One copy of four, so the travel is a quarter of the track. The retired
    // -50% belonged to the two-copy loop.
    expect(keyframes).toContain(`translateX(-${100 / MEDIA_BAR_LOOP_COPIES}%)`);
    expect(keyframes).not.toContain("translateX(-50%)");
  });

  it("gates the carousel on both the breakpoint and motion preference", () => {
    // Gated on no-preference so it never has to out-order the reduced-motion
    // block, which stops the animation wherever it does apply.
    expect(css).toContain(
      `@media (max-width: ${LOGO_CAROUSEL_BREAKPOINT_PX}px) and (prefers-reduced-motion: no-preference)`,
    );
    const reduced = css.match(
      /@media \(prefers-reduced-motion: reduce\)\s*\{[\s\S]*?\n\}/,
    )?.[0] ?? "";
    expect(reduced).toContain("animation: none");
  });

  it("packs the mobile logos tightly and matches the spacing at the seam", () => {
    const bar = css.match(/\.media-bar\s*\{[^}]+\}/)?.[0] ?? "";
    const group = mediaBarCarouselBlock().match(
      /\.media-bar__group\s*\{[^}]+\}/,
    )?.[0] ?? "";
    expect(bar).toContain(`--media-bar-gap: ${MEDIA_BAR_GAP}`);
    // Sized to its logos, not the viewport — the retired 100vw copy is what
    // forced the logos to the far edges of the screen.
    expect(group).toContain("width: max-content");
    expect(group).not.toContain("width: 100vw");
    expect(group).toContain("flex-wrap: nowrap");
    // The trailing padding is the same value as the gap, so the join between
    // two copies is spaced exactly like the logos inside one.
    expect(group).toContain("padding-inline: 0 var(--media-bar-gap)");
    expect(group).toContain("min-width: 25vw");
  });

  it("runs the media bar straight out of the hero with no dividing rules", () => {
    const bar = css.match(/\.media-bar\s*\{[^}]+\}/)?.[0] ?? "";
    // Neither edge is ruled: the strip flows out of the hero above it and
    // into the biography below it on open white.
    expect(bar).not.toContain("border-top");
    expect(bar).not.toContain("border-bottom");
    expect(bar).toContain(`padding: ${MEDIA_BAR_PADDING}`);
    expect(bar).not.toContain(LEGACY_MEDIA_BAR_PADDING);
    expect(bar).toContain("margin-bottom: 0");
  });

  it("gives the media-bar a 3D stage for the logo carousel curve", () => {
    const bar = css.match(/\.media-bar\s*\{[^}]+\}/)?.[0] ?? "";
    const track = css.match(/\.media-bar__track\s*\{[^}]+\}/)?.[0] ?? "";
    const link = css.match(/\.media-bar__link\s*\{[^}]+\}/)?.[0] ?? "";
    expect(bar).toContain("position: relative");
    expect(bar).toContain("perspective: 1400px");
    expect(track).toContain("transform-style: preserve-3d");
    expect(link).toContain("transform-style: preserve-3d");
    expect(link).toContain("transition: filter 120ms linear, opacity 120ms linear");
  });

  it("blurs the media-bar edges into the background instead of hard-cutting", () => {
    const edge = css.match(/\.media-bar__edge\s*\{[^}]+\}/)?.[0] ?? "";
    const left = css.match(/\.media-bar__edge--left\s*\{[^}]+\}/)?.[0] ?? "";
    const right = css.match(/\.media-bar__edge--right\s*\{[^}]+\}/)?.[0] ?? "";
    expect(edge).toContain("backdrop-filter: blur(6px)");
    expect(edge).toContain("-webkit-backdrop-filter: blur(6px)");
    expect(edge).toContain("pointer-events: none");
    expect(left).toContain("mask-image: linear-gradient(to right, black, transparent)");
    expect(right).toContain("mask-image: linear-gradient(to left, black, transparent)");
  });

  it("freezes the per-logo curve transition under reduced motion", () => {
    const reduced = css.match(
      /@media \(prefers-reduced-motion: reduce\)\s*\{[\s\S]*?\n\}/,
    )?.[0] ?? "";
    expect(reduced).toContain(".media-bar__link");
  });

  it("sizes the home Company Coinsub logo to the h2 type scale", () => {
    const logo = css.match(/\.home-company__logo\s*\{[^}]+\}/)?.[0] ?? "";
    expect(logo).toContain("height: clamp(1.75rem, 3vw, 2.5rem)");
  });

  it("frames press-release thumbnails at 16:9", () => {
    const media = css.match(/\.card__media\s*\{[^}]+\}/)?.[0] ?? "";
    const thumb = css.match(/\.card__thumb\s*\{[^}]+\}/)?.[0] ?? "";
    expect(media).toContain("aspect-ratio: 16 / 9");
    expect(thumb).toContain("height: 100%");
    expect(thumb).toContain("object-fit: cover");
  });

  it("lays speaking topics out in two compact columns", () => {
    const grid = css.match(/\.topic-grid\s*\{[^}]+\}/)?.[0] ?? "";
    const title = css.match(/\.topic-grid h3\s*\{[^}]+\}/)?.[0] ?? "";
    expect(grid).toContain("grid-template-columns: 1fr 1fr");
    expect(title).toContain("font-size: 1rem");
  });

  it("centres the media kit ask on one screen with the form in a dialog", () => {
    const hero = css.match(/\.media-kit-hero\s*\{[^}]+\}/)?.[0] ?? "";
    const dialog = css.match(/\.request-dialog\s*\{[^}]+\}/)?.[0] ?? "";
    const panel = css.match(/\.request-dialog__panel\s*\{[^}]+\}/)?.[0] ?? "";
    // The ask fills the screen below the masthead and centres within it.
    // The article's own top padding must stay zeroed: leave it in and the
    // hero starts 70px low, which pushes the ask off the optical centre.
    const article = css.match(/\.media-kit-page\s*\{[^}]+\}/)?.[0] ?? "";
    expect(hero).toContain("min-height: calc(100dvh - 5.5rem)");
    expect(article).toContain("padding-top: 0");
    expect(hero).toContain("align-content: center");
    expect(hero).toContain("text-align: center");
    // The dialog scrolls inside itself so a long form never overruns the viewport.
    expect(dialog).toContain("max-height: 86dvh");
    expect(dialog).toContain("overflow: auto");
    expect(css).toContain(".request-dialog::backdrop");
    // The centred hero must not centre the form's labels too.
    expect(panel).toContain("text-align: left");
    // The still, its frame, and the two-column treatment are all retired.
    expect(css).not.toContain(".media-kit-request");
  });

  it("pins a semitranslucent network field behind the page", () => {
    const field = css.match(/\.network-field\s*\{[^}]+\}/)?.[0] ?? "";
    expect(field).toContain("position: fixed");
    expect(field).toContain("pointer-events: none");
    expect(field).toContain("opacity: 0.42");
    expect(field).toContain("z-index: 0");
  });

  it("lets the featured interview title span the full content width", () => {
    const full = css.match(/\.section-intro--full\s*\{[^}]+\}/)?.[0] ?? "";
    const title = css.match(/\.section-intro--full h2\s*\{[^}]+\}/)?.[0] ?? "";
    expect(full).toContain("max-width: none");
    expect(full).toContain("width: 100%");
    expect(title).toContain("max-width: none");
    expect(title).toContain("width: 100%");
  });

  it("frames the showcase still as a top-anchored cinematic crop", () => {
    verifyShowcaseCard();
  });

  it("sets the About label at the sitewide eyebrow scale in sky, with no rule beneath", () => {
    verifyAboutPageLabel();
  });

  it("rejects a missing, mis-scaled, or retired gold About label", () => {
    expect(() => parseAboutPageLabelSize(".eyebrow { font-size: 0.75rem; }")).toThrow(
      "About page label rule is required",
    );
    expect(() =>
      parseAboutPageLabelSize(".page-head--label .eyebrow { color: var(--sky); }"),
    ).toThrow("About page label font-size is required");
    expect(() =>
      parseAboutPageLabelSize(
        ".page-head--label .eyebrow { font-size: 0.75px; }",
      ),
    ).toThrow("About page label must be a rem length");
    expect(() =>
      parseAboutPageLabelSize(
        ".page-head--label .eyebrow { font-size: 1.5rem; }",
      ),
    ).toThrow("Doubled gold About label is not published");
    expect(() =>
      parseAboutPageLabelSize(
        ".page-head--label .eyebrow { font-size: 1rem; }",
      ),
    ).toThrow("About page label must be 0.75rem (the eyebrow scale)");
  });

  it("formats the About bio with paragraph rhythm and a left quote", () => {
    verifyAboutBioProse();
  });

  it("rejects a missing or unreduced About bio font-size", () => {
    expect(() => parseAboutBioFontSize(".about-bio { display: grid; }")).toThrow(
      "About bio font rule is required",
    );
    expect(() => parseAboutBioFontSize(".bio-full { max-width: none; }")).toThrow(
      "About bio font-size clamp is required",
    );
    expect(() =>
      parseAboutBioFontSize(
        `.bio-full { font-size: ${LEGACY_ABOUT_BIO_FONT_SIZE}; }`,
      ),
    ).toThrow("About bio font-size must be 10% smaller");
    expect(() =>
      parseAboutBioFontSize(
        ".bio-full { font-size: clamp(1.05rem, 1.26vw, 1.08rem); }",
      ),
    ).toThrow("About bio min font-size must be 10% smaller");
    expect(() =>
      parseAboutBioFontSize(
        ".bio-full { font-size: clamp(0.945rem, 1.4vw, 1.08rem); }",
      ),
    ).toThrow("About bio preferred font-size must be 10% smaller");
    expect(() =>
      parseAboutBioFontSize(
        ".bio-full { font-size: clamp(0.945rem, 1.26vw, 1.2rem); }",
      ),
    ).toThrow("About bio max font-size must be 10% smaller");
  });

  it("sets the About bio in one measured column under the hero card", () => {
    verifyAboutBioColumn();
  });

  it("rejects a showcase crop that would put the broadcast chyron back on screen", () => {
    expect(() => parseShowcaseAspectRatio(".about-bio { display: grid; }")).toThrow(
      "Showcase image rule is required",
    );
    expect(() =>
      parseShowcaseAspectRatio(".showcase__image { object-fit: cover; }"),
    ).toThrow("Showcase image aspect-ratio is required");
    // 16:9 is the source ratio, so it crops nothing and shows the chyron.
    expect(() =>
      parseShowcaseAspectRatio(".showcase__image { aspect-ratio: 16 / 9; }"),
    ).toThrow("Showcase crop must stay wide enough to cut the broadcast lower-third");
    expect(() =>
      parseShowcaseAspectRatio(".showcase__image { aspect-ratio: 4 / 5; }"),
    ).toThrow("Showcase crop must stay wide enough to cut the broadcast lower-third");
    expect(() =>
      parseShowcaseAspectRatio(".showcase__image { aspect-ratio: 4 / 1; }"),
    ).toThrow(`Showcase crop cannot be wider than ${SHOWCASE_ASPECT_RATIO_MAX}:1`);
    // Boundaries: exactly at the minimum crop and exactly at the maximum.
    expect(
      parseShowcaseAspectRatio(".showcase__image { aspect-ratio: 2.32 / 1; }"),
    ).toBe("2.32 / 1");
    expect(
      parseShowcaseAspectRatio(".showcase__image { aspect-ratio: 3 / 1; }"),
    ).toBe("3 / 1");
  });

  it("pulls the press inquiry form up beside the title", () => {
    verifyContactPressLayout();
  });

  it("rejects a missing or oversized contact layout gap", () => {
    expect(() => parseContactColumnGap(".route-list { margin: 0; }")).toThrow(
      "Contact layout rule is required",
    );
    expect(() =>
      parseContactColumnGap(
        `.contact-layout { gap: ${LEGACY_CONTACT_GAP}; }`,
      ),
    ).toThrow("Contact layout cannot keep the 5rem column gap");
    expect(() =>
      parseContactColumnGap(".contact-layout { display: grid; }"),
    ).toThrow("Contact layout column-gap clamp is required");
    expect(() =>
      parseContactColumnGap(
        ".contact-layout { column-gap: clamp(2rem, 3vw, 2.5rem); }",
      ),
    ).toThrow("Contact layout min column-gap is too wide");
    expect(() =>
      parseContactColumnGap(
        ".contact-layout { column-gap: clamp(1.5rem, 5vw, 2.5rem); }",
      ),
    ).toThrow("Contact layout preferred column-gap is too wide");
    expect(() =>
      parseContactColumnGap(
        ".contact-layout { column-gap: clamp(1.5rem, 3vw, 5rem); }",
      ),
    ).toThrow("Contact layout max column-gap is too wide");
  });

  it("rejects a contact title that still uses the page-head 16ch measure", () => {
    expect(() => parseContactTitleSize(".page-head h1 { max-width: 16ch; }")).toThrow(
      "Contact title rule is required",
    );
    expect(() =>
      parseContactTitleSize(
        ".contact-layout .page-head h1 { max-width: 16ch; font-size: clamp(2rem, 3.2vw, 2.85rem); }",
      ),
    ).toThrow("Contact title cannot keep the 16ch cap");
    expect(() =>
      parseContactTitleSize(
        ".contact-layout .page-head h1 { font-size: clamp(2rem, 3.2vw, 2.85rem); }",
      ),
    ).toThrow("Contact title must drop the page-head measure");
    expect(() =>
      parseContactTitleSize(
        ".contact-layout .page-head h1 { max-width: none; }",
      ),
    ).toThrow("Contact title font-size clamp is required");
    expect(() =>
      parseContactTitleSize(
        ".contact-layout .page-head h1 { max-width: none; font-size: clamp(2.6rem, 3.2vw, 2.85rem); }",
      ),
    ).toThrow("Contact title min font-size must fit the routing column");
    expect(() =>
      parseContactTitleSize(
        ".contact-layout .page-head h1 { max-width: none; font-size: clamp(2rem, 5.5vw, 2.85rem); }",
      ),
    ).toThrow("Contact title preferred font-size must fit the routing column");
    expect(() =>
      parseContactTitleSize(
        ".contact-layout .page-head h1 { max-width: none; font-size: clamp(2rem, 3.2vw, 4.6rem); }",
      ),
    ).toThrow("Contact title max font-size must fit the routing column");
  });
});

function unlockPageBlock(source = css) {
  return source.match(/\.unlock-page\s*\{[^}]+\}/)?.[0] ?? "";
}

function unlockSealBlock(source = css) {
  return source.match(/\.unlock-card \.jasper-seal\s*\{[^}]+\}/)?.[0] ?? "";
}

function unlockButtonBlock(source = css) {
  return source.match(/\.unlock-form button\s*\{[^}]+\}/)?.[0] ?? "";
}

function parseUnlockChrome(source: string) {
  const page = unlockPageBlock(source);
  if (!page.trim()) {
    throw new Error("Unlock page rule is required");
  }
  if (/background/.test(page)) {
    throw new Error("Unlock page must not paint its own background");
  }

  const seal = unlockSealBlock(source);
  if (!seal.includes("justify-self: center")) {
    throw new Error("Unlock seal must be centred");
  }

  const button = unlockButtonBlock(source);
  if (!button.includes("justify-self: center")) {
    throw new Error("Unlock button must be centred");
  }

  return { page, seal, button };
}

function verifyUnlockScreenChrome(source = css) {
  const { page, seal, button } = parseUnlockChrome(source);
  expect(page).toContain("place-items: center");
  expect(page).toContain("min-height: 100dvh");
  expect(page).not.toContain(`background: var(--paper)`);
  expect(seal).toContain("justify-self: center");
  expect(button).toContain("justify-self: center");
  expect(button).not.toContain("justify-self: start");
  expect(unlockCardBlock(source)).toContain("justify-items: start");
}

function unlockCardBlock(source = css) {
  return source.match(/\.unlock-card\s*\{[^}]+\}/)?.[0] ?? "";
}

describe("unlock screen chrome", () => {
  it("lets the site background show through and centres the seal and button", () => {
    verifyUnlockScreenChrome();
  });

  it("keeps the gate copy left-aligned inside the card", () => {
    expect(unlockCardBlock()).toContain("justify-items: start");
  });

  it("rejects a missing unlock page rule", () => {
    expect(() => parseUnlockChrome(".unlock-card { gap: 1rem; }")).toThrow(
      "Unlock page rule is required",
    );
  });

  it("rejects a painted unlock background", () => {
    expect(() =>
      parseUnlockChrome(".unlock-page { background: var(--paper); }"),
    ).toThrow("Unlock page must not paint its own background");
  });

  it("rejects an off-centre seal", () => {
    expect(() =>
      parseUnlockChrome(
        ".unlock-page { place-items: center; } .unlock-card .jasper-seal { justify-self: start; }",
      ),
    ).toThrow("Unlock seal must be centred");
  });

  it("rejects an off-centre button", () => {
    expect(() =>
      parseUnlockChrome(
        ".unlock-page { place-items: center; } .unlock-card .jasper-seal { justify-self: center; } .unlock-form button { justify-self: start; }",
      ),
    ).toThrow("Unlock button must be centred");
  });
});
