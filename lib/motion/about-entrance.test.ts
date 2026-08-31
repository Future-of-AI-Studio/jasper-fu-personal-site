import { describe, expect, it } from "vitest";

import { quickFacts } from "../copy";
import { HERO_ENTRANCE_TIMELINE, heroEntranceEndMs } from "./hero-entrance";
import {
  ABOUT_ENTRANCE_ATTRIBUTE,
  ABOUT_ENTRANCE_MAX_MS,
  ABOUT_ENTRANCE_STAGES,
  ABOUT_ENTRANCE_TIMELINE,
  ABOUT_STAGE_DECK,
  ABOUT_STAGE_FRAME,
  ABOUT_STAGE_HEADLINE,
  ABOUT_STAGE_IDENTITY,
  ABOUT_STAGE_STATS,
  ABOUT_STAT_COUNT,
  ABOUT_STAT_STAGGER_MS,
  aboutEntranceEndMs,
  aboutEntranceStep,
  aboutEntranceTotalMs,
  aboutStatDelayMs,
  assertAboutEntranceTimeline,
  parseAboutEntranceStage,
  type AboutEntranceStep,
} from "./about-entrance";

function timelineDraft(): AboutEntranceStep[] {
  return ABOUT_ENTRANCE_TIMELINE.map((step) => ({ ...step }));
}

function withStep(index: number, patch: Partial<AboutEntranceStep>) {
  const draft = timelineDraft();
  draft[index] = { ...draft[index]!, ...patch };
  return draft;
}

function verifySequenceRunsForward(steps: readonly AboutEntranceStep[]) {
  steps.forEach((step, index) => {
    expect(step.stage).toBe(ABOUT_ENTRANCE_STAGES[index]);
    expect(step.delayMs).toBeGreaterThanOrEqual(0);
    expect(step.durationMs).toBeGreaterThan(0);
    if (index > 0) {
      expect(step.delayMs).toBeGreaterThan(steps[index - 1]!.delayMs);
    }
  });
}

describe("about entrance stages", () => {
  it("publishes the five stages in the order they play", () => {
    expect(ABOUT_ENTRANCE_STAGES).toEqual([
      ABOUT_STAGE_HEADLINE,
      ABOUT_STAGE_DECK,
      ABOUT_STAGE_FRAME,
      ABOUT_STAGE_IDENTITY,
      ABOUT_STAGE_STATS,
    ]);
    verifySequenceRunsForward(ABOUT_ENTRANCE_TIMELINE);
  });

  it("keeps its own attribute so the hero's rules cannot reach it", () => {
    // The hero's stage rules are unscoped; sharing the attribute would pull
    // the home page's animations onto the About page wholesale.
    expect(ABOUT_ENTRANCE_ATTRIBUTE).toBe("data-about-stage");
    expect(ABOUT_ENTRANCE_ATTRIBUTE).not.toBe("data-hero-stage");
  });

  it("parses a published stage name", () => {
    ABOUT_ENTRANCE_STAGES.forEach((stage) => {
      expect(parseAboutEntranceStage(stage)).toBe(stage);
    });
    expect(parseAboutEntranceStage("  frame  ")).toBe(ABOUT_STAGE_FRAME);
  });

  it("rejects an empty stage name", () => {
    expect(() => parseAboutEntranceStage("   ")).toThrow(
      "About entrance stage is required",
    );
  });

  it("rejects a stage name that is not published", () => {
    // The hero's stages are a different sequence and must not cross over.
    expect(() => parseAboutEntranceStage("portrait")).toThrow(
      "About entrance stage portrait is not a published stage",
    );
  });

  it("rejects a stage that carries no timing", () => {
    expect(() =>
      aboutEntranceStep("outlets" as never),
    ).toThrow("About entrance stage outlets has no timing");
  });
});

describe("about stat stagger", () => {
  it("steps each chip one stagger past the last", () => {
    const base = aboutEntranceStep(ABOUT_STAGE_STATS).delayMs;
    expect(aboutStatDelayMs(0)).toBe(base);
    expect(aboutStatDelayMs(1)).toBe(base + ABOUT_STAT_STAGGER_MS);
    expect(aboutStatDelayMs(2)).toBe(base + 2 * ABOUT_STAT_STAGGER_MS);
  });

  it("covers every chip the page actually renders", () => {
    // The CSS staggers by :nth-child, so the count has to match the content.
    expect(ABOUT_STAT_COUNT).toBe(quickFacts.length);
  });

  it("rejects a chip index below the first", () => {
    expect(() => aboutStatDelayMs(-1)).toThrow(
      "About stat index cannot be below 0",
    );
  });

  it("rejects a chip index past the last", () => {
    expect(() => aboutStatDelayMs(ABOUT_STAT_COUNT)).toThrow(
      `About stat index cannot be above ${ABOUT_STAT_COUNT - 1}`,
    );
  });

  it("rejects a fractional chip index", () => {
    expect(() => aboutStatDelayMs(1.5)).toThrow(
      "About stat index cannot be below 0",
    );
  });

  it("holds at the chip boundaries", () => {
    expect(aboutStatDelayMs(0)).toBe(760);
    expect(aboutStatDelayMs(ABOUT_STAT_COUNT - 1)).toBe(900);
  });
});

