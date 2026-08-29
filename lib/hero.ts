/**
 * Content for the home page's editorial hero: the oversized name, the
 * watermark behind it, the featured headshot, and the topic column beside
 * the portrait.
 *
 * The name and watermark are *derived* from identity.name rather than
 * repeated as their own strings, so the masthead, the JSON-LD, and the hero
 * can never drift apart on spelling.
 */
import { identity } from "./identity";
import { assertPortraitSrc } from "./portraits";

export const HERO_TOPIC_MIN_COUNT = 3;
export const HERO_TOPIC_MAX_COUNT = 5;
export const HERO_TOPIC_MAX_LENGTH = 32;

/**
 * The one lane held in the foreground, kept deliberately in step with
 * identity.lockedOneLiner ("the orchestration layer for programmable money").
 */
export const HERO_FEATURED_TOPIC = "Payments Orchestration";

/**
 * Condensed from copy.insightLanes so the column stays scannable at a
 * glance; the long-form speaking titles still live in lib/copy.ts and are
 * what /speaking publishes.
 */
export const heroTopics = [
  "Programmable Money",
  "Payments Orchestration",
  "Stablecoin Infrastructure",
  "Built-in Compliance",
] as const;

/**
 * Labels that ship with the layout template this composition was modelled
 * on. They are typo'd filler for a designer's portfolio and must never
 * reach a page about Jasper.
 */
export const TEMPLATE_HERO_TOPICS = [
  "Brading Deisgn",
  "Product Deisgn",
  "UI/UX Design",
  "Design Consultency",
] as const;

/**
 * The background-free cutout the hero composition needs. The rest of
 * lib/portraits.ts is studio-backdrop JPEG, which reads as a grey rectangle
 * once it sits directly on the white page instead of inside a framed box.
 */
export const HERO_FEATURE_PORTRAIT = "/portraits/jasper-fu.png";
export const RETIRED_HERO_PORTRAIT = "/portraits/jasper-fu-placeholder.jpg";

/** Intrinsic size of the cutout, so the browser can reserve the box. */
export const HERO_FEATURE_PORTRAIT_WIDTH = 260;
export const HERO_FEATURE_PORTRAIT_HEIGHT = 288;

export type HeroTopic = {
  label: string;
  featured: boolean;
};

export function assertHeroTopic(value: string) {
  const trimmed = value.trim();

  if (!trimmed) {
    throw new Error("Hero topic is required");
  }

  if ((TEMPLATE_HERO_TOPICS as readonly string[]).includes(trimmed)) {
    throw new Error(`${trimmed} is layout-template filler, not published copy`);
  }

  if (trimmed.length > HERO_TOPIC_MAX_LENGTH) {
    throw new Error(
      `Hero topic cannot exceed ${HERO_TOPIC_MAX_LENGTH} characters`,
    );
  }

  return trimmed;
}

export function parseHeroTopics(topics: readonly string[]): HeroTopic[] {
  if (topics.length < HERO_TOPIC_MIN_COUNT) {
    throw new Error(`Hero needs at least ${HERO_TOPIC_MIN_COUNT} topics`);
  }

  if (topics.length > HERO_TOPIC_MAX_COUNT) {
    throw new Error(`Hero cannot exceed ${HERO_TOPIC_MAX_COUNT} topics`);
  }

  const labels = topics.map(assertHeroTopic);

  if (new Set(labels).size !== labels.length) {
    throw new Error("Hero topics must each be unique");
  }

  if (!labels.includes(HERO_FEATURED_TOPIC)) {
    throw new Error("Hero topics must include the featured topic");
  }

  return labels.map((label) => ({
    label,
    featured: label === HERO_FEATURED_TOPIC,
  }));
}

/**
 * The hero sets the name in caps, but that is `text-transform` in CSS, not
 * content — the DOM keeps "Jasper Fu" so the accessible name stays a name
 * rather than something a screen reader may spell out letter by letter.
 */
export function assertHeroDisplayName(value: string) {
  const trimmed = value.trim();

  if (!trimmed) {
    throw new Error("Hero display name is required");
  }

  if (trimmed !== identity.name) {
    throw new Error("Hero display name must match identity.name");
  }

  return trimmed;
}

/** The ghosted first name set behind the headline. */
export function assertHeroWatermark(value: string) {
  const [first] = assertHeroDisplayName(value).split(" ");

  if (!first) {
    throw new Error("Hero watermark needs a first name");
  }

  return first;
}

export function assertHeroPortrait(value: string) {
  const src = assertPortraitSrc(value);

  if (src === RETIRED_HERO_PORTRAIT) {
    throw new Error(
      "The studio-backdrop headshot is retired here; the hero needs the cutout",
    );
  }

  if (src !== HERO_FEATURE_PORTRAIT) {
    throw new Error("Hero portrait must be the approved cutout");
  }

  return src;
}
