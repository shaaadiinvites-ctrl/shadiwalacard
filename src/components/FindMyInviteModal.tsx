"use client";

import { useState, useEffect, useRef } from "react";
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from "firebase/auth";
import { auth } from "@/lib/firebase";

interface WeddingItem {
  id: string;
  slug: string;
  coupleNames: string;
  editUrl: string;
  previewUrl: string;
  createdAt: string;
  templateId?: string;
}

interface LookupResult {
  found: boolean;
  type?: "wedding" | "order";
  weddings?: WeddingItem[];
  primaryEditUrl?: string;
  primaryCoupleNames?: string;
  formUrl?: string;
  message?: string;
}

interface FindMyInviteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FindMyInviteModal({ isOpen, onClose }: FindMyInviteModalProps) {
  const [step, setStep] = useState<"phone" | "otp" | "result">("phone");
  const [countryCode, setCountryCode] = useState("+91");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);

  const [otpArray, setOtpArray] = useState(["", "", "", "", "", ""]);
  const [otpError, setOtpError] = useState("");
  const [resendTimer, setResendTimer] = useState(30);
  const [lookupResult, setLookupResult] = useState<LookupResult | null>(null);

  const phoneInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setStep("phone");
      setError("");
      setOtpError("");
      setLookupResult(null);
      setOtpArray(["", "", "", "", "", ""]);
      setTimeout(() => phoneInputRef.current?.focus(), 200);
    } else {
      cleanupRecaptcha();
    }
  }, [isOpen]);

  useEffect(() => {
    let interval: any;
    if (step === "otp" && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, resendTimer]);

  const cleanupRecaptcha = () => {
    if (typeof window !== "undefined") {
      if ((window as any).findRecaptchaVerifier) {
        try {
          (window as any).findRecaptchaVerifier.clear();
        } catch (e) {}
        (window as any).findRecaptchaVerifier = null;
      }
      try {
        (window as any).grecaptcha?.reset();
      } catch (e) {}

      const container = document.getElementById("find-recaptcha-wrapper");
      if (container) {
        container.innerHTML = '<div id="find-recaptcha-container"></div>';
      }
    }
  };

  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanDigits = phone.replace(/\D/g, "");
    if (cleanDigits.length < 10) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    setLoading(true);
    setError("");
    setResendTimer(30);
    cleanupRecaptcha();

    try {
      const fullPhone = `${countryCode}${cleanDigits}`;
      const verifier = new RecaptchaVerifier(auth, "find-recaptcha-container", {
        size: "invisible",
      });
      (window as any).findRecaptchaVerifier = verifier;

      const result = await signInWithPhoneNumber(auth, fullPhone, verifier);
      setConfirmationResult(result);
      setStep("otp");
    } catch (err: any) {
      console.error("Error sending OTP", err);
      cleanupRecaptcha();
      let msg = err.message || "Could not send verification code. Please try again.";
      if (err.code === "auth/too-many-requests") {
        msg = "Too many attempts. Please wait a few moments before trying again.";
      } else if (err.code === "auth/invalid-phone-number") {
        msg = "Please enter a valid mobile number.";
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (element: HTMLInputElement, index: number) => {
    const val = element.value.replace(/\D/g, "");
    const newOtp = [...otpArray];
    newOtp[index] = val ? val.slice(-1) : "";
    setOtpArray(newOtp);
    setOtpError("");

    if (element.nextElementSibling && val !== "") {
      (element.nextElementSibling as HTMLInputElement).focus();
    }

    const combined = newOtp.join("");
    if (combined.length === 6 && !newOtp.includes("")) {
      handleVerifyAndLookup(combined);
    }
  };

  const handleOtpKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace") {
      if (!otpArray[index] && (e.target as HTMLElement).previousElementSibling) {
        ((e.target as HTMLElement).previousElementSibling as HTMLInputElement).focus();
      }
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").trim().replace(/\D/g, "");
    if (!pasted) return;

    const digits = pasted.slice(0, 6).split("");
    const newOtp = [...otpArray];
    digits.forEach((d, i) => {
      newOtp[i] = d;
    });
    setOtpArray(newOtp);
    setOtpError("");

    if (digits.length === 6) {
      handleVerifyAndLookup(digits.join(""));
    }
  };

  const handleVerifyAndLookup = async (otpCode: string) => {
    if (!otpCode || otpCode.length !== 6) {
      setOtpError("Please enter the 6-digit code.");
      return;
    }

    if (!confirmationResult) {
      setOtpError("Verification session expired. Please request a new code.");
      return;
    }

    setLoading(true);
    setOtpError("");

    try {
      const userCredential = await confirmationResult.confirm(otpCode);
      const idToken = await userCredential.user.getIdToken();
      const fullPhone = `${countryCode}${phone.replace(/\D/g, "")}`;

      // Call lookup API
      const res = await fetch("/api/find-invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken, phone: fullPhone }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Could not retrieve invitation details.");
      }

      setLookupResult(data);
      setStep("result");
    } catch (err: any) {
      console.error("Verification/Lookup Error", err);
      setOtpError(err.message || "Invalid verification code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0, 0, 0, 0.85)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        padding: "16px",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="find-recaptcha-wrapper"
        style={{
          position: "absolute",
          width: 1,
          height: 1,
          overflow: "hidden",
          opacity: 0,
          pointerEvents: "none",
        }}
      >
        <div id="find-recaptcha-container" />
      </div>

      <div
        style={{
          width: "100%",
          maxWidth: 460,
          background: "linear-gradient(135deg, rgba(22, 20, 24, 0.98) 0%, rgba(10, 10, 14, 0.98) 100%)",
          border: "1px solid rgba(255, 255, 255, 0.12)",
          borderRadius: 24,
          padding: "28px 24px",
          boxShadow: "0 24px 60px rgba(0, 0, 0, 0.9), 0 0 40px rgba(225, 29, 72, 0.1)",
          color: "#FFFFFF",
          fontFamily: "var(--font-body), 'Inter', sans-serif",
          position: "relative",
        }}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          style={{
            position: "absolute",
            top: 18,
            right: 18,
            background: "rgba(255, 255, 255, 0.06)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "50%",
            width: 32,
            height: 32,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "rgba(255, 255, 255, 0.6)",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
        >
          ✕
        </button>

        {/* ── STEP 1: Enter Phone ── */}
        {step === "phone" && (
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 10px", borderRadius: 999, background: "rgba(255, 188, 75, 0.12)", border: "1px solid rgba(255, 188, 75, 0.3)", color: "#ffbc4b", fontSize: "0.688rem", fontWeight: 700, letterSpacing: "0.6px", textTransform: "uppercase", marginBottom: 12 }}>
              <span>✦</span>
              <span>SELF-SERVE RECOVERY</span>
            </div>

            <h3 style={{ fontFamily: "var(--font-display), 'Montserrat', sans-serif", fontSize: "1.35rem", fontWeight: 700, margin: "0 0 6px", color: "#FFFFFF" }}>
              Find My Invitation
            </h3>
            <p style={{ fontSize: "0.813rem", color: "rgba(255, 255, 255, 0.65)", margin: "0 0 20px", lineHeight: 1.5 }}>
              Enter the mobile number you used during checkout. We&apos;ll send an SMS verification code to retrieve your invitation.
            </p>

            {error && (
              <div style={{ marginBottom: 14, padding: "10px 12px", borderRadius: 10, background: "rgba(225, 29, 72, 0.15)", border: "1px solid rgba(225, 29, 72, 0.4)", color: "#fb7185", fontSize: "0.75rem", fontWeight: 600 }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSendOtp}>
              <div style={{ display: "flex", gap: 8, height: 46, marginBottom: 16 }}>
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  style={{
                    width: 76,
                    background: "#141419",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    borderRadius: 12,
                    color: "#FFFFFF",
                    fontSize: "0.813rem",
                    textAlign: "center",
                    outline: "none",
                  }}
                >
                  <option value="+91">+91 (IN)</option>
                  <option value="+1">+1 (US)</option>
                  <option value="+44">+44 (UK)</option>
                  <option value="+61">+61 (AU)</option>
                  <option value="+971">+971 (AE)</option>
                </select>
                <input
                  ref={phoneInputRef}
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                  placeholder="10-digit mobile number"
                  maxLength={15}
                  style={{
                    flex: 1,
                    minWidth: 0,
                    background: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    borderRadius: 12,
                    padding: "0 14px",
                    color: "#FFFFFF",
                    fontSize: "0.875rem",
                    outline: "none",
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={loading || phone.replace(/\D/g, "").length < 10}
                style={{
                  width: "100%",
                  height: 48,
                  borderRadius: 12,
                  background: loading || phone.replace(/\D/g, "").length < 10 ? "rgba(255, 255, 255, 0.1)" : "#FFFFFF",
                  color: loading || phone.replace(/\D/g, "").length < 10 ? "rgba(255, 255, 255, 0.4)" : "#050505",
                  fontWeight: 700,
                  fontSize: "0.875rem",
                  fontFamily: "var(--font-display), 'Montserrat', sans-serif",
                  border: "none",
                  cursor: loading || phone.replace(/\D/g, "").length < 10 ? "not-allowed" : "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                {loading ? "Sending Verification Code..." : "Send Verification Code"}
              </button>
            </form>
          </div>
        )}

        {/* ── STEP 2: Enter OTP ── */}
        {step === "otp" && (
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 10px", borderRadius: 999, background: "rgba(16, 185, 129, 0.12)", border: "1px solid rgba(16, 185, 129, 0.3)", color: "#34d399", fontSize: "0.688rem", fontWeight: 700, letterSpacing: "0.6px", textTransform: "uppercase", marginBottom: 12 }}>
              <span>✓</span>
              <span>CODE SENT TO {countryCode} {phone}</span>
            </div>

            <h3 style={{ fontFamily: "var(--font-display), 'Montserrat', sans-serif", fontSize: "1.35rem", fontWeight: 700, margin: "0 0 6px", color: "#FFFFFF" }}>
              Enter 6-Digit Code
            </h3>
            <p style={{ fontSize: "0.813rem", color: "rgba(255, 255, 255, 0.65)", margin: "0 0 20px", lineHeight: 1.5 }}>
              Enter the verification code sent to your mobile via SMS.
            </p>

            {otpError && (
              <div style={{ marginBottom: 14, padding: "10px 12px", borderRadius: 10, background: "rgba(225, 29, 72, 0.15)", border: "1px solid rgba(225, 29, 72, 0.4)", color: "#fb7185", fontSize: "0.75rem", fontWeight: 600 }}>
                {otpError}
              </div>
            )}

            <div style={{ display: "flex", justifyContent: "space-between", gap: 8, marginBottom: 20 }}>
              {otpArray.map((digit, idx) => (
                <input
                  key={idx}
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(e.target, idx)}
                  onKeyDown={(e) => handleOtpKeyDown(e, idx)}
                  onPaste={handleOtpPaste}
                  style={{
                    width: 44,
                    height: 50,
                    textAlign: "center",
                    fontSize: "1.3rem",
                    fontWeight: 700,
                    background: "rgba(255, 255, 255, 0.06)",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    borderRadius: 12,
                    color: "#FFFFFF",
                    outline: "none",
                  }}
                />
              ))}
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.75rem", color: "rgba(255, 255, 255, 0.6)" }}>
              <button
                type="button"
                onClick={() => setStep("phone")}
                style={{ background: "none", border: "none", color: "rgba(255, 255, 255, 0.6)", cursor: "pointer", textDecoration: "underline", padding: 0 }}
              >
                Wrong number?
              </button>

              {resendTimer > 0 ? (
                <span>Resend in {resendTimer}s</span>
              ) : (
                <button
                  type="button"
                  onClick={() => handleSendOtp()}
                  style={{ background: "none", border: "none", color: "#ffbc4b", cursor: "pointer", fontWeight: 600, padding: 0 }}
                >
                  Resend Code
                </button>
              )}
            </div>

            {loading && (
              <div style={{ marginTop: 16, textAlign: "center", fontSize: "0.813rem", color: "rgba(255, 255, 255, 0.7)" }}>
                Verifying &amp; retrieving invitation...
              </div>
            )}
          </div>
        )}

        {/* ── STEP 3: Result ── */}
        {step === "result" && lookupResult && (
          <div>
            {lookupResult.found ? (
              <div>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 10px", borderRadius: 999, background: "rgba(16, 185, 129, 0.15)", border: "1px solid rgba(16, 185, 129, 0.35)", color: "#34d399", fontSize: "0.688rem", fontWeight: 700, letterSpacing: "0.6px", textTransform: "uppercase", marginBottom: 12 }}>
                  <span>✦</span>
                  <span>INVITATION FOUND!</span>
                </div>

                <h3 style={{ fontFamily: "var(--font-display), 'Montserrat', sans-serif", fontSize: "1.35rem", fontWeight: 700, margin: "0 0 6px", color: "#FFFFFF" }}>
                  {lookupResult.type === "wedding" ? lookupResult.primaryCoupleNames : "Your Invitation Workspace"}
                </h3>
                <p style={{ fontSize: "0.813rem", color: "rgba(255, 255, 255, 0.65)", margin: "0 0 20px", lineHeight: 1.5 }}>
                  {lookupResult.type === "wedding"
                    ? "Your digital wedding invitation workspace is active. Click below to customize or view your card."
                    : "Your order is confirmed! You can now complete your wedding details."}
                </p>

                {lookupResult.type === "wedding" && lookupResult.weddings && lookupResult.weddings.length > 0 ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
                    {lookupResult.weddings.map((w) => (
                      <div
                        key={w.id}
                        style={{
                          background: "rgba(255, 255, 255, 0.04)",
                          border: "1px solid rgba(255, 255, 255, 0.1)",
                          borderRadius: 14,
                          padding: "12px 14px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: 12,
                        }}
                      >
                        <div>
                          <div style={{ fontWeight: 700, fontSize: "0.875rem", color: "#FFFFFF" }}>{w.coupleNames}</div>
                          <div style={{ fontSize: "0.75rem", color: "rgba(255, 255, 255, 0.5)", fontFamily: "monospace" }}>{w.slug}</div>
                        </div>

                        <div style={{ display: "flex", gap: 8 }}>
                          <a
                            href={w.editUrl}
                            style={{
                              height: 36,
                              padding: "0 14px",
                              borderRadius: 8,
                              background: "#FFFFFF",
                              color: "#050505",
                              fontSize: "0.75rem",
                              fontWeight: 700,
                              textDecoration: "none",
                              display: "inline-flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            Edit
                          </a>
                          <a
                            href={w.previewUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              height: 36,
                              padding: "0 10px",
                              borderRadius: 8,
                              background: "rgba(255, 255, 255, 0.08)",
                              color: "rgba(255, 255, 255, 0.8)",
                              fontSize: "0.75rem",
                              fontWeight: 600,
                              textDecoration: "none",
                              display: "inline-flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            View
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ marginBottom: 20 }}>
                    <a
                      href={lookupResult.formUrl || lookupResult.primaryEditUrl || "/"}
                      style={{
                        width: "100%",
                        height: 48,
                        borderRadius: 12,
                        background: "#FFFFFF",
                        color: "#050505",
                        fontWeight: 700,
                        fontSize: "0.875rem",
                        fontFamily: "var(--font-display), 'Montserrat', sans-serif",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 8,
                        textDecoration: "none",
                      }}
                    >
                      <span>Start Customizing Now</span>
                      <span>→</span>
                    </a>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 10px", borderRadius: 999, background: "rgba(225, 29, 72, 0.15)", border: "1px solid rgba(225, 29, 72, 0.35)", color: "#fb7185", fontSize: "0.688rem", fontWeight: 700, letterSpacing: "0.6px", textTransform: "uppercase", marginBottom: 12 }}>
                  <span>✕</span>
                  <span>NO INVITATION FOUND</span>
                </div>

                <h3 style={{ fontFamily: "var(--font-display), 'Montserrat', sans-serif", fontSize: "1.35rem", fontWeight: 700, margin: "0 0 6px", color: "#FFFFFF" }}>
                  Order Not Found
                </h3>
                <p style={{ fontSize: "0.813rem", color: "rgba(255, 255, 255, 0.65)", margin: "0 0 20px", lineHeight: 1.5 }}>
                  {lookupResult.message || "We couldn't find an active digital wedding invitation registered under this phone number."}
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <button
                    type="button"
                    onClick={() => setStep("phone")}
                    style={{
                      width: "100%",
                      height: 44,
                      borderRadius: 12,
                      background: "rgba(255, 255, 255, 0.08)",
                      border: "1px solid rgba(255, 255, 255, 0.15)",
                      color: "#FFFFFF",
                      fontWeight: 600,
                      fontSize: "0.813rem",
                      cursor: "pointer",
                    }}
                  >
                    Try Another Phone Number
                  </button>

                  <a
                    href="mailto:hello@shadiwalacard.com"
                    style={{
                      width: "100%",
                      height: 44,
                      borderRadius: 12,
                      background: "#FFFFFF",
                      color: "#050505",
                      fontWeight: 700,
                      fontSize: "0.813rem",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      textDecoration: "none",
                    }}
                  >
                    Contact Support (hello@shadiwalacard.com)
                  </a>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