describe("assertAboutEntranceTimeline", () => {
  it("accepts the published timeline", () => {
    expect(assertAboutEntranceTimeline(ABOUT_ENTRANCE_TIMELINE)).toHaveLength(
      ABOUT_ENTRANCE_STAGES.length,
    );
  });

  it("rejects an empty timeline", () => {
    expect(() => assertAboutEntranceTimeline([])).toThrow(
      "About entrance timeline is required",
    );
  });

  it("rejects a timeline that drops a stage", () => {
    expect(() =>
      assertAboutEntranceTimeline(ABOUT_ENTRANCE_TIMELINE.slice(0, -1)),
    ).toThrow(
      `About entrance timeline must cover all ${ABOUT_ENTRANCE_STAGES.length} stages`,
    );
  });

  it("rejects a timeline whose stages run out of order", () => {
    const draft = timelineDraft();
    const [first, second] = [draft[0]!, draft[1]!];
    expect(() =>
      assertAboutEntranceTimeline([
        { ...second, delayMs: first.delayMs },
        { ...first, delayMs: second.delayMs },
        ...draft.slice(2),
      ]),
    ).toThrow("About entrance stage deck is out of order at position 0");
  });

  it("rejects a negative delay", () => {
    expect(() =>
      assertAboutEntranceTimeline(withStep(0, { delayMs: -1 })),
    ).toThrow("About entrance delay for headline cannot be below 0");
  });

  it("rejects a duration of zero", () => {
    expect(() =>
      assertAboutEntranceTimeline(withStep(0, { durationMs: 0 })),
    ).toThrow("About entrance duration for headline must be above 0");
  });

  it("rejects a stage that does not start after the one before it", () => {
    expect(() =>
      assertAboutEntranceTimeline(withStep(1, { delayMs: 60 })),
    ).toThrow("About entrance stage deck must start after headline");
  });

  it("rejects an entrance that runs past the ceiling", () => {
    const last = ABOUT_ENTRANCE_STAGES.length - 1;
    expect(() =>
      assertAboutEntranceTimeline(
        withStep(last, { delayMs: ABOUT_ENTRANCE_MAX_MS, durationMs: 1 }),
      ),
    ).toThrow(`About entrance cannot run longer than ${ABOUT_ENTRANCE_MAX_MS}ms`);
  });

  it("counts the staggered chips against the ceiling, not just the stage", () => {
    // The stats stage ends at delay + duration, but the last chip runs two
    // staggers later. A ceiling that ignored the stagger would let the real
    // end of the sequence drift past it unnoticed.
    const last = ABOUT_ENTRANCE_STAGES.length - 1;
    const stagger = (ABOUT_STAT_COUNT - 1) * ABOUT_STAT_STAGGER_MS;
    const justInside = withStep(last, {
      delayMs: ABOUT_ENTRANCE_MAX_MS - stagger - 10,
      durationMs: 10,
    });
    const justOver = withStep(last, {
      delayMs: ABOUT_ENTRANCE_MAX_MS - stagger - 10,
      durationMs: 11,
    });

    expect(assertAboutEntranceTimeline(justInside)).toHaveLength(
      ABOUT_ENTRANCE_STAGES.length,
    );
    expect(() => assertAboutEntranceTimeline(justOver)).toThrow(
      `About entrance cannot run longer than ${ABOUT_ENTRANCE_MAX_MS}ms`,
    );
  });

  it("finishes well under half the home hero", () => {
    // About is a reference page a journalist may revisit; a showpiece
    // entrance wears out on repeat visits in a way the front door does not.
    const heroTotal = Math.max(...HERO_ENTRANCE_TIMELINE.map(heroEntranceEndMs));
    expect(aboutEntranceTotalMs()).toBe(1240);
    expect(aboutEntranceTotalMs()).toBeLessThan(heroTotal / 2);
    expect(aboutEntranceTotalMs()).toBeLessThanOrEqual(ABOUT_ENTRANCE_MAX_MS);
    // Opens on the headline now that the page-name eyebrow is retired.
    expect(aboutEntranceEndMs(aboutEntranceStep(ABOUT_STAGE_HEADLINE))).toBe(
      510,
    );
    expect(() => parseAboutEntranceStage("eyebrow")).toThrow(
      "About entrance stage eyebrow is not a published stage",
    );
  });
});
