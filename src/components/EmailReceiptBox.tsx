"use client";

import { useState } from "react";

interface EmailReceiptBoxProps {
  paymentOrderId: string;
  templateId?: string;
  phone?: string;
  initialEmail?: string;
  sig?: string;
}

export default function EmailReceiptBox({
  paymentOrderId,
  templateId = "grand-palace",
  phone = "",
  initialEmail = "",
  sig = "",
}: EmailReceiptBoxProps) {
  const [email, setEmail] = useState(initialEmail);
  const [loading, setLoading] = useState(false);
  const [sentTo, setSentTo] = useState<string | null>(initialEmail || null);
  const [error, setError] = useState<string | null>(null);
  const [showInputForm, setShowInputForm] = useState(!initialEmail);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/send-receipt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentOrderId,
          templateId,
          email: email.trim(),
          phone,
          sig,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Could not send receipt. Please try again.");
      }

      setSentTo(email.trim());
      setShowInputForm(false);
    } catch (err: any) {
      setError(err.message || "Failed to send receipt. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 460,
        margin: "14px auto 0",
        background: "linear-gradient(135deg, rgba(20, 20, 24, 0.95) 0%, rgba(10, 10, 14, 0.95) 100%)",
        backdropFilter: "blur(24px) saturate(180%)",
        WebkitBackdropFilter: "blur(24px) saturate(180%)",
        borderRadius: 20,
        border: "1px solid rgba(255, 255, 255, 0.08)",
        padding: "18px 20px",
        boxShadow: "0 12px 32px rgba(0,0,0,0.6)",
        textAlign: "left",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: "rgba(255, 188, 75, 0.12)",
            border: "1px solid rgba(255, 188, 75, 0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#ffbc4b",
            flexShrink: 0,
            marginTop: 2,
          }}
        >
          <svg style={{ width: 18, height: 18 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
          </svg>
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <h4
            style={{
              fontFamily: "var(--font-display), 'Montserrat', sans-serif",
              fontSize: "0.938rem",
              fontWeight: 700,
              color: "#FFFFFF",
              margin: "0 0 4px",
            }}
          >
            Want a Tax Invoice on Email?
          </h4>
          <p style={{ fontSize: "0.813rem", color: "rgba(255, 255, 255, 0.65)", lineHeight: 1.5, margin: "0 0 14px" }}>
            Receive your official GST payment receipt and direct invitation link in your email inbox.
          </p>

          {sentTo && !showInputForm ? (
            <div
              style={{
                background: "rgba(16, 185, 129, 0.1)",
                border: "1px solid rgba(16, 185, 129, 0.3)",
                borderRadius: 12,
                padding: "10px 14px",
                display: "flex",
                flexDirection: "column",
                gap: 6,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#34d399", fontSize: "0.813rem", fontWeight: 600 }}>
                <svg style={{ width: 16, height: 16, flexShrink: 0 }} viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Tax invoice &amp; receipt sent to:</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
                <span style={{ fontSize: "0.813rem", color: "#FFFFFF", fontWeight: 500, wordBreak: "break-all" }}>
                  {sentTo}
                </span>
                <button
                  type="button"
                  onClick={() => setShowInputForm(true)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "rgba(255, 255, 255, 0.5)",
                    fontSize: "0.75rem",
                    cursor: "pointer",
                    textDecoration: "underline",
                    padding: 0,
                  }}
                >
                  Send to another email
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ display: "flex", gap: 8 }}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="Enter your email (e.g. rahul@gmail.com)"
                  style={{
                    flex: 1,
                    minWidth: 0,
                    height: 42,
                    background: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid rgba(255, 255, 255, 0.12)",
                    borderRadius: 10,
                    padding: "0 12px",
                    color: "#FFFFFF",
                    fontSize: "0.813rem",
                    fontFamily: "var(--font-body), sans-serif",
                    outline: "none",
                    transition: "all 0.2s ease",
                  }}
                />
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    height: 42,
                    padding: "0 16px",
                    background: "#FFFFFF",
                    color: "#050505",
                    border: "none",
                    borderRadius: 10,
                    fontWeight: 700,
                    fontSize: "0.813rem",
                    fontFamily: "var(--font-display), sans-serif",
                    cursor: loading ? "not-allowed" : "pointer",
                    opacity: loading ? 0.7 : 1,
                    whiteSpace: "nowrap",
                    flexShrink: 0,
                    transition: "all 0.2s ease",
                  }}
                >
                  {loading ? "Sending..." : "Send Receipt"}
                </button>
              </div>

              {error && (
                <div style={{ color: "#ff4d6d", fontSize: "0.75rem", fontWeight: 600 }}>
                  {error}
                </div>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
