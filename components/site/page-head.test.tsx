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

  it("rejects a missing eyebrow", () => {
    expect(() => assertPageHead({ eyebrow: " ", title: happyHead.title })).toThrow(
      "Page head eyebrow is required",
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
});
