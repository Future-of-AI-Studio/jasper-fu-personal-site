import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { parseNavigationItems, primaryNavigation } from "../../lib/navigation";
import { NavigationList, currentNavPath } from "./primary-nav";

const pathname = vi.hoisted(() => ({ value: "/" }));

vi.mock("next/navigation", () => ({
  usePathname: () => pathname.value,
}));

const navigation = parseNavigationItems(primaryNavigation);

afterEach(() => {
  cleanup();
});

function renderAt(path: string) {
  // Several assertions re-render inside one test, so clear the prior tree
  // rather than querying two navs at once.
  cleanup();
  pathname.value = path;
  return render(<NavigationList items={navigation} />);
}

function verifyCurrent(path: string, expectedLabel: string | null) {
  renderAt(path);
  const marked = screen
    .getAllByRole("link")
    .filter((link) => link.getAttribute("aria-current") === "page");

  if (expectedLabel === null) {
    expect(marked).toHaveLength(0);
    return;
  }

  expect(marked).toHaveLength(1);
  expect(marked[0]?.textContent).toBe(expectedLabel);
}

describe("NavigationList", () => {
  it("renders every published navigation item once", () => {
    renderAt("/");
    expect(screen.getAllByRole("link")).toHaveLength(navigation.length);
    for (const item of navigation) {
      expect(
        screen.getByRole("link", { name: item.label }).getAttribute("href"),
      ).toBe(item.href);
    }
  });

  it("marks the current page for each route", () => {
    verifyCurrent("/", "Home");
    verifyCurrent("/about", "About");
    verifyCurrent("/press", "Press");
    verifyCurrent("/speaking", "Booking");
    verifyCurrent("/media-kit", "Media Kit");
    verifyCurrent("/contact", "Contact");
  });

  it("keeps Press current on the nested media coverage tab", () => {
    verifyCurrent("/press/media-coverage", "Press");
  });

  it("marks nothing on a route outside the navigation", () => {
    verifyCurrent("/terms", null);
  });

  it("omits aria-current entirely on inactive items", () => {
    renderAt("/about");
    const home = screen.getByRole("link", { name: "Home" });
    expect(home.hasAttribute("aria-current")).toBe(false);
  });
});

describe("currentNavPath", () => {
  it("passes through an absolute path", () => {
    expect(currentNavPath("/about")).toBe("/about");
  });

  it("trims surrounding whitespace", () => {
    expect(currentNavPath("  /about  ")).toBe("/about");
  });

  it("returns null rather than throwing for an unusable pathname", () => {
    expect(currentNavPath(null)).toBeNull();
    expect(currentNavPath(undefined)).toBeNull();
    expect(currentNavPath("")).toBeNull();
    expect(currentNavPath("about")).toBeNull();
  });

  it("marks nothing current when the router gives no usable path", () => {
    verifyCurrent("", null);
  });
});
