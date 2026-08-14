"use client";

import { useEffect, useState } from "react";

import { prefersReducedMotion } from "../../lib/motion/reveal";
import {
  assertHeroPortraits,
  HERO_PORTRAIT_HEIGHT,
  HERO_PORTRAIT_INTERVAL_MS,
  HERO_PORTRAIT_WIDTH,
  heroPortraits,
  nextPortraitIndex,
  shouldRotatePortraits,
} from "../../lib/portraits";

function readReducedMotion() {
  if (typeof window.matchMedia !== "function") {
    return false;
  }

  return prefersReducedMotion(
    window.matchMedia("(prefers-reduced-motion: reduce)"),
  );
}

export function HeroPortraitCarousel() {
  const portraits = assertHeroPortraits(heroPortraits);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (
      !shouldRotatePortraits({
        reducedMotion: readReducedMotion(),
        count: portraits.length,
      })
    ) {
      return;
    }

    const timer = window.setInterval(() => {
      setIndex((current) => nextPortraitIndex(current, portraits.length));
    }, HERO_PORTRAIT_INTERVAL_MS);

    return () => window.clearInterval(timer);
  }, [portraits.length]);

  const current = portraits[index]!;

  return (
    <div className="hero__photo" aria-label="Editorial portrait">
      <img
        alt={current.alt}
        className="hero__photo-image"
        height={HERO_PORTRAIT_HEIGHT}
        src={current.src}
        width={HERO_PORTRAIT_WIDTH}
      />
    </div>
  );
}
