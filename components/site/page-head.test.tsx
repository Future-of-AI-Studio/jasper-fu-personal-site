import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { identity } from "../../lib/identity";
import { assertPageHead, PageHead } from "./page-head";

const happyHead = {
  eyebrow: "About",
  title: "Jasper Fu",
  lede: identity.thesis,
};

function verifyPageHead(heading: string, eyebrow: string) {
  expect(screen.getByRole("heading", { level: 1, name: heading })).toBeTruthy();
  expect(screen.getByText(eyebrow)).toBeTruthy();
}

describe("assertPageHead", () => {
  it("returns trimmed copy on the happy path", () => {
    expect(assertPageHead({ eyebrow: " About ", title: " Jasper Fu " })).toEqual({
      eyebrow: "About",
      title: "Jasper Fu",
    });
  });

  it("omits the eyebrow when none is given", () => {
    // Every public page used to carry one naming the page it was already on,
    // above a heading saying much the same thing. They were retired, so an
    // absent eyebrow is now the normal case rather than a fault.
    expect(assertPageHead({ title: "Jasper Fu" })).toEqual({
      title: "Jasper Fu",
    });
  });

  it("rejects an empty eyebrow", () => {
    // Passing "" is a mistake, not a decision: omit the prop instead.
    expect(() => assertPageHead({ eyebrow: " ", title: happyHead.title })).toThrow(
      "Page head eyebrow cannot be empty",
    );
  });

  it("rejects a missing title", () => {
    expect(() => assertPageHead({ eyebrow: happyHead.eyebrow, title: " " })).toThrow(
      "Page head title is required",
    );
  });
});

describe("PageHead", () => {
  it("renders eyebrow, title, and lede", () => {
    render(<PageHead {...happyHead} />);
    verifyPageHead(happyHead.title, happyHead.eyebrow);
    expect(screen.getByText(happyHead.lede)).toBeTruthy();
  });

  it("omits the lede when it is not provided", () => {
    render(<PageHead eyebrow={happyHead.eyebrow} title={happyHead.title} />);
    verifyPageHead(happyHead.title, happyHead.eyebrow);
    expect(screen.queryByText(happyHead.lede)).toBeNull();
  });

  it("renders no eyebrow element when none is given", () => {
    const { container } = render(<PageHead title={happyHead.title} />);
    expect(
      screen.getByRole("heading", { level: 1, name: happyHead.title }),
    ).toBeTruthy();
    expect(container.querySelectorAll(".eyebrow")).toHaveLength(0);
  });
});
