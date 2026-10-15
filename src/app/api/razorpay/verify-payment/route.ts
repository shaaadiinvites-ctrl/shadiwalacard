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
      .select("id, template_id, coupon_id")
      .single();

    if (error || !row) {
      console.error("verify-payment: could not update payment_orders", error);
      return NextResponse.json({ error: "This payment was already used or could not be verified." }, { status: 400 });
    }

    // Increment coupon used_count if a coupon was used
    if (row.coupon_id) {
      try {
        const { data: cData } = await supabase.from("coupons").select("used_count").eq("id", row.coupon_id).single();
        if (cData) {
          await supabase.from("coupons").update({ used_count: (cData.used_count || 0) + 1 }).eq("id", row.coupon_id);
        }
      } catch (cErr) {
        console.warn("Could not increment coupon used_count:", cErr);
      }
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

    // Fetch full payment details from Razorpay to capture payment method (UPI vs Card), fee, and metadata
    if (razorpay_payment_id && process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
      try {
        const authHeader = Buffer.from(`${process.env.RAZORPAY_KEY_ID.trim()}:${process.env.RAZORPAY_KEY_SECRET.trim()}`).toString("base64");
        const rzpRes = await fetch(`https://api.razorpay.com/v1/payments/${razorpay_payment_id}`, {
          headers: { Authorization: `Basic ${authHeader}` },
        });
        if (rzpRes.ok) {
          const paymentData = await rzpRes.json();
          if (paymentData.email && !customerEmail) {
            const fetched = paymentData.email.trim().toLowerCase();
            if (!fetched.endsWith("@razorpay.com") && !fetched.includes("void@") && !fetched.includes("dummy@")) {
              customerEmail = fetched;
            }
          }

          // Format payment method details (UPI VPA, Card network + last4, Netbanking Bank)
          let methodDetails = "";
          if (paymentData.method === "upi") {
            methodDetails = paymentData.vpa ? `UPI: ${paymentData.vpa}` : "UPI";
          } else if (paymentData.method === "card" && paymentData.card) {
            methodDetails = `${paymentData.card.network || "Card"} ${paymentData.card.type || ""} •••• ${paymentData.card.last4 || ""}`.trim();
          } else if (paymentData.method === "netbanking") {
            methodDetails = paymentData.bank ? `Netbanking: ${paymentData.bank}` : "Netbanking";
          } else if (paymentData.method === "wallet") {
            methodDetails = paymentData.wallet ? `Wallet: ${paymentData.wallet}` : "Wallet";
          } else {
            methodDetails = paymentData.method || "Unknown";
          }

          const feeInr = typeof paymentData.fee === "number" ? paymentData.fee / 100 : 0;
          const taxInr = typeof paymentData.tax === "number" ? paymentData.tax / 100 : 0;

          // Update payment_orders with enriched payment information
          await supabase
            .from("payment_orders")
            .update({
              payment_method: paymentData.method || null,
              payment_method_details: methodDetails || null,
              gateway_fee_inr: feeInr,
              gateway_tax_inr: taxInr,
              razorpay_metadata: paymentData,
            })
            .eq("id", row.id);
        }
      } catch (err) {
        console.error("verify-payment: error fetching/saving Razorpay payment metadata:", err);
      }
    }

    if (customerEmail && !customerEmail.endsWith("@razorpay.com") && !customerEmail.includes("void@")) {
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
