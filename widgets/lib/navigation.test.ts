import { describe, expect, it } from "vitest";

import {
  MAX_NAVIGATION_ITEMS,
  type NavigationItem,
  parseNavigationItems,
} from "./navigation";

function makeNavigation(count = 1): NavigationItem[] {
  return Array.from({ length: count }, (_, index) => ({
    label: `Page ${index + 1}`,
    href: `/page-${index + 1}`,
  }));
}

function verifyNavigation(items: NavigationItem[], expectedCount: number) {
  expect(items).toHaveLength(expectedCount);
  expect(items.every((item) => item.label.length > 0)).toBe(true);
  expect(items.every((item) => item.href.startsWith("/"))).toBe(true);
}

describe("parseNavigationItems", () => {
  it("parses a normal navigation collection", () => {
    verifyNavigation(parseNavigationItems(makeNavigation(3)), 3);
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
