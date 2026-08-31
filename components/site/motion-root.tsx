"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

import {
  createRevealObserver,
  markElementRevealed,
  prefersReducedMotion,
} from "../../lib/motion/reveal";

export function MotionRoot() {
  /**
   * SiteShell mounts this once in the root layout, so it survives every
   * client-side navigation while the page under it is torn down and rebuilt.
   * Keyed on the pathname the effect re-queries on each route change; with a
   * bare [] it would hold observers on the detached nodes of the first page
   * visited and never see the ones that replaced them, leaving anything the
   * stylesheet hides stuck at opacity 0 on the second visit to a route.
   */
  const pathname = usePathname();

  useEffect(() => {
    const nodes = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]"),
    );
    if (nodes.length === 0) return;

    const reduced = prefersReducedMotion(
      window.matchMedia("(prefers-reduced-motion: reduce)"),
    );
    if (reduced) {
      nodes.forEach(markElementRevealed);
      return;
    }

    const observer = createRevealObserver(markElementRevealed);
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
