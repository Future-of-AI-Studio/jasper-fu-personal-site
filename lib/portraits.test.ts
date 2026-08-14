import { describe, expect, it } from "vitest";

import {
  assertHeroPortraits,
  assertPortraitSrc,
  HERO_PORTRAIT_HEIGHT,
  HERO_PORTRAIT_INTERVAL_MS,
  HERO_PORTRAIT_MAX_COUNT,
  HERO_PORTRAIT_MIN_COUNT,
  HERO_PORTRAIT_WIDTH,
  heroPortraits,
  nextPortraitIndex,
  PORTRAIT_PREFIX,
  shouldRotatePortraits,
} from "./portraits";

const happyPortrait = heroPortraits[0]!;

function verifyPortraitSrc(value: string, expected: string) {
  expect(assertPortraitSrc(value)).toBe(expected);
}

function verifyHeroPortraits() {
  const published = assertHeroPortraits(heroPortraits);
  expect(published).toHaveLength(heroPortraits.length);
  expect(published[0]?.src).toBe(happyPortrait.src);
  expect(new Set(published.map((portrait) => portrait.src)).size).toBe(
    published.length,
  );
  expect(
    published.every((portrait) => portrait.src.startsWith(PORTRAIT_PREFIX)),
  ).toBe(true);
}

describe("assertPortraitSrc", () => {
  it("accepts a local portraits asset", () => {
    verifyPortraitSrc(
      " /portraits/jasper-fu-placeholder.jpg ",
      "/portraits/jasper-fu-placeholder.jpg",
    );
  });

  it("rejects a missing portrait source", () => {
    expect(() => assertPortraitSrc(" ")).toThrow("Portrait source is required");
  });

  it("rejects an unpublished portrait", () => {
    expect(() => assertPortraitSrc("/portraits/unpublished.jpg")).toThrow(
      "Unpublished portrait is not allowed",
    );
  });

  it("rejects a remote or non-portraits path", () => {
    expect(() =>
      assertPortraitSrc("https://cdn.example.com/jasper.jpg"),
    ).toThrow("Portrait must be a local /portraits/ asset");
  });
});

describe("assertHeroPortraits", () => {
  it("publishes the homepage portrait set", () => {
    verifyHeroPortraits();
  });

  it("rejects fewer than the minimum number of photos", () => {
    expect(() =>
      assertHeroPortraits(heroPortraits.slice(0, HERO_PORTRAIT_MIN_COUNT - 1)),
    ).toThrow(
      `Hero portraits need at least ${HERO_PORTRAIT_MIN_COUNT} photos`,
    );
  });

  it("rejects more than the maximum number of photos", () => {
    const extra = Array.from(
      { length: HERO_PORTRAIT_MAX_COUNT - heroPortraits.length + 1 },
      (_, index) => ({
        src: `/portraits/extra-${index}.jpg`,
        alt: "Jasper Fu",
      }),
    );
    expect(() => assertHeroPortraits([...heroPortraits, ...extra])).toThrow(
      `Hero portraits cannot exceed ${HERO_PORTRAIT_MAX_COUNT} photos`,
    );
  });

  it("rejects a duplicate portrait source", () => {
    const duplicate = [
      ...heroPortraits.slice(0, HERO_PORTRAIT_MIN_COUNT - 1),
      heroPortraits[0]!,
    ];
    expect(() => assertHeroPortraits(duplicate)).toThrow(
      "Hero portraits must each use a unique source",
    );
  });
});

describe("nextPortraitIndex", () => {
  it("advances from the first slide", () => {
    expect(nextPortraitIndex(0, heroPortraits.length)).toBe(1);
  });

  it("wraps from the last slide back to the first", () => {
    expect(
      nextPortraitIndex(heroPortraits.length - 1, heroPortraits.length),
    ).toBe(0);
  });

  it("stays on the only slide when the list has one photo", () => {
    expect(nextPortraitIndex(0, 1)).toBe(0);
  });

  it("rejects a non-integer portrait count", () => {
    expect(() => nextPortraitIndex(0, 1.5)).toThrow(
      "Portrait count must be an integer",
    );
  });

  it("rejects a portrait count below 1", () => {
    expect(() => nextPortraitIndex(0, 0)).toThrow(
      "Portrait count must be at least 1",
    );
  });

  it("rejects a non-integer portrait index", () => {
    expect(() => nextPortraitIndex(0.5, 6)).toThrow(
      "Portrait index must be an integer",
    );
  });

  it("rejects an index below 0", () => {
    expect(() => nextPortraitIndex(-1, 6)).toThrow(
      "Portrait index cannot be below 0",
    );
  });

  it("rejects an index above the last slide", () => {
    expect(() => nextPortraitIndex(6, 6)).toThrow(
      "Portrait index cannot be above the last slide",
    );
  });
});

describe("shouldRotatePortraits", () => {
  it("rotates when motion is allowed and more than one photo exists", () => {
    expect(
      shouldRotatePortraits({
        reducedMotion: false,
        count: heroPortraits.length,
      }),
    ).toBe(true);
  });

  it("does not rotate when reduced motion is preferred", () => {
    expect(
      shouldRotatePortraits({
        reducedMotion: true,
        count: heroPortraits.length,
      }),
    ).toBe(false);
  });

  it("does not rotate a single photo", () => {
    expect(shouldRotatePortraits({ reducedMotion: false, count: 1 })).toBe(
      false,
    );
  });

  it("does not rotate an empty list", () => {
    expect(shouldRotatePortraits({ reducedMotion: false, count: 0 })).toBe(
      false,
    );
  });

  it("rejects a non-integer count", () => {
    expect(() =>
      shouldRotatePortraits({ reducedMotion: false, count: 1.2 }),
    ).toThrow("Portrait count must be an integer");
  });

  it("rejects a count below 0", () => {
    expect(() =>
      shouldRotatePortraits({ reducedMotion: false, count: -1 }),
    ).toThrow("Portrait count cannot be below 0");
  });
});

describe("hero portrait constants", () => {
  it("rotates every 5 seconds in a 4:5 frame", () => {
    expect(HERO_PORTRAIT_INTERVAL_MS).toBe(5000);
    expect(HERO_PORTRAIT_WIDTH * 5).toBe(HERO_PORTRAIT_HEIGHT * 4);
    expect(heroPortraits.length).toBeGreaterThanOrEqual(HERO_PORTRAIT_MIN_COUNT);
    expect(heroPortraits.length).toBeLessThanOrEqual(HERO_PORTRAIT_MAX_COUNT);
  });
});
