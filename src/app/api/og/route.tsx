import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import sharp from "sharp";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";

function formatDisplayDate(rawDate: string): string {
  if (!rawDate) return "";
  const match = rawDate.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (match) {
    const [, y, m, d] = match;
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];
    const monthName = months[parseInt(m, 10) - 1] || m;
    return `${parseInt(d, 10)} ${monthName} ${y}`;
  }
  return rawDate;
}

function formatTitleCase(str: string): string {
  if (!str) return "";
  return str
    .split(" ")
    .map((word) => (word ? word.charAt(0).toUpperCase() + word.slice(1) : ""))
    .join(" ");
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const rawNames = searchParams.get("names") || "Wedding Invitation";
    const rawDate = searchParams.get("date") || "";
    const rawVenue = searchParams.get("venue") || "";
    const hashtag = searchParams.get("hashtag") || "";
    const photo = searchParams.get("photo") || "";

    const names = formatTitleCase(rawNames);
    const date = formatDisplayDate(rawDate);
    const venue = formatTitleCase(rawVenue);

    // Timeout-guarded photo fetching (1500ms) with data-URI conversion
    let photoDataUri: string | null = null;
    if (photo && photo.startsWith("http")) {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 1500);
        const res = await fetch(photo, { signal: controller.signal });
        clearTimeout(timeout);
        if (res.ok) {
          const ab = await res.arrayBuffer();
          const mime = res.headers.get("content-type") || "image/jpeg";
          photoDataUri = `data:${mime};base64,${Buffer.from(ab).toString("base64")}`;
        }
      } catch {
        // External photo unreachable or timed out — safely fall back to royal text card
      }
    }

    const hasPhoto = Boolean(photoDataUri);

    const imageResponse = new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#080406",
            backgroundImage:
              "radial-gradient(circle at 50% 30%, rgba(225, 29, 72, 0.22) 0%, rgba(136, 19, 55, 0.1) 40%, rgba(8, 4, 6, 1) 85%)",
            padding: "36px",
            fontFamily: "serif",
            position: "relative",
          }}
        >
          {/* Decorative Outer Border */}
          <div
            style={{
              position: "absolute",
              top: "20px",
              left: "20px",
              right: "20px",
              bottom: "20px",
              border: "2px solid rgba(212, 175, 55, 0.5)",
              borderRadius: "16px",
            }}
          />

          {/* Decorative Inner Border */}
          <div
            style={{
              position: "absolute",
              top: "28px",
              left: "28px",
              right: "28px",
              bottom: "28px",
              border: "1px solid rgba(212, 175, 55, 0.2)",
              borderRadius: "12px",
            }}
          />

          {/* Corner Accents */}
          <div
            style={{
              position: "absolute",
              top: "22px",
              left: "22px",
              width: "16px",
              height: "16px",
              borderTop: "3px solid #f59e0b",
              borderLeft: "3px solid #f59e0b",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "22px",
              right: "22px",
              width: "16px",
              height: "16px",
              borderTop: "3px solid #f59e0b",
              borderRight: "3px solid #f59e0b",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "22px",
              left: "22px",
              width: "16px",
              height: "16px",
              borderBottom: "3px solid #f59e0b",
              borderLeft: "3px solid #f59e0b",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "22px",
              right: "22px",
              width: "16px",
              height: "16px",
              borderBottom: "3px solid #f59e0b",
              borderRight: "3px solid #f59e0b",
            }}
          />

          {/* Top Royal Tag */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "16px",
              letterSpacing: "4px",
              textTransform: "uppercase",
              fontSize: "14px",
              fontWeight: 700,
              color: "#fbbf24",
              background: "rgba(245, 158, 11, 0.12)",
              border: "1px solid rgba(245, 158, 11, 0.35)",
              padding: "6px 20px",
              borderRadius: "999px",
            }}
          >
            <span>👑 ROYAL WEDDING INVITATION</span>
          </div>

          {/* Content Container (Split or Centered) */}
          <div
            style={{
              display: "flex",
              flexDirection: hasPhoto ? "row" : "column",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              maxWidth: "1080px",
              gap: hasPhoto ? "48px" : "16px",
              flex: 1,
            }}
          >
            {hasPhoto && (
              <div
                style={{
                  display: "flex",
                  width: "280px",
                  height: "280px",
                  borderRadius: "20px",
                  overflow: "hidden",
                  border: "3px solid rgba(245, 158, 11, 0.6)",
                  boxShadow: "0 10px 40px rgba(0, 0, 0, 0.8), 0 0 20px rgba(225, 29, 72, 0.3)",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photoDataUri!}
                  alt={names}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </div>
            )}

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: hasPhoto ? "flex-start" : "center",
                textAlign: hasPhoto ? "left" : "center",
                maxWidth: hasPhoto ? "700px" : "900px",
              }}
            >
              {/* Couple Names */}
              <h1
                style={{
                  fontSize: names.length > 25 ? "52px" : "66px",
                  fontWeight: 800,
                  lineHeight: 1.1,
                  margin: "0 0 12px 0",
                  color: "#ffffff",
                  textShadow: "0 2px 14px rgba(0, 0, 0, 0.8), 0 0 30px rgba(245, 158, 11, 0.3)",
                }}
              >
                {names}
              </h1>

              {/* Subtitle */}
              <p
                style={{
                  fontSize: "20px",
                  color: "rgba(254, 240, 138, 0.9)",
                  letterSpacing: "1.5px",
                  margin: "0 0 20px 0",
                  fontStyle: "italic",
                }}
              >
                Cordially invite you to celebrate their union
              </p>

              {/* Badges / Details Row */}
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  justifyContent: hasPhoto ? "flex-start" : "center",
                  gap: "12px",
                  marginTop: "8px",
                }}
              >
                {date && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      background: "rgba(255, 255, 255, 0.08)",
                      border: "1px solid rgba(255, 255, 255, 0.15)",
                      padding: "8px 18px",
                      borderRadius: "10px",
                      color: "#FFFFFF",
                      fontSize: "16px",
                    }}
                  >
                    <span>📅</span>
                    <span style={{ fontWeight: 600 }}>{date}</span>
                  </div>
                )}

                {venue && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      background: "rgba(255, 255, 255, 0.08)",
                      border: "1px solid rgba(255, 255, 255, 0.15)",
                      padding: "8px 18px",
                      borderRadius: "10px",
                      color: "#FFFFFF",
                      fontSize: "16px",
                    }}
                  >
                    <span>📍</span>
                    <span style={{ fontWeight: 600 }}>{venue}</span>
                  </div>
                )}

                {hashtag && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      background: "rgba(225, 29, 72, 0.2)",
                      border: "1px solid rgba(225, 29, 72, 0.5)",
                      padding: "8px 18px",
                      borderRadius: "10px",
                      color: "#fda4af",
                      fontSize: "16px",
                      fontWeight: 700,
                    }}
                  >
                    <span>{hashtag.startsWith("#") ? hashtag : `#${hashtag}`}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bottom Footer Note */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "13px",
              letterSpacing: "2px",
              color: "rgba(255, 255, 255, 0.5)",
              textTransform: "uppercase",
              marginTop: "auto",
            }}
          >
            <span>SHADIWALACARD.COM</span>
            <span>•</span>
            <span>ULTRA-LUXURY DIGITAL INVITATION</span>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );

    // Convert PNG buffer to high-quality compressed progressive JPEG (< 200KB for WhatsApp)
    const pngBuffer = Buffer.from(await imageResponse.arrayBuffer());
    const jpegBuffer = await sharp(pngBuffer)
      .jpeg({ quality: 85, progressive: true })
      .toBuffer();

    return new Response(new Uint8Array(jpegBuffer), {
      status: 200,
      headers: {
        "Content-Type": "image/jpeg",
        "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
      },
    });
  } catch (e: any) {
    console.error("OG Image generation failed:", e);
    try {
      const fallbackPath = path.join(process.cwd(), "public", "og-image.jpg");
      if (fs.existsSync(fallbackPath)) {
        const buffer = fs.readFileSync(fallbackPath);
        return new Response(new Uint8Array(buffer), {
          status: 200,
          headers: {
            "Content-Type": "image/jpeg",
            "Cache-Control": "public, max-age=3600",
          },
        });
      }
    } catch {}
    return new Response("Failed to generate image", { status: 500 });
  }
}
