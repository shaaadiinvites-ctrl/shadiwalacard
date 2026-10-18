import { NextRequest, NextResponse } from "next/server";
import { isRequestAuthorized } from "@/lib/adminAuth";
import { createServerSupabaseClient } from "@/lib/supabaseServer";

function extractCity(w: any): string {
  if (Array.isArray(w.events)) {
    for (const e of w.events) {
      if (e?.venue && typeof e.venue === "string") {
        const parts = e.venue.split(",").map((s: string) => s.trim());
        const candidate = parts[parts.length - 1];
        if (
          candidate &&
          candidate.length >= 3 &&
          !candidate.toLowerCase().includes("residence") &&
          !candidate.toLowerCase().includes("hall")
        ) {
          return candidate;
        }
      }
    }
  }
  return "Delhi NCR";
}

export async function GET(req: NextRequest) {
  const { authorized, user } = isRequestAuthorized(req);
  if (!authorized) {
    return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
  }

  try {
    const supabase = createServerSupabaseClient();

    // Launch cutoff timestamp: only count real checkouts from this moment forward
    const launchCutoffStr = process.env.ANALYTICS_START_DATE || "2026-10-18T15:42:00.000Z";
    const launchCutoffTime = new Date(launchCutoffStr).getTime();

    // 1. Fetch weddings including special_instructions for card-level analytics
    const { data: weddings, error: weddingsError } = await supabase
      .from("weddings")
      .select(
        `id, slug, bride_name, groom_name, name_order, hashtag,
         contact_number, primary_email, template_id, price_inr,
         created_at, events, payment_status, rsvp1_name, rsvp1_phone, special_instructions`
      )
      .order("created_at", { ascending: false });

    if (weddingsError) {
      console.error("Error fetching weddings for analytics:", weddingsError);
    }

    // 2. Fetch payment orders with coupon discount tracking
    const { data: paymentOrders, error: ordersError } = await supabase
      .from("payment_orders")
      .select(
        `id, amount_inr, status, customer_phone, template_id,
         created_at, verified_at, used_at, discount_amount_inr, coupon_code`
      )
      .order("created_at", { ascending: false });

    if (ordersError) {
      console.error("Error fetching payment orders for analytics:", ordersError);
    }

    const allWeddings = weddings || [];
    const allOrders = paymentOrders || [];

    // Filter live orders (created on or after launch cutoff)
    const liveOrders = allOrders.filter((o) => {
      const orderTime = new Date(o.created_at || o.verified_at).getTime();
      return orderTime >= launchCutoffTime;
    });

    // Filter live paid orders: 'used', 'verified', 'captured', 'paid'
    const paidLiveOrders = liveOrders.filter(
      (o) => o.status === "verified" || o.status === "used" || o.status === "captured" || o.status === "paid"
    );

    // Filter live weddings (created on or after launch cutoff)
    const liveWeddings = allWeddings.filter((w) => {
      const weddingTime = new Date(w.created_at).getTime();
      return weddingTime >= launchCutoffTime;
    });

    // Calculate Net Revenue from live paid orders:
    // If someone applies a coupon, amount_inr is the discounted amount paid, so revenue reflects the exact net collected
    const totalRevenue = paidLiveOrders.reduce((sum, o) => sum + (Number(o.amount_inr) || 0), 0);
    const totalDiscountsGiven = paidLiveOrders.reduce((sum, o) => sum + (Number(o.discount_amount_inr) || 0), 0);
    const totalOrdersCount = paidLiveOrders.length;
    const avgOrderValue = totalOrdersCount > 0 ? Math.round(totalRevenue / totalOrdersCount) : 0;

    // Geographic City Distribution from live weddings
    const cityCounts: Record<string, number> = {};
    liveWeddings.forEach((w) => {
      const city = extractCity(w);
      cityCounts[city] = (cityCounts[city] || 0) + 1;
    });

    const totalCityRecords = Object.values(cityCounts).reduce((a, b) => a + b, 0);
    const topCities = Object.entries(cityCounts)
      .map(([city, count]) => ({
        city,
        count,
        percentage: totalCityRecords > 0 ? Math.round((count / totalCityRecords) * 100) : 0,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);

    // Revenue Trend: 14 days curve starting at 0
    const dailyMap: Record<string, { revenue: number; orders: number; date: string; label: string }> = {};
    const now = new Date();
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    for (let i = 13; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const isoKey = d.toISOString().split("T")[0];
      const label = `${monthNames[d.getMonth()]} ${d.getDate()}`;
      dailyMap[isoKey] = { revenue: 0, orders: 0, date: isoKey, label };
    }

    // Populate daily stats from live paid orders only
    paidLiveOrders.forEach((o) => {
      const dateStr = o.verified_at || o.created_at;
      if (!dateStr) return;
      const dayKey = dateStr.split("T")[0];
      if (dailyMap[dayKey]) {
        dailyMap[dayKey].orders += 1;
        dailyMap[dayKey].revenue += Number(o.amount_inr) || 799;
      }
    });

    const revenueTrend = Object.values(dailyMap);

    // Format all weddings and parse card-level analytics
    const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "shadiwalacard.com";
    const recentWeddings = allWeddings.map((w) => {
      const coupleNames =
        w.name_order === "bride_first"
          ? `${w.bride_name} & ${w.groom_name}`
          : `${w.groom_name} & ${w.bride_name}`;

      const eventsList = Array.isArray(w.events) ? w.events : [];
      const city = extractCity(w);
      const isTest = new Date(w.created_at).getTime() < launchCutoffTime;

      // Extract card-specific analytics
      let cardAnalytics: {
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

      if (w.special_instructions) {
        try {
          const parsed = JSON.parse(w.special_instructions);
          if (typeof parsed === "object" && parsed !== null) {
            cardAnalytics = {
              views: Number(parsed.views) || 0,
              uniqueVisitors: Number(parsed.uniqueVisitors) || 0,
              cities: parsed.cities || {},
              sources: parsed.sources || {},
              mapClicks: Number(parsed.mapClicks) || 0,
              lastViewedAt: parsed.lastViewedAt || null,
            };
          }
        } catch {
          // Plain text instructions, keep defaults
        }
      }

      return {
        id: w.id,
        slug: w.slug,
        names: coupleNames,
        bride: w.bride_name,
        groom: w.groom_name,
        hashtag: w.hashtag || null,
        email: w.primary_email || "N/A",
        phone: w.contact_number || "N/A",
        templateId: w.template_id || "grand-palace",
        templateName: "The Grand Palace",
        city,
        country: "India",
        eventsCount: eventsList.length,
        price: Number(w.price_inr) || 799,
        createdAt: w.created_at,
        isTest,
        analytics: cardAnalytics,
        liveUrl: `https://${rootDomain}/${w.slug}`,
      };
    });

    return NextResponse.json({
      success: true,
      user,
      kpis: {
        totalRevenue,
        totalDiscountsGiven,
        totalOrders: totalOrdersCount,
        totalLiveInvites: liveWeddings.length,
        averageOrderValue: avgOrderValue,
        topCity: topCities[0]?.city || "Awaiting live orders",
      },
      revenueTrend,
      topCities,
      recentWeddings,
      ordersSummary: {
        totalPaid: paidLiveOrders.length,
        pending: liveOrders.filter((o) => o.status === "created").length,
        totalOrders: liveOrders.length,
        testOrdersArchived: allOrders.length - liveOrders.length,
      },
    });
  } catch (error) {
    console.error("Admin analytics error:", error);
    return NextResponse.json(
      { error: "Failed to generate analytics data." },
      { status: 500 }
    );
  }
}
