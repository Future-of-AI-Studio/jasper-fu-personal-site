import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { identity } from "./identity";

const css = readFileSync(
  join(dirname(fileURLToPath(import.meta.url)), "../app/globals.css"),
  "utf8",
);

const HERO_COLUMN_GAP = {
  min: "1rem",
  preferred: "2.5vw",
  max: "2.5rem",
} as const;
const HERO_COPY_MAX_WIDTH = "28rem";
const WORDMARK_NAME_INSET = "calc(3.5rem + 0.9rem)";
const LEGACY_HERO_GAP = "clamp(2rem, 5vw, 5rem)";
const TOO_TIGHT_HERO_GAP = "clamp(1rem, 2vw, 1.75rem)";
const LEGACY_HERO_PADDING = "clamp(3.5rem, 8vw, 7.5rem)";
const LEGACY_HERO_PHOTO_MIN_HEIGHT = "clamp(22rem, 48vw, 34rem)";
const HERO_FOLD_CHROME = "15rem";
const HERO_FOLD_CHROME_MIN = 12;
const HERO_FOLD_CHROME_MAX = 18;
const EYEBROW_SIZE_REM = 0.75;
const ABOUT_GOLD_HEADER_REM = EYEBROW_SIZE_REM * 2;
const ABOUT_PORTRAIT_MAX_WIDTH = "32rem";
const ABOUT_PORTRAIT_MAX_WIDTH_MIN = 24;
const ABOUT_PORTRAIT_MAX_WIDTH_MAX = 40;
const LEGACY_ABOUT_PORTRAIT_MIN_HEIGHT = "clamp(22rem, 48vw, 34rem)";
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

function aboutGoldHeaderBlock(source = css) {
  return source.match(/\.page-head--label \.eyebrow\s*\{[^}]+\}/)?.[0] ?? "";
}

function parseAboutGoldHeaderSize(source: string) {
  const block = aboutGoldHeaderBlock(source);
  if (!block.trim()) {
    throw new Error("About gold header rule is required");
  }
  const match = block.match(/font-size:\s*([^;]+);/);
  if (!match?.[1]?.trim()) {
    throw new Error("About gold header font-size is required");
  }
  const value = match[1].trim();
  if (!value.endsWith("rem")) {
    throw new Error("About gold header must be a rem length");
  }
  const rem = Number.parseFloat(value);
  if (!Number.isFinite(rem)) {
    throw new Error("About gold header must be a rem length");
  }
  if (rem !== ABOUT_GOLD_HEADER_REM) {
    throw new Error(
      `About gold header must be ${ABOUT_GOLD_HEADER_REM}rem (2x the eyebrow)`,
    );
  }
  return value;
}

function verifyAboutGoldHeader() {
  const eyebrow = css.match(/^\.eyebrow\s*\{[^}]+\}/m)?.[0] ?? "";
  expect(eyebrow).toContain(`font-size: ${EYEBROW_SIZE_REM}rem`);
  expect(parseAboutGoldHeaderSize(css)).toBe(`${ABOUT_GOLD_HEADER_REM}rem`);
  expect(aboutGoldHeaderBlock()).toContain("color: var(--gold)");
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
  expect(quote).toContain("display: flex");
  expect(quote).toContain("border-left: 2px solid var(--gold)");
  expect(css).not.toContain(".about-bio__quote cite");
  expect(paragraphs).toContain("color: var(--navy)");
  expect(parseAboutBioFontSize(css)).toEqual(ABOUT_BIO_FONT_SIZE);
  const headQuote =
    css.match(/\.page-head--label \.about-bio__quote\s*\{[^}]+\}/)?.[0] ?? "";
  const head = css.match(/\.page-head--label\s*\{[^}]+\}/)?.[0] ?? "";
  expect(head).toContain("justify-items: start");
  expect(headQuote).toContain("max-width: 42rem");
}

function aboutPortraitBlock(source = css) {
  return source.match(/\.about-portrait\s*\{[\s\S]*?\}/)?.[0] ?? "";
}

function parseAboutPortraitMaxWidth(source: string) {
  const block = aboutPortraitBlock(source);
  if (!block.trim()) {
    throw new Error("About portrait rule is required");
  }
  const match = block.match(/max-width:\s*([^;]+);/);
  if (!match?.[1]?.trim()) {
    throw new Error("About portrait max-width is required");
  }
  const value = match[1].trim();
  if (!value.endsWith("rem")) {
    throw new Error("About portrait max-width must be a rem length");
  }
  const rem = Number.parseFloat(value);
  if (!Number.isFinite(rem)) {
    throw new Error("About portrait max-width must be a rem length");
  }
  if (rem < ABOUT_PORTRAIT_MAX_WIDTH_MIN) {
    throw new Error(
      `About portrait max-width cannot be below ${ABOUT_PORTRAIT_MAX_WIDTH_MIN}rem`,
    );
  }
  if (rem > ABOUT_PORTRAIT_MAX_WIDTH_MAX) {
    throw new Error(
      `About portrait max-width cannot be above ${ABOUT_PORTRAIT_MAX_WIDTH_MAX}rem`,
    );
  }
  return value;
}

