import { act, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  HERO_PORTRAIT_INTERVAL_MS,
  heroPortraits,
} from "../../lib/portraits";
import { HeroPortraitCarousel } from "./hero-portrait-carousel";

function stubMotion(reduced: boolean) {
  vi.stubGlobal("matchMedia", () => ({ matches: reduced }));
}

function verifyVisiblePortrait(src: string) {
  const images = screen.getAllByRole("img", { name: "Jasper Fu" });
  expect(images).toHaveLength(1);
  expect(images[0]?.getAttribute("src")).toBe(src);
  expect(document.querySelectorAll(".hero__photo-image")).toHaveLength(1);
}

describe("HeroPortraitCarousel", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it("shows the first portrait and advances every 5 seconds", () => {
    stubMotion(false);
    render(<HeroPortraitCarousel />);

    verifyVisiblePortrait(heroPortraits[0]!.src);

    act(() => {
      vi.advanceTimersByTime(HERO_PORTRAIT_INTERVAL_MS);
    });
    verifyVisiblePortrait(heroPortraits[1]!.src);

    act(() => {
      vi.advanceTimersByTime(
        HERO_PORTRAIT_INTERVAL_MS * (heroPortraits.length - 2),
      );
    });
    verifyVisiblePortrait(heroPortraits[heroPortraits.length - 1]!.src);

    act(() => {
      vi.advanceTimersByTime(HERO_PORTRAIT_INTERVAL_MS);
    });
    verifyVisiblePortrait(heroPortraits[0]!.src);
  });

  it("stays on the first portrait when reduced motion is preferred", () => {
    stubMotion(true);
    render(<HeroPortraitCarousel />);

    verifyVisiblePortrait(heroPortraits[0]!.src);
    act(() => {
      vi.advanceTimersByTime(HERO_PORTRAIT_INTERVAL_MS * heroPortraits.length);
    });
    verifyVisiblePortrait(heroPortraits[0]!.src);
  });
});
