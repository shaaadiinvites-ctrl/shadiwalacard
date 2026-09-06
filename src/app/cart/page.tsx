"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getTemplate, TemplateMeta } from "@/lib/templates";
import { usePostHog } from 'posthog-js/react';
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { motion, AnimatePresence } from "framer-motion";
import FindMyInviteModal from "@/components/FindMyInviteModal";

function CartPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const templateId = searchParams.get("template");
  const posthog = usePostHog();

  const detailsSectionRef = useRef<HTMLDivElement>(null);
  const phoneInputRef = useRef<HTMLInputElement>(null);
  const [highlightDetails, setHighlightDetails] = useState(false);

  const [template, setTemplate] = useState<TemplateMeta | null>(null);
  const [couponCode, setCouponCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [isFindModalOpen, setIsFindModalOpen] = useState(false);
  const [loadingRazorpay, setLoadingRazorpay] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [countryCode, setCountryCode] = useState("+91");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [isOrderSummaryOpen, setIsOrderSummaryOpen] = useState(false);

  // Firebase OTP State
  const [isVerified, setIsVerified] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  const [verifying, setVerifying] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [otpArray, setOtpArray] = useState(["", "", "", "", "", ""]);
  const [resendTimer, setResendTimer] = useState(30);

  useEffect(() => {
    let interval: any = null;
    if (showOtpModal && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [showOtpModal, resendTimer]);

  useEffect(() => {
    if (showOtpModal) {
      const timer = setTimeout(() => {
        const firstBox = document.querySelector<HTMLInputElement>(".otp-digit-box");
        firstBox?.focus();
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [showOtpModal]);

  const validatePhone = (code: string, number: string) => {
    const digitsOnly = number.replace(/\D/g, '');
    switch(code) {
      case "+91": return digitsOnly.length === 10;
      case "+1": return digitsOnly.length === 10;
      case "+44": return digitsOnly.length === 10 || digitsOnly.length === 11;
      case "+61": return digitsOnly.length === 9;
      case "+971": return digitsOnly.length === 9;
      default: return digitsOnly.length >= 7 && digitsOnly.length <= 15;
    }
  };

  useEffect(() => {
    if (templateId) {
      setTemplate(getTemplate(templateId));
    } else {
      setTemplate(getTemplate("grand-palace"));
    }
  }, [templateId]);

  useEffect(() => {
    if (template && posthog) {
      posthog.capture('cart_viewed', { template_id: template.id });
    }
  }, [template, posthog]);

  // Auto-save Customer Details when phone is valid
  useEffect(() => {
    if (!phone) return;

    if (validatePhone(countryCode, phone)) {
      const fullPhone = `${countryCode}${phone.replace(/\D/g, '')}`;
      const timer = setTimeout(async () => {
        try {
          await fetch("/api/customer-pii", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: "", phone: fullPhone }),
          });
        } catch (e) {
          console.error("Auto-save failed", e);
        }
      }, 1000); // 1-second debounce

      return () => clearTimeout(timer);
    }
  }, [phone, countryCode]);

  // Load Razorpay Script & cleanup reCAPTCHA on unmount
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      cleanupRecaptcha();
    };
  }, []);

  const handleApplyCoupon = () => {
    if (couponCode.toUpperCase() === "SHADI10") {
      setDiscountPercent(10);
      setError("");
    } else {
      setDiscountPercent(0);
      setError("Invalid coupon code.");
    }
  };

  const cleanupRecaptcha = () => {
    if (typeof window !== "undefined") {
      if ((window as any).recaptchaVerifier) {
        try {
          (window as any).recaptchaVerifier.clear();
        } catch (e) {}
        (window as any).recaptchaVerifier = null;
      }
      try {
        (window as any).grecaptcha?.reset();
      } catch (e) {}

      // Reset recaptcha container in DOM with a pristine node
      const wrapper = document.getElementById("recaptcha-wrapper");
      if (wrapper) {
        wrapper.innerHTML = '<div id="recaptcha-container"></div>';
      } else {
        const container = document.getElementById("recaptcha-container");
        if (container) {
          container.innerHTML = "";
          const freshDiv = document.createElement("div");
          freshDiv.id = "recaptcha-container";
          container.parentNode?.replaceChild(freshDiv, container);
        }
      }

      // Remove any lingering floating badge elements
      document.querySelectorAll(".grecaptcha-badge").forEach((el) => {
        try { el.remove(); } catch (e) {}
      });
    }
  };

  const handleCloseOtpModal = () => {
    setShowOtpModal(false);
    setOtpError("");
    cleanupRecaptcha();
  };

  const handleEditPhoneFromModal = () => {
    setShowOtpModal(false);
    setOtpError("");
    cleanupRecaptcha();
    setTimeout(() => {
      phoneInputRef.current?.focus();
    }, 150);
  };

  const sendOtp = async (): Promise<boolean> => {
    if (!validatePhone(countryCode, phone)) {
      setError(`Please enter a valid phone number for ${countryCode}.`);
      setHighlightDetails(true);
      setTimeout(() => setHighlightDetails(false), 2500);
      phoneInputRef.current?.focus();
      return false;
    }
    setError("");
    setVerifying(true);
    setOtpError("");
    setOtpArray(["", "", "", "", "", ""]);
    setResendTimer(30);
    try {
      const fullPhone = `${countryCode}${phone.replace(/\D/g, '')}`;
      
      // Clean up previous reCAPTCHA instance and reset container to avoid "already been rendered" error
      cleanupRecaptcha();

      // Re-initialize a fresh verifier attached to the fresh pristine DOM node
      const verifier = new RecaptchaVerifier(auth, "recaptcha-container", {
        size: "invisible",
      });
      (window as any).recaptchaVerifier = verifier;

      const result = await signInWithPhoneNumber(auth, fullPhone, verifier);
      setConfirmationResult(result);
      setShowOtpModal(true);
      return true;
    } catch (err: any) {
      console.error("Error sending OTP", err);
      cleanupRecaptcha();
      let userMsg = err.message || "Failed to send OTP. Please try again.";
      if (userMsg.includes("reCAPTCHA") || userMsg.includes("rendered in this element")) {
        userMsg = "Security verification timed out. Please click Proceed to Payment again.";
      } else if (err.code === "auth/invalid-phone-number") {
        userMsg = `Please enter a valid phone number for ${countryCode}.`;
      } else if (err.code === "auth/too-many-requests") {
        userMsg = "Too many OTP attempts. Please wait a few moments before trying again.";
      } else if (err.code === "auth/invalid-app-credential") {
        userMsg = "Security verification failed. On localhost, please test using a registered test phone number or test on the live production domain.";
      } else if (err.code === "auth/quota-exceeded") {
        userMsg = "Daily SMS quota exceeded. Please contact support.";
      }
      setError(userMsg);
      setHighlightDetails(true);
      setTimeout(() => setHighlightDetails(false), 2500);
      return false;
    } finally {
      setVerifying(false);
    }
  };

  const handleOtpChange = (element: HTMLInputElement, index: number) => {
    const val = element.value.replace(/\D/g, '');
    const newOtpArray = [...otpArray];
    newOtpArray[index] = val ? val.slice(-1) : "";
    setOtpArray(newOtpArray);
    setOtpError("");
    
    if (element.nextElementSibling && val !== "") {
      (element.nextElementSibling as HTMLInputElement).focus();
    }
    
    const combinedOtp = newOtpArray.join("");
    if (combinedOtp.length === 6 && !newOtpArray.includes("")) {
      verifyOtp(combinedOtp);
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
    const pastedData = e.clipboardData.getData("text").trim().replace(/\D/g, "");
    if (!pastedData) return;

    const digits = pastedData.slice(0, 6).split("");
    const newOtpArray = [...otpArray];
    digits.forEach((d, i) => {
      newOtpArray[i] = d;
    });
    setOtpArray(newOtpArray);
    setOtpError("");

    const nextFocusIndex = Math.min(digits.length, 5);
    const inputs = document.querySelectorAll<HTMLInputElement>(".otp-digit-box");
    if (inputs[nextFocusIndex]) {
      inputs[nextFocusIndex].focus();
    }

    if (digits.length === 6) {
      verifyOtp(digits.join(""));
    }
  };

  const verifyOtp = async (otpString: string) => {
    if (!otpString || otpString.length !== 6) {
      setOtpError("Please enter a valid 6-digit OTP.");
      return;
    }
    setVerifying(true);
    setOtpError("");
    try {
      if (!confirmationResult) {
        throw new Error("Verification session expired. Please request a new code.");
      }
      const result = await confirmationResult.confirm(otpString);
      const token = await result.user.getIdToken();
      
      // Update Supabase
      const fullPhone = `${countryCode}${phone.replace(/\D/g, '')}`;
      const res = await fetch("/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken: token, phone: fullPhone }),
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || "Failed to verify phone number");

      setIsVerified(true);
      setShowOtpModal(false);

      // Seamless One-Click Transition: Immediately open Razorpay payment modal!
      await initiateRazorpayPayment(fullPhone);
    } catch (err: any) {
      console.error("Error verifying OTP", err);
      setOtpError(err.message || "Invalid OTP. Please check the code and try again.");
    } finally {
      setVerifying(false);
    }
  };

  const initiateRazorpayPayment = async (overridePhone?: string) => {
    if (!template || loadingRazorpay) return;

    setLoadingRazorpay(true);
    setError("");

    posthog?.capture('checkout_started', { template_id: template.id });

    try {
      // 1. Create order on server
      const createRes = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ templateId: template.id, couponCode }),
      });

      const orderData = await createRes.json();

      if (!createRes.ok) {
        throw new Error(orderData.error || "Failed to create order");
      }

      const checkoutPhone = overridePhone || `${countryCode}${phone.replace(/\D/g, '')}`;

      // 2. Open Razorpay Checkout Modal
      const options = {
        key: orderData.keyId,
        amount: orderData.amountPaise,
        currency: "INR",
        name: "ShadiwalaCard",
        description: `Purchase: ${orderData.templateName}`,
        order_id: orderData.orderId,
        handler: async function (response: any) {
          setIsProcessingPayment(true);
          // 3. Verify Payment on Server
          const verifyRes = await fetch("/api/razorpay/verify-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              paymentOrderId: orderData.paymentOrderId,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              email: "",
              phone: checkoutPhone,
            }),
          });

          const verifyData = await verifyRes.json();
          if (verifyRes.ok && verifyData.verified) {
            const sigParam = verifyData.signature ? `&sig=${encodeURIComponent(verifyData.signature)}` : "";
            router.push(`/success?po=${verifyData.paymentOrderId}&template=${template.id}&p=${encodeURIComponent(checkoutPhone)}${sigParam}`);
          } else {
            setIsProcessingPayment(false);
            setError(verifyData.error || "Payment verification failed.");
          }
        },
        theme: {
          color: "#e11d48",
        },
        prefill: {
          contact: checkoutPhone
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on("payment.failed", function (response: any) {
        setIsProcessingPayment(false);
        setError(response.error.description || "Payment failed.");
      });
      rzp.open();
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong.");
    } finally {
      setLoadingRazorpay(false);
    }
  };

  const handleCheckout = async () => {
    if (!template || loadingRazorpay || verifying) return;

    const isPhoneEntered = Boolean(phone && validatePhone(countryCode, phone));

    // Validate phone
    if (!isPhoneEntered) {
      setError(`Please enter a valid mobile number for ${countryCode}.`);
      setHighlightDetails(true);
      setTimeout(() => setHighlightDetails(false), 2500);
      setTimeout(() => phoneInputRef.current?.focus(), 450);
      if (detailsSectionRef.current) {
        const yOffset = -75;
        const y = detailsSectionRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
      return;
    }

    // If phone is not verified yet, automatically send OTP and slide up verification bottom sheet
    if (!isVerified) {
      await sendOtp();
      return;
    }

    // If already verified, directly initiate Razorpay payment
    await initiateRazorpayPayment();
  };

  if (!template) return null;

  // Math flow: MRP -> minus Special Offer -> minus Coupon -> Subtotal -> plus GST -> Total
  const mrpVal = parseInt(template.mrp.replace(/\D/g, ''));
  
  // Calculate final total inclusive of GST (with coupon if any)
  const discountAmount = Math.round((template.priceInr * discountPercent) / 100);
  const total = template.priceInr - discountAmount;
  
  // Final base price and GST
  const basePrice = total / 1.18;
  const gstAmount = total - basePrice;

  // Calculate pre-coupon state
  const basePriceBeforeCoupon = template.priceInr / 1.18;
  const specialOfferDiscount = mrpVal - basePriceBeforeCoupon;
  const specialOfferPercent = ((specialOfferDiscount / mrpVal) * 100).toFixed(2);
  const couponDiscountExclGst = basePriceBeforeCoupon - basePrice;

  const isPhoneValid = Boolean(phone && validatePhone(countryCode, phone));
  const isReadyToProceed = isPhoneValid;
  const isButtonDisabled = loadingRazorpay || verifying;

  return (
    <div style={{ background: '#050505', color: '#FFFFFF', minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: "var(--font-body), 'Inter', sans-serif", overflowX: 'hidden', width: '100%' }}>
      {isProcessingPayment && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(5,5,5,0.92)', backdropFilter: 'blur(16px)' }}>
          <div style={{ width: 48, height: 48, border: '4px solid rgba(225, 29, 72, 0.2)', borderTopColor: '#e11d48', borderRadius: '50%', animation: 'cartSpin 0.8s linear infinite', marginBottom: 16 }} />
          <h2 style={{ fontFamily: "var(--font-display), 'Montserrat', sans-serif", fontSize: '1.25rem', fontWeight: 700, color: '#FFFFFF', marginBottom: 8 }}>Processing Payment...</h2>
          <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.6)' }}>Please do not close or refresh this window.</p>
        </div>
      )}

      <style>{`
        @keyframes cartSpin { to { transform: rotate(360deg); } }
        @keyframes cartShake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-6px); }
          40%, 80% { transform: translateX(6px); }
        }
        .cart-card {
          background: linear-gradient(135deg, rgba(20, 20, 20, 0.95) 0%, rgba(10, 10, 10, 0.95) 100%);
          backdrop-filter: blur(24px);
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 20px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
          padding: 24px;
          transition: border-color 0.2s ease;
        }
        @media (max-width: 640px) {
          .cart-card {
            padding: 18px 16px !important;
            border-radius: 16px;
          }
        }
        .cart-main {
          flex: 1;
          padding: 32px 20px 140px;
        }
        @media (max-width: 640px) {
          .cart-main {
            padding: 20px 14px 140px !important;
          }
        }
        .cart-input {
          width: 100%;
          min-width: 0;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 12px;
          color: #FFFFFF;
          font-family: var(--font-body), 'Inter', sans-serif;
          font-size: 0.938rem;
          outline: none;
          transition: all 0.25s ease;
          box-sizing: border-box;
        }
        .cart-input::placeholder { color: rgba(255, 255, 255, 0.35); }
        .cart-input:focus {
          border-color: #e11d48;
          background: rgba(255, 255, 255, 0.06);
          box-shadow: 0 0 0 3px rgba(225, 29, 72, 0.18);
        }
        .cart-input:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .cart-select {
          background: #141419;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 12px;
          color: #FFFFFF;
          font-family: var(--font-body), 'Inter', sans-serif;
          font-size: 0.875rem;
          outline: none;
          cursor: pointer;
          transition: all 0.25s ease;
          box-sizing: border-box;
        }
        .cart-select:focus {
          border-color: #e11d48;
          box-shadow: 0 0 0 3px rgba(225, 29, 72, 0.18);
        }
        .otp-digit-box {
          width: 46px;
          height: 54px;
          text-align: center;
          font-size: 1.4rem;
          font-weight: 700;
          border-radius: 12px;
        }
        @media (max-width: 420px) {
          .otp-digit-box {
            width: 40px !important;
            height: 48px !important;
            font-size: 1.2rem !important;
          }
        }
      `}</style>
      
      {/* HEADER matching Brand Navigation */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(5, 5, 5, 0.85)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '12px 16px'
      }}>
        <div style={{ maxWidth: 880, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
          {/* Back Button */}
          <Link 
            href="/" 
            style={{ 
              display: 'inline-flex', alignItems: 'center', gap: '6px', 
              color: 'rgba(255,255,255,0.75)', textDecoration: 'none', 
              fontSize: '0.813rem', fontWeight: 500,
              padding: '7px 12px', borderRadius: '999px',
              border: '1px solid rgba(255,255,255,0.12)',
              background: 'rgba(255,255,255,0.03)',
              transition: 'all 0.2s ease', flexShrink: 0
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
            <span>Back</span>
          </Link>

          {/* Logo */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
            <img 
              src="/uploads/logo.png" 
              alt="ShadiwalaCard Logo" 
              style={{ height: '26px', width: 'auto' }}
            />
            <span style={{ fontFamily: "var(--font-display), 'Montserrat', sans-serif", fontSize: '1.1rem', color: '#FFFFFF', fontWeight: 600, letterSpacing: '-0.2px' }}>
              Shadiwala<span style={{ color: '#e11d48' }}>Card</span>
            </span>
          </Link>

          {/* Safe empty balance container for centering */}
          <div style={{ width: '60px', flexShrink: 0 }} />
        </div>
      </header>

      <main className="cart-main">
        <div style={{ maxWidth: 580, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
          
          {/* Section 1: Template Summary */}
          <div className="cart-card" style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <div style={{ width: 84, height: 105, position: 'relative', borderRadius: 14, overflow: 'hidden', flexShrink: 0, boxShadow: '0 8px 20px rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <Image src="/project3-assets/cover.webp" alt={template.name} fill sizes="84px" style={{ objectFit: 'cover' }} priority />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 999, background: 'rgba(255, 188, 75, 0.12)', border: '1px solid rgba(255, 188, 75, 0.3)', color: '#ffbc4b', fontSize: '0.688rem', fontWeight: 700, letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: 8 }}>
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#ffbc4b', boxShadow: '0 0 6px #ffbc4b' }} />
                DIGITAL WEB INVITE
              </div>
              <h2 style={{ fontFamily: "var(--font-display), 'Montserrat', sans-serif", fontSize: '1.2rem', fontWeight: 700, color: '#FFFFFF', margin: '0 0 6px', letterSpacing: '-0.3px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {template.name}
              </h2>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' }}>
                <span style={{ fontSize: '1.35rem', fontWeight: 700, color: '#FFFFFF' }}>₹{template.priceInr}</span>
                <span style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.4)', textDecoration: 'line-through' }}>₹{template.mrp}</span>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#ffbc4b', background: 'rgba(255, 188, 75, 0.15)', padding: '2px 7px', borderRadius: 6 }}>
                  {Math.round(((mrpVal - template.priceInr) / mrpVal) * 100)}% OFF
                </span>
              </div>
            </div>
          </div>

          {/* Section 2: Order Summary & Coupon */}
          <div className="cart-card">
            <div 
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', marginBottom: 16 }}
              onClick={() => setIsOrderSummaryOpen(!isOrderSummaryOpen)}
            >
              <h3 style={{ fontFamily: "var(--font-display), 'Montserrat', sans-serif", fontSize: '1.1rem', fontWeight: 600, color: '#FFFFFF', margin: 0 }}>
                Order Summary
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,0.6)', fontSize: '0.813rem', flexShrink: 0 }}>
                <span>{isOrderSummaryOpen ? 'Hide breakdown' : 'View breakdown'}</span>
                <svg 
                  style={{ width: 15, height: 15, transition: 'transform 0.25s ease', transform: isOrderSummaryOpen ? 'rotate(180deg)' : 'none' }} 
                  fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Coupon Section */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 18, height: 46 }}>
              <input
                type="text"
                placeholder="Coupon (e.g. SHADI10)"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="cart-input"
                style={{ flex: 1, minWidth: 0, padding: '0 14px', textTransform: 'uppercase', letterSpacing: '0.5px' }}
              />
              <button
                onClick={handleApplyCoupon}
                type="button"
                style={{
                  height: '100%', padding: '0 18px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  background: 'rgba(225, 29, 72, 0.15)', color: '#FFFFFF',
                  border: '1px solid rgba(225, 29, 72, 0.4)', borderRadius: 12,
                  fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer',
                  transition: 'all 0.2s ease', whiteSpace: 'nowrap', flexShrink: 0
                }}
              >
                Apply
              </button>
            </div>

            <AnimatePresence initial={false}>
              {isOrderSummaryOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                  style={{ overflow: 'hidden' }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: '0.875rem', paddingBottom: 20, marginBottom: 20, borderBottom: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.75)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>Original Price</span>
                      <span style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'line-through' }}>₹{template.mrp}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#10b981', fontWeight: 600 }}>
                      <span>Special Launch Offer ({specialOfferPercent}% OFF)</span>
                      <span>-₹{specialOfferDiscount.toFixed(2)}</span>
                    </div>

                    {discountPercent > 0 && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: '#ffbc4b', fontWeight: 600 }}>
                        <span>Coupon Discount ({discountPercent}%)</span>
                        <span>-₹{couponDiscountExclGst.toFixed(2)}</span>
                      </div>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                      <span>Subtotal (excl. GST)</span>
                      <span style={{ color: '#FFFFFF' }}>₹{basePrice.toFixed(2)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>GST (18%)</span>
                      <span style={{ color: '#FFFFFF' }}>₹{gstAmount.toFixed(2)}</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: isOrderSummaryOpen ? 0 : 4 }}>
              <span style={{ fontSize: '0.938rem', color: 'rgba(255,255,255,0.85)', fontWeight: 500 }}>Total (incl. GST)</span>
              <span style={{ fontFamily: "var(--font-display), 'Montserrat', sans-serif", fontSize: '1.625rem', fontWeight: 700, color: '#FFFFFF' }}>
                ₹{total}
              </span>
            </div>
          </div>

          {/* Section 3: Customer Details & Checkout */}
          <div 
            ref={detailsSectionRef}
            className="cart-card"
            style={{
              transition: 'all 0.3s ease',
              ...(highlightDetails ? {
                borderColor: 'rgba(225, 29, 72, 0.85)',
                boxShadow: '0 0 0 2px rgba(225, 29, 72, 0.5), 0 12px 36px rgba(225, 29, 72, 0.25)'
              } : {})
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
              <h3 style={{ fontFamily: "var(--font-display), 'Montserrat', sans-serif", fontSize: '1.1rem', fontWeight: 600, color: '#FFFFFF', margin: 0 }}>
                Your WhatsApp Number
              </h3>
              {!isVerified ? (
                <span style={{ fontSize: '0.688rem', color: '#ff4d6d', fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                  Required
                </span>
              ) : (
                <span style={{ fontSize: '0.688rem', color: '#10b981', fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <svg style={{ width: 12, height: 12 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                  Verified
                </span>
              )}
            </div>
            <p style={{ fontSize: '0.813rem', color: 'rgba(255,255,255,0.55)', margin: '0 0 16px', lineHeight: 1.5 }}>
              Your private invite dashboard link and order updates will be sent directly to this WhatsApp number.
            </p>

            {error && (
              <div 
                style={{ 
                  marginBottom: 16, 
                  background: 'rgba(225, 29, 72, 0.14)', 
                  border: '1px solid rgba(225, 29, 72, 0.45)', 
                  color: '#ff4d6d', 
                  padding: '12px 14px', 
                  borderRadius: 12, 
                  fontSize: '0.813rem', 
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  animation: highlightDetails ? 'cartShake 0.4s ease' : 'none'
                }}
              >
                <svg style={{ width: 18, height: 18, flexShrink: 0, color: '#e11d48' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            <div>
              <label style={{ display: 'block', fontSize: '0.813rem', fontWeight: 600, color: 'rgba(255,255,255,0.85)', marginBottom: 6 }}>
                WhatsApp Number (for instant delivery) <span style={{ color: '#e11d48' }}>*</span>
              </label>
                <div style={{ display: 'flex', gap: 8, height: 46 }}>
                  <select
                    value={countryCode}
                    onChange={(e) => {
                      setCountryCode(e.target.value);
                      setIsVerified(false);
                      if (error) setError("");
                      cleanupRecaptcha();
                    }}
                    disabled={isVerified}
                    className="cart-select"
                    style={{ width: 72, minWidth: 72, padding: '0 6px', textAlign: 'center', flexShrink: 0 }}
                  >
                    <option value="+91">+91 (IN)</option>
                    <option value="+1">+1 (US)</option>
                    <option value="+44">+44 (UK)</option>
                    <option value="+61">+61 (AU)</option>
                    <option value="+971">+971 (AE)</option>
                  </select>
                  <div style={{ position: 'relative', flex: 1, minWidth: 0 }}>
                    <input
                      ref={phoneInputRef}
                      type="tel"
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value.replace(/\D/g, ''));
                        setIsVerified(false);
                        if (error) setError("");
                        cleanupRecaptcha();
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleCheckout();
                        }
                      }}
                      disabled={isVerified}
                      placeholder="10-digit WhatsApp number"
                      maxLength={15}
                      className="cart-input"
                      style={{ 
                        width: '100%',
                        height: '100%',
                        padding: isVerified ? '0 90px 0 14px' : '0 14px',
                        ...(highlightDetails && (!phone || !validatePhone(countryCode, phone)) ? { borderColor: '#e11d48', background: 'rgba(225,29,72,0.06)' } : {})
                      }}
                    />
                    {isVerified && (
                      <div style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.4)', borderRadius: 999, padding: '3px 9px', color: '#10b981', fontSize: '0.72rem', fontWeight: 700, pointerEvents: 'none' }}>
                        <svg style={{ width: 12, height: 12 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Verified</span>
                      </div>
                    )}
                  </div>
                </div>

                {isVerified && (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
                    <div style={{ color: '#10b981', fontSize: '0.78rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <svg style={{ width: 14, height: 14 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Number verified for WhatsApp delivery</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setIsVerified(false);
                        cleanupRecaptcha();
                        setTimeout(() => phoneInputRef.current?.focus(), 50);
                      }}
                      style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', cursor: 'pointer', textDecoration: 'underline', padding: '2px 4px' }}
                    >
                      Change number
                    </button>
                  </div>
                )}
              </div>
            </div>

          {/* Section 4: 100% Satisfaction & Money-Back Guarantee */}
          <div className="cart-card" style={{ background: 'linear-gradient(135deg, rgba(30, 20, 10, 0.6) 0%, rgba(15, 10, 5, 0.8) 100%)', border: '1px solid rgba(255, 188, 75, 0.25)', display: 'flex', alignItems: 'flex-start', gap: 14 }}>
            <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'rgba(255, 188, 75, 0.15)', border: '1px solid rgba(255, 188, 75, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffbc4b', flexShrink: 0 }}>
              <svg style={{ width: 18, height: 18 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="M9 12l2 2 4-4" />
              </svg>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                <h4 style={{ fontFamily: "var(--font-display), 'Montserrat', sans-serif", fontSize: '0.938rem', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
                  100% Money-Back Guarantee
                </h4>
                <span style={{ fontSize: '0.625rem', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.8px', padding: '2px 6px', borderRadius: 4, background: 'rgba(255, 188, 75, 0.2)', color: '#ffbc4b' }}>
                  Risk Free
                </span>
              </div>
              <p style={{ fontSize: '0.813rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.5, margin: 0 }}>
                Zero doubts, zero risk. If you are not completely happy with your digital wedding invitation, contact us for a full refund &mdash; zero questions asked.
              </p>
            </div>
          </div>
          
        </div>
      </main>

      {/* Sticky Bottom Bar */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        background: 'rgba(10, 10, 12, 0.95)', backdropFilter: 'blur(24px)',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '12px 16px calc(12px + env(safe-area-inset-bottom, 0px))',
        zIndex: 50, boxShadow: '0 -10px 30px rgba(0, 0, 0, 0.8)'
      }}>
        <div style={{ maxWidth: 580, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
            <div style={{ display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
              <span style={{ fontSize: '0.688rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total to pay</span>
              <span style={{ fontFamily: "var(--font-display), 'Montserrat', sans-serif", fontSize: '1.4rem', fontWeight: 700, color: '#FFFFFF', lineHeight: 1.1 }}>₹{total}</span>
            </div>
            
            <button
              onClick={handleCheckout}
              disabled={loadingRazorpay || verifying}
              type="button"
              style={{
                flex: 1, minWidth: 0, maxWidth: 280, height: 48, borderRadius: 12,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: 8,
                background: !isReadyToProceed ? 'rgba(255,255,255,0.1)' : '#FFFFFF',
                color: !isReadyToProceed ? 'rgba(255,255,255,0.35)' : '#050505',
                fontFamily: "var(--font-display), 'Montserrat', sans-serif",
                fontSize: '0.938rem', fontWeight: 700, border: 'none',
                cursor: (loadingRazorpay || verifying) ? 'not-allowed' : 'pointer',
                boxShadow: !isReadyToProceed ? 'none' : '0 4px 20px rgba(255,255,255,0.25)',
                transition: 'all 0.25s ease', whiteSpace: 'nowrap'
              }}
            >
              {loadingRazorpay ? (
                <>
                  <div style={{ width: 15, height: 15, border: '2px solid rgba(0,0,0,0.2)', borderTopColor: '#000000', borderRadius: '50%', animation: 'cartSpin 0.8s linear infinite' }} />
                  <span>Connecting...</span>
                </>
              ) : verifying ? (
                <>
                  <div style={{ width: 15, height: 15, border: '2px solid rgba(0,0,0,0.2)', borderTopColor: '#000000', borderRadius: '50%', animation: 'cartSpin 0.8s linear infinite' }} />
                  <span>Sending Code...</span>
                </>
              ) : (
                <>
                  <span>Proceed to Payment</span>
                  <svg style={{ width: 16, height: 16 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </>
              )}
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: '0.688rem', color: 'rgba(255,255,255,0.5)', textAlign: 'center', flexWrap: 'wrap' }}>
            <svg style={{ width: 13, height: 13, color: '#ffbc4b', flexShrink: 0 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <path d="M9 12l2 2 4-4" />
            </svg>
            <span>100% Money-Back Guarantee &bull; Instant link access after payment</span>
          </div>
        </div>
      </div>
      
      {/* FOOTER */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.08)', padding: '32px 20px 100px', width: '100%', textAlign: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, maxWidth: 800, margin: '0 auto' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
            <img 
              src="/uploads/logo.png" 
              alt="ShadiwalaCard Logo" 
              style={{ height: '24px', width: 'auto' }}
            />
            <span style={{ fontFamily: "var(--font-display), 'Montserrat', sans-serif", fontSize: '1.05rem', fontWeight: 600, color: '#FFFFFF' }}>
              Shadiwala<span style={{ color: '#e11d48' }}>Card</span>
            </span>
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20, fontSize: '0.813rem', color: 'rgba(255,255,255,0.6)', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => setIsFindModalOpen(true)}
              style={{
                background: 'none',
                border: 'none',
                color: '#ffbc4b',
                fontWeight: 600,
                cursor: 'pointer',
                fontSize: '0.813rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                padding: 0,
              }}
            >
              <span>✦</span>
              <span>Find My Invite</span>
            </button>
            <Link href="/terms" style={{ color: 'inherit', textDecoration: 'none' }}>Terms of Service</Link>
            <Link href="/privacy-policy" style={{ color: 'inherit', textDecoration: 'none' }}>Privacy Policy</Link>
            <Link href="/refund-policy" style={{ color: 'inherit', textDecoration: 'none' }}>Refund Policy</Link>
            <Link href="/contact-us" style={{ color: 'inherit', textDecoration: 'none' }}>Support</Link>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            &copy; 2026 shadiwalacard.com &mdash; Made in India 
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600" width="16" height="11" style={{ display: 'inline-block', borderRadius: 2 }}>
              <rect width="900" height="200" fill="#FF9933"/>
              <rect y="200" width="900" height="200" fill="#FFFFFF"/>
              <rect y="400" width="900" height="200" fill="#138808"/>
              <circle cx="450" cy="300" r="80" stroke="#000080" strokeWidth="15" fill="none"/>
              <circle cx="450" cy="300" r="20" fill="#000080"/>
            </svg>
          </span>
        </div>
      </footer>

      {/* Firebase recaptcha container */}
      <div id="recaptcha-wrapper">
        <div id="recaptcha-container"></div>
      </div>

      {/* OTP Bottom Sheet / Modal */}
      <AnimatePresence>
        {showOtpModal && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseOtpModal}
              style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(10px)', zIndex: 9998 }}
            />

            {/* Bottom Sheet */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              style={{
                position: 'fixed', bottom: 0, left: 0, right: 0,
                background: '#0d0d12', borderTop: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '28px 28px 0 0', zIndex: 9999,
                boxShadow: '0 -12px 40px rgba(0,0,0,0.8)',
                paddingBottom: 'calc(24px + env(safe-area-inset-bottom, 0px))'
              }}
            >
              <div style={{ maxWidth: 460, margin: '0 auto', padding: '24px 20px 10px' }}>
                <div style={{ width: 44, height: 5, background: 'rgba(255,255,255,0.2)', borderRadius: 999, margin: '0 auto 24px' }} />
                
                <h3 style={{ fontFamily: "var(--font-display), 'Montserrat', sans-serif", fontSize: '1.25rem', fontWeight: 700, color: '#FFFFFF', textAlign: 'center', margin: '0 0 8px' }}>
                  Verify Your Phone Number
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.6)', textAlign: 'center', margin: '0 0 6px', lineHeight: 1.5 }}>
                  Enter the 6-digit code sent to <strong style={{ color: '#FFFFFF' }}>{countryCode} {phone}</strong>
                </p>
                <div style={{ textAlign: 'center', marginBottom: 24 }}>
                  <button
                    type="button"
                    onClick={handleEditPhoneFromModal}
                    style={{ background: 'none', border: 'none', color: '#ffbc4b', fontSize: '0.78rem', cursor: 'pointer', textDecoration: 'underline', padding: '4px 8px' }}
                  >
                    Wrong number? Change
                  </button>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', gap: 'clamp(6px, 1.8vw, 10px)', marginBottom: 20 }}>
                  {otpArray.map((digit, index) => (
                    <input
                      key={index}
                      type="text"
                      maxLength={1}
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      value={digit}
                      onChange={(e) => handleOtpChange(e.target, index)}
                      onKeyDown={(e) => handleOtpKeyDown(e, index)}
                      onPaste={handleOtpPaste}
                      className="cart-input otp-digit-box"
                      style={{
                        background: 'rgba(255,255,255,0.06)',
                        borderColor: digit ? '#e11d48' : 'rgba(255,255,255,0.15)',
                        color: '#FFFFFF'
                      }}
                    />
                  ))}
                </div>

                {otpError && <p style={{ color: '#ff4d6d', fontSize: '0.813rem', fontWeight: 600, textAlign: 'center', margin: '0 0 16px' }}>{otpError}</p>}
                {verifying && (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, color: '#ffbc4b', fontSize: '0.813rem', fontWeight: 600, margin: '0 0 16px' }}>
                    <div style={{ width: 14, height: 14, border: '2px solid rgba(255,188,75,0.3)', borderTopColor: '#ffbc4b', borderRadius: '50%', animation: 'cartSpin 0.8s linear infinite' }} />
                    <span>Verifying code &amp; connecting to payment...</span>
                  </div>
                )}

                {/* Resend Code row */}
                <div style={{ textAlign: 'center', marginBottom: 20, fontSize: '0.813rem', color: 'rgba(255,255,255,0.55)' }}>
                  {resendTimer > 0 ? (
                    <span>Resend code in <strong style={{ color: 'rgba(255,255,255,0.85)' }}>{resendTimer}s</strong></span>
                  ) : (
                    <button
                      type="button"
                      onClick={sendOtp}
                      disabled={verifying}
                      style={{ background: 'none', border: 'none', color: '#FFFFFF', fontWeight: 600, cursor: verifying ? 'not-allowed' : 'pointer', textDecoration: 'underline', padding: '4px 8px' }}
                    >
                      Resend Verification Code
                    </button>
                  )}
                </div>

                <div style={{ marginTop: 8, display: 'flex', gap: 12 }}>
                  <button 
                    onClick={handleCloseOtpModal}
                    type="button"
                    style={{
                      flex: 1, height: 48, borderRadius: 12,
                      background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
                      color: 'rgba(255,255,255,0.8)', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer'
                    }}
                    disabled={verifying}
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={() => verifyOtp(otpArray.join(""))}
                    type="button"
                    style={{
                      flex: 1, height: 48, borderRadius: 12,
                      background: '#FFFFFF', border: 'none',
                      color: '#050505', fontWeight: 700, fontSize: '0.875rem',
                      cursor: verifying ? 'not-allowed' : 'pointer',
                      opacity: verifying ? 0.6 : 1
                    }}
                    disabled={verifying}
                  >
                    Confirm &amp; Pay
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <FindMyInviteModal isOpen={isFindModalOpen} onClose={() => setIsFindModalOpen(false)} />
    </div>
  );
}
  
export default function CartPage() {
  return (
    <Suspense fallback={<div style={{ padding: '60px 20px', textAlign: 'center', color: 'rgba(255,255,255,0.6)', background: '#050505', minHeight: '100vh' }}>Loading checkout...</div>}>
      <CartPageContent />
    </Suspense>
  );
}
