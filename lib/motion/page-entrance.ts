/**
 * The press pages' first-paint sequence.
 *
 * Same vocabulary and the same opening beats as the About entrance: fade up,
 * headline first, deck behind it, then the content it introduces. The stages
 * differ because the pages do — /press drops into a grid of article cards
 * and /press/media-coverage into a featured interview, where About has a
 * showcase photo with an overlay to bring in.
 *
 * It also plays on every tab change, not just on load, because the panel in
 * components/press/press-tabs.tsx is keyed on the active tab and so replaces
 * its contents. The stagger is what a tab change looks like.
 */

export const PAGE_ENTRANCE_ATTRIBUTE = "data-page-stage";

export const PAGE_STAGE_HEADLINE = "headline";
export const PAGE_STAGE_DECK = "deck";
export const PAGE_STAGE_CONTENT = "content";

export const PAGE_ENTRANCE_STAGES = [
  PAGE_STAGE_HEADLINE,
  PAGE_STAGE_DECK,
  PAGE_STAGE_CONTENT,
] as const;

export type PageEntranceStage = (typeof PAGE_ENTRANCE_STAGES)[number];

export type PageEntranceStep = {
  stage: PageEntranceStage;
  delayMs: number;
  durationMs: number;
};

/** The About entrance's first three beats, unchanged. */
export const PAGE_ENTRANCE_TIMELINE: readonly PageEntranceStep[] = [
  { stage: PAGE_STAGE_HEADLINE, delayMs: 60, durationMs: 450 },
  { stage: PAGE_STAGE_DECK, delayMs: 180, durationMs: 450 },
  { stage: PAGE_STAGE_CONTENT, delayMs: 300, durationMs: 450 },
];

/** Gap between article cards inside the content stage. */
export const PAGE_CARD_STAGGER_MS = 70;

/** How many cards the staggered CSS covers; /press publishes three posts. */
export const PAGE_CARD_COUNT = 3;

/**
 * A tab is something a reader clicks and expects to have changed. Past this
 * the entrance stops introducing the page and starts delaying it.
 */
export const PAGE_ENTRANCE_MAX_MS = 1600;

export function parsePageEntranceStage(value: string): PageEntranceStage {
  const trimmed = value.trim();
  if (!trimmed) {
    throw new Error("Page entrance stage is required");
  }
  const match = PAGE_ENTRANCE_STAGES.find((stage) => stage === trimmed);
  if (!match) {
    throw new Error(`Page entrance stage ${trimmed} is not a published stage`);
  }
  return match;
}

export function pageEntranceEndMs(step: PageEntranceStep): number {
  return step.delayMs + step.durationMs;
}

export function pageEntranceStep(stage: PageEntranceStage): PageEntranceStep {
  const match = PAGE_ENTRANCE_TIMELINE.find((step) => step.stage === stage);
  if (!match) {
    throw new Error(`Page entrance stage ${stage} has no timing`);
  }
  return match;
}

/** Delay for the nth article card, counting from 0. */
export function pageCardDelayMs(index: number): number {
  if (!Number.isInteger(index) || index < 0) {
    throw new Error("Page card index cannot be below 0");
  }
  if (index >= PAGE_CARD_COUNT) {
    throw new Error(`Page card index cannot be above ${PAGE_CARD_COUNT - 1}`);
  }
  return (
    pageEntranceStep(PAGE_STAGE_CONTENT).delayMs +
    index * PAGE_CARD_STAGGER_MS
  );
}

/** The last thing to move, cards included. */
export function pageEntranceTotalMs(): number {
  const content = pageEntranceStep(PAGE_STAGE_CONTENT);
  return Math.max(
    pageCardDelayMs(PAGE_CARD_COUNT - 1) + content.durationMs,
    ...PAGE_ENTRANCE_TIMELINE.map(pageEntranceEndMs),
  );
}

export function assertPageEntranceTimeline(
  steps: readonly PageEntranceStep[],
): readonly PageEntranceStep[] {
  if (steps.length === 0) {
    throw new Error("Page entrance timeline is required");
  }
  if (steps.length !== PAGE_ENTRANCE_STAGES.length) {
    throw new Error(
      `Page entrance timeline must cover all ${PAGE_ENTRANCE_STAGES.length} stages`,
    );
  }

  let previousDelayMs = -1;
  steps.forEach((step, index) => {
    if (step.stage !== PAGE_ENTRANCE_STAGES[index]) {
      throw new Error(
        `Page entrance stage ${step.stage} is out of order at position ${index}`,
      );
    }
    if (!Number.isFinite(step.delayMs) || step.delayMs < 0) {
      throw new Error(`Page entrance delay for ${step.stage} cannot be below 0`);
    }
    if (!Number.isFinite(step.durationMs) || step.durationMs <= 0) {
      throw new Error(
        `Page entrance duration for ${step.stage} must be above 0`,
      );
    }
    if (step.delayMs <= previousDelayMs) {
      throw new Error(
        `Page entrance stage ${step.stage} must start after ${
          PAGE_ENTRANCE_STAGES[index - 1]
        }`,
      );
    }
    previousDelayMs = step.delayMs;
  });

  const content = steps[steps.length - 1]!;
  const totalMs = Math.max(
    content.delayMs +
      (PAGE_CARD_COUNT - 1) * PAGE_CARD_STAGGER_MS +
      content.durationMs,
    ...steps.map(pageEntranceEndMs),
  );
  if (totalMs > PAGE_ENTRANCE_MAX_MS) {
    throw new Error(
      `Page entrance cannot run longer than ${PAGE_ENTRANCE_MAX_MS}ms`,
    );
  }

  return steps;
}
