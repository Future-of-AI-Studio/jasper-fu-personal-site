export const PORTRAIT_PREFIX = "/portraits/";
export const HERO_PORTRAIT_INTERVAL_MS = 5000;
export const HERO_PORTRAIT_MIN_COUNT = 5;
export const HERO_PORTRAIT_MAX_COUNT = 8;
export const HERO_PORTRAIT_WIDTH = 780;
export const HERO_PORTRAIT_HEIGHT = 975;

export type HeroPortrait = {
  src: string;
  alt: string;
};

export const heroPortraits: readonly HeroPortrait[] = [
  {
    src: "/portraits/jasper-fu-placeholder.jpg",
    alt: "Jasper Fu",
  },
  {
    src: "/portraits/jasper-fu-about.jpg",
    alt: "Jasper Fu",
  },
  {
    src: "/portraits/jasper-fu-nyse.jpg",
    alt: "Jasper Fu",
  },
  {
    src: "/portraits/jasper-fu-nyse-live.jpg",
    alt: "Jasper Fu",
  },
  {
    src: "/portraits/jasper-fu-circle.jpg",
    alt: "Jasper Fu",
  },
  {
    src: "/portraits/jasper-fu-singapore.jpg",
    alt: "Jasper Fu",
  },
];

export function assertPortraitSrc(value: string) {
  const trimmed = value.trim();
  if (!trimmed) {
    throw new Error("Portrait source is required");
  }

  if (trimmed.includes("unpublished")) {
    throw new Error("Unpublished portrait is not allowed");
  }

  if (!trimmed.startsWith(PORTRAIT_PREFIX)) {
    throw new Error("Portrait must be a local /portraits/ asset");
  }

  return trimmed;
}

export function assertHeroPortraits(portraits: readonly HeroPortrait[]) {
  if (portraits.length < HERO_PORTRAIT_MIN_COUNT) {
    throw new Error(
      `Hero portraits need at least ${HERO_PORTRAIT_MIN_COUNT} photos`,
    );
  }

  if (portraits.length > HERO_PORTRAIT_MAX_COUNT) {
    throw new Error(
      `Hero portraits cannot exceed ${HERO_PORTRAIT_MAX_COUNT} photos`,
    );
  }

  const sources = portraits.map((portrait) => assertPortraitSrc(portrait.src));
  if (new Set(sources).size !== sources.length) {
    throw new Error("Hero portraits must each use a unique source");
  }

  return portraits.map((portrait, index) => ({
    src: sources[index]!,
    alt: portrait.alt,
  }));
}

export function nextPortraitIndex(index: number, length: number) {
  if (!Number.isInteger(length)) {
    throw new Error("Portrait count must be an integer");
  }
  if (length < 1) {
    throw new Error("Portrait count must be at least 1");
  }
  if (!Number.isInteger(index)) {
    throw new Error("Portrait index must be an integer");
  }
  if (index < 0) {
    throw new Error("Portrait index cannot be below 0");
  }
  if (index >= length) {
    throw new Error("Portrait index cannot be above the last slide");
  }

  return (index + 1) % length;
}

export function shouldRotatePortraits({
  reducedMotion,
  count,
}: {
  reducedMotion: boolean;
  count: number;
}) {
  if (!Number.isInteger(count)) {
    throw new Error("Portrait count must be an integer");
  }
  if (count < 0) {
    throw new Error("Portrait count cannot be below 0");
  }

  return !reducedMotion && count > 1;
}
