import { describe, expect, it } from "vitest";

import { interimBlogPosts } from "../copy";
import {
  aboutEntranceStep,
  ABOUT_STAGE_DECK,
  ABOUT_STAGE_HEADLINE,
} from "./about-entrance";
import {
  assertPageEntranceTimeline,
  PAGE_CARD_COUNT,
  PAGE_CARD_STAGGER_MS,
  PAGE_ENTRANCE_ATTRIBUTE,
  PAGE_ENTRANCE_MAX_MS,
  PAGE_ENTRANCE_STAGES,
  PAGE_ENTRANCE_TIMELINE,
  PAGE_STAGE_CONTENT,
  PAGE_STAGE_DECK,
  PAGE_STAGE_HEADLINE,
  parsePageEntranceStage,
  pageCardDelayMs,
  pageEntranceEndMs,
  pageEntranceStep,
  pageEntranceTotalMs,
  type PageEntranceStep,
} from "./page-entrance";

function timelineDraft(): PageEntranceStep[] {
  return PAGE_ENTRANCE_TIMELINE.map((step) => ({ ...step }));
}

function withStep(index: number, patch: Partial<PageEntranceStep>) {
  const draft = timelineDraft();
  draft[index] = { ...draft[index]!, ...patch };
  return draft;
}

describe("press entrance stages", () => {
  it("publishes the three stages in the order they play", () => {
    expect(PAGE_ENTRANCE_STAGES).toEqual([
      PAGE_STAGE_HEADLINE,
      PAGE_STAGE_DECK,
      PAGE_STAGE_CONTENT,
    ]);
    expect(assertPageEntranceTimeline(PAGE_ENTRANCE_TIMELINE)).toHaveLength(3);
  });

  it("opens on the About entrance's own beats", () => {
    // The ask was the same animation, so this is asserted as an equality
    // against About rather than as its own literals, which could drift.
    expect(pageEntranceStep(PAGE_STAGE_HEADLINE)).toEqual({
      ...aboutEntranceStep(ABOUT_STAGE_HEADLINE),
      stage: PAGE_STAGE_HEADLINE,
    });
    expect(pageEntranceStep(PAGE_STAGE_DECK)).toEqual({
      ...aboutEntranceStep(ABOUT_STAGE_DECK),
      stage: PAGE_STAGE_DECK,
    });
  });

  it("keeps its own attribute so the other entrances cannot reach it", () => {
    expect(PAGE_ENTRANCE_ATTRIBUTE).toBe("data-page-stage");
    expect(PAGE_ENTRANCE_ATTRIBUTE).not.toBe("data-about-stage");
    expect(PAGE_ENTRANCE_ATTRIBUTE).not.toBe("data-hero-stage");
  });

  it("parses a published stage name", () => {
    PAGE_ENTRANCE_STAGES.forEach((stage) => {
      expect(parsePageEntranceStage(stage)).toBe(stage);
    });
    expect(parsePageEntranceStage("  content  ")).toBe(PAGE_STAGE_CONTENT);
  });

  it("rejects an empty stage name", () => {
    expect(() => parsePageEntranceStage("  ")).toThrow(
      "Page entrance stage is required",
    );
  });

  it("rejects a stage from another page's sequence", () => {
    expect(() => parsePageEntranceStage("portrait")).toThrow(
      "Page entrance stage portrait is not a published stage",
    );
  });

  it("rejects a stage that carries no timing", () => {
    expect(() => pageEntranceStep("frame" as never)).toThrow(
      "Page entrance stage frame has no timing",
    );
  });
});

