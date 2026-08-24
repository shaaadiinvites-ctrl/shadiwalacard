"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getTemplate, TemplateMeta } from "@/lib/templates";
import { LiquidButton } from "@/components/ui/liquid-glass-button";
import { usePostHog } from 'posthog-js/react';
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { motion, AnimatePresence } from "framer-motion";

function CartPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const templateId = searchParams.get("template");
  const posthog = usePostHog();

  const [template, setTemplate] = useState<TemplateMeta | null>(null);
  const [couponCode, setCouponCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [loadingRazorpay, setLoadingRazorpay] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [email, setEmail] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

  // Firebase OTP State
  const [isVerified, setIsVerified] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  const [verifying, setVerifying] = useState(false);
  const [otpError, setOtpError] = useState("");


  const [otpArray, setOtpArray] = useState(["", "", "", "", "", ""]);

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
      setTemplate(getTemplate("royal-heritage"));
    }
  }, [templateId]);

  useEffect(() => {
    if (template && posthog) {
      posthog.capture('cart_viewed', { template_id: template.id });
    }
  }, [template, posthog]);

  // Auto-save Customer Details when both email and phone are filled out
  useEffect(() => {
    if (!email || !phone) return;
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(email) && validatePhone(countryCode, phone)) {
      const fullPhone = `${countryCode}${phone.replace(/\D/g, '')}`;
      const timer = setTimeout(async () => {
        try {
          await fetch("/api/customer-pii", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, phone: fullPhone }),
          });
        } catch (e) {
          console.error("Auto-save failed", e);
        }
      }, 1000); // 1-second debounce

      return () => clearTimeout(timer);
    }
  }, [email, phone]);

  // Load Razorpay Script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
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

  useEffect(() => {
    if (!template) return;
    if (typeof window !== "undefined" && !(window as any).recaptchaVerifier) {
      try {
        (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
          size: "invisible",
        });
      } catch (e) {
        console.error("Recaptcha Init Error:", e);
      }
    }
  }, [template]);

  const sendOtp = async () => {
    if (!validatePhone(countryCode, phone)) {
      setError(`Please enter a valid phone number for ${countryCode}.`);
      return;
    }
    setError("");
    setVerifying(true);
    setOtpError("");
    setOtpArray(["", "", "", "", "", ""]);
    try {
      const fullPhone = `${countryCode}${phone.replace(/\D/g, '')}`;
      const appVerifier = (window as any).recaptchaVerifier;
      
      if (!appVerifier) {
        throw new Error("Google reCAPTCHA failed to load. This usually happens if an Adblocker, Antivirus (like Kaspersky), or browser privacy setting is blocking it. Please disable it and refresh the page.");
      }

      const result = await signInWithPhoneNumber(auth, fullPhone, appVerifier);
      setConfirmationResult(result);
      setShowOtpModal(true); // Re-purposing this as 'isOtpSent' flag
    } catch (err: any) {
      console.error("Error sending OTP", err);
      setError(err.message || "Failed to send OTP. Please try again.");
    }
    setVerifying(false);
  };

  const handleOtpChange = (element: any, index: number) => {
    if (isNaN(element.value)) return false;
    const newOtpArray = [...otpArray];
    newOtpArray[index] = element.value;
    setOtpArray(newOtpArray);
    setOtpError("");
    
    if (element.nextSibling && element.value !== "") {
      element.nextSibling.focus();
    }
    
    if (index === 5 && element.value !== "") {
      verifyOtp(newOtpArray.join(""));
    }
  };

  const handleOtpKeyDown = (e: any, index: number) => {
    if (e.key === "Backspace" && !otpArray[index] && e.target.previousSibling) {
      e.target.previousSibling.focus();
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
      
      if (!res.ok) throw new Error(data.error);

      setIsVerified(true);
      setShowOtpModal(false);
    } catch (err: any) {
      console.error("Error verifying OTP", err);
      setOtpError("Invalid OTP. Please try again.");
    }
    setVerifying(false);
  };

  const handleCheckout = async () => {
    if (!template) return;
    setLoadingRazorpay(true);
    setError("");

    posthog?.capture('checkout_started', { template_id: template.id });

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      setLoadingRazorpay(false);
      return;
    }

    if (!isVerified) {
      setError("Please verify your phone number first.");
      setLoadingRazorpay(false);
      return;
    }

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
              email: email,
              phone: phone,
            }),
          });

          const verifyData = await verifyRes.json();
          if (verifyRes.ok && verifyData.verified) {
            // Payment success -> Redirect to success page!
            router.push(`/success?po=${verifyData.paymentOrderId}&template=${template.id}&e=${encodeURIComponent(email)}&p=${encodeURIComponent(phone)}`);
          } else {
            setIsProcessingPayment(false);
            setError(verifyData.error || "Payment verification failed.");
          }
        },
        theme: {
          color: "#9d174d",
        },
        prefill: {
          email: email,
          contact: phone
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

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isFormValid = emailRegex.test(email) && validatePhone(countryCode, phone) && isVerified;
  const isButtonDisabled = loadingRazorpay || !isFormValid;

  return (
    <div className="min-h-screen text-[#1A202C] relative flex flex-col" style={{ background: '#F2F4F8', fontFamily: "'Inter', sans-serif" }}>
      {isProcessingPayment && (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#F2F4F8]/90 backdrop-blur-sm">
          <div className="w-12 h-12 border-4 border-[#9d174d] border-t-transparent rounded-full animate-spin mb-4"></div>
          <h2 className="text-xl font-bold text-[#2e1065] mb-2">Processing Payment...</h2>
          <p className="text-sm text-gray-600 font-medium">Please do not close or refresh this window.</p>
        </div>
      )}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400&family=Inter:wght@300;400;500;600;700;800&display=swap');
        input { font-family: 'Inter', sans-serif; }
        button { font-family: 'Inter', sans-serif; }
      `}</style>
      {/* HEADER matching Contact Us */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 1000, background: 'rgba(242, 244, 248, 0.85)', backdropFilter: 'blur(24px)', borderBottom: '1px solid rgba(26,32,44,0.12)'
      }}>
        <div style={{ width: '100%', maxWidth: '1220px', margin: '0 auto', padding: '0 20px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
          {/* Back Button */}
          <Link href="/" style={{ position: 'absolute', left: '20px', display: 'flex', alignItems: 'center', color: '#2e1065', padding: '8px' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
          </Link>

          {/* Logo */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 9, flexShrink: 0, userSelect: 'none' }}>
            <img 
              src="/uploads/envelope_icon_transparent.png" 
              alt="shadiwalacard.com Icon" 
              style={{ height: '32px', width: '32px', objectFit: 'contain', borderRadius: '4px' }} 
            />
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.25rem', color: '#2e1065', letterSpacing: '0.2px', fontWeight: 500 }}>
              Shadiwala<span style={{ color: '#9d174d' }}>Card</span>
            </span>
          </Link>
        </div>
      </header>

      <div style={{ flex: 1, padding: '24px 20px' }}>
        <div className="max-w-4xl mx-auto relative z-10">


          <div className="max-w-xl mx-auto space-y-6">
            
            {/* Section 1: Template Summary */}
            <div className="rounded-2xl p-6 flex gap-6 items-center" style={{ background: '#ffffff', border: '1px solid rgba(26, 32, 44, 0.1)', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)' }}>
              <div className="w-24 h-32 relative rounded-xl overflow-hidden flex-shrink-0">
                <Image src={template.img} alt={template.name} fill className="object-cover" />
              </div>
              <div className="flex-1">
                <div className="text-xs font-bold text-[#9d174d] tracking-wider uppercase mb-1">
                  Digital Invite
                </div>
                <h2 className="text-xl font-bold text-[#2e1065] mb-2">{template.name}</h2>
                <div className="text-gray-600 text-sm mb-3">Quantity: 1</div>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '1.4rem', color: '#1A202C', fontWeight: 800, lineHeight: 1.1 }}>₹{template.priceInr}</div>
              </div>
            </div>

            {/* Section 2: Order Summary & Coupon */}
            <div className="rounded-2xl p-6" style={{ background: '#ffffff', border: '1px solid rgba(26, 32, 44, 0.1)', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)' }}>
              <h2 className="text-xl font-bold text-[#2e1065] mb-6">Order Summary</h2>

              {/* Coupon Section */}
              <div className="flex gap-2 mb-6 h-[44px]">
                <input
                  type="text"
                  placeholder="Enter coupon code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  style={{ flex: 1, border: '1px solid rgba(26, 32, 44, 0.2)', borderRadius: '12px', padding: '0 16px', fontSize: '0.9rem', outline: 'none', background: '#ffffff', color: '#1A202C', transition: 'border-color 0.2s' }}
                  onFocus={(e) => e.target.style.borderColor = '#9d174d'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(26, 32, 44, 0.2)'}
                />
                <button
                  onClick={handleApplyCoupon}
                  style={{
                    height: '100%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    padding: '0 20px',
                    color: '#2e1065', fontWeight: 500, letterSpacing: '0.3px', fontSize: '0.85rem',
                    background: 'transparent',
                    borderRadius: '12px',
                    border: '1px solid #2e1065',
                    cursor: 'pointer',
                    transition: 'background 0.2s ease, color 0.2s ease'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.background = '#f3e8ff'}
                  onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  Apply
                </button>
              </div>

              <div className="space-y-4 text-sm mb-6 border-b border-gray-100 pb-6 text-gray-700">
                <div className="flex justify-between items-center">
                  <span>Original Price</span>
                  <span className="font-medium text-gray-400 line-through">{template.mrp}</span>
                </div>
                <div className="flex justify-between items-center text-green-700 font-semibold">
                  <span>Special Offer ({specialOfferPercent}% OFF)</span>
                  <span>-₹{specialOfferDiscount.toFixed(2)}</span>
                </div>

                {discountPercent > 0 && (
                  <div className="flex justify-between text-[#9d174d] font-semibold">
                    <span>Coupon Discount ({discountPercent}%)</span>
                    <span>-₹{couponDiscountExclGst.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                  <span>Subtotal (excl. GST)</span>
                  <span className="font-semibold text-[#1A202C]">₹{basePrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center mt-3">
                  <span>GST (18%)</span>
                  <span className="font-semibold text-[#1A202C]">₹{gstAmount.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-[#2e1065]">Total (incl. GST)</span>
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '1.8rem', color: '#9d174d', fontWeight: 800, lineHeight: 1.1 }}>₹{total}</span>
              </div>
            </div>

            {/* Section 3: Customer Details & Checkout */}
            <div className="rounded-2xl p-6" style={{ background: '#ffffff', border: '1px solid rgba(26, 32, 44, 0.1)', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)' }}>
              <h2 className="text-xl font-bold text-[#2e1065] mb-2">Checkout details</h2>
              <p className="text-xs text-gray-500 mb-6 leading-relaxed">
                We'll use this to send your payment receipt and your private customization dashboard link.
              </p>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-[#1A202C] mb-1">Email Address <span className="text-red-500">*</span></label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    style={{ width: '100%', border: '1px solid rgba(26, 32, 44, 0.2)', borderRadius: '12px', padding: '12px 16px', fontSize: '0.95rem', outline: 'none', background: '#ffffff', color: '#1A202C', transition: 'border-color 0.2s' }}
                    onFocus={(e) => e.target.style.borderColor = '#9d174d'}
                    onBlur={(e) => e.target.style.borderColor = 'rgba(26, 32, 44, 0.2)'}
                  />
                </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#1A202C] mb-1">Phone Number <span className="text-red-500">*</span></label>
                    <div className="flex gap-2 h-[44px]">
                      <select
                        value={countryCode}
                        onChange={(e) => setCountryCode(e.target.value)}
                        disabled={isVerified}
                        style={{ width: '70px', border: '1px solid rgba(26, 32, 44, 0.2)', borderRadius: '12px', padding: '0 4px', fontSize: '0.9rem', outline: 'none', background: '#ffffff', color: '#1A202C', cursor: 'pointer', appearance: 'none', textAlign: 'center', height: '100%', flexShrink: 0 }}
                      >
                        <option value="+91">+91</option>
                        <option value="+1">+1</option>
                        <option value="+44">+44</option>
                        <option value="+61">+61</option>
                        <option value="+971">+971</option>
                      </select>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => {
                          setPhone(e.target.value.replace(/\D/g, ''));
                          setIsVerified(false);
                        }}
                        disabled={isVerified}
                        placeholder="Phone Number"
                        style={{ flex: 1, minWidth: 0, border: '1px solid rgba(26, 32, 44, 0.2)', borderRadius: '12px', padding: '0 12px', fontSize: '0.9rem', outline: 'none', background: '#ffffff', color: '#1A202C', transition: 'border-color 0.2s', height: '100%' }}
                        onFocus={(e) => e.target.style.borderColor = '#9d174d'}
                        onBlur={(e) => e.target.style.borderColor = 'rgba(26, 32, 44, 0.2)'}
                      />
                      {!isVerified && (
                        <button
                          onClick={sendOtp}
                          disabled={verifying || !phone}
                          style={{
                            height: '100%',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            padding: '0 16px',
                            color: '#2e1065', fontWeight: 500, letterSpacing: '0.3px', fontSize: '0.85rem',
                            background: 'transparent',
                            borderRadius: '12px',
                            border: '1px solid #2e1065',
                            cursor: (verifying || !phone) ? 'not-allowed' : 'pointer',
                            opacity: (verifying || !phone) ? 0.5 : 1,
                            transition: 'background 0.2s ease, color 0.2s ease',
                            flexShrink: 0
                          }}
                          onMouseOver={(e) => { if(!(verifying || !phone)) e.currentTarget.style.background = '#f3e8ff'; }}
                          onMouseOut={(e) => { if(!(verifying || !phone)) e.currentTarget.style.background = 'transparent'; }}
                          type="button"
                        >
                          {verifying ? "Sending..." : "Get OTP"}
                        </button>
                      )}
                    </div>
                    {isVerified && (
                      <div className="text-green-600 text-sm mt-2 font-medium flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                        Number Verified!
                      </div>
                    )}
                </div>
              </div>

              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 border border-red-200 text-xs font-semibold">
                  {error}
                </div>
              )}

              <button
                onClick={handleCheckout}
                disabled={isButtonDisabled}
                style={{
                  width: '100%',
                  height: '54px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#ffffff', fontWeight: 'normal', letterSpacing: '0.4px', fontSize: '1.05rem',
                  background: isButtonDisabled ? '#6b7280' : '#2e1065',
                  borderRadius: '16px',
                  border: 'none',
                  cursor: isButtonDisabled ? 'not-allowed' : 'pointer',
                  opacity: isButtonDisabled ? 0.6 : 1,
                  transition: 'background 0.2s ease, opacity 0.2s ease'
                }}
                onMouseOver={(e) => { if(!isButtonDisabled) e.currentTarget.style.background = '#4c1d95'; }}
                onMouseOut={(e) => { if(!isButtonDisabled) e.currentTarget.style.background = '#2e1065'; }}
              >
                {loadingRazorpay ? "Securely Connecting..." : "Checkout & Pay"}
              </button>
              
              <div className="text-center mt-4 text-xs text-[#2e1065]/70 font-medium flex items-center justify-center gap-2">
                🔒 Secured by Razorpay
              </div>
            </div>
            
          </div>
        </div>
      </div>
      
      {/* FOOTER */}
      <footer style={{ borderTop: '1px solid rgba(26,32,44,0.15)', padding: '40px 0', textAlign: 'center', background: '#F2F4F8' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.25rem', color: '#2e1065' }}>
            Shadiwala<span style={{ color: '#9d174d' }}>Card</span>
          </span>
          <span style={{ fontSize: '0.719rem', color: 'rgba(26,32,44,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
            © 2026 shadiwalacard.com — Made in India 
            <img src="https://flagcdn.com/w20/in.png" alt="India" style={{ width: '14px', height: '10px' }} />
          </span>
        </div>
        </footer>

        {/* Firebase recaptcha container */}
        <div id="recaptcha-container"></div>

        {/* OTP Bottom Sheet */}
        <AnimatePresence>
          {showOtpModal && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowOtpModal(false)}
                className="fixed inset-0 bg-black/40 z-[9998]"
              />

              {/* Bottom Sheet */}
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-[9999] shadow-[0_-8px_30px_rgba(0,0,0,0.12)] pb-[env(safe-area-inset-bottom)]"
              >
                <div className="w-full max-w-lg mx-auto p-6 pt-4">
                  <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-6" />
                  
                  <h3 className="text-xl font-bold text-[#2e1065] text-center mb-2">Verify Phone Number</h3>
                  <p className="text-sm text-gray-500 text-center mb-8">
                    Enter the 6-digit OTP sent to <span className="font-semibold text-gray-800">{countryCode} {phone}</span>
                  </p>

                  <div className="flex justify-center gap-2 md:gap-3 mb-6">
                    {otpArray.map((digit, index) => (
                      <input
                        key={index}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(e.target, index)}
                        onKeyDown={(e) => handleOtpKeyDown(e, index)}
                        className="w-12 h-14 md:w-14 md:h-16 text-center text-2xl font-bold border rounded-xl focus:border-[#9d174d] focus:ring-2 focus:ring-[#9d174d]/20 focus:outline-none transition-all bg-gray-50 text-[#1A202C]"
                        style={{ borderColor: 'rgba(26, 32, 44, 0.2)' }}
                      />
                    ))}
                  </div>

                  {otpError && <p className="text-red-500 text-sm text-center font-medium mb-4">{otpError}</p>}
                  {verifying && <p className="text-blue-500 text-sm text-center font-medium mb-4">Verifying OTP...</p>}

                  <div className="mt-8">
                    <button 
                      onClick={() => setShowOtpModal(false)}
                      className="w-full py-4 rounded-xl border border-gray-300 text-gray-700 font-bold hover:bg-gray-50 transition-colors"
                      disabled={verifying}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    );
  }
  
export default function CartPage() {
    return (
      <Suspense fallback={<div className="p-10 text-center">Loading cart...</div>}>
        <CartPageContent />
      </Suspense>
    );
}
