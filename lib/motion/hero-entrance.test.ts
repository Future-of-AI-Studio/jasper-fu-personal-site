import { describe, expect, it } from "vitest";

import {
  assertHeroEntranceTimeline,
  HERO_ARRIVAL_MAX_MS,
  HERO_ENTRANCE_ATTRIBUTE,
  HERO_ENTRANCE_MAX_MS,
  HERO_ENTRANCE_STAGES,
  HERO_ENTRANCE_TIMELINE,
  HERO_STAGE_COPY,
  HERO_STAGE_CTA,
  HERO_STAGE_NAME,
  HERO_STAGE_OUTLETS,
  HERO_STAGE_PORTRAIT,
  HERO_STAGES_ON_ELEMENTS,
  heroEntranceEndMs,
  heroEntranceStep,
  parseHeroEntranceStage,
  type HeroEntranceStep,
} from "./hero-entrance";

/** The published timeline, as a mutable copy one field can be changed on. */
function timelineDraft(): HeroEntranceStep[] {
  return HERO_ENTRANCE_TIMELINE.map((step) => ({ ...step }));
}

function withStep(index: number, patch: Partial<HeroEntranceStep>) {
  const draft = timelineDraft();
  draft[index] = { ...draft[index]!, ...patch };
  return draft;
}

function verifySequenceRunsForward(steps: readonly HeroEntranceStep[]) {
  steps.forEach((step, index) => {
    expect(step.stage).toBe(HERO_ENTRANCE_STAGES[index]);
    expect(step.delayMs).toBeGreaterThanOrEqual(0);
    expect(step.durationMs).toBeGreaterThan(0);
    if (index > 0) {
      expect(step.delayMs).toBeGreaterThan(steps[index - 1]!.delayMs);
    }
  });
}

describe("hero entrance stages", () => {
  it("publishes the five stages in the order they play", () => {
    expect(HERO_ENTRANCE_STAGES).toEqual([
      HERO_STAGE_NAME,
      HERO_STAGE_PORTRAIT,
      HERO_STAGE_COPY,
      HERO_STAGE_OUTLETS,
      HERO_STAGE_CTA,
    ]);
    expect(HERO_ENTRANCE_ATTRIBUTE).toBe("data-hero-stage");
  });

  it("keeps the CTA stage off the attribute list it cannot mark", () => {
    // The masthead CTA is chrome on every page, so the stylesheet scopes its
    // highlight to the home root rather than the hero marking an element.
    expect(HERO_STAGES_ON_ELEMENTS).not.toContain(HERO_STAGE_CTA);
    expect(HERO_STAGES_ON_ELEMENTS).toHaveLength(
      HERO_ENTRANCE_STAGES.length - 1,
    );
    HERO_STAGES_ON_ELEMENTS.forEach((stage) => {
      expect(HERO_ENTRANCE_STAGES).toContain(stage);
    });
    // It is still a real stage: it parses, and it carries timing.
    expect(parseHeroEntranceStage(HERO_STAGE_CTA)).toBe(HERO_STAGE_CTA);
    expect(heroEntranceStep(HERO_STAGE_CTA).delayMs).toBe(2450);
  });

  it("starts the CTA highlight as the outlet strip finishes", () => {
    expect(heroEntranceStep(HERO_STAGE_CTA).delayMs).toBe(
      heroEntranceEndMs(heroEntranceStep(HERO_STAGE_OUTLETS)),
    );
  });

  it("parses a published stage name", () => {
    HERO_ENTRANCE_STAGES.forEach((stage) => {
      expect(parseHeroEntranceStage(stage)).toBe(stage);
    });
    expect(parseHeroEntranceStage("  portrait  ")).toBe(HERO_STAGE_PORTRAIT);
  });

  it("rejects an empty stage name", () => {
    expect(() => parseHeroEntranceStage("   ")).toThrow(
      "Hero entrance stage is required",
    );
  });

  it("rejects a stage name that is not published", () => {
    expect(() => parseHeroEntranceStage("headline")).toThrow(
      "Hero entrance stage headline is not a published stage",
    );
  });

  it("returns the timing for each published stage", () => {
    expect(heroEntranceStep(HERO_STAGE_NAME).delayMs).toBe(150);
    expect(heroEntranceStep(HERO_STAGE_OUTLETS).delayMs).toBe(1950);
    expect(heroEntranceEndMs(heroEntranceStep(HERO_STAGE_NAME))).toBe(1000);
  });
});

