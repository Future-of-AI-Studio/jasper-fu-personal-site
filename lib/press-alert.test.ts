import { describe, expect, it, vi } from "vitest";

import { parsePressAlertEmail } from "./press-alert";

describe("parsePressAlertEmail", () => {
  it("accepts a valid email", () => {
    expect(parsePressAlertEmail("  editor@example.com ")).toBe(
      "editor@example.com",
    );
  });

  it("rejects a missing email", () => {
    expect(() => parsePressAlertEmail("")).toThrow("Email is required");
  });

  it("rejects an invalid email", () => {
    expect(() => parsePressAlertEmail("not-an-email")).toThrow(
      "Email must be valid",
    );
  });
});

describe("copyTextToClipboard via media-kit", () => {
  it("writes trimmed approved copy", async () => {
    const { copyTextToClipboard } = await import("./media-kit");
    const writeText = vi.fn().mockResolvedValue(undefined);
    await copyTextToClipboard(writeText, "  Approved bio  ");
    expect(writeText).toHaveBeenCalledWith("Approved bio");
  });

  it("rejects empty copy", async () => {
    const { copyTextToClipboard } = await import("./media-kit");
    expect(() => copyTextToClipboard(vi.fn(), "   ")).toThrow(
      "There is no approved copy to clipboard",
    );
  });
});

describe("assertMediaKitPhoto", () => {
  it("accepts the published speaking photo", async () => {
    const { assertMediaKitPhoto, MEDIA_KIT_SPEAKING_PHOTO } = await import(
      "./media-kit"
    );
    expect(assertMediaKitPhoto(` ${MEDIA_KIT_SPEAKING_PHOTO} `)).toBe(
      MEDIA_KIT_SPEAKING_PHOTO,
    );
  });

  it("rejects a missing photo source", async () => {
    const { assertMediaKitPhoto } = await import("./media-kit");
    expect(() => assertMediaKitPhoto(" ")).toThrow(
      "Media kit photo source is required",
    );
  });

  it("rejects a placeholder photo", async () => {
    const { assertMediaKitPhoto } = await import("./media-kit");
    expect(() => assertMediaKitPhoto("/media-kit/placeholder.jpg")).toThrow(
      "Placeholder media kit photo is not published",
    );
  });

  it("rejects an unpublished photo path", async () => {
    const { assertMediaKitPhoto } = await import("./media-kit");
    expect(() => assertMediaKitPhoto("/media-kit/other.jpg")).toThrow(
      "/media-kit/other.jpg is not the published media kit photo",
    );
  });
});
