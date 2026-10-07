import { NextResponse, NextRequest } from "next/server";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const { ok } = await checkRateLimit("transliterate", ip, 50, 60); // 50 requests per minute
    if (!ok) {
      return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
    }

    const { text } = await req.json();
    if (!text) return NextResponse.json({ result: "" });

    const url = `https://inputtools.google.com/request?text=${encodeURIComponent(text)}&itc=hi-t-i0-und&num=1&cp=0&cs=1&ie=utf-8&oe=utf-8&app=shadiwalacard`;
    
    const response = await fetch(url);
    if (!response.ok) throw new Error("Google API failed");

    const data = await response.json();
    
    let result = text;
    if (data[0] === "SUCCESS" && data[1] && data[1][0] && data[1][0][1] && data[1][0][1][0]) {
      result = data[1][0][1][0];
    }

    return NextResponse.json({ result });
  } catch (error) {
    console.error("Transliteration Error:", error);
    return NextResponse.json({ error: "Failed to transliterate" }, { status: 500 });
  }
}