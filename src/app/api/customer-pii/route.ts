import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabaseServer";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
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

    const { error } = await supabase
      .from("customer_pii")
      .upsert(
        {
          customer_id: customerId,
          phone_number: phone,
          email: resolvedEmail,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "phone_number" }
      );

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
