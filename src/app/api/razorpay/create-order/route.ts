import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabaseServer";
import { getTemplate } from "@/lib/templates";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

// Cloudflare Turnstile (free CAPTCHA) verification. If TURNSTILE_SECRET_KEY
// isn't set, this no-ops and lets requests through — so the site keeps
// working before you've set up a Turnstile account. Once you add the keys
// (see README / SECURITY-AUDIT.md), it starts actually blocking bots.
async function verifyTurnstile(token: string | undefined, ip: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true;
  if (!token) return false;
  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret, response: token, remoteip: ip }),
    });
    const data = await res.json();
    return data?.success === true;
  } catch (err) {
    console.error("Turnstile verification error:", err);
    return false;
  }
}

// POST /api/razorpay/create-order
// Body: { templateId: string, turnstileToken?: string }
// Creates a Razorpay order for the template's price, records it in
// payment_orders (status='created'), and returns what the client needs to
// open the Razorpay Checkout modal.
export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const { ok } = await checkRateLimit("create-order", ip, 8, 600); // 8 per 10 min per IP
    if (!ok) {
      return NextResponse.json({ error: "Too many attempts. Please wait a few minutes and try again." }, { status: 429 });
    }

    const { templateId, turnstileToken, couponCode } = await req.json();

    if (!(await verifyTurnstile(turnstileToken, ip))) {
      return NextResponse.json({ error: "Verification failed. Please refresh the page and try again." }, { status: 400 });
    }

    const template = getTemplate(templateId);

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keyId || !keySecret) {
      return NextResponse.json(
        { error: "Payments aren't configured yet. RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET are missing." },
        { status: 500 }
      );
    }

    let finalPrice = template.priceInr;
    if (couponCode && couponCode.toUpperCase() === "SHADI10") {
      finalPrice = finalPrice - Math.round(finalPrice * 0.1);
    }

    const amountPaise = finalPrice * 100;

    const razorpayRes = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Basic " + Buffer.from(`${keyId}:${keySecret}`).toString("base64"),
      },
      body: JSON.stringify({
        amount: amountPaise,
        currency: "INR",
        receipt: `tmpl_${template.id}_${Date.now()}`,
        notes: { template_id: template.id },
      }),
    });

    const order = await razorpayRes.json();
    if (!razorpayRes.ok) {
      console.error("Razorpay order creation failed:", order);
      return NextResponse.json({ error: order?.error?.description || "Could not create payment order." }, { status: 502 });
    }

    const supabase = createServerSupabaseClient();
    const { data: row, error } = await supabase
      .from("payment_orders")
      .insert({
        razorpay_order_id: order.id,
        template_id: template.id,
        amount_inr: finalPrice,
        status: "created",
      })
      .select("id")
      .single();

    if (error) {
      // Full error goes to server logs only — never to the client. Internal
      // DB error details (schema names, constraint names) shouldn't be
      // handed to whoever is calling this API.
      console.error("Supabase payment_orders insert error:", error);
      return NextResponse.json({ error: "Could not save payment order." }, { status: 500 });
    }

    return NextResponse.json({
      orderId: order.id,
      amountPaise,
      keyId,
      paymentOrderId: row.id,
      templateName: template.name,
    });
  } catch (err) {
    console.error("create-order route error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
