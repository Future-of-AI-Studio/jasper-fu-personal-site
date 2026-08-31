import { describe, expect, it } from "vitest";

import {
  assertTabRect,
  computeTabMarker,
  isTabRectMeasurable,
  nextMarkerPhase,
  parsePressTabMarkerPhase,
  PRESS_TAB_MARKER_MS,
  PRESS_TAB_MARKER_PHASES,
  tabMarkerStyle,
} from "./press-tabs";

function verifyMarker(
  marker: { left: number; width: number },
  expected: { left: number; width: number },
) {
  expect(marker).toEqual(expected);
  expect(tabMarkerStyle(marker)).toEqual({
    "--press-tab-x": `${expected.left}px`,
    "--press-tab-w": `${expected.width}px`,
  });
}

describe("assertTabRect", () => {
  it("returns a measured rect unchanged", () => {
    expect(assertTabRect({ left: 12, width: 180 })).toEqual({
      left: 12,
      width: 180,
    });
  });

  it("rejects a non-finite left", () => {
    expect(() => assertTabRect({ left: Number.NaN, width: 10 })).toThrow(
      "Tab rect left must be a finite number",
    );
  });

  it("rejects a non-finite width", () => {
    expect(() =>
      assertTabRect({ left: 0, width: Number.POSITIVE_INFINITY }),
    ).toThrow("Tab rect width must be a finite number");
  });

  it("rejects a width of zero", () => {
    // A zero-width marker is an invisible underline, which reads as the
    // active tab simply having lost its mark.
    expect(() => assertTabRect({ left: 0, width: 0 })).toThrow(
      "Tab rect width must be above 0",
    );
  });

  it("rejects a negative width", () => {
    expect(() => assertTabRect({ left: 0, width: -1 })).toThrow(
      "Tab rect width must be above 0",
    );
  });

  it("accepts a negative left", () => {
    // Legitimate: a tab scrolled partly off the left of a narrow nav.
    expect(assertTabRect({ left: -30, width: 90 })).toEqual({
      left: -30,
      width: 90,
    });
  });
});

describe("isTabRectMeasurable", () => {
  it("accepts a laid-out element", () => {
    expect(isTabRectMeasurable({ left: 40, width: 160 })).toBe(true);
  });

  it("rejects the zeros an unlaid element reports", () => {
    // Before first layout, while the nav is hidden, or while a webfont is
    // still swapping. The caller places no marker rather than a zero-width
    // one, and never asserts on it, which would throw inside an effect.
    expect(isTabRectMeasurable({ left: 0, width: 0 })).toBe(false);
  });

  it("rejects non-finite measurements", () => {
    expect(isTabRectMeasurable({ left: Number.NaN, width: 10 })).toBe(false);
    expect(
      isTabRectMeasurable({ left: 0, width: Number.POSITIVE_INFINITY }),
    ).toBe(false);
  });

  it("is tolerant where assertTabRect is strict", () => {
    // Two different jobs: measuring may fail, a placed marker may not.
    expect(isTabRectMeasurable({ left: 0, width: 0 })).toBe(false);
    expect(() => assertTabRect({ left: 0, width: 0 })).toThrow();
  });
});

describe("computeTabMarker", () => {
  it("expresses the active link relative to its nav", () => {
    verifyMarker(computeTabMarker({ left: 220, width: 160 }, { left: 40 }), {
      left: 180,
      width: 160,
    });
  });

  it("puts the first tab at the nav's own edge", () => {
    verifyMarker(computeTabMarker({ left: 40, width: 120 }, { left: 40 }), {
      left: 0,
      width: 120,
    });
  });

  it("is unchanged by scrolling, since both rects move together", () => {
    // Viewport rects, so the subtraction is what makes the result survive
    // the page being scrolled under the nav.
    const atTop = computeTabMarker({ left: 220, width: 160 }, { left: 40 });
    const scrolled = computeTabMarker({ left: 220, width: 160 }, { left: 40 });
    expect(scrolled).toEqual(atTop);
  });

  it("rejects a non-finite nav left", () => {
    expect(() =>
      computeTabMarker({ left: 0, width: 10 }, { left: Number.NaN }),
    ).toThrow("Tab nav left must be a finite number");
  });

  it("rejects an unmeasurable link", () => {
    expect(() => computeTabMarker({ left: 0, width: 0 }, { left: 0 })).toThrow(
      "Tab rect width must be above 0",
    );
  });
});

describe("tabMarkerStyle", () => {
  it("rounds to whole pixels to avoid subpixel churn", () => {
    expect(tabMarkerStyle({ left: 12.4, width: 159.6 })).toEqual({
      "--press-tab-x": "12px",
      "--press-tab-w": "160px",
    });
  });
});

describe("marker phases", () => {
  it("publishes the three phases in the order they run", () => {
    expect(PRESS_TAB_MARKER_PHASES).toEqual(["idle", "placed", "armed"]);
    expect(PRESS_TAB_MARKER_MS).toBe(320);
  });

  it("places before it arms, then stays armed", () => {
    // Arming on the same pass as placing would slide the underline in from
    // the nav's left edge on every page load.
    expect(nextMarkerPhase("idle")).toBe("placed");
    expect(nextMarkerPhase("placed")).toBe("armed");
    expect(nextMarkerPhase("armed")).toBe("armed");
  });

  it("parses a published phase", () => {
    PRESS_TAB_MARKER_PHASES.forEach((phase) => {
      expect(parsePressTabMarkerPhase(phase)).toBe(phase);
    });
    expect(parsePressTabMarkerPhase("  armed  ")).toBe("armed");
  });

  it("rejects an empty phase", () => {
    expect(() => parsePressTabMarkerPhase("  ")).toThrow(
      "Press tab marker phase is required",
    );
  });

  it("rejects a phase that is not published", () => {
    expect(() => parsePressTabMarkerPhase("sliding")).toThrow(
      "Press tab marker phase sliding is not published",
    );
  });
});