describe("press card stagger", () => {
  it("steps each card one stagger past the last", () => {
    const base = pageEntranceStep(PAGE_STAGE_CONTENT).delayMs;
    expect(pageCardDelayMs(0)).toBe(base);
    expect(pageCardDelayMs(1)).toBe(base + PAGE_CARD_STAGGER_MS);
    expect(pageCardDelayMs(2)).toBe(base + 2 * PAGE_CARD_STAGGER_MS);
  });

  it("covers every card the page actually renders", () => {
    // The CSS staggers by :nth-child, so the count has to match the content.
    expect(PAGE_CARD_COUNT).toBe(interimBlogPosts.length);
  });

  it("rejects a card index below the first", () => {
    expect(() => pageCardDelayMs(-1)).toThrow(
      "Page card index cannot be below 0",
    );
  });

  it("rejects a card index past the last", () => {
    expect(() => pageCardDelayMs(PAGE_CARD_COUNT)).toThrow(
      `Page card index cannot be above ${PAGE_CARD_COUNT - 1}`,
    );
  });

  it("rejects a fractional card index", () => {
    expect(() => pageCardDelayMs(1.5)).toThrow(
      "Page card index cannot be below 0",
    );
  });

  it("holds at the card boundaries", () => {
    expect(pageCardDelayMs(0)).toBe(300);
    expect(pageCardDelayMs(PAGE_CARD_COUNT - 1)).toBe(440);
  });
});

describe("assertPageEntranceTimeline", () => {
  it("rejects an empty timeline", () => {
    expect(() => assertPageEntranceTimeline([])).toThrow(
      "Page entrance timeline is required",
    );
  });

  it("rejects a timeline that drops a stage", () => {
    expect(() =>
      assertPageEntranceTimeline(PAGE_ENTRANCE_TIMELINE.slice(0, -1)),
    ).toThrow(
      `Page entrance timeline must cover all ${PAGE_ENTRANCE_STAGES.length} stages`,
    );
  });

  it("rejects a timeline whose stages run out of order", () => {
    const draft = timelineDraft();
    const [first, second] = [draft[0]!, draft[1]!];
    expect(() =>
      assertPageEntranceTimeline([
        { ...second, delayMs: first.delayMs },
        { ...first, delayMs: second.delayMs },
        ...draft.slice(2),
      ]),
    ).toThrow("Page entrance stage deck is out of order at position 0");
  });

  it("rejects a negative delay", () => {
    expect(() => assertPageEntranceTimeline(withStep(0, { delayMs: -1 }))).toThrow(
      "Page entrance delay for headline cannot be below 0",
    );
  });

  it("rejects a duration of zero", () => {
    expect(() =>
      assertPageEntranceTimeline(withStep(0, { durationMs: 0 })),
    ).toThrow("Page entrance duration for headline must be above 0");
  });

  it("rejects a stage that does not start after the one before it", () => {
    expect(() => assertPageEntranceTimeline(withStep(1, { delayMs: 60 }))).toThrow(
      "Page entrance stage deck must start after headline",
    );
  });

  it("counts the staggered cards against the ceiling, not just the stage", () => {
    // The content stage ends at delay + duration, but the last card runs two
    // staggers later. A ceiling ignoring the stagger would let the real end
    // of the sequence drift past it unnoticed.
    const stagger = (PAGE_CARD_COUNT - 1) * PAGE_CARD_STAGGER_MS;
    const justInside = withStep(2, {
      delayMs: PAGE_ENTRANCE_MAX_MS - stagger - 10,
      durationMs: 10,
    });
    const justOver = withStep(2, {
      delayMs: PAGE_ENTRANCE_MAX_MS - stagger - 10,
      durationMs: 11,
    });

    expect(assertPageEntranceTimeline(justInside)).toHaveLength(3);
    expect(() => assertPageEntranceTimeline(justOver)).toThrow(
      `Page entrance cannot run longer than ${PAGE_ENTRANCE_MAX_MS}ms`,
    );
  });

  it("finishes fast enough for something a reader just clicked", () => {
    expect(pageEntranceTotalMs()).toBe(890);
    expect(pageEntranceTotalMs()).toBeLessThan(PAGE_ENTRANCE_MAX_MS);
    expect(pageEntranceEndMs(pageEntranceStep(PAGE_STAGE_HEADLINE))).toBe(510);
  });
});
