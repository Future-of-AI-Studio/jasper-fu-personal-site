import { render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { PressTabs, PRESS_TABS } from "./press-tabs";

const pathname = { value: "/press" };

vi.mock("next/navigation", () => ({
  usePathname: () => pathname.value,
}));

/**
 * Every link reports the same box, so the measured marker lands on a known
 * position and the phase machine can be driven without a layout engine.
 */
function stubLayout({ left, width }: { left: number; width: number }) {
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue({
    left,
    width,
    top: 0,
    right: left + width,
    bottom: 0,
    height: 0,
    x: left,
    y: 0,
    toJSON: () => ({}),
  } as DOMRect);
}

function renderTabs(path: string) {
  pathname.value = path;
  return render(
    <PressTabs>
      <p>Panel body</p>
    </PressTabs>,
  );
}

function verifyTabs(container: HTMLElement, currentLabel: string) {
  const nav = screen.getByRole("navigation", { name: "Press sections" });
  const links = within(nav).getAllByRole("link");

  expect(links.map((a) => a.textContent)).toEqual([
    "Press Releases",
    "Media Coverage and Interviews",
  ]);
  expect(links.map((a) => a.getAttribute("href"))).toEqual([
    "/press",
    "/press/media-coverage",
  ]);

  const current = links.filter((a) => a.getAttribute("aria-current") === "page");
  expect(current).toHaveLength(1);
  expect(current[0]?.textContent).toBe(currentLabel);

  const panel = container.querySelector(".press-tabs__panel");
  expect(panel?.textContent).toContain("Panel body");
  expect(nav.contains(panel)).toBe(false);
}

describe("PressTabs", () => {
  beforeEach(() => {
    pathname.value = "/press";
    vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback) => {
      cb(0);
      return 1;
    });
    vi.stubGlobal("cancelAnimationFrame", () => undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("marks the releases tab current from the pathname", () => {
    stubLayout({ left: 0, width: 120 });
    const { container } = renderTabs("/press");
    verifyTabs(container, "Press Releases");
  });

  it("marks the coverage tab current from the pathname", () => {
    stubLayout({ left: 0, width: 120 });
    const { container } = renderTabs("/press/media-coverage");
    verifyTabs(container, "Media Coverage and Interviews");
  });

  it("falls back to the first tab on an unknown path", () => {
    stubLayout({ left: 0, width: 120 });
    // The layout wraps everything under /press, so a future child route
    // still gets a nav with something marked rather than nothing.
    const { container } = renderTabs("/press/something-new");
    verifyTabs(container, "Press Releases");
  });

  it("places the marker on the active tab once measured", () => {
    stubLayout({ left: 40, width: 160 });
    const { container } = renderTabs("/press");

    const marker = container.querySelector<HTMLElement>(".press-tabs__marker");
    expect(marker).toBeTruthy();
    // Both rects stub to left 40, so the offset within the nav is 0.
    expect(marker?.style.getPropertyValue("--press-tab-x")).toBe("0px");
    expect(marker?.style.getPropertyValue("--press-tab-w")).toBe("160px");
  });

  it("arms transitions only after the marker has been placed", () => {
    // Placed first with transitions off, armed on the next frame. Armed on
    // the first pass instead, the underline would slide in from the left
    // edge of the nav every time the page loaded.
    stubLayout({ left: 0, width: 120 });
    const { container } = renderTabs("/press");
    const nav = container.querySelector(".press-tabs__nav");
    expect(nav?.getAttribute("data-marker")).toBe("armed");
  });

  it("renders no marker before the nav has been laid out", () => {
    // No stubbed layout, so every rect reports zeros exactly as it does
    // before first layout, while the nav is hidden, or while a webfont is
    // still swapping. Placing a zero-width underline there would read as
    // the active tab losing its mark, and asserting the rect would throw
    // inside the effect and take the page down with it.
    const { container } = renderTabs("/press");

    expect(container.querySelector(".press-tabs__marker")).toBeNull();
    expect(
      container.querySelector(".press-tabs__nav")?.getAttribute("data-marker"),
    ).toBe("idle");
    // The fallback underline is still what marks the tab in that state.
    expect(
      container.querySelector('a[aria-current="page"]')?.textContent,
    ).toBe("Press Releases");
  });

  it("gives the panel a fresh element per tab so the animation replays", () => {
    stubLayout({ left: 0, width: 120 });
    const { container, rerender } = renderTabs("/press");
    const first = container.querySelector(".press-tabs__panel");

    pathname.value = "/press/media-coverage";
    rerender(
      <PressTabs>
        <p>Panel body</p>
      </PressTabs>,
    );

    expect(container.querySelector(".press-tabs__panel")).not.toBe(first);
  });

  it("publishes both tabs in reading order", () => {
    expect(PRESS_TABS.map((tab) => tab.href)).toEqual([
      "/press",
      "/press/media-coverage",
    ]);
  });
});
