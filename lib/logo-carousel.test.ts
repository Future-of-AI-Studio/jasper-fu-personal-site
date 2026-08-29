import { describe, expect, it } from "vitest";

import {
  clampLogoCarouselOffsetRatio,
  computeLogoCarouselTransform,
  LOGO_CAROUSEL_MAX_BLUR_PX,
  LOGO_CAROUSEL_MAX_DEPTH_PX,
  LOGO_CAROUSEL_MAX_ROTATION_DEG,
  LOGO_CAROUSEL_MIN_OPACITY,
  logoCarouselTransformStyle,
  resolveLogoOffsetRatio,
} from "./logo-carousel";

function verifyTransform(
  transform: ReturnType<typeof computeLogoCarouselTransform>,
  expected: {
    rotateYDeg: number;
    translateZPx: number;
    blurPx: number;
    opacity: number;
  },
) {
  expect(transform.rotateYDeg).toBeCloseTo(expected.rotateYDeg, 5);
  expect(transform.translateZPx).toBeCloseTo(expected.translateZPx, 5);
  expect(transform.blurPx).toBeCloseTo(expected.blurPx, 5);
  expect(transform.opacity).toBeCloseTo(expected.opacity, 5);
}

describe("clampLogoCarouselOffsetRatio", () => {
  it("passes through a mid-range ratio unchanged", () => {
    expect(clampLogoCarouselOffsetRatio(0.5)).toBe(0.5);
  });

  it("rejects NaN", () => {
    expect(() => clampLogoCarouselOffsetRatio(Number.NaN)).toThrow(
      "Logo carousel offset ratio must be a finite number",
    );
  });

  it("rejects Infinity", () => {
    expect(() => clampLogoCarouselOffsetRatio(Number.POSITIVE_INFINITY)).toThrow(
      "Logo carousel offset ratio must be a finite number",
    );
  });

  it("clamps below -1 up to -1", () => {
    expect(clampLogoCarouselOffsetRatio(-1.5)).toBe(-1);
  });

  it("clamps above 1 down to 1", () => {
    expect(clampLogoCarouselOffsetRatio(1.5)).toBe(1);
  });

  it("leaves the -1 and 1 boundaries exactly as given", () => {
    expect(clampLogoCarouselOffsetRatio(-1)).toBe(-1);
    expect(clampLogoCarouselOffsetRatio(1)).toBe(1);
  });
});

describe("resolveLogoOffsetRatio", () => {
  it("returns 0 for an item centered on the container", () => {
    expect(resolveLogoOffsetRatio(500, 500, 400)).toBe(0);
  });

  it("returns a positive ratio for an item right of center", () => {
    expect(resolveLogoOffsetRatio(700, 500, 400)).toBeCloseTo(0.5, 5);
  });

  it("returns a negative ratio for an item left of center", () => {
    expect(resolveLogoOffsetRatio(300, 500, 400)).toBeCloseTo(-0.5, 5);
  });

  it("rejects a non-finite item center", () => {
    expect(() => resolveLogoOffsetRatio(Number.NaN, 500, 400)).toThrow(
      "Logo carousel position must be a finite number",
    );
  });

  it("rejects a non-finite container center", () => {
    expect(() => resolveLogoOffsetRatio(700, Number.NaN, 400)).toThrow(
      "Logo carousel position must be a finite number",
    );
  });

  it("returns 0 when the container has no measurable width yet", () => {
    expect(resolveLogoOffsetRatio(700, 500, 0)).toBe(0);
  });

  it("returns 0 for a degenerate negative container width", () => {
    expect(resolveLogoOffsetRatio(700, 500, -10)).toBe(0);
  });

  it("clamps an item far outside the container to the 1 boundary", () => {
    expect(resolveLogoOffsetRatio(5000, 500, 400)).toBe(1);
  });

  it("clamps an item far outside the container to the -1 boundary", () => {
    expect(resolveLogoOffsetRatio(-5000, 500, 400)).toBe(-1);
  });
});

describe("computeLogoCarouselTransform", () => {
  it("holds a centered logo flat, sharp, and fully opaque", () => {
    verifyTransform(computeLogoCarouselTransform(0), {
      rotateYDeg: 0,
      translateZPx: 0,
      blurPx: 0,
      opacity: 1,
    });
  });

  it("curves a logo at the +1 boundary to the maximum in every axis", () => {
    verifyTransform(computeLogoCarouselTransform(1), {
      rotateYDeg: -LOGO_CAROUSEL_MAX_ROTATION_DEG,
      translateZPx: -LOGO_CAROUSEL_MAX_DEPTH_PX,
      blurPx: LOGO_CAROUSEL_MAX_BLUR_PX,
      opacity: LOGO_CAROUSEL_MIN_OPACITY,
    });
  });

  it("curves a logo at the -1 boundary the mirrored way", () => {
    verifyTransform(computeLogoCarouselTransform(-1), {
      rotateYDeg: LOGO_CAROUSEL_MAX_ROTATION_DEG,
      translateZPx: -LOGO_CAROUSEL_MAX_DEPTH_PX,
      blurPx: LOGO_CAROUSEL_MAX_BLUR_PX,
      opacity: LOGO_CAROUSEL_MIN_OPACITY,
    });
  });

  it("ramps blur quadratically so the middle third stays near-sharp", () => {
    verifyTransform(computeLogoCarouselTransform(0.5), {
      rotateYDeg: -LOGO_CAROUSEL_MAX_ROTATION_DEG * 0.5,
      translateZPx: -LOGO_CAROUSEL_MAX_DEPTH_PX * 0.5,
      blurPx: LOGO_CAROUSEL_MAX_BLUR_PX * 0.25,
      opacity: 1 - 0.5 * (1 - LOGO_CAROUSEL_MIN_OPACITY),
    });
  });

  it("rejects a non-finite ratio", () => {
    expect(() => computeLogoCarouselTransform(Number.NaN)).toThrow(
      "Logo carousel offset ratio must be a finite number",
    );
  });
});

describe("logoCarouselTransformStyle", () => {
  it("formats rotation and depth into a single transform string", () => {
    const style = logoCarouselTransformStyle(
      computeLogoCarouselTransform(1),
    );
    expect(style.transform).toBe(
      `rotateY(-${LOGO_CAROUSEL_MAX_ROTATION_DEG.toFixed(2)}deg) translateZ(-${LOGO_CAROUSEL_MAX_DEPTH_PX.toFixed(2)}px)`,
    );
    expect(style.filter).toBe(`blur(${LOGO_CAROUSEL_MAX_BLUR_PX.toFixed(2)}px)`);
    expect(style.opacity).toBe(LOGO_CAROUSEL_MIN_OPACITY);
  });

  it("reports no filter at all for a perfectly centered logo", () => {
    const style = logoCarouselTransformStyle(computeLogoCarouselTransform(0));
    expect(style.filter).toBe("none");
    expect(style.transform).toBe("rotateY(0.00deg) translateZ(0.00px)");
    expect(style.opacity).toBe(1);
  });

  it("switches from none to a blur value right above the visibility threshold", () => {
    const justBelow = logoCarouselTransformStyle({
      rotateYDeg: 0,
      translateZPx: 0,
      blurPx: 0.01,
      opacity: 1,
    });
    const justAbove = logoCarouselTransformStyle({
      rotateYDeg: 0,
      translateZPx: 0,
      blurPx: 0.02,
      opacity: 1,
    });
    expect(justBelow.filter).toBe("none");
    expect(justAbove.filter).toBe("blur(0.02px)");
  });
});
