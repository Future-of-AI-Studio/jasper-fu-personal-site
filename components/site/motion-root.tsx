"use client";

import { useEffect } from "react";

import {
  createRevealObserver,
  markElementRevealed,
  prefersReducedMotion,
} from "../../lib/motion/reveal";

export function MotionRoot() {
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
  }, []);

  return null;
}
