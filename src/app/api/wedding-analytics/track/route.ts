import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabaseServer";
import { getClientIp } from "@/lib/rateLimit";

function detectSource(userAgent: string, referrer: string): string {
  const ua = (userAgent || "").toLowerCase();
  const ref = (referrer || "").toLowerCase();

  if (ua.includes("whatsapp") || ref.includes("whatsapp")) return "WhatsApp";
  if (ua.includes("instagram") || ref.includes("instagram")) return "Instagram";
  if (ua.includes("fbav") || ua.includes("facebook") || ref.includes("facebook")) return "Facebook";
  if (ua.includes("mobile") && ua.includes("safari") && !ua.includes("chrome")) return "Safari Mobile";
  if (ua.includes("chrome") || ua.includes("crios")) return "Chrome";
  if (ua.includes("safari")) return "Safari";
  return "Direct / Browser";
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    if (!body || !body.slug) {
      return NextResponse.json({ error: "Missing slug." }, { status: 400 });
    }

    const { slug, event = "view" } = body;
    const supabase = createServerSupabaseClient();

    // 1. Fetch current wedding record
    const { data: wedding, error } = await supabase
      .from("weddings")
      .select("id, slug, special_instructions")
      .eq("slug", slug)
      .maybeSingle();

    if (error || !wedding) {
      return NextResponse.json({ error: "Wedding not found." }, { status: 404 });
    }

    // 2. Parse existing analytics or initialize
    let stats: {
      views: number;
      uniqueVisitors: number;
      cities: Record<string, number>;
      sources: Record<string, number>;
      mapClicks: number;
      lastViewedAt: string | null;
    } = {
      views: 0,
      uniqueVisitors: 0,
      cities: {},
      sources: {},
      mapClicks: 0,
      lastViewedAt: null,
    };

    if (wedding.special_instructions) {
      try {
        const parsed = JSON.parse(wedding.special_instructions);
        if (typeof parsed === "object" && parsed !== null) {
          stats = {
            views: Number(parsed.views) || 0,
            uniqueVisitors: Number(parsed.uniqueVisitors) || 0,
            cities: parsed.cities || {},
            sources: parsed.sources || {},
            mapClicks: Number(parsed.mapClicks) || 0,
            lastViewedAt: parsed.lastViewedAt || null,
          };
        }
      } catch {
        // Not a JSON string (could be older plain text instructions), keep defaults
      }
    }

    // 3. Extract visitor geo and source
    const rawCity =
      req.headers.get("x-vercel-ip-city") ||
      req.headers.get("cf-ipcity") ||
      "";
    const city = rawCity ? decodeURIComponent(rawCity).trim() : "Delhi NCR";

    const userAgent = req.headers.get("user-agent") || "";
    const referrer = req.headers.get("referer") || "";
    const source = detectSource(userAgent, referrer);

    // 4. Update metrics based on event
    const now = new Date().toISOString();
    if (event === "map_click") {
      stats.mapClicks += 1;
    } else {
      // Default: 'view'
      stats.views += 1;
      stats.cities[city] = (stats.cities[city] || 0) + 1;
      stats.sources[source] = (stats.sources[source] || 0) + 1;
      stats.lastViewedAt = now;
    }

    // 5. Save back to special_instructions
    await supabase
      .from("weddings")
      .update({ special_instructions: JSON.stringify(stats) })
      .eq("slug", slug);

    return NextResponse.json({ success: true, stats });
  } catch (err: any) {
    console.error("Wedding tracking error:", err);
    return NextResponse.json({ error: "Failed to record event." }, { status: 500 });
  }
}
