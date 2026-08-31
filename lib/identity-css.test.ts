import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { identity, MEDIA_BAR_LOOP_COPIES } from "./identity";
import { LOGO_CAROUSEL_BREAKPOINT_PX } from "./logo-carousel";
import {
  ABOUT_ENTRANCE_ATTRIBUTE,
  ABOUT_ENTRANCE_STAGES,
  ABOUT_STAGE_FRAME,
  ABOUT_STAT_COUNT,
  aboutEntranceStep,
  aboutStatDelayMs,
} from "./motion/about-entrance";
import {
  PAGE_CARD_COUNT,
  PAGE_STAGE_CONTENT,
  PAGE_STAGE_DECK,
  PAGE_STAGE_HEADLINE,
  pageCardDelayMs,
  pageEntranceStep,
  type PageEntranceStage,
} from "./motion/page-entrance";
import { SCROLL_REVEAL_SCOPE_ATTRIBUTE } from "./motion/reveal";
import {
  heroEntranceStep,
  HERO_STAGE_COPY,
  HERO_STAGE_CTA,
  HERO_STAGE_NAME,
  HERO_STAGE_OUTLETS,
  HERO_STAGE_PORTRAIT,
} from "./motion/hero-entrance";

const css = readFileSync(
  join(dirname(fileURLToPath(import.meta.url)), "../app/globals.css"),
  "utf8",
);

const SHELL_CONTAINER = {
  min: "80rem",
  preferred: "85vw",
  max: "100rem",
} as const;
const SHELL_WIDTH =
  "width: min(var(--container), calc(100% - 2 * var(--gutter)))";
/* Retired: the shell was pinned at 80rem, so a 2560px display rendered the
   page at half its width with ~640px dead on either side. */
const RETIRED_FIXED_SHELL_CONTAINER = "--container: 80rem;";
/* The whole system is sized in rem, so this step is what enlarges the
   composition on a large display instead of stranding a 1280px page in the
   middle of it. 100% up to 1600px, 137.5% by 2560px. */
const ROOT_FONT_SCALE = {
  min: "1rem",
  preferred: "0.6vw + 0.4rem",
  max: "1.375rem",
} as const;
/* A px root font-size would scale the page but silently discard a reader's
   own default-font-size setting; rem/% here resolves against it. */
const RETIRED_PX_ROOT_FONT_SIZE = /font-size:\s*\d+px/;
const HERO_COLUMN_GAP = {
  min: "1rem",
  preferred: "2.5vw",
  max: "2.5rem",
} as const;
const HERO_INTRO_MAX_WIDTH = "24rem";
const LEGACY_HERO_COPY_MAX_WIDTH = "28rem";
/* Sized against the hero's own box, not the viewport: --container caps at
   104rem while vw keeps climbing, so a vw slope drifts away from the shell at
   exactly the widths the headline is meant to fill. */
const HERO_NAME_FONT_SIZE = {
  min: "3rem",
  preferred: "16.4cqw",
  max: "22rem",
} as const;
const HERO_WATERMARK_FONT_SIZE = {
  min: "6rem",
  preferred: "19cqw",
  max: "26rem",
} as const;
const HERO_QUERY_CONTAINER = "container-type: inline-size";
const HERO_ENTRANCE_GUARD = "@media (prefers-reduced-motion: no-preference)";
const HERO_NAME_WIPE_KEYFRAMES = "@keyframes hero-name-wipe";
/* The box shows a third of a mask three times its width, so sliding the mask
   from its transparent tail to its solid head walks one soft edge across the
   letters, left to right. Only the mask moves — the letters never shift. */
const HERO_NAME_WIPE_FROM = "mask-position: 100% 0";
const HERO_NAME_WIPE_TO = "mask-position: 0% 0";
const HERO_NAME_MASK_SIZE = "mask-size: 300% 100%";
/* Retired: the name arrived one character at a time behind a stepped clip,
   with a blinking caret riding the reveal. */
const RETIRED_HERO_TYPEWRITER = "@keyframes hero-type";
const RETIRED_HERO_CARET = "hero__name-caret";
/* The scroll reveal is its own no-preference block, further down the file
   than the hero entrance and keyed on the comment above it. */
/* The page heads used to run a full step larger than the About page's lead,
   which made /press shout louder than the page carrying the biography and
   pushed its article thumbnails out of the first screen. Legal keeps the
   larger scale, so the retired values are asserted against the specific
   rule rather than the whole stylesheet. */
const RETIRED_PAGE_HEAD_TITLE_SIZE = "clamp(2.6rem, 5.5vw, 4.6rem)";
const RETIRED_PAGE_HEAD_LEDE_SIZE = "clamp(1.2rem, 2vw, 1.55rem)";
const PRESS_TABS_PADDING = "clamp(0.75rem, 1.5vw, 1.25rem)";
/* Retired: a full section's worth of space above the page's own nav. */
const RETIRED_PRESS_TABS_PADDING = "clamp(2.5rem, 5vw, 4.75rem)";
/* The press entrance. Keyed on the comment above its own no-preference
   block, since the stylesheet has several. */
