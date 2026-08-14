import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { SiteShell } from "./site-shell";

function verifySiteShell() {
  const primary = screen.getByRole("navigation", {
    name: "Primary navigation",
  });

  expect(within(primary).getByRole("link", { name: "Services" })).toBeTruthy();
  expect(within(primary).getByRole("link", { name: "Contact" })).toBeTruthy();
  expect(
    screen
      .getByRole("link", { name: "Skip to main content" })
      .getAttribute("href"),
  ).toBe("#main-content");
  expect(
    screen.getByText("Make the market pay attention."),
  ).toBeTruthy();
}

describe("SiteShell", () => {
  it("renders the shared public navigation and footer", () => {
    render(
      <SiteShell>
        <h1>Page content</h1>
      </SiteShell>,
    );

    verifySiteShell();
    expect(screen.getByRole("heading", { name: "Page content" })).toBeTruthy();
  });

  it("provides mobile navigation and client portal access", () => {
    render(
      <SiteShell>
        <p>Page content</p>
      </SiteShell>,
    );

    const mobileNavigation = screen.getByRole("navigation", {
      name: "Mobile navigation",
    });

    expect(
      within(mobileNavigation)
        .getByRole("link", { name: "Client portal" })
        .getAttribute("href"),
    ).toBe("/auth");
    expect(screen.getByLabelText("Open navigation")).toBeTruthy();
  });
});
