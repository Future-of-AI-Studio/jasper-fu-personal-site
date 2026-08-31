/**
 * The home hero's first-paint sequence.
 *
 * The animation itself is pure CSS in app/globals.css — this module is the
 * single source of the stage names and their timing, so the markup, the
 * stylesheet, and the tests cannot drift apart. lib/identity-css.test.ts
 * reads the stylesheet and asserts it against `HERO_ENTRANCE_TIMELINE`.
 *
 * Order: the name fades up left to right, the portrait eases up behind it,
 * the intro copy and the topic list arrive together, the outlet strip lands,
 * and the header CTA takes one highlight sweep to close the sequence.
 */

export const HERO_ENTRANCE_ATTRIBUTE = "data-hero-stage";

export const HERO_STAGE_NAME = "name";
export const HERO_STAGE_PORTRAIT = "portrait";
export const HERO_STAGE_COPY = "copy";
export const HERO_STAGE_OUTLETS = "outlets";
/**
 * The closing highlight on the masthead's Book to Speak button.
 *
 * Unlike the four before it this stage marks no element: the CTA is site
 * chrome present on every page, so the hero cannot own it with an attribute.
 * The stylesheet scopes the sweep to the home root instead. The timing still
 * belongs here so the whole sequence reads in one place.
 */
export const HERO_STAGE_CTA = "cta";

export const HERO_ENTRANCE_STAGES = [
  HERO_STAGE_NAME,
  HERO_STAGE_PORTRAIT,
  HERO_STAGE_COPY,
  HERO_STAGE_OUTLETS,
  HERO_STAGE_CTA,
] as const;

/** The stages that mark an element with `HERO_ENTRANCE_ATTRIBUTE`. */
export const HERO_STAGES_ON_ELEMENTS = [
  HERO_STAGE_NAME,
  HERO_STAGE_PORTRAIT,
  HERO_STAGE_COPY,
  HERO_STAGE_OUTLETS,
] as const;

export type HeroEntranceStage = (typeof HERO_ENTRANCE_STAGES)[number];

export type HeroEntranceStep = {
  stage: HeroEntranceStage;
  delayMs: number;
  durationMs: number;
};

/**
 * Each stage overlaps the tail of the one before it by ~100-150ms. Butted
 * end to end the sequence reads as four separate events; overlapped it reads
 * as one movement.
 */
export const HERO_ENTRANCE_TIMELINE: readonly HeroEntranceStep[] = [
  { stage: HERO_STAGE_NAME, delayMs: 150, durationMs: 850 },
  { stage: HERO_STAGE_PORTRAIT, delayMs: 1000, durationMs: 650 },
  { stage: HERO_STAGE_COPY, delayMs: 1550, durationMs: 500 },
  { stage: HERO_STAGE_OUTLETS, delayMs: 1950, durationMs: 500 },
  // Starts as the outlet strip settles, so the eye is handed up to the CTA
  // rather than being pulled to it while something else is still moving.
  // Runs at more than twice the length of an arrival stage: the others are
  // getting content on screen, where quick is a virtue, while this one is
  // asking to be watched and reads as a twitch at that speed.
  { stage: HERO_STAGE_CTA, delayMs: 2450, durationMs: 1200 },
];

/**
 * Nothing a visitor came for may still be arriving after this. Applies to
 * the stages that mark an element — that is, to the page itself.
 */
export const HERO_ARRIVAL_MAX_MS = 2600;

/**
 * The whole sequence, including the closing highlight. That highlight is
 * allowed past the arrival ceiling because it rides on chrome that has been
 * clickable since first paint and holds nothing back — but an entrance that
 * is still going this long stops being an introduction either way.
 */
export const HERO_ENTRANCE_MAX_MS = 4000;

export function parseHeroEntranceStage(value: string): HeroEntranceStage {
  const trimmed = value.trim();
  if (!trimmed) {
    throw new Error("Hero entrance stage is required");
  }
  const match = HERO_ENTRANCE_STAGES.find((stage) => stage === trimmed);
  if (!match) {
    throw new Error(`Hero entrance stage ${trimmed} is not a published stage`);
  }
  return match;
}

export function heroEntranceEndMs(step: HeroEntranceStep): number {
  return step.delayMs + step.durationMs;
}

export function heroEntranceStep(stage: HeroEntranceStage): HeroEntranceStep {
  const match = HERO_ENTRANCE_TIMELINE.find((step) => step.stage === stage);
  if (!match) {
    throw new Error(`Hero entrance stage ${stage} has no timing`);
  }
  return match;
}

export function assertHeroEntranceTimeline(
  steps: readonly HeroEntranceStep[],
): readonly HeroEntranceStep[] {
  if (steps.length === 0) {
    throw new Error("Hero entrance timeline is required");
  }
  if (steps.length !== HERO_ENTRANCE_STAGES.length) {
    throw new Error(
      `Hero entrance timeline must cover all ${HERO_ENTRANCE_STAGES.length} stages`,
    );
  }

  let previousDelayMs = -1;
  steps.forEach((step, index) => {
    if (step.stage !== HERO_ENTRANCE_STAGES[index]) {
      throw new Error(
        `Hero entrance stage ${step.stage} is out of order at position ${index}`,
      );
    }
    if (!Number.isFinite(step.delayMs) || step.delayMs < 0) {
      throw new Error(`Hero entrance delay for ${step.stage} cannot be below 0`);
    }
    if (!Number.isFinite(step.durationMs) || step.durationMs <= 0) {
      throw new Error(
        `Hero entrance duration for ${step.stage} must be above 0`,
      );
    }
    // Equal delays would fire two stages together, which is what the "copy"
    // stage exists to express — it carries the intro and the topics on one
    // attribute rather than two stages racing.
    if (step.delayMs <= previousDelayMs) {
      throw new Error(
        `Hero entrance stage ${step.stage} must start after ${
          HERO_ENTRANCE_STAGES[index - 1]
        }`,
      );
    }
    previousDelayMs = step.delayMs;
  });

  const onElements: readonly string[] = HERO_STAGES_ON_ELEMENTS;
  const arrivalMs = Math.max(
    ...steps
      .filter((step) => onElements.includes(step.stage))
      .map(heroEntranceEndMs),
  );
  if (arrivalMs > HERO_ARRIVAL_MAX_MS) {
    throw new Error(
      `Hero content cannot still be arriving after ${HERO_ARRIVAL_MAX_MS}ms`,
    );
  }

  const totalMs = Math.max(...steps.map(heroEntranceEndMs));
  if (totalMs > HERO_ENTRANCE_MAX_MS) {
    throw new Error(
      `Hero entrance cannot run longer than ${HERO_ENTRANCE_MAX_MS}ms`,
    );
  }

  return steps;
}