const PAGE_ENTRANCE_GUARD = "/* Page entrance ---";
/* Retired: a single fade on the panel, which moved the whole thing as one
   block and said nothing about the headline, deck, and cards inside it. */
const RETIRED_PANEL_ANIMATION = "press-tab-in";
const PAGE_HEAD_BAND_PADDING = "1.25rem";
/* A band that opens with its own section label is a new section, not the
   lede's content, so it gets more air than the card grid case. */
const PAGE_HEAD_SECTION_PADDING = "4rem";
/* Retired for the band under a page head: 6rem of section padding plus the
   grid's own 2rem left the lede 128px clear of the thumbnails it introduces.
   Ordinary sections keep it. */
const RETIRED_PAGE_HEAD_BAND_PADDING = "padding-top: 6rem";
const PRESS_TABS_NAV_MARGIN = "0 0 1.5rem";
const RETIRED_PRESS_TABS_NAV_MARGIN = "0 0 2.5rem";
const SCROLL_REVEAL_GUARD = "/* Scroll reveal ---";
const REVEAL_RISE = "transform: translate3d(0, 1.75rem, 0)";
const ABOUT_ENTRANCE_GUARD = "/* About entrance ---";
/* Settles out of a slight zoom rather than sliding: the frame already clips,
   so the photo reads as coming to rest inside a card that is already there. */
const ABOUT_PHOTO_ZOOM = "1.06";
/* Retired with the fixed 80rem shell: viewport-relative hero type. */
const RETIRED_VIEWPORT_HERO_NAME_SIZE = "15vw";
const RETIRED_VIEWPORT_HERO_WATERMARK_SIZE = "18vw";
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
/* Retired with the page-name eyebrows: /about no longer prints a label
   reading "About" above a page the reader is already on. */
const RETIRED_ABOUT_LABEL_RULE = ".page-head--label .eyebrow";
const ABOUT_HEADLINE_FONT_SIZE = "clamp(2.1rem, 4.4vw, 3.5rem)";
/* The About header, its deck, and the showcase share one screen. The measure
   widened rather than the type shrinking: at 20ch the 54-character one-liner
   broke over three lines, and that third line was what pushed the image past
   the fold. Everything below is the spacing trimmed around it. */
const ABOUT_HEADLINE_MEASURE = "28ch";
const RETIRED_ABOUT_HEADLINE_MEASURE = "20ch";
const ABOUT_HEAD_MARGIN = "clamp(1.25rem, 2.4vw, 1.75rem)";
const RETIRED_ABOUT_HEAD_MARGIN = "clamp(2rem, 4vw, 3rem)";
const ABOUT_LABEL_MARGIN = "0 0 0.7rem";
const RETIRED_ABOUT_LABEL_MARGIN = "0 0 1.15rem";
const ABOUT_DECK_MARGIN = "clamp(0.7rem, 1.4vw, 0.95rem)";
const RETIRED_ABOUT_DECK_MARGIN = "clamp(1rem, 2vw, 1.35rem)";
const ABOUT_ARTICLE_PADDING = "0.5rem";
const RETIRED_ABOUT_ARTICLE_PADDING = "1.25rem";
const ABOUT_FOLD_CHROME = "20.25rem";
const ABOUT_FOLD_CHROME_MIN = 20;
const ABOUT_FOLD_CHROME_MAX = 22.9;
/* Retired with the page-name eyebrow: the header lost ~31px, and a budget
   still sized for it cropped the photo by that much on every short window. */
const RETIRED_ABOUT_FOLD_CHROME = "22.25rem";
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

function verifyAboutPageLabel() {
  const eyebrow = css.match(/^\.eyebrow\s*\{[^}]+\}/m)?.[0] ?? "";
  const head = css.match(/\.page-head--label\s*\{[^}]+\}/)?.[0] ?? "";
  // The sitewide eyebrow scale still stands; the About page just no longer
  // has one of its own.
  expect(eyebrow).toContain(`font-size: ${EYEBROW_SIZE_REM}rem`);
  // Retired with the page-name eyebrows. The rule styled an element that no
  // longer exists, so it would have been dead CSS guarded by a live test.
  expect(css).not.toContain(RETIRED_ABOUT_LABEL_RULE);
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

/**
 * Brace-matched slice starting at `marker`. The `[^}]+` blocks used
 * everywhere else in this file stop at the first nested rule, which is no use
 * for an at-rule that wraps others.
 */
