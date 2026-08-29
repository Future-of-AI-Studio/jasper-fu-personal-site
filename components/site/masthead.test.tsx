import { act, cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { MASTHEAD_SCROLL_THRESHOLD } from "../../lib/masthead";
import { Masthead } from "./masthead";

afterEach(() => {
  cleanup();
  window.scrollY = 0;
});

function scrollTo(offset: number) {
  act(() => {
    window.scrollY = offset;
    window.dispatchEvent(new Event("scroll"));
  });
}

function header() {
  return document.querySelector("header.masthead");
}

function verifyScrolled(expected: "true" | "false") {
  expect(header()?.getAttribute("data-scrolled")).toBe(expected);
}

describe("Masthead", () => {
  it("renders its children inside the masthead element", () => {
    render(
      <Masthead>
        <p>header content</p>
      </Masthead>,
    );
    expect(header()?.textContent).toBe("header content");
  });

  it("starts transparent at the top of the page", () => {
    render(<Masthead>chrome</Masthead>);
    verifyScrolled("false");
  });

  it("glassifies after the page scrolls past the threshold", () => {
    render(<Masthead>chrome</Masthead>);
    scrollTo(MASTHEAD_SCROLL_THRESHOLD + 40);
    verifyScrolled("true");
  });

  it("returns to transparent when scrolled back to the top", () => {
    render(<Masthead>chrome</Masthead>);
    scrollTo(200);
    verifyScrolled("true");
    scrollTo(0);
    verifyScrolled("false");
  });

  it("holds at the threshold boundary", () => {
    render(<Masthead>chrome</Masthead>);
    scrollTo(MASTHEAD_SCROLL_THRESHOLD);
    verifyScrolled("false");
    scrollTo(MASTHEAD_SCROLL_THRESHOLD + 1);
    verifyScrolled("true");
  });

  it("picks up a page already scrolled on mount", () => {
    window.scrollY = 500;
    render(<Masthead>chrome</Masthead>);
    verifyScrolled("true");
  });

  it("stops listening once unmounted", () => {
    const { unmount } = render(<Masthead>chrome</Masthead>);
    unmount();
    expect(() => scrollTo(300)).not.toThrow();
    expect(header()).toBeNull();
  });
});
