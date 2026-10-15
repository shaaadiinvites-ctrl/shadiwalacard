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

    const { paymentOrderId, razorpay_order_id, razorpay_payment_id, razorpay_signature, email, phone } = await req.json();

    if (!paymentOrderId || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ error: "Missing payment fields." }, { status: 400 });
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET?.trim();
    if (!keySecret) {
      return NextResponse.json({ error: "Payments aren't configured yet." }, { status: 500 });
    }

    const expectedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    const expectedBuf = Buffer.from(expectedSignature, "utf-8");
    const receivedBuf = Buffer.from(razorpay_signature, "utf-8");

    const isMatch =
      expectedBuf.length === receivedBuf.length &&
      crypto.timingSafeEqual(expectedBuf, receivedBuf);

    if (!isMatch) {
      return NextResponse.json({ success: false, error: "Payment signature verification failed." }, { status: 400 });
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

    // Safely record customer_phone on payment_orders if column exists
    if (phone) {
      try {
        await supabase
          .from("payment_orders")
          .update({ customer_phone: phone })
          .eq("id", row.id);
      } catch (e) {
        // Gracefully ignore if customer_phone column is not yet present
      }
    }

    const { signSetupLink } = await import("@/lib/linkSecurity");
    // Sign setup link without exposing phone in the URL query string
    const signature = signSetupLink({
      po: row.id,
      template: row.template_id,
      email: email || "",
      phone: "",
    });

    const reqOrigin = req.headers.get("origin") || "";
    const origin =
      reqOrigin && !reqOrigin.includes("localhost") && !reqOrigin.includes("127.0.0.1")
        ? reqOrigin
        : "https://shadiwalacard.com";
    let setupUrl = `${origin}/form?po=${row.id}&template=${row.template_id}`;
    if (email) setupUrl += `&e=${encodeURIComponent(email)}`;
    // Omit &p= so the customer's phone number remains private in WhatsApp & shared URLs
    setupUrl += `&sig=${signature}`;

    // Dispatch automated WhatsApp confirmation and email in parallel before returning
    const dispatchTasks: Promise<any>[] = [];

    if (phone) {
      dispatchTasks.push(
        (async () => {
          const { sendWhatsAppOrderConfirmation } = await import("@/lib/whatsapp");
          const { getTemplate } = await import("@/lib/templates");
          const tmpl = getTemplate(row.template_id);
          const result = await sendWhatsAppOrderConfirmation({
            phone,
            templateName: tmpl.name,
            customizeUrl: setupUrl,
          });
          if (!result.success) {
            console.error("WhatsApp delivery issue:", result.error);
          }
          return result;
        })().catch((err) => console.error("WhatsApp dispatch error:", err))
      );
    }

    let customerEmail = email ? email.trim().toLowerCase() : "";

    // If email was not passed by client, fetch it directly from Razorpay payment details
    if (!customerEmail && razorpay_payment_id && process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
      try {
        const authHeader = Buffer.from(`${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`).toString("base64");
        const rzpRes = await fetch(`https://api.razorpay.com/v1/payments/${razorpay_payment_id}`, {
          headers: { Authorization: `Basic ${authHeader}` },
        });
        if (rzpRes.ok) {
          const paymentData = await rzpRes.json();
          if (paymentData.email) {
            customerEmail = paymentData.email.trim().toLowerCase();
          }
        }
      } catch (err) {
        console.error("verify-payment: could not fetch customer email from Razorpay:", err);
      }
    }

    if (customerEmail) {
      dispatchTasks.push(
        (async () => {
          const { sendSetupLinkEmail } = await import("@/lib/email");
          return sendSetupLinkEmail(customerEmail, setupUrl);
        })().catch((err) => console.error("Email dispatch error:", err))
      );
    }

    if (dispatchTasks.length > 0) {
      await Promise.allSettled(dispatchTasks);
    }

    return NextResponse.json({
      success: true,
      verified: true,
      paymentOrderId: row.id,
      templateId: row.template_id,
      signature,
    });
  } catch (err) {
    console.error("verify-payment route error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
