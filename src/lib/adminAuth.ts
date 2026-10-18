import crypto from "crypto";
import { NextRequest } from "next/server";

export const ADMIN_COOKIE_NAME = "swc_admin_session";

export const ADMIN_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 7 * 24 * 60 * 60, // 7 days
};

function getSecretKey(): string {
  return (
    process.env.ADMIN_SESSION_SECRET ||
    "fallback-secret-key-shadiwalacard-analytics-platform-2026-secure"
  );
}

/**
 * Creates a cryptographically signed session token for admin access.
 */
export function createAdminToken(username: string): string {
  const secret = getSecretKey();
  const payload = {
    u: username,
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
  };

  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto
    .createHmac("sha256", secret)
    .update(payloadB64)
    .digest("base64url");

  return `${payloadB64}.${signature}`;
}

/**
 * Validates the HMAC signature and expiration date of an admin session token.
 */
export function verifyAdminToken(token: string | undefined | null): {
  valid: boolean;
  user?: string;
} {
  if (!token || typeof token !== "string") {
    return { valid: false };
  }

  const parts = token.split(".");
  if (parts.length !== 2) {
    return { valid: false };
  }

  const [payloadB64, signature] = parts;
  const secret = getSecretKey();

  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(payloadB64)
    .digest("base64url");

  try {
    const isSignatureValid = crypto.timingSafeEqual(
      Buffer.from(signature, "utf8"),
      Buffer.from(expectedSignature, "utf8")
    );

    if (!isSignatureValid) {
      return { valid: false };
    }

    const payloadJson = Buffer.from(payloadB64, "base64url").toString("utf8");
    const payload = JSON.parse(payloadJson);

    if (!payload.exp || Date.now() > payload.exp) {
      return { valid: false };
    }

    return { valid: true, user: payload.u };
  } catch {
    return { valid: false };
  }
}

/**
 * Validates admin credentials using timing-safe comparison to prevent timing attacks.
 */
export function validateAdminCredentials(
  usernameInput: string,
  passwordInput: string
): boolean {
  const adminUsername = process.env.ADMIN_USERNAME || "hkhatter94";
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    return false;
  }

  try {
    const usernameMatch = crypto.timingSafeEqual(
      Buffer.from(usernameInput.trim()),
      Buffer.from(adminUsername.trim())
    );

    const passwordMatch = crypto.timingSafeEqual(
      Buffer.from(passwordInput),
      Buffer.from(adminPassword)
    );

    return usernameMatch && passwordMatch;
  } catch {
    // timingSafeEqual throws if buffers are different lengths
    return false;
  }
}

/**
 * Helper to check admin authentication from NextRequest headers/cookies.
 */
export function isRequestAuthorized(req: NextRequest): {
  authorized: boolean;
  user?: string;
} {
  const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  const verification = verifyAdminToken(token);
  return { authorized: verification.valid, user: verification.user };
}
