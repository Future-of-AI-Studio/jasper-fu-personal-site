import { describe, expect, it } from "vitest";

import { interimBlogPosts } from "./copy";
import {
  assertPressThumbnail,
  PRESS_THUMB_HEIGHT,
  PRESS_THUMB_WIDTH,
  PRESS_THUMBNAIL_PREFIX,
} from "./press-thumbnail";

function verifyPressThumbnail(value: string, expected: string) {
  expect(assertPressThumbnail(value)).toBe(expected);
}

describe("assertPressThumbnail", () => {
  it("accepts a published local press thumbnail", () => {
    verifyPressThumbnail(
      " /press/next-alternative-payment-method.png ",
      "/press/next-alternative-payment-method.png",
    );
  });

  it("rejects a missing thumbnail source", () => {
    expect(() => assertPressThumbnail(" ")).toThrow(
      "Press thumbnail source is required",
    );
  });

  it("rejects a placeholder thumbnail", () => {
    expect(() => assertPressThumbnail("/press/placeholder.png")).toThrow(
      "Placeholder press thumbnail is not published",
    );
  });

  it("rejects a remote or non-press path", () => {
    expect(() =>
      assertPressThumbnail("https://cdn.example.com/post.png"),
    ).toThrow("Press thumbnail must be a local /press/ asset");
  });
});

describe("interimBlogPosts thumbnails", () => {
  it("gives every press card a unique local thumbnail", () => {
    const images = interimBlogPosts.map((post) =>
      assertPressThumbnail(post.image),
    );
    expect(images).toHaveLength(interimBlogPosts.length);
    expect(new Set(images).size).toBe(interimBlogPosts.length);
    expect(images.every((src) => src.startsWith(PRESS_THUMBNAIL_PREFIX))).toBe(
      true,
    );
  });

  it("publishes a 16:9 intrinsic thumbnail size", () => {
    expect(PRESS_THUMB_WIDTH).toBeGreaterThan(0);
    expect(PRESS_THUMB_HEIGHT).toBeGreaterThan(0);
    expect(PRESS_THUMB_WIDTH * 9).toBe(PRESS_THUMB_HEIGHT * 16);
  });
});
