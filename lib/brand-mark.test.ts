import { describe, expect, it } from "vitest";

import {
  assertMonogram,
  assertSealSrc,
  PUBLISHED_MONOGRAM,
  PUBLISHED_SEAL_SRC,
} from "./brand-mark";

function verifyMonogram(value: string, expected: string) {
  expect(assertMonogram(value)).toBe(expected);
}

function verifySealSrc(value: string, expected: string) {
  expect(assertSealSrc(value)).toBe(expected);
}

describe("assertMonogram", () => {
  it("accepts the published JF. monogram", () => {
    verifyMonogram(" JF. ", PUBLISHED_MONOGRAM);
  });

  it("rejects a missing monogram", () => {
    expect(() => assertMonogram(" ")).toThrow("Monogram is required");
  });

  it("rejects the brand-kit placeholder YN.", () => {
    expect(() => assertMonogram("YN.")).toThrow(
      "Placeholder monogram YN. is not published",
    );
  });

  it("rejects an unpublished monogram", () => {
    expect(() => assertMonogram("XX.")).toThrow(
      "XX. is not the published monogram",
    );
  });
});

describe("assertSealSrc", () => {
  it("accepts the published circular seal path", () => {
    verifySealSrc(` ${PUBLISHED_SEAL_SRC} `, PUBLISHED_SEAL_SRC);
  });

  it("rejects a missing seal source", () => {
    expect(() => assertSealSrc(" ")).toThrow("Seal source is required");
  });

  it("rejects a placeholder YN seal", () => {
    expect(() => assertSealSrc("/media-kit/YN-seal.png")).toThrow(
      "Placeholder seal YN is not published",
    );
  });

  it("rejects an unpublished seal path", () => {
    expect(() => assertSealSrc("/media-kit/jasper-fu-monogram.svg")).toThrow(
      "/media-kit/jasper-fu-monogram.svg is not the published seal",
    );
  });
});
