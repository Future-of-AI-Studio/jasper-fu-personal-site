/**
 * Geometry for the press tabs' sliding underline.
 *
 * The marker is one element under the whole nav rather than a rule on each
 * link, because a box-shadow on two separate elements can only appear and
 * disappear: nothing travels between them. Its position is measured rather
 * than hard-coded, so the two labels can be any width.
 *
 * Kept here, away from the component, so the arithmetic is testable without
 * a DOM and the component stays a thin measuring shell.
 */

export const PRESS_TAB_MARKER_MS = 320;

export type TabRect = {
  left: number;
  width: number;
};

/** Phases the marker moves through; see the component for why. */
export const PRESS_TAB_MARKER_PHASES = ["idle", "placed", "armed"] as const;
export type PressTabMarkerPhase = (typeof PRESS_TAB_MARKER_PHASES)[number];

export function assertTabRect(rect: TabRect): TabRect {
  if (!Number.isFinite(rect.left)) {
    throw new Error("Tab rect left must be a finite number");
  }
  if (!Number.isFinite(rect.width)) {
    throw new Error("Tab rect width must be a finite number");
  }
  if (rect.width <= 0) {
    throw new Error("Tab rect width must be above 0");
  }
  return rect;
}

/**
 * Whether a measurement is usable yet.
 *
 * Separate from assertTabRect on purpose: measuring is allowed to fail and
 * the caller should simply not place a marker, whereas a marker that has
 * been placed must have valid geometry. An element that has not been laid
 * out reports zeros, which happens before first layout, while the nav is
 * hidden, and while a webfont is still swapping.
 */
export function isTabRectMeasurable(rect: TabRect): boolean {
  return (
    Number.isFinite(rect.left) && Number.isFinite(rect.width) && rect.width > 0
  );
}

/**
 * The active link's box, expressed relative to the nav that contains it.
 *
 * Both inputs are viewport rects, so the subtraction is what makes the
 * result survive the page being scrolled or the shell being resized.
 */
export function computeTabMarker(link: TabRect, nav: Pick<TabRect, "left">) {
  assertTabRect(link);
  if (!Number.isFinite(nav.left)) {
    throw new Error("Tab nav left must be a finite number");
  }
  return { left: link.left - nav.left, width: link.width };
}

/** Custom properties the stylesheet reads; rounded to avoid subpixel churn. */
export function tabMarkerStyle(marker: TabRect) {
  const { left, width } = assertTabRect(marker);
  return {
    "--press-tab-x": `${Math.round(left)}px`,
    "--press-tab-w": `${Math.round(width)}px`,
  };
}

export function parsePressTabMarkerPhase(value: string): PressTabMarkerPhase {
  const trimmed = value.trim();
  if (!trimmed) {
    throw new Error("Press tab marker phase is required");
  }
  const match = PRESS_TAB_MARKER_PHASES.find((phase) => phase === trimmed);
  if (!match) {
    throw new Error(`Press tab marker phase ${trimmed} is not published`);
  }
  return match;
}

/**
 * The phase after this one.
 *
 * `idle` renders no marker at all, so a reader without scripting keeps the
 * per-link underline instead of an empty nav. `placed` puts the marker where
 * it belongs with transitions still off, so it does not slide in from the
 * left edge on first paint. `armed` turns transitions on, and every change
 * after that travels.
 */
export function nextMarkerPhase(
  phase: PressTabMarkerPhase,
): PressTabMarkerPhase {
  if (phase === "idle") return "placed";
  return "armed";
}
