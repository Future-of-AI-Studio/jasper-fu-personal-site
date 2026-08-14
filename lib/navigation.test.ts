import { describe, expect, it } from "vitest";

import {
  BOOKING_NAV_HREF,
  BOOKING_NAV_LABEL,
  HEADER_CTA,
  MAX_NAVIGATION_ITEMS,
  type NavigationItem,
  assertBookingNavLabel,
  assertHeaderCta,
  parseNavigationItems,
  primaryNavigation,
} from "./navigation";

function makeNavigation(count = 1): NavigationItem[] {
  return Array.from({ length: count }, (_, index) => ({
    label: `Page ${index + 1}`,
    href: `/page-${index + 1}`,
  }));
}

function makeHeaderCta(
  overrides: Partial<{ label: string; href: string }> = {},
) {
  return { label: HEADER_CTA.label, href: HEADER_CTA.href, ...overrides };
}

function verifyNavigation(items: NavigationItem[], expectedCount: number) {
  expect(items).toHaveLength(expectedCount);
  expect(items.every((item) => item.label.length > 0)).toBe(true);
  expect(items.every((item) => item.href.startsWith("/"))).toBe(true);
}

function verifyBookingNavLabel(label: string) {
  expect(assertBookingNavLabel(label)).toBe(BOOKING_NAV_LABEL);
}

function verifyHeaderCta(input: { label: string; href: string }) {
  expect(assertHeaderCta(input)).toEqual({
    label: HEADER_CTA.label,
    href: HEADER_CTA.href,
  });
}

describe("parseNavigationItems", () => {
  it("parses the published primary navigation", () => {
    verifyNavigation(
      parseNavigationItems(primaryNavigation),
      primaryNavigation.length,
    );
  });

  it("omits Insights from the published primary navigation", () => {
    expect(primaryNavigation.map((item) => item.label)).not.toContain(
      "Insights",
    );
    expect(primaryNavigation.map((item) => item.href)).not.toContain(
      "/insights",
    );
  });

  it("publishes Booking instead of Book in the primary navigation", () => {
    const parsed = parseNavigationItems(primaryNavigation);
    verifyBookingNavLabel(` ${BOOKING_NAV_LABEL} `);
    expect(
      parsed.some(
        (item) => item.label === BOOKING_NAV_LABEL && item.href === BOOKING_NAV_HREF,
      ),
    ).toBe(true);
    expect(parsed.map((item) => item.label)).not.toContain("Book");
    expect(parsed.map((item) => item.label)).not.toContain("Speaking");
  });

  it("rejects a missing Booking nav label", () => {
    expect(() => assertBookingNavLabel(" ")).toThrow("Booking nav label is required");
  });

  it("rejects the retired Book nav label", () => {
    expect(() => assertBookingNavLabel("Book")).toThrow("Book nav label is not published");
  });

  it("rejects the retired Speaking nav label", () => {
    expect(() => assertBookingNavLabel("Speaking")).toThrow(
      "Speaking nav label is not published",
    );
  });

  it("rejects an unpublished booking nav label", () => {
    expect(() => assertBookingNavLabel("Reserve")).toThrow(
      "Booking nav label must be Booking",
    );
  });

  it("rejects an empty navigation", () => {
    expect(() => parseNavigationItems([])).toThrow(
      "Navigation must include at least one item",
    );
  });

  it("rejects a blank label", () => {
    expect(() =>
      parseNavigationItems([{ label: " ", href: "/page-1" }]),
    ).toThrow("Navigation item 1 requires a label");
  });

  it("rejects an external href", () => {
    expect(() =>
      parseNavigationItems([
        { label: "Page 1", href: "https://example.com" as `/${string}` },
      ]),
    ).toThrow("Navigation item 1 requires an internal href");
  });

  it.each([1, MAX_NAVIGATION_ITEMS - 1, MAX_NAVIGATION_ITEMS])(
    "accepts the %i-item boundary",
    (count) => {
      verifyNavigation(parseNavigationItems(makeNavigation(count)), count);
    },
  );

  it("rejects more than the maximum navigation items", () => {
    expect(() =>
      parseNavigationItems(makeNavigation(MAX_NAVIGATION_ITEMS + 1)),
    ).toThrow(
      `Navigation cannot include more than ${MAX_NAVIGATION_ITEMS} items`,
    );
  });

  it("trims a label before returning it", () => {
    expect(
      parseNavigationItems([{ label: " Page 1 ", href: "/page-1" }])[0]?.label,
    ).toBe("Page 1");
  });
});

describe("assertHeaderCta", () => {
  it("publishes Book to Speak on the speaking page", () => {
    verifyHeaderCta(makeHeaderCta());
  });

  it("trims the published header CTA", () => {
    verifyHeaderCta(makeHeaderCta({ label: " Book to Speak ", href: " /speaking " }));
  });

  it("rejects a missing header CTA label", () => {
    expect(() => assertHeaderCta(makeHeaderCta({ label: " " }))).toThrow(
      "Header CTA label is required",
    );
  });

  it("rejects the retired Media Kit header CTA", () => {
    expect(() => assertHeaderCta(makeHeaderCta({ label: "Media Kit" }))).toThrow(
      "Media Kit header CTA is not published",
    );
  });

  it("rejects an unpublished header CTA label", () => {
    expect(() => assertHeaderCta(makeHeaderCta({ label: "Book now" }))).toThrow(
      "Header CTA must be Book to Speak",
    );
  });

  it("rejects a missing header CTA href", () => {
    expect(() => assertHeaderCta(makeHeaderCta({ href: " " }))).toThrow(
      "Header CTA href is required",
    );
  });

  it("rejects a media kit header CTA href", () => {
    expect(() => assertHeaderCta(makeHeaderCta({ href: "/media-kit" }))).toThrow(
      "Header CTA cannot link to the media kit",
    );
  });

  it("rejects an unpublished header CTA href", () => {
    expect(() => assertHeaderCta(makeHeaderCta({ href: "/contact" }))).toThrow(
      "Header CTA must link to the speaking page",
    );
  });
});
