// @vitest-environment node
import { afterEach, describe, expect, it, vi } from "vitest";

import {
  GATE_COOKIE_NAME,
  GATE_DISABLED_MESSAGE,
  GATE_HOME_PATH,
  GATE_INVALID_PASSWORD_MESSAGE,
  GATE_MALFORMED_REQUEST_MESSAGE,
  GATE_PASSWORD_ENV,
  GATE_SESSION_MAX_AGE_SECONDS,
  MAX_GATE_PASSWORD_LENGTH,
  verifyGateToken,
} from "../../../lib/gate";
import { POST } from "./route";

const PASSWORD = "press-preview-2026";
const ENDPOINT = "https://www.jasperfu.com/api/unlock";

afterEach(() => {
  vi.unstubAllEnvs();
});

function enableGate(password = PASSWORD) {
  vi.stubEnv(GATE_PASSWORD_ENV, password);
}

function makeRequest(body: unknown, raw = false) {
  return new Request(ENDPOINT, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: raw ? (body as string) : JSON.stringify(body),
  });
}

function setCookieHeader(response: Response) {
  return response.headers.get("set-cookie") ?? "";
}

async function verifyUnlocked(response: Response, expectedNext: string) {
  expect(response.status).toBe(200);
  expect(await response.clone().json()).toEqual({ next: expectedNext });

  const cookie = setCookieHeader(response);
  expect(cookie).toContain(`${GATE_COOKIE_NAME}=`);
  expect(cookie).toContain("HttpOnly");
  expect(cookie).toContain("SameSite=lax");
  expect(cookie).toContain("Path=/");
  expect(cookie).toContain(`Max-Age=${GATE_SESSION_MAX_AGE_SECONDS}`);

  const token = decodeURIComponent(
    cookie.split(`${GATE_COOKIE_NAME}=`)[1]!.split(";")[0]!,
  );
  expect(await verifyGateToken(token, PASSWORD, Date.now())).toBe(true);
}

async function verifyRejected(
  response: Response,
  status: number,
  message: string,
) {
  expect(response.status).toBe(status);
  expect(await response.json()).toEqual({ error: message });
  expect(setCookieHeader(response)).not.toContain(GATE_COOKIE_NAME);
}

describe("POST /api/unlock", () => {
  it("issues a session cookie for the correct password", async () => {
    enableGate();
    const response = await POST(makeRequest({ password: PASSWORD }));
    await verifyUnlocked(response, GATE_HOME_PATH);
  });

  it("returns the requested page so the visitor lands where they started", async () => {
    enableGate();
    const response = await POST(
      makeRequest({ password: PASSWORD, next: "/press" }),
    );
    await verifyUnlocked(response, "/press");
  });

  it("refuses to hand back an off-site redirect", async () => {
    enableGate();
    const response = await POST(
      makeRequest({ password: PASSWORD, next: "https://evil.example.com" }),
    );
    await verifyUnlocked(response, GATE_HOME_PATH);
  });

  it("rejects the wrong password without setting a cookie", async () => {
    enableGate();
    const response = await POST(makeRequest({ password: "not-the-password" }));
    await verifyRejected(response, 401, GATE_INVALID_PASSWORD_MESSAGE);
  });

  it("rejects a password that only shares a prefix", async () => {
    enableGate();
    const response = await POST(
      makeRequest({ password: PASSWORD.slice(0, -1) }),
    );
    await verifyRejected(response, 401, GATE_INVALID_PASSWORD_MESSAGE);
  });

  it("is unavailable when no password is configured", async () => {
    const response = await POST(makeRequest({ password: PASSWORD }));
    await verifyRejected(response, 404, GATE_DISABLED_MESSAGE);
  });

  it.each([
    [{}, "Password is required"],
    [{ password: "" }, "Password is required"],
    [{ password: 12345678 }, "Password is required"],
    [
      { password: "a".repeat(MAX_GATE_PASSWORD_LENGTH + 1) },
      "Password is too long",
    ],
  ])("rejects invalid input with a specific error", async (body, message) => {
    enableGate();
    await verifyRejected(await POST(makeRequest(body)), 400, message);
  });

  it("rejects a body that is not JSON", async () => {
    enableGate();
    const response = await POST(makeRequest("not-json-at-all", true));
    await verifyRejected(response, 400, GATE_MALFORMED_REQUEST_MESSAGE);
  });

  it("fails loudly when the configured password is unusable", async () => {
    enableGate("short");
    await expect(POST(makeRequest({ password: PASSWORD }))).rejects.toThrow(
      "Site password must be at least 8 characters",
    );
  });
});
