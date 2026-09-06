import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { auth } from "@/lib/firebaseAdmin";
import { createServerSupabaseClient } from "@/lib/supabaseServer";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";
import { signSetupLink } from "@/lib/linkSecurity";

// POST /api/find-invite
// Body: { idToken: string, phone: string }
// Authenticates user via Firebase SMS OTP and looks up their wedding invitation or active paid orders
export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const { ok } = await checkRateLimit("find-invite", ip, 10, 600); // 10 attempts per 10 min
    if (!ok) {
      return NextResponse.json(
        { error: "Too many attempts. Please wait a few moments before trying again." },
        { status: 429 }
      );
    }

    const { idToken, phone } = await req.json();

    if (!idToken || !phone) {
      return NextResponse.json({ error: "Missing token or phone number" }, { status: 400 });
    }

    // 1. Verify the Firebase ID Token
    let decodedToken;
    try {
      decodedToken = await auth.verifyIdToken(idToken);
    } catch (err: any) {
      console.error("Firebase token verification failed:", err);
      return NextResponse.json({ error: "Verification session expired or invalid. Please try again." }, { status: 401 });
    }

    // Extract digits
    const tokenPhoneDigits = (decodedToken.phone_number || "").replace(/\D/g, "");
    const requestedPhoneDigits = phone.replace(/\D/g, "");

    const tokenLast10 = tokenPhoneDigits.slice(-10);
    const requestedLast10 = requestedPhoneDigits.slice(-10);

    // Verify phone in token matches requested phone
    if (!tokenLast10 || tokenLast10 !== requestedLast10) {
      return NextResponse.json({ error: "Verified phone number does not match request." }, { status: 403 });
    }

    const supabase = createServerSupabaseClient();

    // 2. Query weddings by contact_number ending with the 10 digits
    const { data: weddings, error: weddingError } = await supabase
      .from("weddings")
      .select("id, slug, bride_name, groom_name, contact_number, edit_token, template_id, created_at")
      .ilike("contact_number", `%${requestedLast10}%`)
      .order("created_at", { ascending: false });

    if (weddingError) {
      console.error("Supabase weddings query error:", weddingError);
    }

    if (weddings && weddings.length > 0) {
      // Ensure each wedding has an edit_token
      for (const w of weddings) {
        if (!w.edit_token) {
          const generatedToken = crypto.randomBytes(24).toString("hex");
          await supabase
            .from("weddings")
            .update({ edit_token: generatedToken })
            .eq("id", w.id);
          w.edit_token = generatedToken;
        }
      }

      const formattedWeddings = weddings.map((w) => ({
        id: w.id,
        slug: w.slug,
        coupleNames: `${w.groom_name} & ${w.bride_name}`,
        editUrl: `/edit/${w.edit_token}`,
        previewUrl: `/${w.slug}`,
        createdAt: w.created_at,
        templateId: w.template_id,
      }));

      return NextResponse.json({
        found: true,
        type: "wedding",
        weddings: formattedWeddings,
        primaryEditUrl: formattedWeddings[0].editUrl,
        primaryCoupleNames: formattedWeddings[0].coupleNames,
      });
    }

    // 3. If no wedding found, check if there is an unsubmitted verified payment order
    // Query payment_orders with customer_phone if available, or status = 'verified'
    try {
      const { data: orders } = await supabase
        .from("payment_orders")
        .select("id, template_id, status, created_at, customer_phone")
        .eq("status", "verified")
        .ilike("customer_phone", `%${requestedLast10}%`)
        .order("created_at", { ascending: false })
        .limit(1);

      if (orders && orders.length > 0) {
        const order = orders[0];
        const template = order.template_id || "grand-palace";
        const signature = signSetupLink({
          po: order.id,
          template,
          email: "",
          phone: requestedPhoneDigits,
        });

        const formUrl = `/form?po=${order.id}&template=${template}&p=${encodeURIComponent(requestedPhoneDigits)}&sig=${signature}`;

        return NextResponse.json({
          found: true,
          type: "order",
          formUrl,
          orderId: order.id,
          templateId: template,
        });
      }
    } catch (orderErr) {
      // customer_phone column might not exist yet; gracefully continue to not found
    }

    return NextResponse.json({
      found: false,
      message: `No active wedding invitation found for +91 ${requestedLast10}. If you just placed an order, please allow 1-2 minutes or contact support.`,
    });
  } catch (err: any) {
    console.error("find-invite error:", err);
    return NextResponse.json({ error: "Internal server error. Please try again later." }, { status: 500 });
  }
}
