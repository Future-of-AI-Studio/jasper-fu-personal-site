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
  it("renders the circular seal alone as the home link", () => {
    const { container } = render(<Wordmark />);
    verifySeal(container);
    expect(container.querySelector(".wordmark")).toBeTruthy();

    const home = container.querySelector("a.wordmark__home");
    expect(home?.getAttribute("href")).toBe("/");
    expect(home?.getAttribute("aria-label")).toBe(identity.name);
  });

  it("no longer repeats the name and Coinsub title from the hero", () => {
    const { container } = render(<Wordmark />);
    expect(container.querySelector(".wordmark__lockup")).toBeNull();
    expect(container.querySelector(".wordmark__name")).toBeNull();
    expect(container.querySelector(".wordmark__tag")).toBeNull();
    expect(screen.queryByText(identity.name)).toBeNull();
    expect(screen.queryByText(identity.title)).toBeNull();
    expect(screen.queryByRole("link", { name: "Coinsub" })).toBeNull();
  });
});
