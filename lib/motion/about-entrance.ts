/**
 * The About page's first-paint sequence.
 *
 * The animation itself is pure CSS in app/globals.css — this module is the
 * single source of the stage names and their timing, and
 * lib/identity-css.test.ts reads the stylesheet back to hold the two in step.
 *
 * Order: the one-liner and its deck arrive in turn, the showcase fades in
 * while the photo inside it settles out of a slight zoom, and the name and
 * stat chips ride up over the settled image.
 *
 * There was an "eyebrow" stage ahead of the headline, for a label reading
 * "About" above the one-liner. That label was retired along with the other
 * page-name eyebrows, so the sequence now opens on the headline and the
 * whole thing starts sooner.
 *
 * Deliberately its own attribute rather than the hero's: the hero's stage
 * rules are unscoped, so sharing `data-hero-stage` here would inherit the
 * home page's animations wholesale.
 */

export const ABOUT_ENTRANCE_ATTRIBUTE = "data-about-stage";

export const ABOUT_STAGE_HEADLINE = "headline";
export const ABOUT_STAGE_DECK = "deck";
export const ABOUT_STAGE_FRAME = "frame";
export const ABOUT_STAGE_IDENTITY = "identity";
export const ABOUT_STAGE_STATS = "stats";

export const ABOUT_ENTRANCE_STAGES = [
  ABOUT_STAGE_HEADLINE,
  ABOUT_STAGE_DECK,
  ABOUT_STAGE_FRAME,
  ABOUT_STAGE_IDENTITY,
  ABOUT_STAGE_STATS,
] as const;

export type AboutEntranceStage = (typeof ABOUT_ENTRANCE_STAGES)[number];

export type AboutEntranceStep = {
  stage: AboutEntranceStage;
  delayMs: number;
  durationMs: number;
};

/**
 * Each stage overlaps the one before it. Butted end to end at this tempo the
 * sequence reads as six separate events rather than one movement.
 */
export const ABOUT_ENTRANCE_TIMELINE: readonly AboutEntranceStep[] = [
  { stage: ABOUT_STAGE_HEADLINE, delayMs: 60, durationMs: 450 },
  { stage: ABOUT_STAGE_DECK, delayMs: 180, durationMs: 450 },
  { stage: ABOUT_STAGE_FRAME, delayMs: 300, durationMs: 620 },
  { stage: ABOUT_STAGE_IDENTITY, delayMs: 680, durationMs: 380 },
  { stage: ABOUT_STAGE_STATS, delayMs: 760, durationMs: 340 },
];

/** Gap between consecutive stat chips within the `stats` stage. */
export const ABOUT_STAT_STAGGER_MS = 70;

/** How many chips the staggered CSS covers; quickFacts publishes three. */
export const ABOUT_STAT_COUNT = 3;

/**
 * About is a reference page a journalist may come back to repeatedly, so its
 * entrance runs well under half the home hero's. Past this it stops being an
 * introduction and starts being something to sit through on every visit.
 */
export const ABOUT_ENTRANCE_MAX_MS = 1600;

export function parseAboutEntranceStage(value: string): AboutEntranceStage {
  const trimmed = value.trim();
  if (!trimmed) {
    throw new Error("About entrance stage is required");
  }
  const match = ABOUT_ENTRANCE_STAGES.find((stage) => stage === trimmed);
  if (!match) {
    throw new Error(`About entrance stage ${trimmed} is not a published stage`);
  }
  return match;
}

export function aboutEntranceEndMs(step: AboutEntranceStep): number {
  return step.delayMs + step.durationMs;
}

export function aboutEntranceStep(
  stage: AboutEntranceStage,
): AboutEntranceStep {
  const match = ABOUT_ENTRANCE_TIMELINE.find((step) => step.stage === stage);
  if (!match) {
    throw new Error(`About entrance stage ${stage} has no timing`);
  }
  return match;
}

/** Delay for the nth stat chip, counting from 0. */
export function aboutStatDelayMs(index: number): number {
  if (!Number.isInteger(index) || index < 0) {
    throw new Error("About stat index cannot be below 0");
  }
  if (index >= ABOUT_STAT_COUNT) {
    throw new Error(
      `About stat index cannot be above ${ABOUT_STAT_COUNT - 1}`,
    );
  }
  return (
    aboutEntranceStep(ABOUT_STAGE_STATS).delayMs + index * ABOUT_STAT_STAGGER_MS
  );
}

/** The last thing to move, chips included. */
export function aboutEntranceTotalMs(): number {
  const stats = aboutEntranceStep(ABOUT_STAGE_STATS);
  const lastChip =
    aboutStatDelayMs(ABOUT_STAT_COUNT - 1) + stats.durationMs;
  return Math.max(
    lastChip,
    ...ABOUT_ENTRANCE_TIMELINE.map(aboutEntranceEndMs),
  );
}

export function assertAboutEntranceTimeline(
  steps: readonly AboutEntranceStep[],
): readonly AboutEntranceStep[] {
  if (steps.length === 0) {
    throw new Error("About entrance timeline is required");
  }
  if (steps.length !== ABOUT_ENTRANCE_STAGES.length) {
    throw new Error(
      `About entrance timeline must cover all ${ABOUT_ENTRANCE_STAGES.length} stages`,
    );
  }

  let previousDelayMs = -1;
  steps.forEach((step, index) => {
    if (step.stage !== ABOUT_ENTRANCE_STAGES[index]) {
      throw new Error(
        `About entrance stage ${step.stage} is out of order at position ${index}`,
      );
    }
    if (!Number.isFinite(step.delayMs) || step.delayMs < 0) {
      throw new Error(
        `About entrance delay for ${step.stage} cannot be below 0`,
      );
    }
    if (!Number.isFinite(step.durationMs) || step.durationMs <= 0) {
      throw new Error(
        `About entrance duration for ${step.stage} must be above 0`,
      );
    }
    if (step.delayMs <= previousDelayMs) {
      throw new Error(
        `About entrance stage ${step.stage} must start after ${
          ABOUT_ENTRANCE_STAGES[index - 1]
        }`,
      );
    }
    previousDelayMs = step.delayMs;
  });

  const stats = steps[steps.length - 1]!;
  const totalMs = Math.max(
    stats.delayMs + (ABOUT_STAT_COUNT - 1) * ABOUT_STAT_STAGGER_MS +
      stats.durationMs,
    ...steps.map(aboutEntranceEndMs),
  );
  if (totalMs > ABOUT_ENTRANCE_MAX_MS) {
    throw new Error(
      `About entrance cannot run longer than ${ABOUT_ENTRANCE_MAX_MS}ms`,
    );
  }

  return steps;
}
