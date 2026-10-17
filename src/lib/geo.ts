import { NextRequest } from "next/server";

export interface ClientGeoInfo {
  ip: string;
  city: string;
  region: string;
  country: string;
}

/**
 * Extracts client IP and Vercel edge geolocation headers.
 * In production on Vercel, Vercel edge routers automatically attach:
 * - x-forwarded-for: client IP (first entry before comma)
 * - x-vercel-ip-city: city name (URL-encoded)
 * - x-vercel-ip-country-region: 2-letter state/region code (e.g. DL, UP, MH, UK)
 * - x-vercel-ip-country: 2-letter country code (e.g. IN)
 */
export function getClientGeo(req: NextRequest): ClientGeoInfo {
  // IP resolution
  const fwd = req.headers.get("x-forwarded-for");
  let ip = fwd ? fwd.split(",")[0].trim() : req.headers.get("x-real-ip") || "unknown";
  if (ip === "::1" || ip === "127.0.0.1") {
    ip = "127.0.0.1";
  }

  // City resolution
  let city = req.headers.get("x-vercel-ip-city") || "";
  if (city) {
    try {
      city = decodeURIComponent(city);
    } catch {
      // keep raw if decoding fails
    }
  }

  const region = req.headers.get("x-vercel-ip-country-region") || "";
  const country = req.headers.get("x-vercel-ip-country") || "";

  return {
    ip,
    city,
    region,
    country,
  };
}
