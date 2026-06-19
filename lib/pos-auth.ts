import type { NextResponse } from "next/server";

export const POS_SESSION_COOKIE_NAME = "sikim_pos_session";
export const DEFAULT_POS_SESSION_MAX_AGE_SECONDS = 259_200;
export const MIN_POS_SESSION_SECRET_LENGTH = 32;

const encoder = new TextEncoder();

type PosAuthConfig =
  | {
      ok: true;
      passwordHash: string;
      sessionMaxAgeSeconds: number;
      sessionSecret: string;
    }
  | {
      ok: false;
      invalid: string[];
      missing: string[];
    };

function getRequiredEnv(name: string) {
  const value = process.env[name]?.trim();
  return value ? value : null;
}

function parseSessionMaxAge() {
  const rawValue = process.env.POS_SESSION_MAX_AGE_SECONDS?.trim();

  if (!rawValue) {
    return DEFAULT_POS_SESSION_MAX_AGE_SECONDS;
  }

  const parsedValue = Number.parseInt(rawValue, 10);
  return Number.isFinite(parsedValue) && parsedValue > 0 ? parsedValue : null;
}

function normalizeSha256Hex(value: string) {
  const normalizedValue = value.trim().toLowerCase();
  return /^[a-f0-9]{64}$/.test(normalizedValue) ? normalizedValue : null;
}

export function getPosAuthConfig(): PosAuthConfig {
  const missing: string[] = [];
  const invalid: string[] = [];
  const passwordHash = getRequiredEnv("POS_ACCESS_PASSWORD_HASH");
  const sessionSecret = getRequiredEnv("POS_SESSION_SECRET");
  const sessionMaxAgeSeconds = parseSessionMaxAge();
  const normalizedPasswordHash = passwordHash
    ? normalizeSha256Hex(passwordHash)
    : null;

  if (!passwordHash) {
    missing.push("POS_ACCESS_PASSWORD_HASH");
  }

  if (!sessionSecret) {
    missing.push("POS_SESSION_SECRET");
  }

  if (sessionSecret && sessionSecret.length < MIN_POS_SESSION_SECRET_LENGTH) {
    invalid.push("POS_SESSION_SECRET");
  }

  if (passwordHash && !normalizedPasswordHash) {
    invalid.push("POS_ACCESS_PASSWORD_HASH");
  }

  if (!sessionMaxAgeSeconds) {
    invalid.push("POS_SESSION_MAX_AGE_SECONDS");
  }

  if (missing.length > 0 || invalid.length > 0) {
    return { ok: false, invalid, missing };
  }

  return {
    ok: true,
    passwordHash: normalizedPasswordHash!,
    sessionMaxAgeSeconds: sessionMaxAgeSeconds!,
    sessionSecret: sessionSecret!,
  };
}

export function getPosAuthConfigMessage(config = getPosAuthConfig()) {
  if (config.ok) {
    return null;
  }

  const problems = [
    ...config.missing.map((name) => `${name} no esta configurada`),
    ...config.invalid.map((name) => `${name} tiene un formato no valido`),
  ];

  return problems.join(". ");
}

function bytesToBase64Url(bytes: Uint8Array) {
  const binary = Array.from(bytes, (byte) => String.fromCharCode(byte)).join("");
  return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
}

function base64UrlToBytes(value: string) {
  const base64 = value.replaceAll("-", "+").replaceAll("_", "/");
  const paddedBase64 = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
  const binary = atob(paddedBase64);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

function constantTimeEqual(left: string, right: string) {
  const maxLength = Math.max(left.length, right.length);
  let difference = left.length ^ right.length;

  for (let index = 0; index < maxLength; index += 1) {
    difference |= (left.charCodeAt(index) || 0) ^ (right.charCodeAt(index) || 0);
  }

  return difference === 0;
}

async function sha256Hex(value: string) {
  const digest = await crypto.subtle.digest("SHA-256", encoder.encode(value));
  return Array.from(new Uint8Array(digest), (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");
}

async function hmacSha256Base64Url(payload: string, secret: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { hash: "SHA-256", name: "HMAC" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  return bytesToBase64Url(new Uint8Array(signature));
}

export async function isSubmittedPasswordValid(
  submittedPassword: string,
  passwordHash: string,
) {
  const submittedHash = await sha256Hex(submittedPassword);
  return constantTimeEqual(submittedHash, passwordHash);
}

export async function createPosSessionCookie(config: Extract<PosAuthConfig, { ok: true }>) {
  const issuedAt = Date.now();
  const expiresAt = issuedAt + config.sessionMaxAgeSeconds * 1000;
  const payload = bytesToBase64Url(
    encoder.encode(JSON.stringify({ exp: expiresAt, iat: issuedAt, v: 1 })),
  );
  const signature = await hmacSha256Base64Url(payload, config.sessionSecret);

  return `${payload}.${signature}`;
}

export async function verifyPosSession(sessionCookie?: string | null) {
  if (!sessionCookie) {
    return false;
  }

  const config = getPosAuthConfig();

  if (!config.ok) {
    return false;
  }

  const [payload, signature, extra] = sessionCookie.split(".");

  if (!payload || !signature || extra) {
    return false;
  }

  const expectedSignature = await hmacSha256Base64Url(payload, config.sessionSecret);

  if (!constantTimeEqual(signature, expectedSignature)) {
    return false;
  }

  try {
    const decodedPayload = JSON.parse(new TextDecoder().decode(base64UrlToBytes(payload)));
    return (
      decodedPayload?.v === 1 &&
      typeof decodedPayload.exp === "number" &&
      decodedPayload.exp > Date.now()
    );
  } catch {
    return false;
  }
}

export function getSafeRedirectPath(value: FormDataEntryValue | string | null | undefined) {
  if (typeof value !== "string" || value.trim() === "") {
    return "/";
  }

  try {
    const url = new URL(value, "https://sikim-pos.local");

    if (url.origin !== "https://sikim-pos.local" || url.pathname === "/login") {
      return "/";
    }

    return `${url.pathname}${url.search}`;
  } catch {
    return "/";
  }
}

export function applyPosSessionCookie(
  response: NextResponse,
  cookieValue: string,
  config: Extract<PosAuthConfig, { ok: true }>,
) {
  response.cookies.set(POS_SESSION_COOKIE_NAME, cookieValue, {
    httpOnly: true,
    maxAge: config.sessionMaxAgeSeconds,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
}

export function clearPosSessionCookie(response: NextResponse) {
  response.cookies.set(POS_SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    maxAge: 0,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
}
