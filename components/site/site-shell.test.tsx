import { render, screen, within } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { REVEAL_NOSCRIPT_FALLBACK, SiteShell } from "./site-shell";

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
  expect(document.querySelector("canvas.network-field")).toBeNull();

  const footerNav = screen.getByRole("navigation", { name: "Legal" });
  const contact = document.querySelector(".site-footer__contact");
  expect(contact).toBeTruthy();
  expect(
    screen.getByRole("heading", { level: 2, name: "Get in touch" }),
  ).toBeTruthy();
  expect(
    screen.getByText(
      "Working on a story about stablecoin infrastructure, programmable money, or payments orchestration?",
    ),
  ).toBeTruthy();
  const footerContactLink = within(contact as HTMLElement).getByRole("link", {
    name: "Contact",
  });
  expect(footerContactLink.getAttribute("href")).toBe("/contact");
  // The contact block trails the legal nav in the footer grid, which places
  // it in the rightmost column on desktop rather than beside the brand mark.
  expect(
    footerNav.compareDocumentPosition(contact as Node) &
      Node.DOCUMENT_POSITION_FOLLOWING,
  ).toBeTruthy();
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

  it("restores the scroll reveal for a reader with scripting off", () => {
    // Asserted against the server markup, not the client DOM: React drops
    // noscript children once scripting is on, so the style exists only in
    // the shipped HTML — which is the one place it has to.
    const markup = renderToStaticMarkup(
      <SiteShell>
        <p>Page body</p>
      </SiteShell>,
    );

    // The reveal hides [data-reveal] from first paint so a section is never
    // painted and then taken away. Nothing adds .is-revealed without
    // scripting, so without this the home page is blank below the hero.
    expect(markup).toContain(
      `<noscript><style>${REVEAL_NOSCRIPT_FALLBACK}</style></noscript>`,
    );
    expect(REVEAL_NOSCRIPT_FALLBACK).toContain("[data-reveal]");
    expect(REVEAL_NOSCRIPT_FALLBACK).toContain("opacity:1!important");
    expect(REVEAL_NOSCRIPT_FALLBACK).toContain("transform:none!important");
    // It has to outrank the scoped hidden state, which carries body:has().
    expect(REVEAL_NOSCRIPT_FALLBACK.match(/!important/g)).toHaveLength(2);
  });
});
