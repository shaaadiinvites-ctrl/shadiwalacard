import { NextRequest, NextResponse } from "next/server";
import { isRequestAuthorized } from "@/lib/adminAuth";

export async function GET(req: NextRequest) {
  const { authorized, user } = isRequestAuthorized(req);
  if (!authorized) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  return NextResponse.json({ authenticated: true, user });
}
