// @vitest-environment node
import { describe, expect, it } from "vitest";

import { PUBLISHED_SEAL_SRC } from "./brand-mark";
import {
  GATE_COOKIE_NAME,
  GATE_HOME_PATH,
  GATE_PASSWORD_ENV,
  GATE_SESSION_MAX_AGE_SECONDS,
  GATE_UNLOCK_ENDPOINT,
  GATE_UNLOCK_PATH,
  MAX_GATE_PASSWORD_LENGTH,
  MIN_GATE_PASSWORD_LENGTH,
  assertGatePath,
  buildUnlockPath,
  createGateSession,
  createGateToken,
  gateCookieOptions,
  isGateBypassPath,
  isGateEnabled,
  parseUnlockSubmission,
  resolveGateConfig,
  resolveNextPath,
  timingSafeEqual,
  verifyGateToken,
} from "./gate";

const PASSWORD = "press-preview-2026";
const NOW = 1_760_000_000_000;

function makeEnv(overrides: Record<string, string | undefined> = {}) {
  return { [GATE_PASSWORD_ENV]: PASSWORD, ...overrides };
}

function verifyEnabledConfig(env: Record<string, string | undefined>) {
  const config = resolveGateConfig(env);
  expect(config.enabled).toBe(true);
  expect(config.password).toBe(PASSWORD);
  expect(isGateEnabled(env)).toBe(true);
  return config;
}

function verifyDisabledConfig(env: Record<string, string | undefined>) {
  const config = resolveGateConfig(env);
  expect(config.enabled).toBe(false);
  expect(config.password).toBe("");
  expect(isGateEnabled(env)).toBe(false);
}

function verifyConfigFailure(
  value: string,
  message: string,
) {
  expect(() => resolveGateConfig(makeEnv({ [GATE_PASSWORD_ENV]: value }))).toThrow(
    message,
  );
}

async function makeToken(
  overrides: { password?: string; expiresAtMs?: number } = {},
) {
  return createGateToken(
    overrides.password ?? PASSWORD,
    overrides.expiresAtMs ?? NOW + 60_000,
  );
}

async function verifyTokenAccepted(token: string, nowMs = NOW) {
  expect(await verifyGateToken(token, PASSWORD, nowMs)).toBe(true);
}

async function verifyTokenRejected(
  token: unknown,
  { password = PASSWORD, nowMs = NOW }: { password?: string; nowMs?: number } = {},
) {
  expect(await verifyGateToken(token, password, nowMs)).toBe(false);
}

describe("resolveGateConfig", () => {
  it("enables the gate when a usable password is configured", () => {
    verifyEnabledConfig(makeEnv());
  });

  it("trims surrounding whitespace from the configured password", () => {
    verifyEnabledConfig(makeEnv({ [GATE_PASSWORD_ENV]: `  ${PASSWORD}  ` }));
  });

  it("leaves the site public when no password is configured", () => {
    verifyDisabledConfig({});
    verifyDisabledConfig(makeEnv({ [GATE_PASSWORD_ENV]: undefined }));
  });

  it("leaves the site public for an empty or whitespace-only password", () => {
    verifyDisabledConfig(makeEnv({ [GATE_PASSWORD_ENV]: "" }));
    verifyDisabledConfig(makeEnv({ [GATE_PASSWORD_ENV]: "   " }));
  });

  it("rejects a password below the minimum length", () => {
    verifyConfigFailure(
      "a".repeat(MIN_GATE_PASSWORD_LENGTH - 1),
      `Site password must be at least ${MIN_GATE_PASSWORD_LENGTH} characters`,
    );
  });

  it("rejects a password above the maximum length", () => {
    verifyConfigFailure(
      "a".repeat(MAX_GATE_PASSWORD_LENGTH + 1),
      `Site password must be at most ${MAX_GATE_PASSWORD_LENGTH} characters`,
    );
  });

  it.each([MIN_GATE_PASSWORD_LENGTH, MAX_GATE_PASSWORD_LENGTH - 1, MAX_GATE_PASSWORD_LENGTH])(
    "accepts a password at the %i-character boundary",
    (length) => {
      const password = "a".repeat(length);
      const config = resolveGateConfig(
        makeEnv({ [GATE_PASSWORD_ENV]: password }),
      );
      expect(config.enabled).toBe(true);
      expect(config.password).toHaveLength(length);
    },
  );
});

