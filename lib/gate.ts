import { z } from "zod";

import { PUBLISHED_SEAL_SRC } from "./brand-mark";

export const GATE_COOKIE_NAME = "jf_gate";
export const GATE_PASSWORD_ENV = "SITE_PASSWORD";
export const GATE_UNLOCK_PATH = "/unlock";
export const GATE_UNLOCK_ENDPOINT = "/api/unlock";
export const GATE_NEXT_PARAM = "next";
export const GATE_PASSWORD_FIELD = "password";
export const GATE_HOME_PATH = "/";

export const MIN_GATE_PASSWORD_LENGTH = 8;
export const MAX_GATE_PASSWORD_LENGTH = 200;
export const GATE_SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

export const GATE_INVALID_PASSWORD_MESSAGE = "That password is not correct";
export const GATE_DISABLED_MESSAGE = "The gate is not enabled";
export const GATE_UNAVAILABLE_MESSAGE = "The site could not be unlocked";
export const GATE_MALFORMED_REQUEST_MESSAGE = "Unlock request must be JSON";

export const UNLOCK_EYEBROW = "Private preview";
export const UNLOCK_TITLE = "This site is not public yet";
export const UNLOCK_INTRO =
  "Enter the password you were sent to view the press site.";
export const UNLOCK_LABEL = "Password";
export const UNLOCK_CTA = "View site";
export const UNLOCK_HELP = "Need access?";

export const gateBypassExactPaths = [
  GATE_UNLOCK_PATH,
  GATE_UNLOCK_ENDPOINT,
  "/robots.txt",
  "/favicon.ico",
  "/icon.png",
  "/apple-icon.png",
  PUBLISHED_SEAL_SRC,
] as const;

export const gateBypassPrefixes = ["/_next/"] as const;

export type GateConfig =
  | { enabled: false; password: "" }
  | { enabled: true; password: string };

/**
 * The gate is off unless SITE_PASSWORD is set, so local dev, tests, and a
 * default deploy stay public. A password that is set but unusable throws
 * instead of silently leaving the site open.
 */
export function resolveGateConfig(
  env: Record<string, string | undefined> = process.env,
): GateConfig {
  const raw = env[GATE_PASSWORD_ENV];
  const password = typeof raw === "string" ? raw.trim() : "";

  if (!password) {
    return { enabled: false, password: "" };
  }

  if (password.length < MIN_GATE_PASSWORD_LENGTH) {
    throw new Error(
      `Site password must be at least ${MIN_GATE_PASSWORD_LENGTH} characters`,
    );
  }

  if (password.length > MAX_GATE_PASSWORD_LENGTH) {
    throw new Error(
      `Site password must be at most ${MAX_GATE_PASSWORD_LENGTH} characters`,
    );
  }

  return { enabled: true, password };
}

export function isGateEnabled(
  env: Record<string, string | undefined> = process.env,
) {
  return resolveGateConfig(env).enabled;
}

export function assertGatePath(pathname: unknown) {
  if (typeof pathname !== "string" || !pathname.trim()) {
    throw new Error("Gate path is required");
  }

  if (!pathname.startsWith("/")) {
    throw new Error("Gate path must start with a slash");
  }

  return pathname;
}

export function isGateBypassPath(pathname: string) {
  const path = assertGatePath(pathname);

  if ((gateBypassExactPaths as readonly string[]).includes(path)) {
    return true;
  }

  return gateBypassPrefixes.some((prefix) => path.startsWith(prefix));
}

/**
 * Only same-origin absolute paths survive, so `?next=` cannot be used to
 * bounce a visitor to another site after they unlock.
 */
export function resolveNextPath(value: unknown) {
  if (typeof value !== "string") {
    return GATE_HOME_PATH;
  }

  const trimmed = value.trim();

  if (!trimmed.startsWith("/") || trimmed.startsWith("//")) {
    return GATE_HOME_PATH;
  }

  if (trimmed.startsWith("/\\") || trimmed.includes("\\")) {
    return GATE_HOME_PATH;
  }

  if (trimmed === GATE_UNLOCK_PATH || trimmed.startsWith(`${GATE_UNLOCK_PATH}?`)) {
    return GATE_HOME_PATH;
  }

  return trimmed;
}

