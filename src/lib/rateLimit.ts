import { NextRequest } from "next/server";
import { createServerSupabaseClient } from "./supabaseServer";

// Simple, dependency-free per-IP rate limiter backed by a Supabase table
// (see supabase-add-rate-limits.sql). Buckets requests into fixed time
// windows and atomically increments a counter via a Postgres function, so
// it's safe under concurrent requests and works across serverless instances
// (unlike an in-memory Map, which resets per instance/cold start).
//
// Fails OPEN on unexpected errors (e.g. migration not run yet) so a
// misconfigured limiter never takes the whole site down — it just means
// rate limiting isn't active until the migration is applied.
export function getClientIp(req: NextRequest): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") || "unknown";
}

export async function checkRateLimit(
  routeKey: string,
  ip: string,
  limit: number,
  windowSeconds: number
): Promise<{ ok: boolean; count: number }> {
  try {
    const windowStart = Math.floor(Date.now() / 1000 / windowSeconds) * windowSeconds;
    const bucketKey = `${routeKey}:${ip}:${windowStart}`;

    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase.rpc("increment_rate_limit", { p_key: bucketKey });

    if (error) {
      console.error(`rateLimit(${routeKey}): RPC error, failing open —`, error.message);
      return { ok: true, count: 0 };
    }

    const count = typeof data === "number" ? data : 0;
    return { ok: count <= limit, count };
  } catch (err) {
    console.error(`rateLimit(${routeKey}): unexpected error, failing open —`, err);
    return { ok: true, count: 0 };
  }
}
