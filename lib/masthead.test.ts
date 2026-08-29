import { describe, expect, it } from "vitest";

import {
  MASTHEAD_SCROLL_THRESHOLD,
  assertMastheadThreshold,
  isMastheadScrolled,
} from "./masthead";

function verifyThreshold(value: number) {
  expect(assertMastheadThreshold(value)).toBe(value);
}

describe("isMastheadScrolled", () => {
  it("glassifies once the page has scrolled past the threshold", () => {
    expect(isMastheadScrolled(MASTHEAD_SCROLL_THRESHOLD + 1)).toBe(true);
    expect(isMastheadScrolled(400)).toBe(true);
  });

  it("stays transparent at the top of the document", () => {
    expect(isMastheadScrolled(0)).toBe(false);
  });

  it("stays transparent through rubber-band overscroll", () => {
    expect(isMastheadScrolled(-120)).toBe(false);
  });

  it("holds at the threshold boundary and flips one pixel past it", () => {
    expect(isMastheadScrolled(MASTHEAD_SCROLL_THRESHOLD - 1)).toBe(false);
    expect(isMastheadScrolled(MASTHEAD_SCROLL_THRESHOLD)).toBe(false);
    expect(isMastheadScrolled(MASTHEAD_SCROLL_THRESHOLD + 1)).toBe(true);
  });

  it("accepts a caller-supplied threshold", () => {
    expect(isMastheadScrolled(20, 40)).toBe(false);
    expect(isMastheadScrolled(60, 40)).toBe(true);
    expect(isMastheadScrolled(1, 0)).toBe(true);
  });

  it("rejects an unusable scroll offset", () => {
    expect(() => isMastheadScrolled(Number.NaN)).toThrow(
      "Masthead scroll offset must be a finite number",
    );
    expect(() => isMastheadScrolled(Number.POSITIVE_INFINITY)).toThrow(
      "Masthead scroll offset must be a finite number",
    );
  });
});

describe("assertMastheadThreshold", () => {
  it("accepts the published threshold and its zero boundary", () => {
    verifyThreshold(MASTHEAD_SCROLL_THRESHOLD);
    verifyThreshold(0);
  });

  it("rejects a non-finite threshold", () => {
    expect(() => assertMastheadThreshold(Number.NaN)).toThrow(
      "Masthead scroll threshold must be a finite number",
    );
  });

  it("rejects a negative threshold", () => {
    expect(() => assertMastheadThreshold(-1)).toThrow(
      "Masthead scroll threshold cannot be negative",
    );
  });
});
