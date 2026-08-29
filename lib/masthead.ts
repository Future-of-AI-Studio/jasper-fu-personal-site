export const MASTHEAD_SCROLL_THRESHOLD = 8;
export const MASTHEAD_SCROLLED_ATTRIBUTE = "data-scrolled";

export function assertMastheadThreshold(value: number) {
  if (!Number.isFinite(value)) {
    throw new Error("Masthead scroll threshold must be a finite number");
  }

  if (value < 0) {
    throw new Error("Masthead scroll threshold cannot be negative");
  }

  return value;
}

/**
 * Rubber-band overscroll reports a negative offset, which is still the top of
 * the document, so only a positive offset past the threshold glassifies the
 * bar. The threshold keeps a one-pixel nudge from flickering the background.
 */
export function isMastheadScrolled(
  offset: number,
  threshold: number = MASTHEAD_SCROLL_THRESHOLD,
) {
  if (!Number.isFinite(offset)) {
    throw new Error("Masthead scroll offset must be a finite number");
  }

  return offset > assertMastheadThreshold(threshold);
}
