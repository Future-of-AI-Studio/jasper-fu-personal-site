/**
 * Pure position math for the home page's 3D logo carousel. The horizontal
 * scroll itself stays the existing CSS `media-bar-marquee` keyframe
 * (see app/globals.css); this module only maps a logo's live horizontal
 * position, as a ratio of the visible strip's half-width, to the rotation /
 * depth / blur / opacity that gives it a coverflow-style curve. Consumed by
 * `components/site/logo-carousel.tsx`.
 */

/**
 * The strip only loops where the full row of outlets no longer fits, which
 * is the same 900px breakpoint the stylesheet stacks the rest of the site
 * at. Above it the logos are shown all at once, at rest.
 */
export const LOGO_CAROUSEL_BREAKPOINT_PX = 900;
export const LOGO_CAROUSEL_MEDIA_QUERY = `(max-width: ${LOGO_CAROUSEL_BREAKPOINT_PX}px) and (prefers-reduced-motion: no-preference)`;

export const LOGO_CAROUSEL_MAX_ROTATION_DEG = 46;
export const LOGO_CAROUSEL_MAX_DEPTH_PX = 120;
export const LOGO_CAROUSEL_MAX_BLUR_PX = 5;
export const LOGO_CAROUSEL_MIN_OPACITY = 0.25;

export type LogoCarouselTransform = {
  rotateYDeg: number;
  translateZPx: number;
  blurPx: number;
  opacity: number;
};

export type LogoCarouselStyle = {
  transform: string;
  filter: string;
  opacity: number;
};

/**
 * Clamps to [-1, 1] — -1 is the far left edge of the visible strip, 0 is
 * dead center, 1 is the far right edge. Throws on non-finite input so a
 * broken measurement (e.g. a divide-by-zero upstream) fails loudly instead
 * of painting a NaN transform.
 */
export function clampLogoCarouselOffsetRatio(value: number): number {
  if (!Number.isFinite(value)) {
    throw new Error("Logo carousel offset ratio must be a finite number");
  }

  if (value < -1) {
    return -1;
  }

  if (value > 1) {
    return 1;
  }

  return value;
}

/**
 * Converts a logo's live screen position into an offset ratio. Returns 0
 * (dead center, no curve) when the container has no measurable width yet —
 * the state on first paint and in environments without real layout — rather
 * than dividing by zero.
 */
export function resolveLogoOffsetRatio(
  itemCenterPx: number,
  containerCenterPx: number,
  containerHalfWidthPx: number,
): number {
  if (!Number.isFinite(itemCenterPx) || !Number.isFinite(containerCenterPx)) {
    throw new Error("Logo carousel position must be a finite number");
  }

  if (containerHalfWidthPx <= 0) {
    return 0;
  }

  const raw = (itemCenterPx - containerCenterPx) / containerHalfWidthPx;
  return clampLogoCarouselOffsetRatio(raw);
}

/**
 * Maps an offset ratio to the coverflow curve: logos rotate away from the
 * viewer and recede in depth the further they sit from center, with blur
 * ramping in quadratically (so the center stays crisp and only the outer
 * third visibly softens) and opacity easing off at the extremes.
 */
export function computeLogoCarouselTransform(
  offsetRatio: number,
): LogoCarouselTransform {
  const ratio = clampLogoCarouselOffsetRatio(offsetRatio);
  const magnitude = Math.abs(ratio);

  return {
    rotateYDeg: -ratio * LOGO_CAROUSEL_MAX_ROTATION_DEG,
    translateZPx: -magnitude * LOGO_CAROUSEL_MAX_DEPTH_PX,
    blurPx: magnitude ** 2 * LOGO_CAROUSEL_MAX_BLUR_PX,
    opacity: 1 - magnitude * (1 - LOGO_CAROUSEL_MIN_OPACITY),
  };
}

/** Formats a transform as the literal inline-style values to apply. */
export function logoCarouselTransformStyle(
  transform: LogoCarouselTransform,
): LogoCarouselStyle {
  return {
    transform: `rotateY(${transform.rotateYDeg.toFixed(2)}deg) translateZ(${transform.translateZPx.toFixed(2)}px)`,
    filter: transform.blurPx > 0.01 ? `blur(${transform.blurPx.toFixed(2)}px)` : "none",
    opacity: Number(transform.opacity.toFixed(3)),
  };
}
