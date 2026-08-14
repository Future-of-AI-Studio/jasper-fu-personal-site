export const identity = {
  name: "Jasper Fu",
  title: "Co-Founder and CEO, Coinsub",
  siteUrl: "https://www.jasperfu.com",
  thesis: "I think of blockchain like plumbing. Nobody should have to admire the pipes.",
  lockedOneLiner: "I build the orchestration layer for programmable money.",
  pressEmail: "press@coinsub.io",
  speakingEmail: "speaking@jasperfu.com",
  bookingEmail: "speaking@jasperfu.io",
  partnershipEmail: "partnerships@jasperfu.com",
  linkedInUrl: "https://www.linkedin.com/in/jasper-fu",
  coinsubUrl: "https://www.coinsub.io/",
  calendlyUrl: "https://calendly.com/jasper-coinsub",
  monogram: "JF.",
  colors: {
    navy: "#061A36",
    sky: "#336D9F",
    white: "#FFFFFF",
    skyPale: "#E1EDF8",
    paper: "#F4F9FF",
    ink: "#061A36",
    muted: "#496684",
    border: "#CED9E5",
    navyLight: "#173C63",
  },
} as const;

export const MEDIA_OUTLET_LOGO_PREFIX = "/logos/";
export const MEDIA_BAR_LOOP_COPIES = 2;

export const mediaOutlets = [
  { name: "NASDAQ", href: "https://www.nasdaq.com", logo: "/logos/nasdaq.svg" },
  {
    name: "CEO Magazine",
    href: "https://ceofficialmag.com",
    logo: "/logos/ceo-magazine.svg",
  },
  { name: "Circle", href: "https://www.circle.com", logo: "/logos/circle.png" },
  { name: "NYSE", href: "https://www.nyse.com", logo: "/logos/nyse.svg" },
] as const;

export const unclearedLogoPartners = [
  "FCTI",
  "Ordr",
  "Hashlock",
  "Finsuite",
  "GlobalStake",
  "Key to Web3",
] as const;

export const clearedEditorialBrands = [
  "Coinsub",
  "NASDAQ",
  "CEO Magazine",
  "Circle",
  "NYSE",
] as const;

export function assertLogoPublishable(name: string) {
  const trimmed = name.trim();
  if (!trimmed) {
    throw new Error("Logo name is required");
  }

  if ((unclearedLogoPartners as readonly string[]).includes(trimmed)) {
    throw new Error(`${trimmed} logo is not cleared for publication`);
  }

  if (!(clearedEditorialBrands as readonly string[]).includes(trimmed)) {
    throw new Error(`${trimmed} logo has no publication status`);
  }

  return trimmed;
}

export function assertMediaOutletLogo(value: string) {
  const trimmed = value.trim();
  if (!trimmed) {
    throw new Error("Media outlet logo source is required");
  }

  if (trimmed.includes("placeholder")) {
    throw new Error("Placeholder media outlet logo is not published");
  }

  if (!trimmed.startsWith(MEDIA_OUTLET_LOGO_PREFIX)) {
    throw new Error("Media outlet logo must be a local /logos/ asset");
  }

  return trimmed;
}

export function assertMediaOutletMark(outlet: { name: string; logo: string }) {
  return {
    name: assertLogoPublishable(outlet.name),
    logo: assertMediaOutletLogo(outlet.logo),
  };
}

export function assertMediaBarLoopCopies(value: number) {
  if (!Number.isInteger(value)) {
    throw new Error("Media bar loop copy count must be an integer");
  }

  if (value < 2) {
    throw new Error("Media bar loop needs at least two copies to seam");
  }

  if (value !== 2) {
    throw new Error("Media bar loop uses exactly two copies");
  }

  return value;
}

export function mediaBarLoopCopyIndexes() {
  const copies = assertMediaBarLoopCopies(MEDIA_BAR_LOOP_COPIES);
  return Array.from({ length: copies }, (_, index) => index);
}

