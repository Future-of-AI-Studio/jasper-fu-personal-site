import { afterEach, describe, expect, it, vi } from "vitest";

import {
  createRevealObserver,
  DEFAULT_REVEAL_THRESHOLD,
  markElementRevealed,
  parseRevealRootMargin,
  parseRevealThreshold,
  prefersReducedMotion,
} from "./reveal";

class FakeIntersectionObserver {
  static instances: FakeIntersectionObserver[] = [];
  readonly callback: IntersectionObserverCallback;
  readonly options: IntersectionObserverInit | undefined;
  readonly observed: Element[] = [];

  constructor(
    callback: IntersectionObserverCallback,
    options?: IntersectionObserverInit,
  ) {
    this.callback = callback;
    this.options = options;
    FakeIntersectionObserver.instances.push(this);
  }

  observe(element: Element) {
    this.observed.push(element);
  }

  unobserve(element: Element) {
    const index = this.observed.indexOf(element);
    if (index >= 0) this.observed.splice(index, 1);
  }

  disconnect() {
    this.observed.length = 0;
  }

  trigger(entries: Array<Partial<IntersectionObserverEntry>>) {
    this.callback(
      entries.map((entry) => ({
        isIntersecting: false,
        target: document.createElement("div"),
        ...entry,
      })) as IntersectionObserverEntry[],
      this as unknown as IntersectionObserver,
    );
  }
}

function verifyThreshold(value: number, expected: number) {
  expect(parseRevealThreshold(value)).toBe(expected);
}

describe("reveal motion helpers", () => {
  afterEach(() => {
    FakeIntersectionObserver.instances = [];
    vi.unstubAllGlobals();
  });

  it("parses the default reveal threshold", () => {
    verifyThreshold(DEFAULT_REVEAL_THRESHOLD, 0.18);
  });

  it.each([
    [0, 0],
    [1, 1],
    [0.5, 0.5],
  ])("accepts boundary threshold %s", (input, expected) => {
    verifyThreshold(input, expected);
  });

  it.each([
    [Number.NaN, "Reveal threshold must be a finite number"],
    [-0.01, "Reveal threshold cannot be below 0"],
    [1.01, "Reveal threshold cannot be above 1"],
  ])("rejects invalid threshold %s", (input, message) => {
    expect(() => parseRevealThreshold(input as number)).toThrow(message);
  });

  it("requires a root margin", () => {
    expect(parseRevealRootMargin("0px 0px -8% 0px")).toBe("0px 0px -8% 0px");
    expect(() => parseRevealRootMargin("   ")).toThrow(
      "Reveal root margin is required",
    );
  });

  it("creates an observer that reveals intersecting targets once", () => {
    vi.stubGlobal("IntersectionObserver", FakeIntersectionObserver);
    const onReveal = vi.fn();
    const observer = createRevealObserver(onReveal, { threshold: 0.2 });
    const target = document.createElement("section");

    expect(FakeIntersectionObserver.instances[0]?.options?.threshold).toBe(0.2);
    observer.observe(target);
    FakeIntersectionObserver.instances[0]!.trigger([
      { isIntersecting: false, target },
      { isIntersecting: true, target },
    ]);

    expect(onReveal).toHaveBeenCalledOnce();
    expect(onReveal).toHaveBeenCalledWith(target);
    expect(FakeIntersectionObserver.instances[0]?.observed).not.toContain(
      target,
    );
  });

  it("rejects a missing reveal callback", () => {
    expect(() =>
      createRevealObserver(undefined as unknown as (element: Element) => void),
    ).toThrow("Reveal observer requires an onReveal callback");
  });

  it("marks an element as revealed", () => {
    const element = document.createElement("div");
    markElementRevealed(element);
    expect(element.classList.contains("is-revealed")).toBe(true);
    expect(element.getAttribute("data-revealed")).toBe("true");
  });

  it("detects reduced-motion preference", () => {
    expect(prefersReducedMotion({ matches: true })).toBe(true);
    expect(prefersReducedMotion({ matches: false })).toBe(false);
    expect(prefersReducedMotion(null)).toBe(false);
  });
});
