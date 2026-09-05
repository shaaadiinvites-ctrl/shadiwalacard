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
    
    // Check if the phone number in the token matches what they sent (ensure +91 format)
    const firebasePhone = decodedToken.phone_number;
    const requestedPhone = phone.startsWith('+') ? phone : `+91${phone}`;

    if (firebasePhone !== requestedPhone) {
      return NextResponse.json({ error: "Phone number mismatch" }, { status: 400 });
    }

    // 2. Update Supabase
    const supabase = createServerSupabaseClient();
    const { error } = await supabase
      .from("customer_pii")
      .update({ is_verified: true })
      .eq("phone_number", requestedPhone);

    if (error) {
      console.error("Supabase update error:", error);
      return NextResponse.json({ error: "Failed to update verified status" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("OTP Verification Error:", err);
    return NextResponse.json({ error: "Invalid token or verification failed" }, { status: 401 });
  }
}