describe("assertHeroEntranceTimeline", () => {
  it("accepts the published timeline", () => {
    const steps = assertHeroEntranceTimeline(HERO_ENTRANCE_TIMELINE);
    verifySequenceRunsForward(steps);
  });

  it("rejects an empty timeline", () => {
    expect(() => assertHeroEntranceTimeline([])).toThrow(
      "Hero entrance timeline is required",
    );
  });

  it("rejects a timeline that drops a stage", () => {
    expect(() =>
      assertHeroEntranceTimeline(HERO_ENTRANCE_TIMELINE.slice(0, -1)),
    ).toThrow(
      `Hero entrance timeline must cover all ${HERO_ENTRANCE_STAGES.length} stages`,
    );
  });

  it("rejects a timeline whose stages run out of order", () => {
    const draft = timelineDraft();
    const [first, second] = [draft[0]!, draft[1]!];
    expect(() =>
      assertHeroEntranceTimeline([
        { ...second, delayMs: first.delayMs },
        { ...first, delayMs: second.delayMs },
        ...draft.slice(2),
      ]),
    ).toThrow("Hero entrance stage portrait is out of order at position 0");
  });

  it("rejects a negative delay", () => {
    expect(() =>
      assertHeroEntranceTimeline(withStep(0, { delayMs: -1 })),
    ).toThrow("Hero entrance delay for name cannot be below 0");
  });

  it("rejects a duration of zero", () => {
    expect(() =>
      assertHeroEntranceTimeline(withStep(0, { durationMs: 0 })),
    ).toThrow("Hero entrance duration for name must be above 0");
  });

  it("rejects a stage that does not start after the one before it", () => {
    expect(() =>
      assertHeroEntranceTimeline(withStep(1, { delayMs: 150 })),
    ).toThrow("Hero entrance stage portrait must start after name");
  });

  it("rejects an entrance that runs past the ceiling", () => {
    const last = HERO_ENTRANCE_STAGES.length - 1;
    expect(() =>
      assertHeroEntranceTimeline(
        withStep(last, { delayMs: HERO_ENTRANCE_MAX_MS, durationMs: 1 }),
      ),
    ).toThrow(`Hero entrance cannot run longer than ${HERO_ENTRANCE_MAX_MS}ms`);
  });

  it("rejects content still arriving past the arrival ceiling", () => {
    // Stretching the outlet strip, not moving it, so the stage order stays
    // valid and the arrival ceiling is the only thing that can fire.
    const outlets = HERO_ENTRANCE_STAGES.indexOf(HERO_STAGE_OUTLETS);
    const overrun = HERO_ARRIVAL_MAX_MS - 1950 + 1;
    expect(() =>
      assertHeroEntranceTimeline(withStep(outlets, { durationMs: overrun })),
    ).toThrow(
      `Hero content cannot still be arriving after ${HERO_ARRIVAL_MAX_MS}ms`,
    );
  });

  it("lets the closing highlight run past the arrival ceiling", () => {
    // The CTA is chrome, clickable from first paint, so it is measured
    // against the entrance ceiling rather than the arrival one.
    const cta = heroEntranceStep(HERO_STAGE_CTA);
    expect(heroEntranceEndMs(cta)).toBeGreaterThan(HERO_ARRIVAL_MAX_MS);
    expect(heroEntranceEndMs(cta)).toBeLessThanOrEqual(HERO_ENTRANCE_MAX_MS);
  });

  it("holds at both ceiling boundaries", () => {
    const last = HERO_ENTRANCE_STAGES.length - 1;
    const outlets = HERO_ENTRANCE_STAGES.indexOf(HERO_STAGE_OUTLETS);

    expect(
      assertHeroEntranceTimeline(
        withStep(last, { delayMs: HERO_ENTRANCE_MAX_MS - 1, durationMs: 1 }),
      ),
    ).toHaveLength(HERO_ENTRANCE_STAGES.length);
    expect(
      assertHeroEntranceTimeline(
        withStep(outlets, { durationMs: HERO_ARRIVAL_MAX_MS - 1950 }),
      ),
    ).toHaveLength(HERO_ENTRANCE_STAGES.length);

    // Published: content is all in by 2450ms, the sweep closes out at 3650ms.
    const arrival = HERO_ENTRANCE_TIMELINE.filter((step) =>
      (HERO_STAGES_ON_ELEMENTS as readonly string[]).includes(step.stage),
    );
    expect(Math.max(...arrival.map(heroEntranceEndMs))).toBe(2450);
    expect(Math.max(...HERO_ENTRANCE_TIMELINE.map(heroEntranceEndMs))).toBe(
      3650,
    );
  });

  it("puts the hero's own CTA up long before the entrance ends", () => {
    // "Book to Speak" is in the copy stage. The closing highlight lands on
    // the masthead button, and neither one gates a click on the other.
    expect(heroEntranceEndMs(heroEntranceStep(HERO_STAGE_COPY))).toBeLessThan(
      heroEntranceStep(HERO_STAGE_CTA).delayMs,
    );
    expect(heroEntranceEndMs(heroEntranceStep(HERO_STAGE_CTA))).toBeLessThan(
      HERO_ENTRANCE_MAX_MS,
    );
  });
});