export function buildUnlockPath(requestedPath: string) {
  const path = assertGatePath(requestedPath);
  const next = resolveNextPath(path);

  if (next === GATE_HOME_PATH) {
    return GATE_UNLOCK_PATH;
  }

  return `${GATE_UNLOCK_PATH}?${GATE_NEXT_PARAM}=${encodeURIComponent(next)}`;
}

const unlockSchema = z.object({
  password: z
    .string({ error: "Password is required" })
    .min(1, "Password is required")
    .max(MAX_GATE_PASSWORD_LENGTH, "Password is too long"),
  next: z
    .unknown()
    .optional()
    .transform((value) => resolveNextPath(value)),
});

export type UnlockSubmission = { password: string; next: string };

export function parseUnlockSubmission(input: unknown): UnlockSubmission {
  const result = unlockSchema.safeParse(input);

  if (!result.success) {
    throw new Error(result.error.issues[0]!.message);
  }

  return result.data;
}

function gateSubtle() {
  const subtle = globalThis.crypto?.subtle;

  if (!subtle) {
    throw new Error("Web Crypto is unavailable in this runtime");
  }

  return subtle;
}

function assertExpiry(expiresAtMs: number) {
  if (!Number.isInteger(expiresAtMs) || expiresAtMs <= 0) {
    throw new Error("Gate session expiry must be a positive integer");
  }

  return expiresAtMs;
}

function toBase64Url(bytes: ArrayBuffer) {
  let binary = "";
  for (const byte of new Uint8Array(bytes)) {
    binary += String.fromCharCode(byte);
  }

  return btoa(binary)
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll("=", "");
}

async function signExpiry(password: string, expiresAtMs: number) {
  const encoder = new TextEncoder();
  const key = await gateSubtle().importKey(
    "raw",
    encoder.encode(password),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await gateSubtle().sign(
    "HMAC",
    key,
    encoder.encode(String(expiresAtMs)),
  );

  return toBase64Url(signature);
}

/**
 * The signing key is the password itself, so rotating SITE_PASSWORD
 * invalidates every cookie that was issued under the old one.
 */
export async function createGateToken(password: string, expiresAtMs: number) {
  if (!password) {
    throw new Error("Gate token needs a site password");
  }

  assertExpiry(expiresAtMs);

  return `${expiresAtMs}.${await signExpiry(password, expiresAtMs)}`;
}

export function timingSafeEqual(left: string, right: string) {
  if (left.length !== right.length) {
    return false;
  }

  let mismatch = 0;
  for (let index = 0; index < left.length; index += 1) {
    mismatch |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }

  return mismatch === 0;
}

export async function verifyGateToken(
  token: unknown,
  password: string,
  nowMs: number,
) {
  if (!password || typeof token !== "string" || !token) {
    return false;
  }

  const separator = token.indexOf(".");
  if (separator <= 0) {
    return false;
  }

  const expiresAtRaw = token.slice(0, separator);
  const signature = token.slice(separator + 1);

  if (!/^\d+$/.test(expiresAtRaw) || !signature) {
    return false;
  }

  const expiresAtMs = Number(expiresAtRaw);
  if (!Number.isSafeInteger(expiresAtMs) || expiresAtMs <= nowMs) {
    return false;
  }

  return timingSafeEqual(signature, await signExpiry(password, expiresAtMs));
}

export async function createGateSession(password: string, nowMs: number) {
  const expiresAtMs = nowMs + GATE_SESSION_MAX_AGE_SECONDS * 1_000;

  return {
    name: GATE_COOKIE_NAME,
    value: await createGateToken(password, expiresAtMs),
    maxAge: GATE_SESSION_MAX_AGE_SECONDS,
    expiresAtMs,
  };
}

export function gateCookieOptions(isProduction: boolean) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: isProduction,
    path: GATE_HOME_PATH,
    maxAge: GATE_SESSION_MAX_AGE_SECONDS,
  };
}
