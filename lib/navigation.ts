export const MAX_NAVIGATION_ITEMS = 7;

export type NavigationItem = {
  label: string;
  href: `/${string}`;
};

export const BOOKING_NAV_LABEL = "Booking";
export const BOOKING_NAV_HREF = "/speaking" as const;

export function assertBookingNavLabel(value: string) {
  const trimmed = value.trim();
  if (!trimmed) {
    throw new Error("Booking nav label is required");
  }
  if (trimmed === "Book") {
    throw new Error("Book nav label is not published");
  }
  if (trimmed === "Speaking") {
    throw new Error("Speaking nav label is not published");
  }
  if (trimmed !== BOOKING_NAV_LABEL) {
    throw new Error("Booking nav label must be Booking");
  }
  return trimmed;
}

export const primaryNavigation = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Press", href: "/press" },
  { label: assertBookingNavLabel(BOOKING_NAV_LABEL), href: BOOKING_NAV_HREF },
  { label: "Media Kit", href: "/media-kit" },
  { label: "Contact", href: "/contact" },
] satisfies NavigationItem[];

export const HEADER_CTA = {
  label: "Book to Speak",
  href: "/speaking",
} as const;

export const footerLegalNavigation = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Cookie Policy", href: "/cookies" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Legal and Compliance", href: "/legal" },
] satisfies NavigationItem[];

export function parseNavigationItems(items: NavigationItem[]) {
  if (items.length === 0) {
    throw new Error("Navigation must include at least one item");
  }

  if (items.length > MAX_NAVIGATION_ITEMS) {
    throw new Error(
      `Navigation cannot include more than ${MAX_NAVIGATION_ITEMS} items`,
    );
  }

  return items.map((item, index) => {
    if (item.label.trim().length === 0) {
      throw new Error(`Navigation item ${index + 1} requires a label`);
    }

    if (!item.href.startsWith("/")) {
      throw new Error(`Navigation item ${index + 1} requires an internal href`);
    }

    return { ...item, label: item.label.trim() };
  });
}

export function assertHeaderCta(input: { label: string; href: string }) {
  const label = input.label.trim();
  const href = input.href.trim();

  if (!label) {
    throw new Error("Header CTA label is required");
  }
  if (label === "Media Kit") {
    throw new Error("Media Kit header CTA is not published");
  }
  if (label !== HEADER_CTA.label) {
    throw new Error("Header CTA must be Book to Speak");
  }
  if (!href) {
    throw new Error("Header CTA href is required");
  }
  if (href === "/media-kit") {
    throw new Error("Header CTA cannot link to the media kit");
  }
  if (href !== HEADER_CTA.href) {
    throw new Error("Header CTA must link to the speaking page");
  }

  return { label, href };
}
