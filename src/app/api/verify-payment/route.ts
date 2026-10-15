import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createServerSupabaseClient } from "@/lib/supabaseServer";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

// POST /api/verify-payment
// Request: { razorpay_order_id, razorpay_payment_id, razorpay_signature }
// Returns: { success: boolean, message?: string }
export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const { ok } = await checkRateLimit("verify-payment", ip, 20, 600); // 20 per 10 min per IP
    if (!ok) {
      return NextResponse.json({ error: "Too many verification attempts. Please wait a few minutes." }, { status: 429 });
    }

    const body = await req.json().catch(() => ({}));

    // Accept both standard Razorpay callback parameter names and camelCase / aliases
    const razorpayOrderId = body.razorpay_order_id || body.order_id || body.orderId;
    const razorpayPaymentId = body.razorpay_payment_id || body.payment_id || body.paymentId;
    const razorpaySignature = body.razorpay_signature || body.signature;
    const paymentOrderId = body.paymentOrderId;
    const phone = body.phone;
    const email = body.email;

    // Validate missing fields
    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required payment verification fields (razorpay_order_id, razorpay_payment_id, razorpay_signature).",
        },
        { status: 400 }
      );
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET?.trim();
    if (!keySecret) {
      return NextResponse.json(
        { success: false, error: "Razorpay key secret is not configured on the server." },
        { status: 500 }
      );
    }

    // HMAC-SHA256 verification: HMAC(order_id + "|" + payment_id, KEY_SECRET)
    const expectedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest("hex");

    const expectedBuf = Buffer.from(expectedSignature, "utf-8");
    const receivedBuf = Buffer.from(razorpaySignature, "utf-8");

    const isSignatureValid =
      expectedBuf.length === receivedBuf.length &&
      crypto.timingSafeEqual(expectedBuf, receivedBuf);

    if (!isSignatureValid) {
      return NextResponse.json(
        { success: false, error: "Payment verification failed: signature mismatch." },
        { status: 400 }
      );
    }

    // If paymentOrderId is provided, update Supabase payment_orders row
    let setupSignature: string | undefined = undefined;
    let templateId: string | undefined = undefined;

    if (paymentOrderId) {
      try {
        const supabase = createServerSupabaseClient();
        const { data: row, error } = await supabase
          .from("payment_orders")
          .update({
            status: "verified",
            razorpay_payment_id: razorpayPaymentId,
            verified_at: new Date().toISOString(),
          })
          .eq("id", paymentOrderId)
          .eq("razorpay_order_id", razorpayOrderId)
          .eq("status", "created")
          .select("id, template_id")
          .single();

        if (error || !row) {
          console.warn("verify-payment: order update skipped or already verified", error);
        } else {
          templateId = row.template_id;
          const { signSetupLink } = await import("@/lib/linkSecurity");
          setupSignature = signSetupLink({
            po: row.id,
            template: row.template_id,
            email: email || "",
            phone: "",
          });

          // Dispatch confirmation in background
          if (phone) {
            import("@/lib/whatsapp").then(async ({ sendWhatsAppOrderConfirmation }) => {
              const { getTemplate } = await import("@/lib/templates");
              const tmpl = getTemplate(row.template_id);
              const origin = "https://shadiwalacard.com";
              const setupUrl = `${origin}/form?po=${row.id}&template=${row.template_id}&sig=${setupSignature}`;
              sendWhatsAppOrderConfirmation({
                phone,
                templateName: tmpl.name,
                customizeUrl: setupUrl,
              }).catch((e) => console.error("WhatsApp error in verify-payment:", e));
            }).catch((err) => console.error("Failed to load whatsapp module:", err));
          }
        }
      } catch (dbErr) {
        console.error("Database update error in verify-payment:", dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      verified: true,
      message: "Payment signature verified successfully.",
      razorpay_order_id: razorpayOrderId,
      razorpay_payment_id: razorpayPaymentId,
      paymentOrderId,
      signature: setupSignature,
      templateId,
    });
  } catch (err: any) {
    console.error("verify-payment error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to verify payment." },
      { status: 500 }
    );
  }
}
