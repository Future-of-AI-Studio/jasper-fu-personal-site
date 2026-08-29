import { act, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { MEDIA_BAR_LOOP_COPIES, mediaOutlets } from "../../lib/identity";
import { LOGO_CAROUSEL_MEDIA_QUERY } from "../../lib/logo-carousel";
import { LogoCarousel } from "./logo-carousel";

/**
 * The component asks one combined query — narrow AND motion allowed — so the
 * stub reports whether the carousel is live and hands back the listener the
 * component registers, letting a test drive a breakpoint change.
 */
function stubCarouselActive(active: boolean) {
  const listeners = new Set<() => void>();
  const query = {
    matches: active,
    addEventListener: (_: string, listener: () => void) =>
      listeners.add(listener),
    removeEventListener: (_: string, listener: () => void) =>
      listeners.delete(listener),
  };
  vi.stubGlobal("matchMedia", (input: string) => {
    expect(input).toBe(LOGO_CAROUSEL_MEDIA_QUERY);
    return query;
  });
  return {
    setMatches: (next: boolean) => {
      query.matches = next;
      listeners.forEach((listener) => listener());
    },
  };
}

function stubAnimationFrame() {
  const queue: FrameRequestCallback[] = [];
  let nextId = 0;
  const cancel = vi.fn();

  vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
    queue.push(callback);
    nextId += 1;
    return nextId;
  });
  vi.stubGlobal("cancelAnimationFrame", cancel);

  return {
    cancel,
    pendingCount: () => queue.length,
    flushOne: () => {
      const callback = queue.shift();
      callback?.(0);
    },
  };
}

function verifyCarouselStructure() {
  const bar = document.querySelector(".media-bar");
  const track = bar?.querySelector(".media-bar__track");
  const groups = bar?.querySelectorAll(".media-bar__group") ?? [];
  const links = bar?.querySelectorAll(".media-bar__link") ?? [];
  expect(bar).toBeTruthy();
  expect(track).toBeTruthy();
  expect(groups).toHaveLength(MEDIA_BAR_LOOP_COPIES);
  expect(links).toHaveLength(mediaOutlets.length * MEDIA_BAR_LOOP_COPIES);
  expect(bar?.querySelector(".media-bar__edge--left")).toBeTruthy();
  expect(bar?.querySelector(".media-bar__edge--right")).toBeTruthy();
  expect(
    bar?.querySelector(".media-bar__edge--left")?.getAttribute("aria-hidden"),
  ).toBe("true");
  expect(
    bar?.querySelector(".media-bar__edge--right")?.getAttribute("aria-hidden"),
  ).toBe("true");
  return { bar: bar as HTMLElement, links: [...links] as HTMLAnchorElement[] };
}

describe("LogoCarousel", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("renders the same seamless-loop markup as the media bar", () => {
    stubCarouselActive(true);
    stubAnimationFrame();
    render(<LogoCarousel />);

    verifyCarouselStructure();
    for (const outlet of mediaOutlets) {
      const logo = screen.getByRole("img", { name: outlet.name });
      expect(logo.getAttribute("src")).toBe(outlet.logo);
      expect(logo.closest("a")?.getAttribute("href")).toBe(outlet.href);
    }
  });

  it("exposes only the first copy to assistive tech and the tab order", () => {
    stubCarouselActive(true);
    stubAnimationFrame();
    render(<LogoCarousel />);

    const groups = [...document.querySelectorAll(".media-bar__group")];
    expect(groups[0]?.getAttribute("aria-hidden")).toBeNull();
    for (const group of groups.slice(1)) {
      expect(group.getAttribute("aria-hidden")).toBe("true");
      for (const link of group.querySelectorAll("a")) {
        expect(link.getAttribute("tabindex")).toBe("-1");
      }
    }
    // One named logo per outlet, however many copies back it.
    for (const outlet of mediaOutlets) {
      expect(screen.getAllByRole("img", { name: outlet.name })).toHaveLength(1);
    }
  });

  it("applies a centered, sharp, fully-opaque style after one animation frame", () => {
    stubCarouselActive(true);
    const raf = stubAnimationFrame();
    render(<LogoCarousel />);

    const { links } = verifyCarouselStructure();
    expect(raf.pendingCount()).toBe(1);
    raf.flushOne();

    for (const link of links) {
      expect(link.style.transform).toBe("rotateY(0.00deg) translateZ(0.00px)");
      expect(link.style.filter).toBe("none");
      expect(link.style.opacity).toBe("1");
    }
  });

  it("never starts the curve on a desktop-width, static row", () => {
    stubCarouselActive(false);
    const raf = stubAnimationFrame();
    render(<LogoCarousel />);

    const { links } = verifyCarouselStructure();
    expect(raf.pendingCount()).toBe(0);
    for (const link of links) {
      expect(link.style.transform).toBe("");
    }
  });

  it("starts the curve when the viewport narrows to carousel width", () => {
    const media = stubCarouselActive(false);
    const raf = stubAnimationFrame();
    render(<LogoCarousel />);

    expect(raf.pendingCount()).toBe(0);
    act(() => media.setMatches(true));
    expect(raf.pendingCount()).toBe(1);
    raf.flushOne();

    const { links } = verifyCarouselStructure();
    expect(links[0]?.style.transform).toBe("rotateY(0.00deg) translateZ(0.00px)");
  });

  it("clears every curve style when the viewport widens back to a static row", () => {
    const media = stubCarouselActive(true);
    const raf = stubAnimationFrame();
    render(<LogoCarousel />);

    raf.flushOne();
    const { links } = verifyCarouselStructure();
    expect(links[0]?.style.transform).not.toBe("");

    act(() => media.setMatches(false));
    expect(raf.cancel).toHaveBeenCalled();
    for (const link of links) {
      expect(link.style.transform).toBe("");
      expect(link.style.filter).toBe("");
      expect(link.style.opacity).toBe("");
    }
  });

  it("degrades to the static layout when requestAnimationFrame is unavailable", () => {
    stubCarouselActive(true);
    vi.stubGlobal("requestAnimationFrame", undefined);
    render(<LogoCarousel />);

    const { links } = verifyCarouselStructure();
    for (const link of links) {
      expect(link.style.transform).toBe("");
    }
  });

  it("cancels the in-flight animation frame on unmount", () => {
    stubCarouselActive(true);
    const raf = stubAnimationFrame();
    const { unmount } = render(<LogoCarousel />);

    expect(raf.pendingCount()).toBe(1);
    unmount();
    expect(raf.cancel).toHaveBeenCalledTimes(1);
    expect(raf.cancel).toHaveBeenCalledWith(1);
  });
});