describe("assertGatePath", () => {
  it("returns an absolute path unchanged", () => {
    expect(assertGatePath("/about")).toBe("/about");
  });

  it.each([undefined, null, 42, "", "   "])(
    "rejects a missing gate path (%s)",
    (value) => {
      expect(() => assertGatePath(value)).toThrow("Gate path is required");
    },
  );

  it("rejects a path that does not start with a slash", () => {
    expect(() => assertGatePath("about")).toThrow(
      "Gate path must start with a slash",
    );
  });
});

describe("isGateBypassPath", () => {
  it.each([
    GATE_UNLOCK_PATH,
    GATE_UNLOCK_ENDPOINT,
    "/robots.txt",
    "/favicon.ico",
    "/icon.png",
    "/apple-icon.png",
    PUBLISHED_SEAL_SRC,
    "/_next/static/chunk.js",
  ])("lets %s through the gate", (path) => {
    expect(isGateBypassPath(path)).toBe(true);
  });

  it.each([
    "/",
    "/about",
    "/press/media-coverage",
    "/sitemap.xml",
    "/media-kit/other-asset.png",
    "/portraits/jasper-fu-placeholder.jpg",
  ])("gates %s", (path) => {
    expect(isGateBypassPath(path)).toBe(false);
  });
});

describe("resolveNextPath", () => {
  it.each(["/about", "/press/media-coverage", "/contact?type=interview"])(
    "keeps the same-origin path %s",
    (path) => {
      expect(resolveNextPath(path)).toBe(path);
    },
  );

  it.each([
    "//evil.example.com",
    "https://evil.example.com",
    "/\\evil.example.com",
    "/about\\..\\admin",
    "about",
    "",
    "   ",
  ])("falls back home for the unsafe target %s", (path) => {
    expect(resolveNextPath(path)).toBe(GATE_HOME_PATH);
  });

  it.each([undefined, null, 42, {}])(
    "falls back home for the non-string target %s",
    (value) => {
      expect(resolveNextPath(value)).toBe(GATE_HOME_PATH);
    },
  );

  it("never loops back to the unlock screen", () => {
    expect(resolveNextPath(GATE_UNLOCK_PATH)).toBe(GATE_HOME_PATH);
    expect(resolveNextPath(`${GATE_UNLOCK_PATH}?next=%2Fabout`)).toBe(
      GATE_HOME_PATH,
    );
  });
});

describe("buildUnlockPath", () => {
  it("remembers the requested page", () => {
    expect(buildUnlockPath("/press")).toBe(`${GATE_UNLOCK_PATH}?next=%2Fpress`);
    expect(buildUnlockPath("/contact?type=interview")).toBe(
      `${GATE_UNLOCK_PATH}?next=%2Fcontact%3Ftype%3Dinterview`,
    );
  });

  it("omits the redirect for the home page and the unlock screen itself", () => {
    expect(buildUnlockPath(GATE_HOME_PATH)).toBe(GATE_UNLOCK_PATH);
    expect(buildUnlockPath(GATE_UNLOCK_PATH)).toBe(GATE_UNLOCK_PATH);
  });

  it("rejects a relative requested path", () => {
    expect(() => buildUnlockPath("press")).toThrow(
      "Gate path must start with a slash",
    );
  });
});

describe("parseUnlockSubmission", () => {
  it("parses a password with a sanitized redirect", () => {
    const submission = parseUnlockSubmission({
      password: PASSWORD,
      next: "/press",
    });
    expect(submission.password).toBe(PASSWORD);
    expect(submission.next).toBe("/press");
  });

  it("defaults to the home page when no redirect is supplied", () => {
    expect(parseUnlockSubmission({ password: PASSWORD }).next).toBe(
      GATE_HOME_PATH,
    );
  });

  it("drops an off-site redirect", () => {
    expect(
      parseUnlockSubmission({
        password: PASSWORD,
        next: "https://evil.example.com",
      }).next,
    ).toBe(GATE_HOME_PATH);
  });

  it.each([
    [{}, "Password is required"],
    [{ password: "" }, "Password is required"],
    [{ password: null }, "Password is required"],
    [{ password: 12345678 }, "Password is required"],
    [
      { password: "a".repeat(MAX_GATE_PASSWORD_LENGTH + 1) },
      "Password is too long",
    ],
  ])("rejects invalid input with a specific error", (input, message) => {
    expect(() => parseUnlockSubmission(input)).toThrow(message);
  });

  it.each([1, MAX_GATE_PASSWORD_LENGTH - 1, MAX_GATE_PASSWORD_LENGTH])(
    "accepts a submitted password at the %i-character boundary",
    (length) => {
      expect(
        parseUnlockSubmission({ password: "a".repeat(length) }).password,
      ).toHaveLength(length);
    },
  );
});

