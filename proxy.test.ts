// @vitest-environment node
import { NextRequest, type NextResponse } from "next/server";
import { afterEach, describe, expect, it, vi } from "vitest";

import { PUBLISHED_SEAL_SRC } from "./lib/brand-mark";
import {
  GATE_COOKIE_NAME,
  GATE_PASSWORD_ENV,
  GATE_UNLOCK_ENDPOINT,
  GATE_UNLOCK_PATH,
  createGateToken,
} from "./lib/gate";
import { proxy } from "./proxy";

const ORIGIN = "https://www.jasperfu.com";
const PASSWORD = "press-preview-2026";

afterEach(() => {
  vi.unstubAllEnvs();
});

function enableGate(password = PASSWORD) {
  vi.stubEnv(GATE_PASSWORD_ENV, password);
}

function makeRequest(path: string, token?: string) {
  const headers = new Headers();

  if (token !== undefined) {
    headers.set("cookie", `${GATE_COOKIE_NAME}=${token}`);
  }

  return new NextRequest(new URL(path, ORIGIN), { headers });
}

function validToken() {
  return createGateToken(PASSWORD, Date.now() + 60_000);
}

function verifyAllowed(response: NextResponse) {
  expect(response.status).toBe(200);
  expect(response.headers.get("location")).toBeNull();
  expect(response.headers.get("x-middleware-next")).toBe("1");
}

function verifyGated(response: NextResponse, expectedNext?: string) {
  expect(response.status).toBe(307);
  expect(response.headers.get("x-robots-tag")).toBe("noindex, nofollow");

  const location = new URL(response.headers.get("location") ?? "");
  expect(location.pathname).toBe(GATE_UNLOCK_PATH);
  expect(location.origin).toBe(ORIGIN);
  expect(location.searchParams.get("next")).toBe(expectedNext ?? null);
}

async function gateResponse(path: string, token?: string) {
  return (await proxy(makeRequest(path, token))) as NextResponse;
}

describe("password gate proxy", () => {
  it("serves the site untouched when no password is configured", async () => {
    verifyAllowed(await gateResponse("/about"));
    verifyAllowed(await gateResponse("/"));
  });

  it("serves a visitor holding a valid session cookie", async () => {
    enableGate();
    verifyAllowed(await gateResponse("/about", await validToken()));
  });

  it("redirects an unlocked visitor to the gate and remembers the page", async () => {
    enableGate();
    verifyGated(await gateResponse("/press"), "/press");
    verifyGated(await gateResponse("/contact?type=interview"), "/contact?type=interview");
  });

  it("redirects the home page to a bare unlock screen", async () => {
    enableGate();
    verifyGated(await gateResponse("/"));
  });

  it("rejects a cookie signed with a rotated password", async () => {
    const stale = await createGateToken("previous-password", Date.now() + 60_000);
    enableGate();
    verifyGated(await gateResponse("/about", stale), "/about");
  });

  it("rejects an expired cookie", async () => {
    const expired = await createGateToken(PASSWORD, Date.now() - 1_000);
    enableGate();
    verifyGated(await gateResponse("/about", expired), "/about");
  });

  it("rejects a tampered cookie", async () => {
    const token = await validToken();
    enableGate();
    verifyGated(await gateResponse("/about", `${token.slice(0, -1)}x`), "/about");
  });

  it("rejects an empty cookie", async () => {
    enableGate();
    verifyGated(await gateResponse("/about", ""), "/about");
  });

  it.each([
    GATE_UNLOCK_PATH,
    GATE_UNLOCK_ENDPOINT,
    "/robots.txt",
    PUBLISHED_SEAL_SRC,
    "/_next/static/chunk.js",
  ])("always serves %s so the gate can render", async (path) => {
    enableGate();
    verifyAllowed(await gateResponse(path));
  });

  it("gates crawler-facing routes other than robots.txt", async () => {
    enableGate();
    verifyGated(await gateResponse("/sitemap.xml"), "/sitemap.xml");
  });

  it("fails loudly when the configured password is unusable", async () => {
    enableGate("short");
    await expect(gateResponse("/about")).rejects.toThrow(
      "Site password must be at least 8 characters",
    );
  });
});
