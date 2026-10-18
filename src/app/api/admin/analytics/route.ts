import { NextRequest, NextResponse } from "next/server";
import { isRequestAuthorized } from "@/lib/adminAuth";
import { createServerSupabaseClient } from "@/lib/supabaseServer";

export async function GET(req: NextRequest) {
  const { authorized, user } = isRequestAuthorized(req);
  if (!authorized) {
    return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
  }

  try {
    const supabase = createServerSupabaseClient();

    // 1. Fetch all weddings
    const { data: weddings, error: weddingsError } = await supabase
      .from("weddings")
      .select(
        `id, slug, bride_name, groom_name, name_order, hashtag,
         contact_number, primary_email, template_id, price_inr,
         client_ip, client_city, client_region, client_country,
         created_at, events`
      )
      .order("created_at", { ascending: false });

    if (weddingsError) {
      console.error("Error fetching weddings for analytics:", weddingsError);
    }

    // 2. Fetch all payment orders
    const { data: paymentOrders, error: ordersError } = await supabase
      .from("payment_orders")
      .select(
        `id, amount_inr, status, customer_name, customer_phone,
         customer_email, template_id, created_at, client_city, client_country`
      )
      .order("created_at", { ascending: false });

    if (ordersError) {
      console.error("Error fetching payment orders for analytics:", ordersError);
    }

    const allWeddings = weddings || [];
    const allOrders = paymentOrders || [];

    // Filter paid orders
    const paidOrders = allOrders.filter(
      (o) => o.status === "verified" || o.status === "captured" || o.status === "paid"
    );

    // Calculate Gross Revenue:
    // If orders table has paid records, use order amounts; otherwise compute from published weddings * 799
    const orderRevenue = paidOrders.reduce((sum, o) => sum + (Number(o.amount_inr) || 799), 0);
    const weddingRevenue = allWeddings.reduce((sum, w) => sum + (Number(w.price_inr) || 799), 0);
    const totalRevenue = Math.max(orderRevenue, weddingRevenue);

    const totalOrdersCount = Math.max(paidOrders.length, allWeddings.length);
    const avgOrderValue = totalOrdersCount > 0 ? Math.round(totalRevenue / totalOrdersCount) : 799;

    // Template Name mapping
    const templateNames: Record<string, string> = {
      "grand-palace": "The Grand Palace",
      "royal-heritage": "Royal Heritage",
      "floral-romance": "Floral Romance",
      "modern-minimal": "Modern Minimal",
    };

    // Template Popularity
    const templateCounts: Record<string, number> = {};
    allWeddings.forEach((w) => {
      const tid = w.template_id || "grand-palace";
      templateCounts[tid] = (templateCounts[tid] || 0) + 1;
    });

    const templateBreakdown = Object.entries(templateCounts).map(([id, count]) => ({
      id,
      name: templateNames[id] || id,
      count,
      percentage: allWeddings.length > 0 ? Math.round((count / allWeddings.length) * 100) : 0,
    })).sort((a, b) => b.count - a.count);

    // Geographic City Distribution
    const cityCounts: Record<string, number> = {};
    allWeddings.forEach((w) => {
      const city = w.client_city || "Delhi NCR";
      cityCounts[city] = (cityCounts[city] || 0) + 1;
    });
    // Also include cities from orders if available
    paidOrders.forEach((o) => {
      if (o.client_city) {
        cityCounts[o.client_city] = (cityCounts[o.client_city] || 0) + 1;
      }
    });

    const totalCityRecords = Object.values(cityCounts).reduce((a, b) => a + b, 0);
    const topCities = Object.entries(cityCounts)
      .map(([city, count]) => ({
        city,
        count,
        percentage: totalCityRecords > 0 ? Math.round((count / totalCityRecords) * 100) : 0,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    // Revenue and Orders Trend (Group by last 14 days)
    const dailyMap: Record<string, { revenue: number; orders: number; date: string; label: string }> = {};
    const now = new Date();
    for (let i = 13; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const isoKey = d.toISOString().split("T")[0];
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const label = `${monthNames[d.getMonth()]} ${d.getDate()}`;
      dailyMap[isoKey] = { revenue: 0, orders: 0, date: isoKey, label };
    }

    // Populate daily stats from weddings and orders
    allWeddings.forEach((w) => {
      if (!w.created_at) return;
      const dayKey = w.created_at.split("T")[0];
      if (dailyMap[dayKey]) {
        dailyMap[dayKey].orders += 1;
        dailyMap[dayKey].revenue += Number(w.price_inr) || 799;
      }
    });

    const revenueTrend = Object.values(dailyMap);

    // Recent formatted weddings
    const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "shadiwalacard.com";
    const recentWeddings = allWeddings.map((w) => {
      const coupleNames =
        w.name_order === "bride_first"
          ? `${w.bride_name} & ${w.groom_name}`
          : `${w.groom_name} & ${w.bride_name}`;

      const eventsList = Array.isArray(w.events) ? w.events : [];

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
        templateName: templateNames[w.template_id || "grand-palace"] || "The Grand Palace",
        city: w.client_city || "Delhi NCR",
        country: w.client_country || "India",
        eventsCount: eventsList.length,
        price: Number(w.price_inr) || 799,
        createdAt: w.created_at,
        liveUrl: `https://${rootDomain}/${w.slug}`,
      };
    });

    return NextResponse.json({
      success: true,
      user,
      kpis: {
        totalRevenue,
        totalOrders: totalOrdersCount,
        totalLiveInvites: allWeddings.length,
        averageOrderValue: avgOrderValue,
        topCity: topCities[0]?.city || "Delhi NCR",
      },
      revenueTrend,
      templateBreakdown,
      topCities,
      recentWeddings,
      ordersSummary: {
        totalCaptured: paidOrders.length,
        pending: allOrders.filter((o) => o.status === "created").length,
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
