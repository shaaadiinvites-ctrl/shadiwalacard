import crypto from "crypto";

function getSecretKey(): string {
  const secret =
    process.env.RAZORPAY_KEY_SECRET ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    "shadiwalacard-link-signing-key-fallback";
  return secret;
}

/**
 * Normalizes email for case-insensitive, whitespace-trimmed comparison.
 */
export function normalizeEmail(email?: string | null): string {
  if (!email) return "";
  return email.trim().toLowerCase();
}

/**
 * Normalizes phone number:
 * Extracts only digits, and takes the last 10 digits to handle international prefixes
 * (+91, 0, etc.) consistently.
 */
export function normalizePhone(phone?: string | null): string {
  if (!phone) return "";
  const digits = phone.replace(/\D/g, "");
  // If at least 10 digits, return last 10 digits. Otherwise return full digits.
  return digits.length >= 10 ? digits.slice(-10) : digits;
}

interface SignParams {
  po: string;
  template?: string;
  email?: string;
  phone?: string;
}

/**
 * Generates an HMAC-SHA256 signature for a setup link.
 * Signs po + template + normalized email + normalized phone.
 */
export function signSetupLink({ po, template = "", email = "", phone = "" }: SignParams): string {
  const secret = getSecretKey();
  const cleanEmail = normalizeEmail(email);
  const cleanPhone = normalizePhone(phone);
  const dataToSign = `${po.trim()}|${template.trim()}|${cleanEmail}|${cleanPhone}`;

  return crypto
    .createHmac("sha256", secret)
    .update(dataToSign)
    .digest("hex");
}

interface VerifyParams extends SignParams {
  sig?: string | null;
}

/**
 * Verifies that the provided HMAC-SHA256 signature matches the link parameters.
 * Uses timingSafeEqual to protect against timing attacks.
 */
export function verifySetupLink({ po, template = "", email = "", phone = "", sig }: VerifyParams): boolean {
  if (!sig || typeof sig !== "string" || !po) return false;

  try {
    const expectedSig = signSetupLink({ po, template, email, phone });
    const expectedBuf = Buffer.from(expectedSig, "hex");
    const givenBuf = Buffer.from(sig, "hex");

    if (expectedBuf.length !== givenBuf.length) return false;
    return crypto.timingSafeEqual(expectedBuf, givenBuf);
  } catch (err) {
    console.error("Signature verification error:", err);
    return false;
  }
}

interface WeddingRecord {
  primary_email?: string | null;
  contact_number?: string | null;
}

/**
 * Validates that the provided email and phone match the wedding record's owner.
 * At least one identifier must be provided and match, and if both are provided, neither can conflict.
 */
export function isWeddingOwnerMatch(
  wedding: WeddingRecord | null | undefined,
  providedEmail?: string | null,
  providedPhone?: string | null
): boolean {
  if (!wedding) return false;

  const weddingEmail = normalizeEmail(wedding.primary_email);
  const weddingPhone = normalizePhone(wedding.contact_number);

  const cleanProvidedEmail = normalizeEmail(providedEmail);
  const cleanProvidedPhone = normalizePhone(providedPhone);

  // If neither email nor phone was provided in the request, access cannot be granted.
  if (!cleanProvidedEmail && !cleanProvidedPhone) {
    return false;
  }

  let emailMatches = false;
  let phoneMatches = false;

  if (cleanProvidedEmail && weddingEmail) {
    emailMatches = cleanProvidedEmail === weddingEmail;
    // If an email was provided but does NOT match the wedding email, fail immediately
    if (!emailMatches) return false;
  }

  if (cleanProvidedPhone && weddingPhone) {
    phoneMatches = cleanProvidedPhone === weddingPhone;
    // If a phone was provided but does NOT match the wedding phone, fail immediately
    if (!phoneMatches) return false;
  }

  // Must match at least one verified field
  return emailMatches || phoneMatches;
}
