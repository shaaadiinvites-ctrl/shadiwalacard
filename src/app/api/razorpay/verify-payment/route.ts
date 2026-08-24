import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createServerSupabaseClient } from "@/lib/supabaseServer";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

// POST /api/razorpay/verify-payment
// Body: { paymentOrderId, razorpay_order_id, razorpay_payment_id, razorpay_signature }
// Verifies the HMAC signature Razorpay's Checkout returns on success, and if
// valid, marks the payment_orders row as 'verified'. submit-wedding later
// checks for a 'verified' + unused row before it will insert a wedding.
export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const { ok } = await checkRateLimit("verify-payment", ip, 20, 600); // 20 per 10 min per IP
    if (!ok) {
      return NextResponse.json({ error: "Too many attempts. Please wait a few minutes and try again." }, { status: 429 });
    }

    const { paymentOrderId, razorpay_order_id, razorpay_payment_id, razorpay_signature, email } = await req.json();

    if (!paymentOrderId || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ error: "Missing payment fields." }, { status: 400 });
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      return NextResponse.json({ error: "Payments aren't configured yet." }, { status: 500 });
    }

    const expectedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json({ error: "Payment signature verification failed." }, { status: 400 });
    }

    const supabase = createServerSupabaseClient();
    const { data: row, error } = await supabase
      .from("payment_orders")
      .update({
        status: "verified",
        razorpay_payment_id,
        verified_at: new Date().toISOString(),
      })
      .eq("id", paymentOrderId)
      .eq("razorpay_order_id", razorpay_order_id)
      .eq("status", "created") // can't re-verify an already used/verified order
      .select("id, template_id")
      .single();

    if (error || !row) {
      console.error("verify-payment: could not update payment_orders", error);
      return NextResponse.json({ error: "This payment was already used or could not be verified." }, { status: 400 });
    }

    // Send setup email if we got the email
    if (email) {
      const origin = req.headers.get("origin") || "https://shaadiwala.in";
      const setupUrl = `${origin}/form?po=${row.id}&template=${row.template_id}`;
      // Import dynamically or we can add it to the top
      const { sendSetupLinkEmail } = await import("@/lib/email");
      // Fire and forget (don't await so we don't slow down the response)
      sendSetupLinkEmail(email, setupUrl).catch(console.error);
    }

    return NextResponse.json({ verified: true, paymentOrderId: row.id, templateId: row.template_id });
  } catch (err) {
    console.error("verify-payment route error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
