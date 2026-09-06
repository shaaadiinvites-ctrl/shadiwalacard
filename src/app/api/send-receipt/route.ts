import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createServerSupabaseClient } from "@/lib/supabaseServer";
import { sendSetupLinkEmail } from "@/lib/email";
import { signSetupLink } from "@/lib/linkSecurity";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

// POST /api/send-receipt
// Body: { paymentOrderId, templateId, email, phone, sig }
// Dispatches the official GST payment receipt and direct invitation link to customer's email
export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const { ok } = await checkRateLimit("send-receipt", ip, 10, 600); // 10 per 10 min
    if (!ok) {
      return NextResponse.json(
        { error: "Too many requests. Please wait a few moments before trying again." },
        { status: 429 }
      );
    }

    const { paymentOrderId, templateId, email, phone } = await req.json();

    if (!paymentOrderId || !email) {
      return NextResponse.json({ error: "Order ID and email are required." }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const cleanEmail = email.trim().toLowerCase();
    if (!emailRegex.test(cleanEmail)) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    const supabase = createServerSupabaseClient();

    // Verify payment order exists in database
    const { data: order, error: orderErr } = await supabase
      .from("payment_orders")
      .select("id, template_id, status, wedding_id")
      .eq("id", paymentOrderId)
      .single();

    if (orderErr || !order) {
      return NextResponse.json({ error: "Payment order not found." }, { status: 404 });
    }

    const resolvedTemplate = templateId || order.template_id || "grand-palace";

    // Generate cryptographic HMAC-SHA256 signature for this email/phone tuple
    const signature = signSetupLink({
      po: order.id,
      template: resolvedTemplate,
      email: cleanEmail,
      phone: phone || "",
    });

    const origin = req.headers.get("origin") || "https://shadiwalacard.com";
    let setupUrl = `${origin}/form?po=${order.id}&template=${resolvedTemplate}&e=${encodeURIComponent(cleanEmail)}`;
    if (phone) setupUrl += `&p=${encodeURIComponent(phone)}`;
    setupUrl += `&sig=${signature}`;

    // 1. If wedding was already created for this order, attach email to it
    if (order.wedding_id) {
      try {
        await supabase
          .from("weddings")
          .update({ primary_email: cleanEmail, updated_at: new Date().toISOString() })
          .eq("id", order.wedding_id)
          .is("primary_email", null);
      } catch (e) {
        console.error("Could not link email to existing wedding:", e);
      }
    }

    // 2. Auto-save/update customer_pii table with this email
    if (phone) {
      const cleanDigits = phone.replace(/\D/g, "");
      try {
        // Try updating existing record by phone_number
        const { data: updatedRows } = await supabase
          .from("customer_pii")
          .update({ email: cleanEmail, updated_at: new Date().toISOString() })
          .or(`phone_number.eq.${phone},phone_number.eq.+${cleanDigits},phone_number.eq.${cleanDigits}`)
          .select("id");

        // If no matching phone was found, insert a new record
        if (!updatedRows || updatedRows.length === 0) {
          const hash = crypto.createHash("sha256").update(phone).digest("hex");
          const hashInt = parseInt(hash.substring(0, 8), 16);
          const customerId = (100000 + (hashInt % 900000)).toString();

          await supabase
            .from("customer_pii")
            .upsert(
              {
                customer_id: customerId,
                phone_number: phone,
                email: cleanEmail,
                updated_at: new Date().toISOString(),
              },
              { onConflict: "phone_number" }
            );
        }
      } catch (e) {
        console.error("Could not update customer_pii with email:", e);
      }
    }

    // Fire email with setup link & official receipt
    await sendSetupLinkEmail(cleanEmail, setupUrl);

    return NextResponse.json({
      success: true,
      email: cleanEmail,
      setupUrl,
    });
  } catch (err: any) {
    console.error("Error in /api/send-receipt:", err);
    return NextResponse.json({ error: "Failed to send receipt. Please try again." }, { status: 500 });
  }
}
