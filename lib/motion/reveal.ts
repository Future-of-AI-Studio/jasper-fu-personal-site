export const DEFAULT_REVEAL_THRESHOLD = 0.18;

/**
 * Marks a page root as opting into the scroll reveal.
 *
 * SectionIntro carries `data-reveal` on every page, so the stylesheet cannot
 * simply hide the attribute site-wide — pages that are meant to sit still
 * would go blank until an observer that may never see them says otherwise.
 * A page opts in by putting this on its root; the CSS keys the hidden state
 * on `body:has([data-scroll-reveal])`.
 */
export const SCROLL_REVEAL_SCOPE_ATTRIBUTE = "data-scroll-reveal";

export type RevealObserverOptions = {
  threshold?: number;
  rootMargin?: string;
};

export function parseRevealThreshold(value: number): number {
  if (!Number.isFinite(value)) {
    throw new Error("Reveal threshold must be a finite number");
  }
  if (value < 0) {
    throw new Error("Reveal threshold cannot be below 0");
  }
  if (value > 1) {
    throw new Error("Reveal threshold cannot be above 1");
  }
  return value;
}

export function parseRevealRootMargin(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) {
    throw new Error("Reveal root margin is required");
  }
  return trimmed;
}

export function createRevealObserver(
  onReveal: (element: Element) => void,
  options: RevealObserverOptions = {},
): IntersectionObserver {
  if (typeof onReveal !== "function") {
    throw new Error("Reveal observer requires an onReveal callback");
  }

  const threshold = parseRevealThreshold(
    options.threshold ?? DEFAULT_REVEAL_THRESHOLD,
  );
  const rootMargin = parseRevealRootMargin(
    options.rootMargin ?? "0px 0px -8% 0px",
  );

  return new IntersectionObserver(
    (entries, observer) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        onReveal(entry.target);
        observer.unobserve(entry.target);
      }
    },
    { threshold, rootMargin },
  );
}

export function markElementRevealed(element: Element) {
  element.classList.add("is-revealed");
  element.setAttribute("data-revealed", "true");
}

export function prefersReducedMotion(
  media: Pick<MediaQueryList, "matches"> | null | undefined,
): boolean {
  return Boolean(media?.matches);
}