function blockAfter(marker: string): string {
  const start = css.indexOf(marker);
  if (start === -1) return "";
  const open = css.indexOf("{", start);
  if (open === -1) return "";

  let depth = 0;
  for (let index = open; index < css.length; index += 1) {
    if (css[index] === "{") depth += 1;
    else if (css[index] === "}") {
      depth -= 1;
      if (depth === 0) return css.slice(start, index + 1);
    }
  }
  return "";
}

function heroEntranceBlock() {
  return blockAfter(HERO_ENTRANCE_GUARD);
}

function heroStageRule(stage: string, block = heroEntranceBlock()) {
  return (
    block.match(
      new RegExp(`\\[data-hero-stage="${stage}"\\][^{]*\\{[^}]+\\}`),
    )?.[0] ?? ""
  );
}

/** Every stage rule must carry exactly the timing lib/motion publishes. */
function verifyStageTiming(
  stage: "name" | "portrait" | "copy" | "outlets" | "cta",
  keyframe: string,
  rule = heroStageRule(stage),
  // `both` holds the from-state through the delay; without it a hero element
  // paints in full first and then jumps back to start. The CTA is the one
  // exception — see the "cta" test.
  fill: "both" | "backwards" = "both",
) {
  const step = heroEntranceStep(stage);
  expect(rule).toContain(keyframe);
  expect(rule).toContain(`${step.durationMs}ms`);
  expect(rule).toContain(`${step.delayMs}ms`);
  expect(rule).toContain(fill);
}

