import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { getTemplate, TEMPLATES } from "@/lib/templates";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

// POST /api/create-order
// Request: { amount (paise), currency, receipt } or { templateId, couponCode, phone }
// Returns: { order_id, amount, currency, key_id }
export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const { ok } = await checkRateLimit("create-order", ip, 15, 600); // 15 per 10 min per IP
    if (!ok) {
      return NextResponse.json({ error: "Too many order creation attempts. Please wait a few minutes." }, { status: 429 });
    }

    const body = await req.json().catch(() => ({}));

    const keyId = process.env.RAZORPAY_KEY_ID?.trim();
    const keySecret = process.env.RAZORPAY_KEY_SECRET?.trim();

    if (!keyId || !keySecret) {
      return NextResponse.json(
        { error: "Razorpay credentials are not configured. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET." },
        { status: 500 }
      );
    }

    let amountPaise: number;
    let currency: string = body.currency || "INR";
    let receipt: string = body.receipt || `rcpt_${Date.now()}`;
    let templateName: string | undefined = undefined;

    // Support both direct amount (in paise) and templateId purchase flow
    if (typeof body.amount === "number") {
      amountPaise = body.amount;
    } else if (body.templateId) {
      if (!TEMPLATES.some((t) => t.id === body.templateId)) {
        return NextResponse.json({ error: "Invalid template selected." }, { status: 400 });
      }
      const template = getTemplate(body.templateId);
      templateName = template.name;
      let finalPrice = template.priceInr;
      const cleanCoupon = (body.couponCode || "").trim().toUpperCase();
      if (cleanCoupon === "SAARTHI100") {
        finalPrice = 0;
      } else if (cleanCoupon === "SHADI10") {
        finalPrice = finalPrice - Math.round(finalPrice * 0.1);
      } else if (cleanCoupon === "SHADI790" || cleanCoupon === "RD790" || cleanCoupon === "RS790" || cleanCoupon === "TEST9") {
        finalPrice = Math.max(9, finalPrice - 790);
      }
      amountPaise = finalPrice * 100;
      receipt = `tmpl_${template.id}_${Date.now()}`;
    } else {
      return NextResponse.json(
        { error: "Invalid request. Please provide an amount in paise or a templateId." },
        { status: 400 }
      );
    }

    // Validate minimum amount (>= 100 paise = 1 INR)
    if (amountPaise < 100) {
      return NextResponse.json(
        { error: "Amount must be at least 100 paise (₹1)." },
        { status: 400 }
      );
    }

    try {
      const razorpay = new Razorpay({
        key_id: keyId,
        key_secret: keySecret,
      });

      const order = await razorpay.orders.create({
        amount: Math.round(amountPaise),
        currency,
        receipt,
        notes: body.templateId ? { template_id: body.templateId } : undefined,
      });

      return NextResponse.json({
        order_id: order.id,
        amount: order.amount,
        currency: order.currency,
        key_id: keyId,
        // Also provide camelCase aliases for project compatibility
        orderId: order.id,
        amountPaise: order.amount,
        keyId,
        templateName,
      });
    } catch (rzpErr: any) {
      console.error("Razorpay order creation error:", rzpErr);
      const statusCode = rzpErr.statusCode || rzpErr.status;
      if (statusCode === 401 || rzpErr?.error?.code === "BAD_REQUEST_ERROR" && rzpErr?.error?.description?.includes("Authenticate")) {
        return NextResponse.json(
          { error: "Razorpay authentication failed. Please verify your RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET." },
          { status: 401 }
        );
      }
      return NextResponse.json(
        { error: rzpErr?.error?.description || rzpErr.message || "Failed to create Razorpay order." },
        { status: 500 }
      );
    }
  } catch (err: any) {
    console.error("Unhandled error in /api/create-order:", err);
    return NextResponse.json(
      { error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}
