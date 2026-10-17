import { NextResponse, NextRequest } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabaseServer";
import crypto from "crypto";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";
import { getClientGeo } from "@/lib/geo";

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const { ok } = await checkRateLimit("customer-pii", ip, 20, 600); // 20 per 10 min per IP
    if (!ok) {
      return NextResponse.json(
        { error: "Too many attempts. Please wait a few minutes and try again." },
        { status: 429 }
      );
    }

    const { email, phone } = await req.json();

    if (!phone) {
      return NextResponse.json(
        { error: "Phone number is required" },
        { status: 400 }
      );
    }

    // Generate a unique 6-digit customer_id based on the phone number
    // We use SHA-256 to hash the phone string, then extract an integer from it
    const hash = crypto.createHash("sha256").update(phone).digest("hex");
    // Convert first 8 characters of hex hash to integer, then modulo 900000 + 100000 
    // to guarantee a 6-digit number between 100000 and 999999.
    const hashInt = parseInt(hash.substring(0, 8), 16);
    const customerId = (100000 + (hashInt % 900000)).toString();

    const supabase = createServerSupabaseClient();

    // Check if customer already has a stored email to avoid overwriting with empty
    const { data: existing } = await supabase
      .from("customer_pii")
      .select("email")
      .eq("phone_number", phone)
      .maybeSingle();

    const resolvedEmail = (email && typeof email === "string" && email.trim()) || existing?.email || "";

    const geo = getClientGeo(req);

    const piiPayload: Record<string, any> = {
      customer_id: customerId,
      phone_number: phone,
      email: resolvedEmail,
      updated_at: new Date().toISOString(),
      client_ip: geo.ip || null,
      client_city: geo.city || null,
      client_region: geo.region || null,
      client_country: geo.country || null,
    };

    let { error } = await supabase
      .from("customer_pii")
      .upsert(piiPayload, { onConflict: "phone_number" });

    // Fallback if client_* columns are not added to customer_pii yet (PGRST204)
    if (error && error.code === "PGRST204") {
      delete piiPayload.client_ip;
      delete piiPayload.client_city;
      delete piiPayload.client_region;
      delete piiPayload.client_country;
      const retry = await supabase
        .from("customer_pii")
        .upsert(piiPayload, { onConflict: "phone_number" });
      error = retry.error;
    }

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json(
        { error: "Failed to save customer details" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, customer_id: customerId });
  } catch (err: any) {
    console.error("API Error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