function heroCtaRule(selector: string) {
  return (
    heroEntranceBlock().match(
      new RegExp(`body:has\\(\\.home\\)\\s+${selector}\\s*\\{[^}]+\\}`),
    )?.[0] ?? ""
  );
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

function parseAboutFoldChrome(source: string) {
  const match = source.match(/--about-fold-chrome:\s*([^;]+);/);
  if (!match?.[1]?.trim()) {
    throw new Error("About fold chrome is required");
  }

  const value = match[1].trim();
  const rem = Number.parseFloat(value);
  if (!value.endsWith("rem") || !Number.isFinite(rem)) {
    throw new Error("About fold chrome must be a rem length");
  }
  // Below this the cap subtracts less than the header actually occupies and
  // the showcase still overflows a short window.
  if (rem < ABOUT_FOLD_CHROME_MIN) {
    throw new Error(
      `About fold chrome cannot be below ${ABOUT_FOLD_CHROME_MIN}rem`,
    );
  }
  // Above it the cap starts clipping a full-height laptop that has no need
  // of it, which is the one case the crop was never meant to touch.
  if (rem > ABOUT_FOLD_CHROME_MAX) {
    throw new Error(
      `About fold chrome cannot be above ${ABOUT_FOLD_CHROME_MAX}rem`,
    );
  }

  return value;
}

function verifyAboutHeaderFitsOneFrame() {
  const headline = css.match(/\.about-headline\s*\{[^}]+\}/)?.[0] ?? "";
  const head = css.match(/\.page-head--label\s*\{[^}]+\}/)?.[0] ?? "";
  const deck =
    css.match(/\.page-head--label \.about-bio__quote\s*\{[^}]+\}/)?.[0] ?? "";
  const article = css.match(/article:has\(\.about-bio\)\s*\{[^}]+\}/)?.[0] ?? "";
  const frame = css.match(/\.showcase__frame\s*\{[^}]+\}/)?.[0] ?? "";

  // The one-liner is 54 characters. At 20ch it broke over three lines, and
  // that third line is what pushed the showcase past the fold.
  expect(headline).toContain(`max-width: ${ABOUT_HEADLINE_MEASURE}`);
  expect(headline).not.toContain(`max-width: ${RETIRED_ABOUT_HEADLINE_MEASURE}`);
  // Re-ragged rather than shrunk: the type scale is untouched.
  expect(headline).toContain(`font-size: ${ABOUT_HEADLINE_FONT_SIZE}`);

  // Spacing tightened around it, each away from its retired value.
  expect(head).toContain(`margin-bottom: ${ABOUT_HEAD_MARGIN}`);
  expect(head).not.toContain(`margin-bottom: ${RETIRED_ABOUT_HEAD_MARGIN}`);
  // The eyebrow that used to sit above the one-liner, and the space it took,
  // are both gone; the fold budget below was retuned for its absence.
  expect(css).not.toContain(RETIRED_ABOUT_LABEL_RULE);
  expect(deck).toContain(`margin: ${ABOUT_DECK_MARGIN} 0 0`);
  expect(deck).not.toContain(`margin: ${RETIRED_ABOUT_DECK_MARGIN} 0 0`);
  expect(article).toContain(`padding-top: ${ABOUT_ARTICLE_PADDING}`);
  expect(article).not.toContain(
    `padding-top: ${RETIRED_ABOUT_ARTICLE_PADDING}`,
  );

  // The image height follows the container width, not the viewport, so on a
  // short window the header alone cannot keep it above the fold. The frame
  // yields instead; overflow: hidden is what makes the cap a crop.
  expect(parseAboutFoldChrome(css)).toBe(ABOUT_FOLD_CHROME);
  expect(css).not.toContain(`--about-fold-chrome: ${RETIRED_ABOUT_FOLD_CHROME}`);
  expect(frame).toContain(
    "max-height: calc(100svh - var(--about-fold-chrome))",
  );
  expect(frame).toContain("overflow: hidden");
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

  it("grows the shell with the viewport instead of stranding wide displays", () => {
    const root = css.match(/^:root\s*\{[^}]+\}/m)?.[0] ?? "";
    const shell =
      css.match(/\.site-footer__inner\s*\{[^}]+\}/)?.[0] ?? "";
    const container = parseClamp(root, "--container");

    expect(container.min).toBe(SHELL_CONTAINER.min);
    expect(container.preferred).toBe(SHELL_CONTAINER.preferred);
    expect(container.max).toBe(SHELL_CONTAINER.max);
    expect(root).not.toContain(RETIRED_FIXED_SHELL_CONTAINER);
    // Masthead, main, and footer stay on one shell so their edges line up.
    expect(shell).toContain(SHELL_WIDTH);
    expect(shell).toContain("margin-inline: auto");
  });

  it("scales the rem system on large displays without overriding the reader", () => {
    const html = css.match(/^html\s*\{[^}]+\}/m)?.[0] ?? "";
    const scale = parseClamp(html, "font-size");

    expect(scale.min).toBe(ROOT_FONT_SCALE.min);
    expect(scale.preferred).toBe(ROOT_FONT_SCALE.preferred);
    expect(scale.max).toBe(ROOT_FONT_SCALE.max);
    // The floor is 1rem, so nothing below the 1600px crossover moves.
    expect(html).not.toMatch(RETIRED_PX_ROOT_FONT_SIZE);
    // Breakpoints stay in px, so the root step moves no media query.
    expect(css).not.toMatch(/@media[^{]*\(\s*(min|max)-width:\s*[\d.]+rem/);
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
    expect(name).not.toContain(RETIRED_VIEWPORT_HERO_NAME_SIZE);
  });

  it("scales the hero headline against the shell rather than the viewport", () => {
    const hero = heroBlock();
    const watermark = parseClamp(heroWatermarkBlock(), "font-size");
    // Without the query container both cqw values would resolve against the
    // small viewport default and the headline would collapse to its minimum.
    expect(hero).toContain(HERO_QUERY_CONTAINER);
    expect(watermark.min).toBe(HERO_WATERMARK_FONT_SIZE.min);
    expect(watermark.preferred).toBe(HERO_WATERMARK_FONT_SIZE.preferred);
    expect(watermark.max).toBe(HERO_WATERMARK_FONT_SIZE.max);
    expect(heroWatermarkBlock()).not.toContain(
      RETIRED_VIEWPORT_HERO_WATERMARK_SIZE,
    );
  });

  it("fades the hero name up left to right", () => {
    const rule = heroStageRule(HERO_STAGE_NAME);
    const keyframes = blockAfter(HERO_NAME_WIPE_KEYFRAMES);
    const type = css.match(/\.hero__name-type\s*\{[^}]+\}/)?.[0] ?? "";

    verifyStageTiming(HERO_STAGE_NAME, "hero-name-wipe", rule);
    expect(rule).toContain(HERO_NAME_MASK_SIZE);
    expect(rule).toContain("mask-repeat: no-repeat");
    // Right to left across a mask three times the box: one soft edge crosses
    // the letters, and it ends on the mask's solid head at full strength.
    expect(keyframes).toContain(HERO_NAME_WIPE_FROM);
    expect(keyframes).toContain(HERO_NAME_WIPE_TO);
    // Safari still needs the prefix for both the mask and its position.
    expect(rule).toContain("-webkit-mask-image");
    expect(keyframes).toContain(`-webkit-${HERO_NAME_WIPE_FROM}`);
    // Percentages resolve against the name's own box, which is what the
    // inline-block buys; the h1 spans the whole grid row.
    expect(type).toContain("display: inline-block");
    expect(type).toContain("max-width: 100%");
  });

  it("keeps the retired typewriter and its caret out of the stylesheet", () => {
    expect(css).not.toContain(RETIRED_HERO_TYPEWRITER);
    expect(css).not.toContain(RETIRED_HERO_CARET);
    // A stepped timing function anywhere in the name rule would put the
    // character-at-a-time reveal back.
    expect(heroStageRule(HERO_STAGE_NAME)).not.toContain("steps(");
  });

  it("runs the portrait, then the copy and the outlet strip, after the name", () => {
    verifyStageTiming(HERO_STAGE_PORTRAIT, "hero-portrait-in");
    verifyStageTiming(HERO_STAGE_COPY, "hero-rise");
    verifyStageTiming(HERO_STAGE_OUTLETS, "hero-rise");

    const order = [
      HERO_STAGE_NAME,
      HERO_STAGE_PORTRAIT,
      HERO_STAGE_COPY,
      HERO_STAGE_OUTLETS,
    ].map((stage) => heroEntranceBlock().indexOf(`data-hero-stage="${stage}"`));
    expect(order.every((at) => at >= 0)).toBe(true);
    // The portrait carries scale the copy does not, so the head settles into
    // the headline rather than sliding up into it.
    expect(blockAfter("@keyframes hero-portrait-in")).toContain("scale(0.97)");
    expect(blockAfter("@keyframes hero-rise")).not.toContain("scale(");
  });

  it("closes the entrance by sweeping the masthead CTA once", () => {
    const sweep = heroCtaRule("\\.header-cta::before");
    const flare = heroCtaRule("\\.header-cta");
    const sweepFrames = blockAfter("@keyframes hero-cta-sweep");
    const flareFrames = blockAfter("@keyframes hero-cta-flare");

    verifyStageTiming(HERO_STAGE_CTA, "hero-cta-sweep", sweep, "backwards");
    verifyStageTiming(HERO_STAGE_CTA, "hero-cta-flare", flare, "backwards");

    // Never `both` or `forwards`: the fill has to release so ::before drops
    // back to the base scaleX(0) and hover owns the gold again. A forwards
    // fill would pin the button in its swept state for good.
    [sweep, flare].forEach((rule) => {
      expect(rule).not.toContain("forwards");
      expect(rule).not.toMatch(/\bboth\b/);
    });

    // Same easing the hover transition drives the same gold fill with, so
    // the scripted sweep and the hover sweep read as one gesture.
    const hoverFill =
      css.match(
        /\.button-link:not\(\.button-link--ghost\)::before\s*\{[^}]+\}/,
      )?.[0] ?? "";
    expect(hoverFill).toContain("transition: transform 400ms ease-in-out");
    [sweep, flare].forEach((rule) => {
      expect(rule).toContain("ease-in-out");
    });

    // The band travels: it grows from the left, then retreats to the right,
    // rather than appearing and leaving the way it came.
    expect(sweepFrames).toContain("transform-origin: left center");
    expect(sweepFrames).toContain("transform-origin: right center");
    expect(sweepFrames.trim().endsWith("}")).toBe(true);

    // The CTA is live from first paint. A highlight must not dim it, so the
    // flare touches border, label, and shadow and leaves opacity alone.
    expect(flareFrames).toContain("border-color: var(--gold)");
    expect(flareFrames).not.toContain("opacity");
    expect(flare).not.toContain("opacity");
    // The label turns over with the fill, as it does on hover — white on
    // gold is a contrast the button should never sit at.
    const hover =
      css.match(
        /\.button-link:not\(\.button-link--ghost\):hover,[^{]+\{[^}]+\}/,
      )?.[0] ?? "";
    expect(hover).toContain("color: var(--navy)");
    expect(flareFrames).toContain("color: var(--navy)");
    expect(flareFrames).toContain("color: var(--white)");
  });

  it("scopes the CTA highlight to the home page it closes", () => {
    // The masthead is chrome on every route, so an unscoped rule would flash
    // gold on /about, /press, and the rest.
    const ctaRules = heroEntranceBlock().match(/[^{}]*\.header-cta[^{]*\{/g) ?? [];
    expect(ctaRules).toHaveLength(2);
    ctaRules.forEach((selector) => {
      expect(selector).toContain("body:has(.home)");
    });
  });

  it("fades the home bands up as they scroll into view", () => {
    const guard = blockAfter(HERO_ENTRANCE_GUARD);
    const reveal = css.slice(css.indexOf(SCROLL_REVEAL_GUARD));
    const scope = `body:has\\(\\[${SCROLL_REVEAL_SCOPE_ATTRIBUTE}\\]\\)`;
    const hidden =
      reveal.match(
        new RegExp(`${scope} \\[data-reveal\\]:not\\(\\.is-revealed\\)\\s*\\{[^}]+\\}`),
      )?.[0] ?? "";
    const moving =
      reveal.match(new RegExp(`${scope} \\[data-reveal\\]\\s*\\{[^}]+\\}`))?.[0] ??
      "";
    const nested =
      reveal.match(
        new RegExp(
          `${scope} \\[data-reveal\\] \\[data-reveal\\]:not\\(\\.is-revealed\\)\\s*\\{[^}]+\\}`,
        ),
      )?.[0] ?? "";

    // Fade plus a short rise, released the moment .is-revealed lands.
    expect(hidden).toContain("opacity: 0");
    expect(hidden).toContain(REVEAL_RISE);
    expect(moving).toContain("opacity 700ms ease-out");
    expect(moving).toContain("transform 700ms");
    // A SectionIntro inside a revealing band fades in place rather than
    // travelling its own rise on top of its parent's.
    expect(nested).toContain("transform: none");
    // The revealed default has to stay: it is what a reduced-motion reader
    // and every non-home page sit at.
    // Anchored at column 0: the scoped rules are all indented or prefixed.
    const base = css.match(/^\[data-reveal\]\s*\{[^}]+\}/m)?.[0] ?? "";
    expect(base).toContain("opacity: 1");
    expect(base).toContain("transform: none");
    // Not the hero's entrance block — the reveal is its own state machine.
    expect(guard).not.toContain("is-revealed");
  });

  it("scopes the scroll reveal to pages that opt in", () => {
    // SectionIntro carries data-reveal on every page. An unscoped hidden
    // state would blank /press, /media-kit, and the legal pages until an
    // observer that may never see them says otherwise.
    const reveal = css.slice(css.indexOf(SCROLL_REVEAL_GUARD));
    const hiding = reveal.match(/[^{}]*\[data-reveal\][^{]*\{[^}]*opacity: 0/g) ?? [];
    expect(hiding.length).toBeGreaterThan(0);
    hiding.forEach((rule) => {
      expect(rule).toContain(`body:has([${SCROLL_REVEAL_SCOPE_ATTRIBUTE}])`);
    });
    // Retired: keyed on the home class, which no other page could join.
    expect(reveal).not.toContain("body:has(.home) [data-reveal]");
  });

  it("stages the About entrance from the label to the stat chips", () => {
    const guard = blockAfter(ABOUT_ENTRANCE_GUARD);
    const rule = (stage: string) =>
      guard.match(
        new RegExp(`\\[data-about-stage="${stage}"\\][^{]*\\{[^}]+\\}`),
      )?.[0] ?? "";

    // Every stage carries exactly the timing lib/motion publishes.
    ABOUT_ENTRANCE_STAGES.forEach((stage) => {
      const step = aboutEntranceStep(stage);
      const found = rule(stage);
      expect(found).toContain(`${step.durationMs}ms`);
      expect(found).toContain(`${step.delayMs}ms`);
      expect(found).toContain("both");
    });

    // The frame fades while the photo inside it settles out of a zoom —
    // two rules, so the card does not slide as one block.
    expect(rule(ABOUT_STAGE_FRAME)).toContain("about-fade");
    const photo =
      guard.match(
        /\[data-about-stage="frame"\] \.showcase__image\s*\{[^}]+\}/,
      )?.[0] ?? "";
    expect(photo).toContain("about-photo-settle");
    // Anchored to the same edge as the 12/5 crop.
    expect(photo).toContain("transform-origin: center top");
    expect(blockAfter("@keyframes about-photo-settle")).toContain(
      `scale(${ABOUT_PHOTO_ZOOM})`,
    );

    // Chips stagger by nth-child, so the delays stay out of the markup.
    for (let index = 1; index < ABOUT_STAT_COUNT; index += 1) {
      const chip =
        guard.match(
          new RegExp(
            `\\[data-about-stage="stats"\\] > :nth-child\\(${index + 1}\\)\\s*\\{[^}]+\\}`,
          ),
        )?.[0] ?? "";
      expect(chip).toContain(`animation-delay: ${aboutStatDelayMs(index)}ms`);
    }
  });

  it("keeps the About entrance clear of the hero's unscoped stage rules", () => {
    const guard = blockAfter(ABOUT_ENTRANCE_GUARD);
    // Declarations only: the block's own comment names the hero attribute to
    // explain why it is not used, which is not the same as using it.
    const declarations = guard.replace(/\/\*[\s\S]*?\*\//g, "");
    // Sharing data-hero-stage would pull the home animations onto About.
    expect(declarations).not.toContain("data-hero-stage");
    expect(guard).toContain(ABOUT_ENTRANCE_ATTRIBUTE);
    // Nothing hidden outside the reduced-motion guard.
    const all = css.match(/\[data-about-stage=/g) ?? [];
    const guarded = guard.match(/\[data-about-stage=/g) ?? [];
    expect(all.length).toBeGreaterThan(0);
    expect(guarded.length).toBe(all.length);
  });

  it("hides nothing outside the reduced-motion guard", () => {
    const all = css.match(/\[data-hero-stage=/g) ?? [];
    const guarded = heroEntranceBlock().match(/\[data-hero-stage=/g) ?? [];

    // Every from-state lives inside the guard. A reduced-motion reader, or an
    // engine that skips these rules, gets the finished hero — never a blank
    // one waiting on an animation that will not run.
    expect(all.length).toBeGreaterThan(0);
    expect(guarded.length).toBe(all.length);
    expect(heroEntranceBlock()).not.toContain("(max-width");
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

  it("fits the About header, its deck, and the showcase in one frame", () => {
    verifyAboutHeaderFitsOneFrame();
  });

  it("rejects a missing or out-of-range About fold chrome", () => {
    expect(() => parseAboutFoldChrome(":root { }")).toThrow(
      "About fold chrome is required",
    );
    expect(() =>
      parseAboutFoldChrome(":root { --about-fold-chrome: 340px; }"),
    ).toThrow("About fold chrome must be a rem length");
    // Too small and a short window still overflows.
    expect(() =>
      parseAboutFoldChrome(
        `:root { --about-fold-chrome: ${ABOUT_FOLD_CHROME_MIN - 0.25}rem; }`,
      ),
    ).toThrow(`About fold chrome cannot be below ${ABOUT_FOLD_CHROME_MIN}rem`);
    // Too large and it crops a full-height laptop that never needed it.
    expect(() =>
      parseAboutFoldChrome(
        `:root { --about-fold-chrome: ${ABOUT_FOLD_CHROME_MAX + 0.25}rem; }`,
      ),
    ).toThrow(`About fold chrome cannot be above ${ABOUT_FOLD_CHROME_MAX}rem`);
    // Both bounds are inclusive.
    expect(
      parseAboutFoldChrome(
        `:root { --about-fold-chrome: ${ABOUT_FOLD_CHROME_MIN}rem; }`,
      ),
    ).toBe(`${ABOUT_FOLD_CHROME_MIN}rem`);
    expect(
      parseAboutFoldChrome(
        `:root { --about-fold-chrome: ${ABOUT_FOLD_CHROME_MAX}rem; }`,
      ),
    ).toBe(`${ABOUT_FOLD_CHROME_MAX}rem`);
  });

  it("sets the page heads at the same scale as the About lead", () => {
    const title = css.match(/\.page-head h1\s*\{[^}]+\}/)?.[0] ?? "";
    const lede = css.match(/\.page-head__lede\s*\{[^}]+\}/)?.[0] ?? "";
    const headline = css.match(/\.about-headline\s*\{[^}]+\}/)?.[0] ?? "";
    const deck = css.match(/\.about-bio__quote p\s*\{[^}]+\}/)?.[0] ?? "";

    // Asserted as an equality against the About page rather than as its own
    // literal, because "the same scale" is the actual requirement: pinning
    // two numbers separately lets them drift apart while both stay green.
    const sizeOf = (block: string) =>
      block.match(/font-size:\s*([^;]+);/)?.[1]?.trim();
    expect(sizeOf(title)).toBe(sizeOf(headline));
    expect(sizeOf(lede)).toBe(sizeOf(deck));
    expect(sizeOf(title)).toBe(ABOUT_HEADLINE_FONT_SIZE);
    expect(sizeOf(lede)).toBe(ABOUT_QUOTE_FONT_SIZE);

    expect(title).not.toContain(RETIRED_PAGE_HEAD_TITLE_SIZE);
    expect(lede).not.toContain(RETIRED_PAGE_HEAD_LEDE_SIZE);
  });

  it("leaves the legal pages on their own larger title scale", () => {
    // Split from .page-head h1 deliberately, so the legal documents keep the
    // heavier heading a standalone document wants.
    const legal = css.match(/\.legal-page__header h1\s*\{[^}]+\}/)?.[0] ?? "";
    expect(legal).toContain(`font-size: ${RETIRED_PAGE_HEAD_TITLE_SIZE}`);
  });

  it("closes the gap between a page head and the content it introduces", () => {
    const rule = css.match(/\.page-head \+ \.band\s*\{[^}]+\}/)?.[0] ?? "";
    const wide = blockAfter("@media (min-width: 900px)");

    expect(rule).toContain(`padding-top: ${PAGE_HEAD_BAND_PADDING}`);
    // The 900px block still gives ordinary sections their 6rem; this rule
    // only outranks it for the band directly under a head.
    expect(wide).toContain(RETIRED_PAGE_HEAD_BAND_PADDING);
    expect(rule).not.toContain(RETIRED_PAGE_HEAD_BAND_PADDING);
  });

  it("gives a band that opens its own section room from the lede", () => {
    const labelled =
      css.match(/\.page-head \+ \.band:has\(\.eyebrow\)\s*\{[^}]+\}/)?.[0] ?? "";

    // Two different relationships, so two different gaps. A card grid is the
    // lede's own content and sits close; a band that opens with a section
    // label is a new section, and running it up against the lede makes the
    // two read as one block.
    expect(labelled).toContain(`padding-top: ${PAGE_HEAD_SECTION_PADDING}`);
    expect(
      Number.parseFloat(PAGE_HEAD_SECTION_PADDING),
    ).toBeGreaterThan(Number.parseFloat(PAGE_HEAD_BAND_PADDING));
    // Still under an ordinary mid-page section's 6rem.
    expect(Number.parseFloat(PAGE_HEAD_SECTION_PADDING)).toBeLessThan(6);
  });

  it("stages every PageHead entrance in the About page's beats", () => {
    const guard = blockAfter(PAGE_ENTRANCE_GUARD);
    // `[^{]*` rather than `\s*`: the content stage is a selector list, so
    // the brace does not follow its first selector directly.
    const rule = (selector: string) =>
      guard.match(
        new RegExp(`\\[data-page-entrance\\] ${selector}[^{]*\\{[^}]+\\}`),
      )?.[0] ?? "";

    // Each stage carries exactly the timing lib/motion publishes, and those
    // are the About entrance's opening beats unchanged.
    const stages: Array<[PageEntranceStage, string]> = [
      [PAGE_STAGE_HEADLINE, "\\.page-head h1"],
      [PAGE_STAGE_DECK, "\\.page-head__lede"],
      [PAGE_STAGE_CONTENT, "\\.page-head \\+ \\.band"],
    ];
    // Every page's content block shares that one stage, so none of them is
    // left sitting at full opacity while the head above it animates.
    const contentRule = rule("\\.page-head \\+ \\.band");
    for (const selector of [
      ".page-head > :not(h1):not(.eyebrow):not(.page-head__lede)",
      ".contact-routing",
      "> .inquiry-form",
    ]) {
      expect(contentRule).toContain(selector);
    }
    // The media kit's request dialog embeds its own copy of the contact
    // form. Matching .inquiry-form loosely would animate that hidden copy on
    // every media kit load, so the form is taken as a direct child only.
    expect(contentRule).not.toMatch(/\[data-page-entrance\] \.inquiry-form/);
    for (const [stage, selector] of stages) {
      const step = pageEntranceStep(stage);
      const found = rule(selector);
      expect(found).toContain(`${step.durationMs}ms`);
      expect(found).toContain(`${step.delayMs}ms`);
      expect(found).toContain("both");
      expect(found).toContain("page-rise");
    }
    expect(pageEntranceStep(PAGE_STAGE_HEADLINE).delayMs).toBe(
      aboutEntranceStep("headline").delayMs,
    );
    expect(pageEntranceStep(PAGE_STAGE_DECK).delayMs).toBe(
      aboutEntranceStep("deck").delayMs,
    );

    // Cards arrive in turn, staggered by nth-child so the delays stay out of
    // the markup.
    for (let index = 1; index < PAGE_CARD_COUNT; index += 1) {
      const card =
        guard.match(
          new RegExp(
            `\\.card:nth-child\\(${index + 1}\\)\\s*\\{[^}]+\\}`,
          ),
        )?.[0] ?? "";
      expect(card).toContain(`${pageCardDelayMs(index)}ms`);
    }

    // Retired: one fade on the panel, which could only move the whole thing
    // as a block and had nothing to say about what was inside it.
    expect(css).not.toContain(RETIRED_PANEL_ANIMATION);
    // Nothing hidden outside the reduced-motion guard.
    const all = css.match(/\[data-page-entrance\]/g) ?? [];
    const guarded = guard.match(/\[data-page-entrance\]/g) ?? [];
    expect(all.length).toBeGreaterThan(0);
    expect(guarded.length).toBe(all.length);

    // The tab labels themselves ease between states rather than snapping.
    const link = css.match(/\.press-tabs__nav a\s*\{[^}]+\}/)?.[0] ?? "";
    expect(link).toContain("color 220ms ease");
  });

  it("lifts the press tabs to the top of the page they navigate", () => {
    const tabs = css.match(/\.press-tabs\s*\{[^}]+\}/)?.[0] ?? "";
    // Keyed on border-bottom: the selector also appears in the shared flex
    // rule it shares with the desktop and footer navs, which comes first.
    const nav =
      css.match(/\.press-tabs__nav\s*\{[^}]*border-bottom[^}]*\}/)?.[0] ?? "";

    expect(tabs).toContain(`padding-top: ${PRESS_TABS_PADDING}`);
    // The retired value is still what `article` uses, so this is asserted
    // against the tabs rule rather than the whole stylesheet.
    expect(tabs).not.toContain(RETIRED_PRESS_TABS_PADDING);
    expect(nav).toContain(`margin: ${PRESS_TABS_NAV_MARGIN}`);
    expect(nav).not.toContain(`margin: ${RETIRED_PRESS_TABS_NAV_MARGIN}`);
  });

  it("keeps the retired About page label out of the stylesheet", () => {
    // The rule and its scale guard both went with the page-name eyebrows.
    // Nothing on /about prints a label naming the page any more, so a rule
    // styling one would be dead CSS with a live test standing over it.
    expect(css).not.toContain(RETIRED_ABOUT_LABEL_RULE);
    expect(css).not.toContain(ABOUT_LABEL_MARGIN);
    expect(css).not.toContain(RETIRED_ABOUT_LABEL_MARGIN);
    // The sitewide eyebrow is untouched: section labels still use it.
    expect(css).toMatch(/^\.eyebrow\s*\{/m);
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