function verifyAboutBioBesidePortrait() {
  const layout = css.match(/\.about-bio\s*\{[^}]+\}/)?.[0] ?? "";
  const portrait = aboutPortraitBlock();
  expect(layout).toContain(
    `grid-template-columns: ${ABOUT_PORTRAIT_MAX_WIDTH} minmax(0, 1fr)`,
  );
  expect(layout).toContain("align-items: start");
  expect(layout).not.toContain("align-items: stretch");
  expect(parseAboutPortraitMaxWidth(css)).toBe(ABOUT_PORTRAIT_MAX_WIDTH);
  expect(portrait).not.toContain("max-width: 16rem");
  expect(portrait).not.toContain(LEGACY_ABOUT_PORTRAIT_MIN_HEIGHT);
  expect(portrait).toContain("min-height: 0");
  expect(portrait).toContain("z-index: 0");
  expect(portrait).toContain("overflow: hidden");
}

function heroBlock() {
  return css.match(/\.hero\s*\{[^}]+\}/)?.[0] ?? "";
}

function heroCopyBlock() {
  return css.match(/\.hero__copy\s*\{[^}]+\}/)?.[0] ?? "";
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
  copy = heroCopyBlock(),
) {
  const columnGap = parseClamp(hero, "column-gap");
  expect(columnGap).toEqual(HERO_COLUMN_GAP);
  expect(hero).not.toContain(`gap: ${LEGACY_HERO_GAP}`);
  expect(hero).not.toContain(TOO_TIGHT_HERO_GAP);
  expect(copy).toContain(`max-width: ${HERO_COPY_MAX_WIDTH}`);
  expect(copy).toContain("justify-self: start");
  expect(copy).toContain("margin-inline-start: var(--wordmark-name-inset)");
  expect(copy).toContain("text-align: left");
  expect(copy).not.toContain("justify-self: end");
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
  const copy = heroCopyBlock();
  expect(copy).toContain("margin-inline-start: var(--wordmark-name-inset)");
  expect(copy).toContain("justify-self: start");
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
  expect(hero).toContain("padding: clamp(1.1rem, 2vw, 1.75rem) 0 clamp(0.9rem, 1.6vw, 1.5rem)");
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

  it("uses Libre Baskerville and IBM Plex", () => {
    expect(css).toContain("Libre Baskerville");
    expect(css).toContain("IBM Plex Sans");
    expect(css).toContain("IBM Plex Mono");
  });

  it("uses a white masthead with a border hairline", () => {
    expect(css).toContain(".masthead");
    expect(css).toContain("border-bottom: 1px solid var(--border)");
    expect(css).not.toContain("var(--bronze)");
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

  it("right-aligns desktop navigation against the Media Kit control", () => {
    const nav = css.match(/\.desktop-nav\s*\{[^}]+\}/)?.[0] ?? "";
    const navList = css.match(/\.desktop-nav ul\s*\{[^}]+\}/)?.[0] ?? "";
    expect(nav).toContain("justify-self: end");
    expect(navList).toContain("justify-content: flex-end");
  });

  it("keeps the circular seal circular", () => {
    const seal = css.match(/\.jasper-seal\s*\{[^}]+\}/)?.[0] ?? "";
    const wordmarkSeal = css.match(/\.wordmark \.jasper-seal\s*\{[^}]+\}/)?.[0] ?? "";
    expect(seal).toContain("border-radius: 50%");
    expect(wordmarkSeal).toContain("width: 3.5rem");
  });

  it("centers the home hero copy against the portrait", () => {
    const hero = heroBlock();
    const copy = heroCopyBlock();
    expect(hero).toContain("align-items: center");
    expect(copy).toContain("justify-content: center");
    expect(css).not.toContain(".hero__coinsub");
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

  it("stacks the hero on small screens without a copy max-width", () => {
    const copyBlocks = [...css.matchAll(/\.hero__copy\s*\{[^}]+\}/g)].map(
      (match) => match[0],
    );
    expect(copyBlocks).toHaveLength(2);
    expect(copyBlocks[0]).toContain(`max-width: ${HERO_COPY_MAX_WIDTH}`);
    expect(copyBlocks[1]).toContain("max-width: none");
    expect(copyBlocks[1]).toContain("justify-self: stretch");
    expect(copyBlocks[1]).toContain("margin-inline-start: 0");
    expect(css).toContain(".hero,");
    const mobile = css.slice(css.indexOf("@media (max-width: 900px)"));
    expect(mobile).toContain("grid-template-columns: 1fr");
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

  it("sizes media-bar outlet logos larger, with CEO Magazine extra-large", () => {
    const logo = css.match(/\.media-bar__logo\s*\{[^}]+\}/)?.[0] ?? "";
    const ceo = css.match(/\.media-bar__logo--ceo\s*\{[^}]+\}/)?.[0] ?? "";
    expect(logo).toContain("height: 2.4rem");
    expect(logo).toContain("object-fit: contain");
    expect(ceo).toContain("height: 3.35rem");
  });

  it("loops the media-bar logos with a seamless marquee", () => {
    const track = css.match(/\.media-bar__track\s*\{[^}]+\}/)?.[0] ?? "";
    const keyframes = css.match(
      /@keyframes media-bar-marquee\s*\{[\s\S]*?\n\}/,
    )?.[0] ?? "";
    const reduced = css.match(
      /@media \(prefers-reduced-motion: reduce\)\s*\{[\s\S]*?\n\}/,
    )?.[0] ?? "";
    expect(track).toContain("animation: media-bar-marquee 32s linear infinite");
    expect(keyframes).toContain("translateX(-50%)");
    expect(reduced).toContain("animation: none");
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

  it("places the media kit request copy beside the speaking photo", () => {
    const layout = css.match(/\.media-kit-request\s*\{[^}]+\}/)?.[0] ?? "";
    expect(layout).toContain("grid-template-columns:");
    expect(layout).toContain("align-items: center");
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

  it("frames a compact About portrait at 4:5 with a 16px radius", () => {
    const frame = aboutPortraitBlock();
    expect(frame).toContain("aspect-ratio: 4 / 5");
    expect(frame).toContain("border-radius: var(--radius)");
    expect(frame).toContain("background: var(--sky-pale)");
    expect(frame).toContain(`max-width: ${ABOUT_PORTRAIT_MAX_WIDTH}`);
  });

  it("doubles the gold About header against the eyebrow scale", () => {
    verifyAboutGoldHeader();
  });

  it("rejects a missing or non-doubled About gold header", () => {
    expect(() => parseAboutGoldHeaderSize(".eyebrow { font-size: 0.75rem; }")).toThrow(
      "About gold header rule is required",
    );
    expect(() =>
      parseAboutGoldHeaderSize(".page-head--label .eyebrow { color: var(--gold); }"),
    ).toThrow("About gold header font-size is required");
    expect(() =>
      parseAboutGoldHeaderSize(
        ".page-head--label .eyebrow { font-size: 1.5px; }",
      ),
    ).toThrow("About gold header must be a rem length");
    expect(() =>
      parseAboutGoldHeaderSize(
        ".page-head--label .eyebrow { font-size: 0.75rem; }",
      ),
    ).toThrow("About gold header must be 1.5rem (2x the eyebrow)");
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

  it("keeps the About bio beside a smaller portrait instead of under it", () => {
    verifyAboutBioBesidePortrait();
  });

  it("rejects a missing or out-of-range About portrait max-width", () => {
    expect(() => parseAboutPortraitMaxWidth(".about-bio { display: grid; }")).toThrow(
      "About portrait rule is required",
    );
    expect(() =>
      parseAboutPortraitMaxWidth(".about-portrait { aspect-ratio: 4 / 5; }"),
    ).toThrow("About portrait max-width is required");
    expect(() =>
      parseAboutPortraitMaxWidth(".about-portrait { max-width: 16px; }"),
    ).toThrow("About portrait max-width must be a rem length");
    expect(() =>
      parseAboutPortraitMaxWidth(".about-portrait { max-width: 23rem; }"),
    ).toThrow("About portrait max-width cannot be below 24rem");
    expect(() =>
      parseAboutPortraitMaxWidth(".about-portrait { max-width: 41rem; }"),
    ).toThrow("About portrait max-width cannot be above 40rem");
    expect(parseAboutPortraitMaxWidth(".about-portrait { max-width: 24rem; }")).toBe(
      "24rem",
    );
    expect(parseAboutPortraitMaxWidth(".about-portrait { max-width: 40rem; }")).toBe(
      "40rem",
    );
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
