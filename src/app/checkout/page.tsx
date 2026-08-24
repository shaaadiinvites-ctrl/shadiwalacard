"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { getTemplate } from "@/lib/templates";

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open: () => void };
    turnstile?: {
      render: (container: string | HTMLElement, options: Record<string, unknown>) => string;
      reset: (widgetId?: string) => void;
    };
  }
}

// Set NEXT_PUBLIC_TURNSTILE_SITE_KEY (and the matching TURNSTILE_SECRET_KEY
// server-side) to turn on bot protection at checkout. Until it's set, this
// is undefined and the widget/check is skipped entirely — the site keeps
// working, it's just not bot-protected yet. See SECURITY-AUDIT.md.
const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

function loadTurnstileScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.turnstile) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

function CheckoutInner() {
  const params = useSearchParams();
  const router = useRouter();
  const templateId = params.get("template") || "royal-heritage";
  const template = getTemplate(templateId);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [couponCode, setCouponCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const turnstileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadRazorpayScript();

    if (TURNSTILE_SITE_KEY) {
      loadTurnstileScript().then((ok) => {
        if (ok && window.turnstile && turnstileRef.current) {
          window.turnstile.render(turnstileRef.current, {
            sitekey: TURNSTILE_SITE_KEY,
            callback: (token: string) => setTurnstileToken(token),
          });
        }
      });
    }
  }, []);

  const handleApplyCoupon = () => {
    if (couponCode.toUpperCase() === "SHADI10") {
      setDiscountPercent(10);
      setError(null);
    } else {
      setDiscountPercent(0);
      setError("Invalid coupon code.");
    }
  };

  const handlePay = async () => {
    setLoading(true);
    setError(null);
    try {
      const orderRes = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ templateId: template.id, turnstileToken, couponCode }),
      });
      const orderJson = await orderRes.json();
      if (!orderRes.ok) throw new Error(orderJson.error || "Could not start payment.");

      const ok = await loadRazorpayScript();
      if (!ok || !window.Razorpay) throw new Error("Could not load payment gateway. Check your connection and try again.");

      const rzp = new window.Razorpay({
        key: orderJson.keyId,
        amount: orderJson.amountPaise,
        currency: "INR",
        name: "ShadiwalaCard",
        description: `${template.name} invitation`,
        order_id: orderJson.orderId,
        handler: async (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
          try {
            const verifyRes = await fetch("/api/razorpay/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ paymentOrderId: orderJson.paymentOrderId, ...response }),
            });
            const verifyJson = await verifyRes.json();
            if (!verifyRes.ok) throw new Error(verifyJson.error || "Payment could not be verified.");

            router.push(`/success?po=${verifyJson.paymentOrderId}&template=${template.id}`);
          } catch (e) {
            setError(e instanceof Error ? e.message : "Payment verification failed.");
            setLoading(false);
          }
        },
        modal: { ondismiss: () => setLoading(false) },
        theme: { color: "#e11d48" },
      });
      rzp.open();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
      setLoading(false);
    }
  };

  const payDisabled = loading || (Boolean(TURNSTILE_SITE_KEY) && !turnstileToken);

  const subtotal = template.priceInr;
  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const total = subtotal - discountAmount;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 to-amber-50 p-6">
      <div className="max-w-md w-full bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
        <p className="text-xs uppercase tracking-widest text-gray-400 mb-2">You selected</p>
        <h1 className="text-2xl font-bold text-gray-900">{template.name}</h1>
        <p className="text-sm text-gray-500 mt-2">{template.tagline}</p>
        
        <div className="flex justify-between text-sm mt-6 mb-2">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-medium text-gray-900">₹{subtotal.toLocaleString("en-IN")}</span>
        </div>
        {discountPercent > 0 && (
          <div className="flex justify-between text-sm mb-2 text-green-600 font-medium">
            <span>Discount ({discountPercent}%)</span>
            <span>-₹{discountAmount.toLocaleString("en-IN")}</span>
          </div>
        )}
        <div className="flex justify-between items-center mt-4 border-t border-gray-100 pt-4">
          <span className="text-lg font-bold text-gray-900">Total</span>
          <span className="text-3xl font-bold text-gray-900">₹{total.toLocaleString("en-IN")}</span>
        </div>
        <p className="text-xs text-gray-400 mt-2">One-time payment · lifetime edit access</p>

        <div className="flex gap-2 mt-4 h-[40px]">
          <input
            type="text"
            placeholder="Enter coupon code (e.g. SHADI10)"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            className="flex-1 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 px-3 py-2 text-sm focus:outline-none focus:border-rose-500 transition"
          />
          <button
            onClick={handleApplyCoupon}
            className="px-4 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition"
          >
            Apply
          </button>
        </div>

        {TURNSTILE_SITE_KEY && <div ref={turnstileRef} className="mt-5 flex justify-center" />}

        {error && (
          <div className="mt-5 rounded-lg bg-red-50 border border-red-200 px-4 py-2 text-sm text-red-600 text-left">
            {error}
          </div>
        )}

        <button
          onClick={handlePay}
          disabled={payDisabled}
          className="w-full mt-7 px-6 py-3 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-semibold transition disabled:opacity-60"
        >
          {loading ? "Processing…" : `Pay ₹${total.toLocaleString("en-IN")} with Razorpay`}
        </button>
        <a href="/" className="block mt-4 text-sm text-gray-400 hover:text-gray-600">← Choose a different template</a>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={null}>
      <CheckoutInner />
    </Suspense>
  );
}
