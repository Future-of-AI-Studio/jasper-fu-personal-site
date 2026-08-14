import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { identity } from "../../lib/identity";
import { PUBLISHED_SEAL_SRC } from "../../lib/brand-mark";
import { CoinsubMark, JasperSeal, Wordmark } from "./brand";

function verifySeal(container: HTMLElement) {
  const mark = container.querySelector("img.jasper-seal");
  expect(mark?.getAttribute("src")).toBe(PUBLISHED_SEAL_SRC);
  expect(mark?.getAttribute("alt")).toBe(identity.name);
}

function verifyCoinsubMark(linked: boolean) {
  const logo = screen.getByRole("img", { name: "Coinsub" });
  expect(logo.getAttribute("src")).toBe("/logos/coinsub-logo.svg");

  if (linked) {
    expect(logo.closest("a")?.getAttribute("href")).toBe(identity.coinsubUrl);
    return;
  }

  expect(logo.closest("a")).toBeNull();
}

describe("JasperSeal", () => {
  it("renders the circular screenshot seal", () => {
    const { container } = render(<JasperSeal />);
    verifySeal(container);
  });
});

describe("CoinsubMark", () => {
  it("links the Coinsub wordmark to the company site", () => {
    render(<CoinsubMark />);
    verifyCoinsubMark(true);
  });

  it("can render the Coinsub wordmark without a link", () => {
    render(<CoinsubMark linked={false} />);
    verifyCoinsubMark(false);
  });
});

describe("Wordmark", () => {
  it("pairs the circular seal with Jasper Fu's name and a linked Coinsub title", () => {
    const { container } = render(<Wordmark />);
    verifySeal(container);
    expect(container.querySelector(".wordmark")).toBeTruthy();
    expect(container.querySelector("a.wordmark__home")?.getAttribute("href")).toBe(
      "/",
    );
    expect(screen.getByText(identity.name)).toBeTruthy();
    expect(
      screen.getByText((_, node) =>
        Boolean(
          node?.classList.contains("wordmark__tag") &&
            node.textContent === identity.title,
        ),
      ),
    ).toBeTruthy();
    expect(screen.getByRole("link", { name: "Coinsub" }).getAttribute("href")).toBe(
      identity.coinsubUrl,
    );
    expect(screen.queryByRole("img", { name: "Coinsub" })).toBeNull();
  });
});
