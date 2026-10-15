import { NextResponse, NextRequest } from "next/server";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

export async function GET(request: NextRequest) {
  const ip = getClientIp(request);
  const { ok } = await checkRateLimit("search-location", ip, 60, 60); // 60 queries per minute per IP
  if (!ok) {
    return NextResponse.json({ error: "Too many search requests. Please slow down." }, { status: 429 });
  }

  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q");

  if (!q) {
    return NextResponse.json({ error: "Query is required" }, { status: 400 });
  }

  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&countrycodes=in&q=${encodeURIComponent(
        q
      )}&limit=5`,
      {
        headers: {
          "User-Agent": "ShadiwalaCard-App/1.0 (contact@shadiwalacard.com)",
          "Accept-Language": "en-US,en;q=0.9",
        },
      }
    );

    if (!res.ok) {
      throw new Error(`Nominatim API responded with ${res.status}`);
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Location search proxy error:", error);
    return NextResponse.json({ error: "Failed to search locations" }, { status: 500 });
  }
}