export const PUBLISHED_CALENDLY_URL = "https://calendly.com/jasper-coinsub";
export const PUBLISHED_COINSUB_URL = "https://www.coinsub.io/";
export const PUBLISHED_LINKEDIN_URL = "https://www.linkedin.com/in/jasper-fu";
export const PUBLISHED_BOOKING_EMAIL = "speaking@jasperfu.io";
export const RETIRED_SPEAKING_BOOKING_EMAIL = "speaking@jasperfu.com";
export const RETIRED_INFO_BOOKING_EMAIL = "info@jasperfu.io";
export const COINSUB_SOLO_LABEL = "Coinsub";
export const PUBLISHED_THESIS =
  "I think of blockchain like plumbing. Nobody should have to admire the pipes.";
export const LEGACY_THESIS =
  "Trust shouldn't be a promise. It should be architecture.";

export function assertBookingEmail(value: string) {
  const trimmed = value.trim();
  if (!trimmed) {
    throw new Error("Booking inbox is required");
  }
  if (trimmed === RETIRED_SPEAKING_BOOKING_EMAIL) {
    throw new Error("speaking@jasperfu.com booking inbox is not published");
  }
  if (trimmed === RETIRED_INFO_BOOKING_EMAIL) {
    throw new Error("info@jasperfu.io booking inbox is not published");
  }
  if (trimmed !== PUBLISHED_BOOKING_EMAIL) {
    throw new Error("Booking inbox must be speaking@jasperfu.io");
  }
  return trimmed;
}

export function assertCalendlyUrl(value: string) {
  const trimmed = value.trim();
  if (!trimmed) {
    throw new Error("Calendly URL is required");
  }

  if (trimmed.includes("placeholder")) {
    throw new Error("Placeholder Calendly URL is not published");
  }

  if (trimmed !== PUBLISHED_CALENDLY_URL) {
    throw new Error(`${trimmed} is not the published Calendly URL`);
  }

  return trimmed;
}

export function assertCoinsubUrl(value: string) {
  const trimmed = value.trim();
  if (!trimmed) {
    throw new Error("Coinsub URL is required");
  }
  if (trimmed.includes("placeholder")) {
    throw new Error("Placeholder Coinsub URL is not published");
  }
  if (trimmed !== PUBLISHED_COINSUB_URL) {
    throw new Error(`${trimmed} is not the published Coinsub URL`);
  }
  return trimmed;
}

export function assertLinkedInUrl(value: string) {
  const trimmed = value.trim();
  if (!trimmed) {
    throw new Error("LinkedIn URL is required");
  }
  if (trimmed.includes("placeholder")) {
    throw new Error("Placeholder LinkedIn URL is not published");
  }
  if (trimmed !== PUBLISHED_LINKEDIN_URL) {
    throw new Error(`${trimmed} is not the published LinkedIn URL`);
  }
  return trimmed;
}

export function splitTitleForCoinsub(title: string) {
  const trimmed = title.trim();
  if (!trimmed) {
    throw new Error("Title is required");
  }
  const suffix = `, ${COINSUB_SOLO_LABEL}`;
  if (!trimmed.endsWith(suffix)) {
    throw new Error("Title must end with solo Coinsub copy");
  }
  return {
    prefix: trimmed.slice(0, -COINSUB_SOLO_LABEL.length),
    name: COINSUB_SOLO_LABEL,
  };
}

export function assertThesis(value: string) {
  const trimmed = value.trim();
  if (!trimmed) {
    throw new Error("Thesis is required");
  }
  if (trimmed.includes("placeholder")) {
    throw new Error("Placeholder thesis is not published");
  }
  if (trimmed === LEGACY_THESIS) {
    throw new Error("Trust-as-architecture thesis is not published");
  }
  if (trimmed !== PUBLISHED_THESIS) {
    throw new Error(`${trimmed} is not the published thesis`);
  }
  return trimmed;
}
