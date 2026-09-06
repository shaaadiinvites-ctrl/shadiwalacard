import Link from "next/link";
import Image from "next/image";
import ClientTracker from "@/components/ClientTracker";
import ConfettiEffect from "@/components/ConfettiEffect";
import EmailReceiptBox from "@/components/EmailReceiptBox";
import SuccessLinkActions from "@/components/SuccessLinkActions";
import { getTemplate } from "@/lib/templates";

export const metadata = {
  title: "Payment Successful | ShadiwalaCard",
  description: "Your payment was successful. Start customizing your ShadiwalaCard digital wedding invitation.",
};

interface Props {
  searchParams: Promise<{ po?: string; template?: string; e?: string; p?: string; sig?: string }>;
}

export default async function SuccessPage({ searchParams }: Props) {
  const { po, template, e, p, sig } = await searchParams;
  const templateSlug = template || "grand-palace";
  const selectedTemplate = getTemplate(templateSlug);

  // Build the form URL preserving email, phone, and cryptographic signature
  let formUrl = `/form?po=${po}&template=${templateSlug}`;
  if (e) formUrl += `&e=${encodeURIComponent(e)}`;
  if (p) formUrl += `&p=${encodeURIComponent(p)}`;
  if (sig) formUrl += `&sig=${encodeURIComponent(sig)}`;

  const templateImage =
    templateSlug === "grand-palace" ? "/project3-assets/cover.webp" : selectedTemplate.img;

  if (!po) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#050505', padding: '24px', fontFamily: "var(--font-body), sans-serif", color: '#FFFFFF' }}>
        <div style={{
          width: '100%', maxWidth: 440,
          background: 'linear-gradient(135deg, rgba(22, 22, 28, 0.95) 0%, rgba(10, 10, 14, 0.95) 100%)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: 24,
          padding: '40px 28px',
          textAlign: 'center',
          boxShadow: '0 24px 60px rgba(0,0,0,0.8), 0 0 40px rgba(225, 29, 72, 0.08)'
        }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(225, 29, 72, 0.12)', border: '1px solid rgba(225, 29, 72, 0.3)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
            <svg style={{ width: 28, height: 28, color: '#e11d48' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 style={{ fontFamily: "var(--font-display), 'Montserrat', sans-serif", fontSize: '1.5rem', fontWeight: 700, color: '#FFFFFF', margin: '0 0 12px' }}>
            Order Not Found
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.65)', lineHeight: 1.6, margin: '0 0 28px' }}>
            We couldn't verify this order reference. If you recently completed payment, please check your email and WhatsApp for your direct dashboard link.
          </p>
          <Link
            href="/"
            style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              width: '100%', height: 48, borderRadius: 14,
              background: '#FFFFFF', color: '#050505',
              fontSize: '0.875rem', fontWeight: 700, textDecoration: 'none',
              transition: 'all 0.25s ease'
            }}
          >
            Return to Homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 20px 64px', backgroundColor: '#050505', fontFamily: "var(--font-body), sans-serif", color: '#FFFFFF', overflowX: 'hidden' }}>
      <ClientTracker eventName="payment_success" properties={{ template_id: templateSlug, payment_order_id: po }} />
      <ConfettiEffect />

      {/* Ambient Radial Lighting */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100vw',
          maxWidth: 1000,
          height: 600,
          background: 'radial-gradient(ellipse at 50% 20%, rgba(225, 29, 72, 0.14) 0%, rgba(255, 188, 75, 0.06) 40%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0
        }}
      />

      <style>{`
        @keyframes sfFadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes sfPulseGlow {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.08); opacity: 1; filter: drop-shadow(0 0 16px rgba(16, 185, 129, 0.6)); }
        }
        .sf-success-fade-1 { animation: sfFadeUp 0.6s 0.05s ease both; }
        .sf-success-fade-2 { animation: sfFadeUp 0.6s 0.2s ease both; }
        .sf-success-fade-3 { animation: sfFadeUp 0.6s 0.35s ease both; }
        .sf-btn-primary {
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .sf-btn-primary:hover {
          transform: translateY(-2px) scale(1.02);
          box-shadow: 0 12px 30px rgba(255, 255, 255, 0.25), 0 0 20px rgba(225, 29, 72, 0.3);
        }
        .sf-btn-secondary {
          transition: all 0.25s ease;
        }
        .sf-btn-secondary:hover {
          background: rgba(255, 255, 255, 0.1) !important;
          border-color: rgba(255, 255, 255, 0.25) !important;
        }
      `}</style>

      {/* ── Top Header & Celebration ── */}
      <div className="sf-success-fade-1" style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: 560, margin: '0 auto 28px' }}>
        
        {/* Verified Badge Icon */}
        <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
          <div style={{ position: 'absolute', inset: -6, borderRadius: '50%', background: 'radial-gradient(circle, rgba(16, 185, 129, 0.3) 0%, transparent 70%)', animation: 'sfPulseGlow 3s infinite ease-in-out' }} />
          <div style={{ width: 68, height: 68, borderRadius: '50%', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(5, 150, 105, 0.25) 100%)', border: '1.5px solid rgba(16, 185, 129, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px rgba(16, 185, 129, 0.25)' }}>
            <svg style={{ width: 32, height: 32, color: '#34d399' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>
        </div>

        {/* Status Pill */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '5px 14px', borderRadius: 999, background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#34d399', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.8px', textTransform: 'uppercase' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }} />
            PAYMENT CONFIRMED
          </div>
        </div>

        {/* Fluid Scaled Headline */}
        <h1 style={{ fontFamily: "var(--font-display), 'Montserrat', sans-serif", fontSize: 'clamp(2rem, 5vw, 2.75rem)', fontWeight: 800, color: '#FFFFFF', margin: '0 0 10px', lineHeight: 1.1, letterSpacing: '-0.5px' }}>
          Your Wedding Invitation is Unlocked!
        </h1>
        <p style={{ fontSize: 'clamp(0.875rem, 2.5vw, 1rem)', color: 'rgba(255, 255, 255, 0.7)', lineHeight: 1.6, margin: '0 0 14px' }}>
          Congratulations! Your customized invitation workspace is ready.
        </p>

        {/* Order Reference Pill */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '4px 12px', borderRadius: 8, background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.08)', fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.6)' }}>
          <span>Order ID:</span>
          <span style={{ color: '#ffbc4b', fontWeight: 600, fontFamily: 'monospace', letterSpacing: '0.5px' }}>{po}</span>
        </div>
      </div>

      {/* ── Main Showcase Action Card ── */}
      <div className="sf-success-fade-2" style={{
        position: 'relative',
        zIndex: 1,
        width: '100%',
        maxWidth: 460,
        margin: '0 auto',
        background: 'linear-gradient(135deg, rgba(20, 20, 24, 0.95) 0%, rgba(10, 10, 14, 0.95) 100%)',
        backdropFilter: 'blur(24px) saturate(180%)',
        WebkitBackdropFilter: 'blur(24px) saturate(180%)',
        borderRadius: 24,
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 24px 60px rgba(0, 0, 0, 0.75), 0 0 40px rgba(225, 29, 72, 0.08)',
        overflow: 'hidden'
      }}>

        {/* Preview Image with Vignette & Badge */}
        <div style={{ position: 'relative', width: '100%', height: 210, overflow: 'hidden', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <Image
            src={templateImage}
            alt={selectedTemplate.name}
            fill
            sizes="(max-width: 768px) 100vw, 460px"
            style={{ objectFit: 'cover', objectPosition: 'center 20%' }}
            priority
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(5,5,5,0.2) 0%, rgba(5,5,5,0.7) 100%)', pointerEvents: 'none' }} />
          
          {/* Template Label Badge */}
          <div style={{ position: 'absolute', top: 14, left: 14, zIndex: 2 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 999, background: 'rgba(5, 5, 5, 0.75)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 188, 75, 0.4)', color: '#ffbc4b', fontSize: '0.688rem', fontWeight: 700, letterSpacing: '0.6px', textTransform: 'uppercase' }}>
              <span style={{ color: '#ffbc4b' }}>✦</span>
              {selectedTemplate.name}
            </div>
          </div>

          <div style={{ position: 'absolute', bottom: 12, left: 14, right: 14, zIndex: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div>
              <span style={{ fontSize: '0.688rem', fontWeight: 700, color: '#10b981', letterSpacing: '0.8px', textTransform: 'uppercase', display: 'block', marginBottom: 2 }}>
                UNLOCKED EDITION
              </span>
              <span style={{ fontFamily: "var(--font-display), 'Montserrat', sans-serif", fontSize: '1.15rem', fontWeight: 700, color: '#FFFFFF' }}>
                Full VIP Access
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(16, 185, 129, 0.2)', border: '1px solid rgba(16, 185, 129, 0.4)', padding: '3px 8px', borderRadius: 6, color: '#34d399', fontSize: '0.688rem', fontWeight: 700 }}>
              <svg style={{ width: 12, height: 12 }} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              ACTIVE
            </div>
          </div>
        </div>

        {/* Card Content Area */}
        <div style={{ padding: '24px 20px' }}>
          
          {/* Dispatch Notice for WhatsApp & Email */}
          <div style={{ marginBottom: 20, padding: '14px 16px', borderRadius: 14, background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(5, 150, 105, 0.04) 100%)', border: '1px solid rgba(16, 185, 129, 0.25)', display: 'flex', alignItems: 'flex-start', gap: 12 }}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(16, 185, 129, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
              <svg style={{ width: 16, height: 16, color: '#34d399' }} fill="currentColor" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z" />
              </svg>
            </div>
            <div style={{ fontSize: '0.813rem', color: 'rgba(255, 255, 255, 0.85)', lineHeight: 1.5 }}>
              {p ? (
                <>
                  We&apos;ve sent your private customization link to your WhatsApp on <strong style={{ color: '#34d399' }}>{p}</strong>
                  {e ? <> and email <strong style={{ color: '#FFFFFF' }}>{e}</strong></> : null}.
                </>
              ) : e ? (
                <>
                  We&apos;ve sent your private customization link to your email <strong style={{ color: '#FFFFFF' }}>{e}</strong>.
                </>
              ) : (
                <>Your private customization link has been sent to your registered contact details.</>
              )}
              <div style={{ marginTop: 4, color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.75rem' }}>
                You can start right now, or come back and customize it anytime from your WhatsApp chat!
              </div>
            </div>
          </div>

          {/* Direct Link Controls (Copy & Share to another device/WhatsApp) */}
          <div style={{ marginBottom: 20 }}>
            <SuccessLinkActions formUrl={formUrl} phone={p} />
          </div>

          {/* Quick Feature Chips */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8, marginBottom: 24 }}>
            {[
              {
                icon: (
                  <svg style={{ width: 14, height: 14, color: '#ffbc4b', flexShrink: 0 }} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2l2.4 7.2h7.6l-6.1 4.5 2.3 7.3-6.2-4.6-6.2 4.6 2.3-7.3-6.1-4.5h7.6z" />
                  </svg>
                ),
                text: "3D Royal Experience"
              },
              {
                icon: (
                  <svg style={{ width: 14, height: 14, color: '#e11d48', flexShrink: 0 }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                ),
                text: "Interactive Map Venue"
              }
            ].map((feat, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '7px 10px', borderRadius: 8, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', fontSize: '0.75rem', color: 'rgba(255,255,255,0.85)', fontWeight: 500 }}>
                {feat.icon}
                <span>{feat.text}</span>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%' }}>
            <Link
              href={formUrl}
              className="sf-btn-primary"
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                width: '100%', height: 50, borderRadius: 14,
                background: '#FFFFFF', color: '#050505',
                fontSize: '0.938rem', fontWeight: 700, textDecoration: 'none',
                boxShadow: '0 8px 24px rgba(255, 255, 255, 0.15)'
              }}
            >
              <span>Start Customizing Now</span>
              <svg style={{ width: 18, height: 18 }} viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>

            <Link
              href="/"
              className="sf-btn-secondary"
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: '100%', height: 44, borderRadius: 12,
                background: 'rgba(255, 255, 255, 0.05)', color: 'rgba(255, 255, 255, 0.75)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                fontSize: '0.813rem', fontWeight: 600, textDecoration: 'none'
              }}
            >
              I'll customize later
            </Link>
          </div>

          {/* Subtext Note */}
          <div style={{ marginTop: 20, textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.75rem' }}>
            <svg style={{ width: 14, height: 14, color: '#ffbc4b', flexShrink: 0 }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span>You can edit and preview your invite anytime before sharing.</span>
          </div>
        </div>
      </div>

      {/* ── Post-Payment Tax Invoice & Email Receipt Box ── */}
      <EmailReceiptBox
        paymentOrderId={po}
        templateId={templateSlug}
        phone={p || ""}
        initialEmail={e || ""}
        sig={sig || ""}
      />

      {/* ── Footer ── */}
      <div className="sf-success-fade-3" style={{ position: 'relative', zIndex: 1, marginTop: 36, textAlign: 'center', fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.4)' }}>
        <span>Questions? Contact us at </span>
        <a href="mailto:hello@shadiwalacard.com" style={{ color: 'rgba(255, 255, 255, 0.7)', textDecoration: 'underline' }}>
          hello@shadiwalacard.com
        </a>
      </div>
    </div>
  );
}
