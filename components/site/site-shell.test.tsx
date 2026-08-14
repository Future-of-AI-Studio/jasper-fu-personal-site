import { render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { SiteShell } from "./site-shell";

function verifySiteShell() {
  const primary = screen.getByRole("navigation", {
    name: "Primary navigation",
  });

  expect(within(primary).getByRole("link", { name: "Booking" })).toBeTruthy();
  expect(within(primary).queryByRole("link", { name: /^Book$/ })).toBeNull();
  expect(within(primary).queryByRole("link", { name: "Speaking" })).toBeNull();
  expect(within(primary).getByRole("link", { name: "Media Kit" })).toBeTruthy();
  expect(screen.getByRole("link", { name: "Skip to main content" }).getAttribute("href")).toBe(
    "#main-content",
  );
  const headerCta = document.querySelector(".header-cta");
  expect(headerCta?.textContent).toBe("Book to Speak");
  expect(headerCta?.getAttribute("href")).toBe("/speaking");
  expect(screen.getByRole("link", { name: "Book to Speak" }).getAttribute("href")).toBe(
    "/speaking",
  );
  expect(document.querySelector(".masthead")).toBeTruthy();
  expect(document.querySelectorAll("img.jasper-seal").length).toBeGreaterThan(0);
  expect(screen.getByText("© 2026 Jasper Fu")).toBeTruthy();
  expect(
    screen.getAllByRole("link", { name: "Coinsub" }).every(
      (link) => link.getAttribute("href") === "https://www.coinsub.io/",
    ),
  ).toBe(true);
  expect(screen.getByRole("link", { name: "LinkedIn" }).getAttribute("href")).toBe(
    "https://www.linkedin.com/in/jasper-fu",
  );
  expect(
    screen.getByRole("link", { name: "Terms of Service" }).getAttribute("href"),
  ).toBe("/terms");
  expect(document.querySelector("canvas.network-field")).toBeTruthy();
}

describe("SiteShell", () => {
  beforeEach(() => {
    vi.stubGlobal("matchMedia", () => ({ matches: true }));
    vi.stubGlobal("requestAnimationFrame", () => 1);
    vi.stubGlobal("cancelAnimationFrame", () => undefined);
    Object.defineProperty(HTMLCanvasElement.prototype, "getContext", {
      configurable: true,
      value: () => ({
        clearRect: () => undefined,
        beginPath: () => undefined,
        moveTo: () => undefined,
        lineTo: () => undefined,
        stroke: () => undefined,
        arc: () => undefined,
        fill: () => undefined,
        setTransform: () => undefined,
        globalAlpha: 1,
        strokeStyle: "",
        fillStyle: "",
        lineWidth: 1,
      }),
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("renders the shared public navigation, Book to Speak CTA, and legal footer", () => {
    render(
      <SiteShell>
        <p>Page body</p>
      </SiteShell>,
    );

    verifySiteShell();
  });
});
