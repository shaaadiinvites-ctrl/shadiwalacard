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
  const [isOrderSummaryOpen, setIsOrderSummaryOpen] = useState(false);

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
      setTemplate(getTemplate("grand-palace"));
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
      
      // ALWAYS clear existing verifier before trying to make a new one to prevent stale DOM node errors
      if ((window as any).recaptchaVerifier) {
        try {
          (window as any).recaptchaVerifier.clear();
        } catch (e) {}
        (window as any).recaptchaVerifier = null;
      }

      // Re-initialize a fresh verifier attached to the current DOM node
      (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
        size: "invisible",
      });
      const appVerifier = (window as any).recaptchaVerifier;

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
    <div className="min-h-screen text-[#1A202C] relative flex flex-col pb-24 font-manrope" style={{ background: '#F2F4F8' }}>
      {isProcessingPayment && (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#F2F4F8]/90 backdrop-blur-sm">
          <div className="w-12 h-12 border-4 border-[#4a148c] border-t-transparent rounded-full animate-spin mb-4"></div>
          <h2 className="text-[20px] font-bold text-[#4a148c] mb-2">Processing Payment...</h2>
          <p className="text-[14px] font-medium text-gray-600">Please do not close or refresh this window.</p>
        </div>
      )}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');
        .font-manrope { font-family: 'Manrope', sans-serif; }
        input { font-family: 'Manrope', sans-serif; }
        button { font-family: 'Manrope', sans-serif; }
        select { font-family: 'Manrope', sans-serif; }
      `}</style>
      
      {/* HEADER matching Contact Us */}
      <header className="sticky top-0 z-[1000] bg-white/90 backdrop-blur-md border-b border-gray-200">
        <div className="w-full max-w-[1220px] mx-auto px-5 h-[60px] flex items-center justify-center relative">
          {/* Back Button */}
          <Link href="/" className="absolute left-5 flex items-center text-[#2e1065] p-2 hover:bg-gray-50 rounded-xl transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
          </Link>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0 select-none">
            <img 
              src="/uploads/envelope_icon_transparent.png" 
              alt="shadiwalacard.com Icon" 
              className="h-8 w-8 object-contain rounded"
            />
            <span className="font-bold text-[#2e1065]" style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.25rem', letterSpacing: '0.2px' }}>
              Shadiwala<span style={{ color: '#9d174d' }}>Card</span>
            </span>
          </Link>
        </div>
      </header>

      <div className="flex-1 p-5 md:p-8 pb-32 md:pb-36">
        <div className="max-w-xl mx-auto space-y-6 relative z-10">
          
          {/* Section 1: Template Summary */}
          <div className="rounded-xl p-6 flex gap-6 items-center bg-white border border-gray-200/60 shadow-sm">
            <div className="w-24 h-32 relative rounded-xl overflow-hidden flex-shrink-0">
              <Image src={template.img} alt={template.name} fill sizes="96px" className="object-cover" />
            </div>
            <div className="flex-1">
              <div className="text-[12px] font-medium text-[#9d174d] tracking-wider uppercase mb-1">
                WEB INVITE
              </div>
              <h2 className="text-[20px] font-semibold text-[#2e1065] mb-2">{template.name}</h2>
              <div className="text-[24px] font-bold text-[#1A202C] leading-tight">₹{template.priceInr}</div>
            </div>
          </div>

          {/* Section 2: Order Summary & Coupon */}
          <div className="rounded-xl p-6 bg-white border border-gray-200/60 shadow-sm">
            <div 
              className="flex justify-between items-center mb-6 cursor-pointer"
              onClick={() => setIsOrderSummaryOpen(!isOrderSummaryOpen)}
            >
              <h2 className="text-[20px] font-semibold text-[#2e1065]">Order Summary</h2>
              <svg 
                className={`w-5 h-5 text-gray-500 transition-transform ${isOrderSummaryOpen ? 'rotate-180' : ''}`} 
                fill="none" viewBox="0 0 24 24" stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            {/* Coupon Section */}
            <div className="flex gap-2 mb-6 h-[44px]">
              <input
                type="text"
                placeholder="Enter coupon code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="flex-1 border border-gray-300 rounded-xl px-4 text-[14px] font-medium outline-none bg-white text-[#1A202C] transition-colors focus:border-[#4a148c]"
              />
              <button
                onClick={handleApplyCoupon}
                className="h-full px-5 flex items-center justify-center text-[#4a148c] font-semibold text-[14px] bg-transparent rounded-xl border border-[#4a148c] cursor-pointer transition-colors hover:bg-purple-50"
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
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="space-y-4 text-[14px] mb-6 border-b border-gray-100 pb-6 text-gray-700">
                    <div className="flex justify-between items-center font-medium">
                      <span>Original Price</span>
                      <span className="text-gray-400 line-through decoration-gray-400 decoration-1">₹{template.mrp}</span>
                    </div>
                    <div className="flex justify-between items-center text-[#16a34a] font-bold">
                      <span>Special Offer ({specialOfferPercent}% OFF)</span>
                      <span>-₹{specialOfferDiscount.toFixed(2)}</span>
                    </div>

                    {discountPercent > 0 && (
                      <div className="flex justify-between text-[#9d174d] font-semibold">
                        <span>Coupon Discount ({discountPercent}%)</span>
                        <span>-₹{couponDiscountExclGst.toFixed(2)}</span>
                      </div>
                    )}

                    <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100 font-medium">
                      <span>Subtotal (excl. GST)</span>
                      <span className="text-[#1A202C]">₹{basePrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center mt-3 font-medium">
                      <span>GST (18%)</span>
                      <span className="text-[#1A202C]">₹{gstAmount.toFixed(2)}</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className={`flex justify-between items-center ${!isOrderSummaryOpen ? 'border-t border-gray-100 pt-6' : ''}`}>
              <span className="text-[14px] font-medium text-[#2e1065]">Total (incl. GST)</span>
              <span className="text-[24px] font-bold text-[#4a148c] leading-tight">₹{total}</span>
            </div>
          </div>

          {/* Section 3: Customer Details & Checkout */}
          <div className="rounded-xl p-6 bg-white border border-gray-200/60 shadow-sm">
            <h2 className="text-[20px] font-semibold text-[#2e1065] mb-2">Checkout details</h2>
            <p className="text-[12px] font-normal text-gray-500 mb-6 leading-relaxed">
              We'll send your receipt and dashboard link here.
            </p>
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-[14px] font-medium text-[#1A202C] mb-1">Email Address <span className="text-red-500">*</span></label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full border border-gray-300 rounded-xl p-3 text-[14px] font-medium outline-none bg-white text-[#1A202C] transition-colors focus:border-[#4a148c]"
                />
              </div>
              <div>
                <label className="block text-[14px] font-medium text-[#1A202C] mb-1">Phone Number <span className="text-red-500">*</span></label>
                <div className="flex gap-2 h-[44px]">
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    disabled={isVerified}
                    className="w-[70px] border border-gray-300 rounded-xl px-1 text-[14px] font-medium outline-none bg-white text-[#1A202C] cursor-pointer text-center flex-shrink-0 disabled:opacity-70 disabled:cursor-not-allowed"
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
                    maxLength={15}
                    className="flex-1 min-w-0 border border-gray-300 rounded-xl px-3 text-[14px] font-medium outline-none bg-white text-[#1A202C] transition-colors focus:border-[#4a148c] disabled:opacity-70 disabled:cursor-not-allowed"
                  />
                  {!isVerified && (
                    <button
                      onClick={sendOtp}
                      disabled={verifying || !phone}
                      className="h-full flex items-center justify-center px-4 text-[#4a148c] font-semibold text-[14px] bg-transparent rounded-xl border border-[#4a148c] cursor-pointer transition-colors hover:bg-purple-50 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                      type="button"
                    >
                      {verifying ? "Sending..." : "Get OTP"}
                    </button>
                  )}
                </div>
                {isVerified && (
                  <div className="text-green-600 text-[12px] mt-2 font-medium flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    Number Verified!
                  </div>
                )}
              </div>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-4 border border-red-200 text-[12px] font-semibold">
                {error}
              </div>
            )}
          </div>

          {/* Section 4: 100% Satisfaction & Money-Back Guarantee */}
          <div className="rounded-xl p-5 bg-gradient-to-br from-amber-50 to-orange-50/40 border border-amber-200/80 shadow-sm flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-full bg-amber-100 border border-amber-200 flex items-center justify-center flex-shrink-0 text-amber-700 mt-0.5">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="M9 12l2 2 4-4" />
              </svg>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-[14px] font-bold text-amber-950">100% Money-Back Guarantee</h3>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-200/70 text-amber-800">Risk Free</span>
              </div>
              <p className="text-[12.5px] text-amber-900/80 leading-relaxed mt-1">
                Zero doubts, zero risk. If you are not completely satisfied with your digital wedding invitation, simply message us for a 100% full refund &mdash; zero questions asked.
              </p>
            </div>
          </div>
          
        </div>
      </div>

      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 pb-[calc(1rem+env(safe-area-inset-bottom,0px))] z-50 shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
        <div className="max-w-xl mx-auto flex flex-col gap-2">
          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-col">
              <span className="text-[12px] font-normal text-gray-500">Total to pay</span>
              <span className="text-[24px] font-bold text-[#1A202C]">₹{total}</span>
            </div>
            
            <button
              onClick={handleCheckout}
              disabled={isButtonDisabled}
              className="flex-1 md:flex-none md:w-64 h-[54px] rounded-xl flex items-center justify-center text-white font-bold text-[18px] transition-all"
              style={{ 
                background: isButtonDisabled ? '#9ca3af' : '#4a148c',
                cursor: isButtonDisabled ? 'not-allowed' : 'pointer'
              }}
            >
              {loadingRazorpay ? "Connecting..." : "Checkout & Pay"}
            </button>
          </div>

          <div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-500">
            <svg className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <path d="M9 12l2 2 4-4" />
            </svg>
            <span>100% Money-Back Guarantee &bull; Instant link access after payment</span>
          </div>
        </div>
      </div>
      
      {/* FOOTER */}
      <footer className="border-t border-gray-200 pt-8 pb-24 w-full">
        <div className="flex flex-col items-center justify-center gap-4 w-full mx-auto max-w-4xl text-center">
          <Link href="/" className="flex items-center justify-center gap-2 flex-shrink-0 select-none">
            <img 
              src="/uploads/logo.png" 
              alt="ShadiwalaCard Logo" 
              className="h-8 w-auto object-contain rounded"
            />
            <span className="text-[18px] font-bold text-[#2e1065] tracking-wide">
              Shadiwala<span className="text-[#9d174d]">Card</span>
            </span>
          </Link>
          <div className="flex items-center justify-center gap-6 text-[14px] font-medium text-gray-500 flex-wrap">
            <Link href="/terms" className="hover:text-[#4a148c] transition-colors">Terms of Service</Link>
            <Link href="/privacy-policy" className="hover:text-[#4a148c] transition-colors">Privacy Policy</Link>
            <Link href="/refund-policy" className="hover:text-[#4a148c] transition-colors">Refund Policy</Link>
            <Link href="/contact-us" className="hover:text-[#4a148c] transition-colors">Support</Link>
          </div>
          <span className="text-[12px] font-normal text-gray-400 flex items-center justify-center gap-1.5 mt-2">
            © 2026 shadiwalacard.com — Made in India 
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
                
                <h3 className="text-[20px] font-semibold text-[#2e1065] text-center mb-2">Verify Phone Number</h3>
                <p className="text-[14px] font-medium text-gray-500 text-center mb-8">
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
                      className="w-12 h-14 md:w-14 md:h-16 text-center text-[24px] font-bold border rounded-xl focus:border-[#9d174d] focus:ring-2 focus:ring-[#9d174d]/20 focus:outline-none transition-all bg-gray-50 text-[#1A202C]"
                      style={{ borderColor: 'rgba(26, 32, 44, 0.2)' }}
                    />
                  ))}
                </div>

                {otpError && <p className="text-red-500 text-[14px] font-medium text-center mb-4">{otpError}</p>}
                {verifying && <p className="text-blue-500 text-[14px] font-medium text-center mb-4">Verifying OTP...</p>}

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
