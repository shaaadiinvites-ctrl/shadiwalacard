"use client";

import { useState } from "react";

interface SuccessLinkActionsProps {
  formUrl: string;
  phone?: string;
}

export default function SuccessLinkActions({ formUrl, phone }: SuccessLinkActionsProps) {
  const [copied, setCopied] = useState(false);

  // Full URL for sharing/copying
  const getFullUrl = () => {
    if (typeof window !== "undefined") {
      return `${window.location.origin}${formUrl}`;
    }
    return `https://shadiwalacard.com${formUrl}`;
  };

  const handleCopy = async () => {
    try {
      const fullUrl = getFullUrl();
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      console.error("Clipboard copy failed", e);
    }
  };

  const handleWhatsAppShare = () => {
    const fullUrl = getFullUrl();
    const shareText = encodeURIComponent(
      `Here is my ShadiwalaCard wedding invitation workspace link:\n${fullUrl}\n\n(Click to customize our wedding card anytime)`
    );
    window.open(`https://api.whatsapp.com/send?text=${shareText}`, "_blank", "noopener,noreferrer");
  };

  return (
    <div
      style={{
        marginTop: 14,
        padding: "12px 14px",
        borderRadius: 14,
        background: "rgba(255, 255, 255, 0.03)",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}
    >
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        {/* Copy Link Button */}
        <button
          type="button"
          onClick={handleCopy}
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            height: 38,
            borderRadius: 10,
            background: copied ? "rgba(16, 185, 129, 0.15)" : "rgba(255, 255, 255, 0.06)",
            border: copied ? "1px solid rgba(16, 185, 129, 0.4)" : "1px solid rgba(255, 255, 255, 0.12)",
            color: copied ? "#34d399" : "#FFFFFF",
            fontSize: "0.75rem",
            fontWeight: 600,
            cursor: "pointer",
            transition: "all 0.2s ease",
            fontFamily: "var(--font-display), 'Montserrat', sans-serif",
          }}
        >
          {copied ? (
            <>
              <svg style={{ width: 14, height: 14 }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <span>Copied!</span>
            </>
          ) : (
            <>
              <svg style={{ width: 14, height: 14, color: "rgba(255,255,255,0.7)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
              <span>Copy Link</span>
            </>
          )}
        </button>

        {/* Share on WhatsApp Button */}
        <button
          type="button"
          onClick={handleWhatsAppShare}
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            height: 38,
            borderRadius: 10,
            background: "rgba(16, 185, 129, 0.12)",
            border: "1px solid rgba(16, 185, 129, 0.3)",
            color: "#34d399",
            fontSize: "0.75rem",
            fontWeight: 600,
            cursor: "pointer",
            transition: "all 0.2s ease",
            fontFamily: "var(--font-display), 'Montserrat', sans-serif",
          }}
        >
          <svg style={{ width: 14, height: 14, fill: "currentColor" }} viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z" />
          </svg>
          <span>Share Link</span>
        </button>
      </div>

      <div style={{ fontSize: "0.688rem", color: "rgba(255, 255, 255, 0.5)", lineHeight: 1.4, textAlign: "center" }}>
        Using WhatsApp on another phone? Copy your link above or share it to your other number.
      </div>
    </div>
  );
}