describe("timingSafeEqual", () => {
  it("matches identical strings", () => {
    expect(timingSafeEqual(PASSWORD, PASSWORD)).toBe(true);
  });

  it("rejects a different string of the same length", () => {
    expect(timingSafeEqual("abcdefgh", "abcdefgi")).toBe(false);
  });

  it("rejects strings of different lengths", () => {
    expect(timingSafeEqual(PASSWORD, `${PASSWORD}x`)).toBe(false);
  });
});

describe("createGateToken", () => {
  it("signs the expiry so the token verifies before it lapses", async () => {
    const token = await makeToken();
    expect(token.split(".")).toHaveLength(2);
    expect(token.startsWith(String(NOW + 60_000))).toBe(true);
    await verifyTokenAccepted(token);
  });

  it("produces a different signature for a different password", async () => {
    const mine = await makeToken();
    const theirs = await makeToken({ password: "another-password" });
    expect(mine).not.toBe(theirs);
  });

  it("rejects a missing site password", async () => {
    await expect(createGateToken("", NOW + 60_000)).rejects.toThrow(
      "Gate token needs a site password",
    );
  });

  it.each([0, -1, 1.5, Number.NaN])(
    "rejects the invalid expiry %s",
    async (expiry) => {
      await expect(createGateToken(PASSWORD, expiry)).rejects.toThrow(
        "Gate session expiry must be a positive integer",
      );
    },
  );
});

describe("verifyGateToken", () => {
  it("accepts a token one millisecond before it expires", async () => {
    const token = await makeToken({ expiresAtMs: NOW + 1 });
    await verifyTokenAccepted(token);
  });

  it("rejects a token at and after its expiry", async () => {
    const token = await makeToken({ expiresAtMs: NOW });
    await verifyTokenRejected(token);
    await verifyTokenRejected(await makeToken({ expiresAtMs: NOW - 1 }));
  });

  it("rejects a token signed with a different password", async () => {
    const token = await makeToken({ password: "another-password" });
    await verifyTokenRejected(token);
  });

  it("rejects a tampered signature", async () => {
    const token = await makeToken();
    const [expiry, signature] = token.split(".");
    await verifyTokenRejected(`${expiry}.${signature!.slice(0, -1)}x`);
  });

  it("rejects an extended expiry that keeps the original signature", async () => {
    const token = await makeToken({ expiresAtMs: NOW + 60_000 });
    const signature = token.split(".")[1];
    await verifyTokenRejected(`${NOW + 999_999_999}.${signature}`);
  });

  it.each([
    "",
    "no-separator",
    ".signature",
    "1760000060000.",
    "notanumber.signature",
    "99999999999999999999999.signature",
  ])("rejects the malformed token %s", async (token) => {
    await verifyTokenRejected(token);
  });

  it.each([undefined, null, 42, {}])(
    "rejects the non-string token %s",
    async (token) => {
      await verifyTokenRejected(token);
    },
  );

  it("rejects every token when no password is configured", async () => {
    const token = await makeToken();
    await verifyTokenRejected(token, { password: "" });
  });
});

describe("createGateSession", () => {
  it("issues a week-long cookie that verifies immediately", async () => {
    const session = await createGateSession(PASSWORD, NOW);
    expect(session.name).toBe(GATE_COOKIE_NAME);
    expect(session.maxAge).toBe(GATE_SESSION_MAX_AGE_SECONDS);
    expect(session.expiresAtMs).toBe(NOW + GATE_SESSION_MAX_AGE_SECONDS * 1_000);
    await verifyTokenAccepted(session.value);
  });

  it("stops verifying once the session window has passed", async () => {
    const session = await createGateSession(PASSWORD, NOW);
    await verifyTokenRejected(session.value, {
      nowMs: session.expiresAtMs,
    });
  });
});

describe("gateCookieOptions", () => {
  it("marks the production cookie secure and http-only", () => {
    const options = gateCookieOptions(true);
    expect(options.httpOnly).toBe(true);
    expect(options.secure).toBe(true);
    expect(options.sameSite).toBe("lax");
    expect(options.path).toBe(GATE_HOME_PATH);
    expect(options.maxAge).toBe(GATE_SESSION_MAX_AGE_SECONDS);
  });

  it("drops the secure flag off production so local http works", () => {
    expect(gateCookieOptions(false).secure).toBe(false);
    expect(gateCookieOptions(false).httpOnly).toBe(true);
  });
});
