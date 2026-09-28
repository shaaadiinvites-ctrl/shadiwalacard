import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { texts, targetLang } = await req.json();
    if (!texts || !Array.isArray(texts) || texts.length === 0) {
      return NextResponse.json({ results: [] });
    }
    
    // source lang is auto-detected
    const sl = targetLang === "hi" ? "en" : "hi";
    const tl = targetLang;
    
    const combinedText = texts.join("\n");
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sl}&tl=${tl}&dt=t&q=${encodeURIComponent(combinedText)}`;
    
    const response = await fetch(url);
    if (!response.ok) throw new Error("Google Translate API failed");

    const data = await response.json();
    
    if (data && data[0] && Array.isArray(data[0])) {
      let fullTranslation = "";
      for (const segment of data[0]) {
        if (segment[0]) {
          fullTranslation += segment[0];
        }
      }
      
      const results = fullTranslation.split("\n").map(s => s.trim());
      // ensure we return the exact number of results
      return NextResponse.json({ results: results.slice(0, texts.length) });
    }

    return NextResponse.json({ results: texts });
  } catch (error) {
    console.error("Bulk Translation Error:", error);
    return NextResponse.json({ error: "Failed to translate" }, { status: 500 });
  }
}
