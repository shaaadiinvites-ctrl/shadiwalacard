import { NextRequest, NextResponse } from "next/server";
import {
  validateAdminCredentials,
  createAdminToken,
  ADMIN_COOKIE_NAME,
  ADMIN_COOKIE_OPTIONS,
} from "@/lib/adminAuth";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    // Rate limit: max 6 attempts per 15 minutes per IP
    const rl = await checkRateLimit("admin-login", ip, 6, 900);
    if (!rl.ok) {
      return NextResponse.json(
        { error: "Too many login attempts. Please wait 15 minutes before trying again." },
        { status: 429 }
      );
    }

    const body = await req.json().catch(() => null);
    if (!body || typeof body.username !== "string" || typeof body.password !== "string") {
      return NextResponse.json(
        { error: "Username and password are required." },
        { status: 400 }
      );
    }

    const { username, password } = body;
    const isValid = validateAdminCredentials(username, password);

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid username or password." },
        { status: 401 }
      );
    }

    const token = createAdminToken(username.trim());
    const response = NextResponse.json({
      success: true,
      user: username.trim(),
      message: "Authentication successful.",
    });

    response.cookies.set(ADMIN_COOKIE_NAME, token, ADMIN_COOKIE_OPTIONS);
    return response;
  } catch (error) {
    console.error("Admin login error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred during authentication." },
      { status: 500 }
    );
  }
}
