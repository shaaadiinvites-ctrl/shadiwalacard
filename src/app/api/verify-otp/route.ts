import { NextResponse } from "next/server";
import { auth } from "@/lib/firebaseAdmin";
import { createServerSupabaseClient } from "@/lib/supabaseServer";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { idToken, phone } = await req.json();

    if (!idToken || !phone) {
      return NextResponse.json({ error: "Missing token or phone" }, { status: 400 });
    }

    // 1. Verify the Firebase ID Token
    const decodedToken = await auth.verifyIdToken(idToken);
    
    // Check if the phone number in the token matches what they sent (compare normalized 10 digits)
    const firebaseDigits = (decodedToken.phone_number || "").replace(/\D/g, "").slice(-10);
    const requestedDigits = phone.replace(/\D/g, "").slice(-10);

    if (!firebaseDigits || firebaseDigits !== requestedDigits) {
      return NextResponse.json({ error: "Phone number does not match verification code" }, { status: 400 });
    }

    // 2. Update Supabase customer_pii if present
    try {
      const supabase = createServerSupabaseClient();
      const formattedPhone = `+91${requestedDigits}`;
      await supabase
        .from("customer_pii")
        .update({ is_verified: true })
        .or(`phone_number.eq.${formattedPhone},phone_number.eq.${requestedDigits}`);
    } catch (dbErr) {
      console.warn("Supabase customer_pii update notice:", dbErr);
    }

    return NextResponse.json({ success: true, verifiedPhone: `+91${requestedDigits}` });
  } catch (err: any) {
    console.error("OTP Verification Error:", err);
    return NextResponse.json({ error: err.message || "Invalid token or verification failed" }, { status: 401 });
  }
}
